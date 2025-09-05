import { GoogleGenAI } from "@google/genai";

// 默认使用预览图像模型；可通过 GEMINI_IMAGE_MODEL 覆盖
const MODEL = process.env.GEMINI_IMAGE_MODEL || "models/gemini-2.5-flash-image-preview";

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
      if (!(is429 || is5xx) || i === max - 1) throw e;

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

  const client = new GoogleGenAI({ apiKey });
  const size = `${params.width || 1024}x${params.height || 1024}`;

  // Images API: some versions of @google/genai may not expose `images`
  const anyClient = client as any;
  let res: any;
  if (anyClient.images && typeof anyClient.images.generate === "function") {
    // SDK 路径（带重试）
    res = await callWithRetry(() =>
      anyClient.images.generate({ model: MODEL, prompt: params.prompt, size } as any)
    );
  } else {
    // REST 回退（内容接口）。去掉不确定的 generationConfig/size，减少 5xx 概率。
    const modelId = MODEL.replace(/^models\//, "");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      modelId
    )}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const body = {
      contents: [{ role: "user", parts: [{ text: params.prompt }] }],
    } as any;

    res = await callWithRetry(async () => {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  // 兼容 SDK 与 REST 的不同响应形态
  const first =
    res?.data?.[0] ||
    res?.images?.[0] ||
    res?.result?.[0] ||
    res?.candidates?.[0]?.content?.parts?.find((p: any) => p?.inlineData?.data) ||
    res?.[0];
  if (!first || !first.b64Data) {
    throw new Error("No image data returned from Gemini Images API");
  }

  const bytes: Buffer = Buffer.from(first.b64Data, "base64");
  const mimeType: string = first.mimeType || "image/png";

  return { bytes, mimeType };
}
