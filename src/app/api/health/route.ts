import { NextResponse } from "next/server";
import { getDb } from "@/backend/config/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const env = process.env;
  const checks: Record<string, any> = {
    GOOGLE_API_KEY: Boolean(env.GOOGLE_API_KEY) || Boolean(env.GEMINI_API_KEY),
    POSTGRES_URL: Boolean(env.POSTGRES_URL),
    R2_ACCOUNT_ID: Boolean(env.R2_ACCOUNT_ID),
    R2_ACCESS_KEY_ID: Boolean(env.R2_ACCESS_KEY_ID),
    R2_SECRET_ACCESS_KEY: Boolean(env.R2_SECRET_ACCESS_KEY),
    R2_BUCKET_NAME: Boolean(env.R2_BUCKET_NAME),
    R2_ENDPOINT: Boolean(env.R2_ENDPOINT),
    NEXTAUTH_SECRET: Boolean(env.NEXTAUTH_SECRET),
    NEXTAUTH_URL: Boolean(env.NEXTAUTH_URL),
    STRIPE_PRIVATE_KEY: Boolean(env.STRIPE_PRIVATE_KEY),
    STRIPE_WEBHOOK_SECRET: Boolean(env.STRIPE_WEBHOOK_SECRET),
    WEB_BASE_URI: Boolean(env.WEB_BASE_URI),
  };

  // DB connectivity check
  let dbStatus: { ok: boolean; error?: string } = { ok: false };
  try {
    if (!env.POSTGRES_URL) throw new Error("POSTGRES_URL missing");
    const db = getDb();
    await db.query("SELECT 1");
    dbStatus.ok = true;
  } catch (e: any) {
    dbStatus = { ok: false, error: e?.message || String(e) };
  }

  return NextResponse.json({ checks, dbStatus });
}

