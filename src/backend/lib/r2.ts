import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUrl(
  fileType: string,
  bucketFolder: string,
  fileName: string
): Promise<{ presignedUrl: string; objectKey: string }> {
  const randomString = uuidv4().substring(2, 10);
  const key = `ssat/${bucketFolder}/${randomString}_${fileName.replace(
    /\s/g,
    "_"
  )}`;
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return { presignedUrl: signedUrl, objectKey: key };
}

export async function deleteS3Object(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

export async function uploadImageToR2(
  imageUrl: string,
  objectKey: string
): Promise<string> {
  // Fetch the image data from the URL
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch image from URL: ${response.status} ${response.statusText}`
    );
  }

  const imageBuffer = await response.arrayBuffer();

  // Generate proper object key if not already formatted
  const fullObjectKey = objectKey.includes("/")
    ? objectKey
    : `ssat/images/${objectKey}.jpg`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fullObjectKey,
    Body: Buffer.from(imageBuffer),
    ContentType: response.headers.get("content-type") || "image/jpeg",
  });
  await s3Client.send(command);
  return `${process.env.R2_ENDPOINT}/${fullObjectKey}`;
}

export async function uploadVideoToR2(
  videoUrl: string,
  objectKey: string
): Promise<string> {
  const response = await fetch(videoUrl);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch video from URL: ${response.status} ${response.statusText}`
    );
  }

  const videoBuffer = await response.arrayBuffer();

  // Generate proper object key if not already formatted
  const fullObjectKey = objectKey.includes("/")
    ? objectKey
    : `ssat/videos/${objectKey}.mp4`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: fullObjectKey,
    Body: Buffer.from(videoBuffer),
    ContentType: response.headers.get("content-type") || "video/mp4",
  });

  await s3Client.send(command);
  return `${process.env.R2_ENDPOINT}/${fullObjectKey}`;
}

export async function uploadBufferToR2(
  buffer: Buffer,
  objectKey: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `${process.env.R2_ENDPOINT}/${objectKey}`;
}
