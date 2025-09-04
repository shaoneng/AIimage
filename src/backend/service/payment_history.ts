import { PaymentHistory } from "../type/type";
import { create, update, getById, hasSuccessfulPaymentByUserId } from "../models/payment_history";

export async function createPaymentHistory(paymentHistory: PaymentHistory) {
  return await create(paymentHistory);
}

export async function updatePaymentHistory(paymentHistory: PaymentHistory) {
  return await update(paymentHistory);
}

export async function getPaymentHistoryById(id: string) {
  return await getById(id);
}

export async function checkUserHasSuccessfulPayment(user_id: string) {
  return await hasSuccessfulPaymentByUserId(user_id);
}
