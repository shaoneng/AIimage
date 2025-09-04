import { getDb } from "../config/db";
import { EffectResult } from "../type/type";

export async function create(effectResult: EffectResult) {
  const db = await getDb();
  const res = await db.query(
    `INSERT INTO effect_result (result_id, original_id, user_id, effect_id, effect_name, prompt, url, original_url, storage_type, running_time, credit, request_params, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
    [
      effectResult.result_id,
      effectResult.original_id,
      effectResult.user_id,
      effectResult.effect_id,
      effectResult.effect_name,
      effectResult.prompt,
      effectResult.url,
      effectResult.original_url,
      effectResult.storage_type,
      effectResult.running_time,
      effectResult.credit,
      effectResult.request_params,
      effectResult.status,
      effectResult.created_at,
    ]
  );
  return res.rows[0];
}

export async function getByResultIdAndUserId(resultId: string, userId: string) {
  const db = await getDb();
  const res = await db.query(
    `SELECT * FROM effect_result WHERE result_id = $1 AND user_id = $2`,
    [resultId, userId]
  );
  return res.rows[0];
}

export async function pageListByUserId(
  userId: string,
  page: number,
  pageSize: number
) {
  const db = await getDb();
  const res = await db.query(
    `SELECT original_id, user_id, effect_name, url, running_time, credit, status, created_at FROM effect_result WHERE user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
    [userId, pageSize, (page - 1) * pageSize]
  );
  return res.rows;
}

export async function update(
  originalId: string,
  status: string,
  runningTime: number,
  updatedAt: Date,
  r2Url: string
) {
  const db = await getDb();
  if (r2Url !== "") {
    const res = await db.query(
      `UPDATE effect_result SET status = $1, running_time = $2, updated_at = $3, url = $4 WHERE original_id = $5`,
      [status, runningTime, updatedAt, r2Url, originalId]
    );
    return res.rows[0];
  } else {
    const res = await db.query(
      `UPDATE effect_result SET status = $1, running_time = $2, updated_at = $3 WHERE original_id = $4`,
      [status, runningTime, updatedAt, originalId]
    );
    return res.rows[0];
  }
}

export async function getByOriginalId(originalId: string) {
  const db = await getDb();
  const res = await db.query(
    `SELECT * FROM effect_result WHERE original_id = $1`,
    [originalId]
  );
  return res.rows[0];
}


export async function countByUserId(userId: string) {
  const db = await getDb();
  const res = await db.query(`SELECT COUNT(*) FROM effect_result WHERE user_id = $1`, [userId]);
  return res.rows[0].count;
}