import { pageListEffectResultsByUserId } from "@/backend/service/effect_result";

export const maxDuration = 60; // Set max duration to 60 seconds (1 minute)

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  if (!userId) {
    return Response.json({ detail: "User ID is required" }, { status: 400 });
  }
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("page_size") || "10";
  const results = await pageListEffectResultsByUserId(
    userId,
    parseInt(page),
    parseInt(pageSize)
  );
  return Response.json(results);
}
