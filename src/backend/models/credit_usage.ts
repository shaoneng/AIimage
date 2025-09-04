import { CreditUsage } from "../type/type";
import { getDb } from "../config/db";
export async function create(creditUsage: CreditUsage) {
  const db = await getDb();
  const res = await db.query(
    `INSERT INTO credit_usage (user_id, user_subscriptions_id, used_count, period_remain_count, period_start, period_end, is_subscription_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      creditUsage.user_id,
      creditUsage.user_subscriptions_id,
      creditUsage.used_count,
      creditUsage.period_remain_count,  
      creditUsage.period_start,
      creditUsage.period_end,
      creditUsage.is_subscription_active,
      new Date(),
    ]
  );
  return res.rows[0];
}

export async function update(creditUsage: CreditUsage) {
  const db = await getDb();
  const res = await db.query(
    `UPDATE credit_usage SET user_subscriptions_id = $1, used_count = $2, period_remain_count = $3, period_start = $4, period_end = $5, is_subscription_active = $6, updated_at = $7 WHERE user_id = $8`,
    [
      creditUsage.user_subscriptions_id,
      creditUsage.used_count,
      creditUsage.period_remain_count,
      creditUsage.period_start,
      creditUsage.period_end,
      creditUsage.is_subscription_active,
      new Date(),
      creditUsage.user_id,
    ]
  );
  return res.rows[0];
}


export async function getByUserId(user_id: string) {    
  const db = await getDb();
  const res = await db.query(`SELECT * FROM credit_usage WHERE user_id = $1`, [user_id]);
  return res.rows[0];
}


export async function reducePeriodRemainCount(user_id: string, credit: number) {
  const db = await getDb();
  const res = await db.query(`UPDATE credit_usage SET period_remain_count = period_remain_count - $1, used_count = used_count + $1 WHERE user_id = $2`, [credit, user_id]);
  return res.rows[0];
}


