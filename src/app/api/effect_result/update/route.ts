import { updateEffectResult } from "@/backend/service/effect_result";
import { uploadImageToR2 } from "@/backend/lib/r2";

export async function POST(request: Request) {
  try {
    const { original_id, status, running_time, updated_at, original_image_url, object_key } = await request.json();
    
    // The updateEffectResult function will handle uploading to R2 if needed
    await updateEffectResult(original_id, status, running_time, updated_at, original_image_url || "");
    
    return Response.json({ message: "Effect result updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating effect result:", error);
    return Response.json({ message: "Error updating effect result" }, { status: 500 });
  }
}
