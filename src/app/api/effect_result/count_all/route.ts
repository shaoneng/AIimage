import { countEffectResultsByUserId } from "@/backend/service/effect_result";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");
  if (!userId) {
    return Response.json({ detail: "User ID is required" }, { status: 400 });
  }
  const count = await countEffectResultsByUserId(userId);
  if (count > 100) {
    return NextResponse.json({ count: 100 });
  }
  return NextResponse.json({ count });
}
