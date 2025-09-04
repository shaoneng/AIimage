Title
- AI Image Generation Migration Spec (Gemini 2.5 Flash Image)

Overview
- Replace Replicate text-to-image with Google Images API using `models/gemini-2.5-flash-image-preview`.
- Remove Replicate webhook dependency for text-to-image; perform synchronous generation, upload to R2, persist to DB, and deduct credits in one call.
- Keep existing API route and response shape to avoid frontend changes.

Goals
- Replace Replicate with Google Images API for text-to-image.
- Synchronous generation without external webhook.
- Preserve existing credit system and `effect_result` records.
- Keep frontend behavior and UI stable.

Non-Goals
- Changing image format conversion (defaults to PNG).
- Migrating img-to-video (still Replicate for now; follow-up spec).
- Reworking pricing/credit models or authentication logic.

Architecture
- Request hits `POST /api/predictions/text_to_image`.
- Server validates session and credits via existing `generateCheck(...)`.
- Server generates image using Google Images API (Gemini 2.5 Flash Image).
- Server uploads the image to R2 via new `uploadBufferToR2`.
- Server writes a `succeeded` record to `effect_result` and deducts credits.
- Server returns a “prediction-like” JSON with `status="succeeded"` and `output` set to R2 URL.

Key Changes
- New Google adapter: `src/backend/lib/google.ts` exposes `generateImageByGemini({ prompt, width, height })`.
- R2 adapter extended to support buffer upload: `uploadBufferToR2(buffer, key, contentType)`.
- Replace internals of `src/app/api/predictions/text_to_image/route.ts` to call Gemini + R2 + DB atomically.
- Add dependency `@google/genai` and env `GOOGLE_API_KEY` (fallback `GEMINI_API_KEY`).

Dependencies
- `@google/genai`: Google Generative AI SDK (unified)
- Already present: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` (R2), `pg` (DB)

Environment
- `GOOGLE_API_KEY` (or `GEMINI_API_KEY`): Google AI Studio API key.
- Existing R2 vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`.
- Existing DB vars: `POSTGRES_URL`.

API Contract
- Route: `POST /api/predictions/text_to_image`
- Request body:
  - `prompt`: string
  - `width`: number (optional, default 1024)
  - `height`: number (optional, default 1024)
  - `user_id`: string (required)
  - `user_email`: string (required)
  - `effect_link_name`: string (optional, default `text-to-image`)
  - `credit`: number (required; usually 1)
  - Any legacy fields (`output_format`, `aspect_ratio`) are ignored for generation
- Success response (201):
  - `{ id, status: "succeeded", output: "<R2 URL>", created_at, started_at, completed_at }`
- Error responses:
  - 401: not logged in or no credit (`{ detail: string }`)
  - 500: generation or upload failed (`{ detail: string }`)

Status Mapping
- Generation is synchronous:
  - Always returns `status="succeeded"` on success.
  - No webhook; no intermediate `pending`.

Data Flow
- Validate credits: `generateCheck(user_id, user_email, credit)`.
- Generate image: `generateImageByGemini({ prompt, width, height })` → `{ bytes, mimeType }`.
- Upload to R2: `uploadBufferToR2(bytes, key, mimeType)` → `r2Url`.
- Persist result: `createEffectResult({ status: "succeeded", url: r2Url, ... })`.
- Deduct credits once: `reducePeriodRemainCountByUserId(user_id, credit)`.

Implementation Files
- `src/backend/lib/google.ts`:
  - Expose `generateImageByGemini`.
  - Use model `models/gemini-2.5-flash-image-preview`.
- `src/backend/lib/r2.ts`:
  - Add `uploadBufferToR2(buffer, objectKey, contentType)`.
- `src/app/api/predictions/text_to_image/route.ts`:
  - Replace Replicate flow with Gemini + R2 + DB + credit deduction.
- `package.json`:
  - Add `"@google/genai": "^1.x"` dependency.

Pseudocode
- `src/backend/lib/google.ts`
```
import { GoogleAI } from "@google/genai";

const MODEL = "models/gemini-2.5-flash-image-preview";

export async function generateImageByGemini(params: {
  prompt: string;
  width?: number;
  height?: number;
}) {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY (or GEMINI_API_KEY) is not set");
  }
  const client = new GoogleAI({ apiKey });
  const size = `${params.width || 1024}x${params.height || 1024}`;
  const res = await client.images.generate({ model: MODEL, prompt: params.prompt, size });
  if (!res?.data?.length || !res.data[0].b64Data) throw new Error("Empty image result from Gemini");
  const item = res.data[0];
  const bytes = Buffer.from(item.b64Data, "base64");
  const mimeType = item.mimeType || "image/png";
  return { bytes, mimeType };
}
```

- `src/backend/lib/r2.ts`
```
export async function uploadBufferToR2(
  buffer: Buffer,
  objectKey: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    Body: buffer,
    ContentType: contentType
  });
  await s3Client.send(command);
  return `${process.env.R2_ENDPOINT}/${objectKey}`;
}
```

- `src/app/api/predictions/text_to_image/route.ts`
```
import { NextResponse } from "next/server";
import { genEffectResultId } from "@/backend/utils/genId";
import { createEffectResult } from "@/backend/service/effect_result";
import { reducePeriodRemainCountByUserId } from "@/backend/service/credit_usage";
import { generateCheck } from "@/backend/service/generate-_check";
import { uploadBufferToR2 } from "@/backend/lib/r2";
import { generateImageByGemini } from "@/backend/lib/google";

export async function POST(request: Request) {
  const body = await request.json();
  const { prompt, width, height, user_id, user_email, effect_link_name = "text-to-image", credit = 1 } = body || {};
  const ok = await generateCheck(user_id, user_email, String(credit));
  if (ok !== 1) return NextResponse.json({ detail: "Unauthorized or no credit" }, { status: 401 });
  const start = Date.now();
  try {
    const { bytes, mimeType } = await generateImageByGemini({ prompt, width, height });
    const resultId = genEffectResultId();
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const objectKey = `ssat/images/${resultId}.${ext}`;
    const r2Url = await uploadBufferToR2(bytes, objectKey, mimeType);
    await createEffectResult({
      result_id: resultId,
      original_id: resultId,
      user_id,
      effect_id: 0,
      effect_name: effect_link_name,
      prompt,
      url: r2Url,
      original_url: "",
      storage_type: "R2",
      running_time: (Date.now() - start) / 1000,
      credit,
      request_params: JSON.stringify(body),
      status: "succeeded",
      created_at: new Date()
    });
    await reducePeriodRemainCountByUserId(user_id, credit);
    const now = new Date().toISOString();
    return NextResponse.json({ id: resultId, status: "succeeded", output: r2Url, created_at: now, started_at: now, completed_at: now }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ detail: "Generation failed" }, { status: 500 });
  }
}
```

Database
- No schema changes.
- Optional: Update `effect` seeds to reflect Google platform (`platform: google|vertex`, `api/model: models/gemini-2.5-flash-image-preview`).

Security
- Validate user identity and credit before generation.
- Keep API key server-side; never expose `GEMINI_API_KEY`.
- Add rate limiting later if needed.

Error Handling
- Network/API failures: return 500 and log error message.
- R2 failures: return 500 and log upload error.
- Deduct credits only after successful `effect_result` write.

Performance
- Default `1024x1024` size; configurable via request.
- Enforce upper bounds (e.g., 1024–1536) to control cost and latency.

Backward Compatibility
- Frontend can keep current logic; success returns `succeeded` immediately.
- Existing extra call to `/api/effect_result/update` is harmless.

Testing
- Unit: `generateImageByGemini`, `uploadBufferToR2`, credit deduction on success only.
- Integration: `POST /api/predictions/text_to_image` happy path returns `201` with R2 URL.
- E2E: With real keys, generated images appear in dashboard list.

Rollout Plan
- Add dependency and env var.
- Deploy backend change behind existing route.
- Smoke test text-to-image on staging.
- Roll to production.
- Later migrate img-to-video (Veo) and remove Replicate fully.

Future Work
- Optional format conversion via `sharp`.
- Prompt enhancement / safety filter via Gemini text model.
- Rate limiting and quota dashboard.
- Migrate img-to-video to Veo with our own polling (no webhooks).

Acceptance Criteria
- `POST /api/predictions/text_to_image` returns `201` with `output` (R2 URL) given valid session and credit.
- `effect_result` row created with `status="succeeded"` and correct metadata.
- User credits decremented exactly once per successful generation.
- Frontend displays generated images without change.
