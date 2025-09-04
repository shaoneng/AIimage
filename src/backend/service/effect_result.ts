import { toEffectResultInfo } from "../type/domain/effect_result_info";
import { EffectResult } from "../type/type";
import {
  countByUserId,
  create,
  getByOriginalId,
  getByResultIdAndUserId,
  pageListByUserId,
} from "../models/effect_result";
import { toEffectResultInfos } from "../type/domain/effect_result_info";
import { update } from "../models/effect_result";
import { uploadImageToR2, uploadVideoToR2 } from "../lib/r2";

export async function createEffectResult(effectResult: EffectResult) {
  const result = await create(effectResult);
  return result;
}

export async function updateEffectResult(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  r2Url: string
) {
  console.log(
    `updateEffectResult called with originalId: ${originalId}, status: ${status}, r2Url: ${r2Url}`
  );

  if (r2Url !== "" && r2Url !== null && r2Url !== undefined) {
    try {
      if (r2Url.endsWith(".mp4") || r2Url.includes("video")) {
        console.log(`Uploading video to R2: ${r2Url}`);
        r2Url = await uploadVideoToR2(r2Url, originalId);
        console.log(`Video uploaded successfully, new URL: ${r2Url}`);
      } else {
        console.log(`Uploading image to R2: ${r2Url}`);
        r2Url = await uploadImageToR2(r2Url, originalId);
        console.log(`Image uploaded successfully, new URL: ${r2Url}`);
      }
    } catch (error) {
      console.error(`Failed to upload to R2:`, error);
      // Don't throw the error, just log it and continue with the original URL
    }
  }

  await update(originalId, status, runningTime, updatedAt, r2Url);
  console.log(`Effect result updated in database with URL: ${r2Url}`);
}

export async function updateEffectResultError(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  url: string
) {
  await update(originalId, status, runningTime, updatedAt, url);
}

export async function updateEffectResultText(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  text: string
) {
  await update(originalId, status, runningTime, updatedAt, text);
}

export async function getEffectResult(resultId: string, userId: string) {
  const result = await getByResultIdAndUserId(resultId, userId);
  return toEffectResultInfo(result);
}

export async function pageListEffectResultsByUserId(
  userId: string,
  page: number,
  pageSize: number
) {
  const results = await pageListByUserId(userId, page, pageSize);
  return toEffectResultInfos(results);
}

export async function getEffectResultByOriginalId(originalId: string) {
  const result = await getByOriginalId(originalId);
  if (!result) {
    return null;
  }
  return toEffectResultInfo(result);
}

export async function countEffectResultsByUserId(userId: string) {
  const count = await countByUserId(userId);
  return count;
}
