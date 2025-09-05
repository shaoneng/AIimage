import { GoogleGenAI } from "@google/genai";
import { Agent, setGlobalDispatcher } from "undici";

// Stabilize TLS/HTTP behavior globally for Node fetch (undici)
try {
  const dispatcher = new Agent({
    allowH2: false,
    connect: { timeout: 30_000 },
  });
  setGlobalDispatcher(dispatcher);
} catch {}

// 默认使用预览图像模型；可通过 GEMINI_IMAGE_MODEL 覆盖
const MODEL = process.env.GEMINI_IMAGE_MODEL || "models/gemini-2.5-flash-image-preview";
const FALLBACK_MODEL = process.env.GEMINI_IMAGE_MODEL_FALLBACK || "models/gemini-2.0-flash-001";
const ALLOW_FALLBACK = (process.env.GEMINI_ALLOW_FALLBACK || "0") === "1";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callWithRetry<T>(fn: () => Promise<T>, max = 3) {
  let delayMs = 1000;
  for (let i = 0; i < max; i++) {
    try {
      return await fn();
    } catch (e: any) {
      const msg = e?.message || "";
      const is429 = /429|RESOURCE_EXHAUSTED|Too Many Requests|quota/i.test(msg);
      const is5xx = /\b5\d\d\b|Internal error|INTERNAL/i.test(msg);
      const isTls = /EPROTO|handshake failure|SSL routines|ssl3_read_bytes/i.test(msg);
      if (!(is429 || is5xx || isTls) || i === max - 1) throw e;

      // 尝试解析 RetryInfo.retryDelay
      let retryMs = delayMs;
      try {
        const jsonStart = msg.indexOf("{\n");
        const raw = jsonStart >= 0 ? msg.slice(jsonStart) : "";
        const body = raw ? JSON.parse(raw) : null;
        const details = body?.error?.details || [];
        const retry = details.find((d: any) => String(d?.["@type"]).includes("RetryInfo"));
        const retryDelay = retry?.retryDelay as string | undefined; // e.g. "22s"
        if (retryDelay?.endsWith("s")) retryMs = Number(retryDelay.slice(0, -1)) * 1000;
      } catch {}

      await sleep(retryMs);
      delayMs = Math.min(delayMs * 2, 8000);
    }
  }
  throw new Error("unreachable");
}

export async function generateImageByGemini(params: {
  prompt: string;
  width?: number;
  height?: number;
}) {
  const apiKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) as string | undefined;
  if (!apiKey) {
    throw new Error("The GOOGLE_API_KEY (or GEMINI_API_KEY) environment variable is not set.");
  }
  const key = apiKey as string; // narrow to string for TS

  const client = new GoogleGenAI({ apiKey: key });
  const size = `${params.width || 1024}x${params.height || 1024}`;

  // Images API: some versions of @google/genai may not expose `images`
  const anyClient = client as any;
  async function requestOnce(model: string) {
    // 优先尝试统一 SDK 的内容接口（models.generateContent）
    if (anyClient.models && typeof anyClient.models.generateContent === "function") {
      return await callWithRetry(() =>
        anyClient.models.generateContent({
          model: model.replace(/^models\//, ""),
          contents: [{ role: "user", parts: [{ text: params.prompt }] }],
          responseModalities: ["IMAGE"],
        } as any)
      );
    }
    // 其次尝试 SDK 的 Images API（部分版本可用）
    if (anyClient.images && typeof anyClient.images.generate === "function") {
      // SDK 路径（带重试）
      return await callWithRetry(() =>
        anyClient.images.generate({ model, prompt: params.prompt, size } as any)
      );
    }
    // REST 回退（内容接口）。显式声明只要 IMAGE，提升稳定性
    const modelId = model.replace(/^models\//, "");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      modelId
    )}:generateContent`;
    const body = {
      contents: [{ role: "user", parts: [{ text: params.prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    } as any;
    return await callWithRetry(async () => {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(
          `Content REST API 调用失败：${resp.status} ${resp.statusText} ${errText}`
        );
      }
      return resp.json();
    });
  }

  let res: any;
  try {
    res = await requestOnce(MODEL);
  } catch (e: any) {
    const msg = e?.message || "";
    const is5xx = /\b5\d\d\b|Internal error|INTERNAL/i.test(msg);
    // 当上游 5xx 且允许回退时，尝试回退模型
    if (ALLOW_FALLBACK && is5xx && FALLBACK_MODEL && FALLBACK_MODEL !== MODEL) {
      res = await requestOnce(FALLBACK_MODEL);
    } else {
      throw e;
    }
  }

  // 兼容 SDK 与 REST 的不同响应形态
  // 统一解析：优先 SDK Images API；其次 Content API 的 inlineData
  let bytes: Buffer | null = null;
  let mimeType: string = "image/png";

  // SDK Images API 响应形态
  const sdkItem = res?.data?.[0] || res?.images?.[0] || res?.result?.[0] || res?.[0];
  if (sdkItem?.b64Data) {
    bytes = Buffer.from(sdkItem.b64Data, "base64");
    mimeType = sdkItem.mimeType || mimeType;
  }

  // Content API 响应形态（inlineData）
  if (!bytes) {
    const parts: any[] = res?.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find((p: any) => p?.inlineData?.data);
    if (imgPart?.inlineData?.data) {
      bytes = Buffer.from(imgPart.inlineData.data, "base64");
      mimeType = imgPart.inlineData.mimeType || mimeType;
    }
  }

  if (!bytes) {
    // 提示更多上下文，辅助排错（安全拦截/文本响应等）
    const finishReason = res?.candidates?.[0]?.finishReason || res?.error?.status;
    const text = res?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text).filter(Boolean).join(" ") || "";
    throw new Error(`No image data returned from Gemini API. finishReason=${finishReason || "unknown"} text=${text?.slice(0,120)}`);
  }

  return { bytes, mimeType };
}
