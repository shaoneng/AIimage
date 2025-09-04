import { NextResponse } from "next/server";
import Replicate from "replicate";
export const revalidate = 0

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
 
export async function GET(request: Request, {params}: {params: {id: string}}) {
  const { id } = params;
  const prediction = await replicate.predictions.get(id);
 
  if (prediction?.error) {
    return NextResponse.json({ detail: prediction.error }, { status: 500 });
  }
 
  return NextResponse.json(prediction);
}