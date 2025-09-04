import { NextRequest, NextResponse } from "next/server";
import { generatePresignedUrl } from "@/backend/lib/r2";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string;
    const bucketFolder = formData.get("bucketFolder") as string;
    const fileName = formData.get("fileName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Step 1: Get presigned URL and object key
    const { presignedUrl, objectKey } = await generatePresignedUrl(fileType, bucketFolder, fileName);

    // Step 2: Upload to R2
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    if (!uploadResponse.ok) {
      throw new Error("Failed to upload to R2");
    }

    // Step 3: Generate public URL
    const publicUrl = `${process.env.R2_ENDPOINT}/${objectKey}`;

    return NextResponse.json({ uploadedFileUrl: publicUrl }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to upload to R2" },
      { status: 500 }
    );
  }
}
