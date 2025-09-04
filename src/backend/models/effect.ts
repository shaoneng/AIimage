import { Effect } from "@/backend/type/type";
import { getDb } from "../config/db";

export async function listByType(type: number): Promise<Effect[]> {
  const db = getDb();
  const res = await db.query(`SELECT * FROM effect WHERE type = $1`, [type]);
  return res.rows;
}


export async function getById(id: number): Promise<Effect | null> {
  const db = getDb();
  const res = await db.query(`SELECT * FROM effect WHERE id = $1`, [id]);
  return res.rows[0] || null;
}
