import { getDb } from "../config/db";
import { UserSubscription } from "../type/type";
export async function getByUserIdAndStatus(user_id: string, status: string[]) {
  const db = await getDb();
  const res = await db.query(
    `SELECT * FROM user_subscriptions WHERE user_id = $1 AND status = ANY($2::text[])`,
    [user_id, status]
  );
  return res.rows;
}


export async function create(userSubscription: UserSubscription) {
  const db = await getDb();
  const res = await db.query(
    `INSERT INTO user_subscriptions (user_id, stripe_price_id, subscription_plans_id, stripe_subscription_id, stripe_customer_id, status, current_period_start, current_period_end, cancel_at_period_end, canceled_at, cancellation_reason, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      userSubscription.user_id,
      userSubscription.stripe_price_id,
        userSubscription.subscription_plans_id,
      userSubscription.stripe_subscription_id,
      userSubscription.stripe_customer_id,
      userSubscription.status,
      userSubscription.current_period_start,
      userSubscription.current_period_end,
      userSubscription.cancel_at_period_end,
      userSubscription.canceled_at,
      userSubscription.cancellation_reason,
      userSubscription.created_at,
    ]
  );
  return res.rows[0];
}

export async function update(userSubscription: UserSubscription) {
  const db = await getDb();
  const res = await db.query(
    `UPDATE user_subscriptions SET stripe_price_id = $1, subscription_plans_id = $2, stripe_subscription_id = $3, stripe_customer_id = $4, status = $5, current_period_start = $6, current_period_end = $7, updated_at = $8 WHERE user_id = $9 RETURNING *`,
    [
      userSubscription.stripe_price_id,
      userSubscription.subscription_plans_id,
      userSubscription.stripe_subscription_id,
      userSubscription.stripe_customer_id,
      userSubscription.status,
      userSubscription.current_period_start,
      userSubscription.current_period_end,
      new Date(),
      userSubscription.user_id,
    ]
  );
  return res.rows[0];
}



export async function getInfoByUserId(user_id: string) {
  const db = await getDb();
  const res = await db.query(`SELECT us.*, cu.period_remain_count FROM user_subscriptions us JOIN credit_usage cu ON us.id = cu.user_subscriptions_id WHERE us.user_id = $1`, [user_id]);
  return res.rows[0];
}


export async function getByUserId(user_id: string) {
  const db = await getDb();
  const res = await db.query(`SELECT * FROM user_subscriptions WHERE user_id = $1`, [user_id]);
  return res.rows[0];
}