import { getDb } from "../config/db";
import { PaymentHistory } from "../type/type";

export async function create(paymentHistory: PaymentHistory) {
  const db = await getDb();
  const res = await db.query(`INSERT INTO payment_history (user_id, subscription_plans_id, stripe_payment_intent_id, stripe_price_id, stripe_subscription_id, stripe_customer_id, amount, currency, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [paymentHistory.user_id, paymentHistory.subscription_plans_id, paymentHistory.stripe_payment_intent_id, paymentHistory.stripe_price_id, paymentHistory.stripe_subscription_id, paymentHistory.stripe_customer_id, paymentHistory.amount, paymentHistory.currency, paymentHistory.status, paymentHistory.created_at]);
  return res.rows[0];
}


export async function update(paymentHistory: PaymentHistory) {
  const db = await getDb();
  const res = await db.query(`UPDATE payment_history SET stripe_subscription_id = $1, stripe_customer_id = $2, status = $3 WHERE id = $4`, [paymentHistory.stripe_subscription_id, paymentHistory.stripe_customer_id, paymentHistory.status, paymentHistory.id]);
  return res.rows[0];
}


export async function getById(id: string) {
  const db = await getDb();
  const res = await db.query(`SELECT * FROM payment_history WHERE id = $1`, [id]);
  return res.rows[0];
}

export async function hasSuccessfulPaymentByUserId(user_id: string) {
  const db = await getDb();
  const res = await db.query(`SELECT COUNT(*) as count FROM payment_history WHERE user_id = $1 AND status = 'success'`, [user_id]);
  return parseInt(res.rows[0].count) > 0;
}
