import { GoogleAI } from "google-genai";

const MODEL = "models/gemini-2.5-flash-image-preview";

export async function generateImageByGemini(params: {
  prompt: string;
  width?: number;
  height?: number;
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("The GEMINI_API_KEY environment variable is not set.");
  }

  const client = new GoogleAI({ apiKey: process.env.GEMINI_API_KEY as string });
  const size = `${params.width || 1024}x${params.height || 1024}`;

  // Images API: synchronous generation
  const res: any = await client.images.generate({
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

