import { GoogleGenAI } from "@google/genai";

const MODEL = "models/gemini-2.5-flash-image-preview";

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
    // SDK 路径
    res = await anyClient.images.generate({
      model: MODEL,
      prompt: params.prompt,
      size,
    } as any);
  } else {
    // REST 回退：部分运行环境/版本未暴露 images.generate
    const url = `https://generativelanguage.googleapis.com/v1beta/images:generate?key=${encodeURIComponent(apiKey)}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, prompt: params.prompt, size }),
    });
    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      throw new Error(
        `Images REST API 调用失败：${resp.status} ${resp.statusText} ${errText}`
      );
    }
    res = await resp.json();
  }

  // 兼容 SDK 与 REST 的不同响应形态
  const first = res?.data?.[0] || res?.images?.[0] || res?.result?.[0] || res?.[0];
  if (!first || !first.b64Data) {
    throw new Error("No image data returned from Gemini Images API");
  }

  const bytes: Buffer = Buffer.from(first.b64Data, "base64");
  const mimeType: string = first.mimeType || "image/png";

  return { bytes, mimeType };
}
