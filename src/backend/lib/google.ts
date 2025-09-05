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
  if (!anyClient.images || typeof anyClient.images.generate !== "function") {
    throw new Error(
      "@google/genai 版本不支持 Images API（client.images.generate 不存在）。请升级依赖：npm i @google/genai@latest，并确认使用 Google AI Studio API key。"
    );
  }

  const res: any = await anyClient.images.generate({
    model: MODEL,
    prompt: params.prompt,
    size,
  } as any);

  const first = res?.data?.[0];
  if (!first || !first.b64Data) {
    throw new Error("No image data returned from Gemini Images API");
  }

  const bytes: Buffer = Buffer.from(first.b64Data, "base64");
  const mimeType: string = first.mimeType || "image/png";

  return { bytes, mimeType };
}
