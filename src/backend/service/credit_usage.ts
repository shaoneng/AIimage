import { create, getByUserId, reducePeriodRemainCount, update } from "../models/credit_usage";
import { CreditUsage } from "../type/type";

export async function createCreditUsage(creditUsage: CreditUsage) {
  return await create(creditUsage);
}


export async function checkCreditUsageByUserId(user_id: string, credit: number) {
  const creditUsage = await getByUserId(user_id);
  console.log("creditUsage", creditUsage);
  // This situation generally does not exist because a credit_usage is created when the user is created
  if (!creditUsage) {
    const newCreditUsage = await createCreditUsage({
      user_id: user_id,
      user_subscriptions_id: -1,
      is_subscription_active: false,
      used_count: 0,
      period_remain_count: 5,
      period_start: new Date(),
      period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      created_at: new Date(),
    });
    await createCreditUsage(newCreditUsage);
    return -1;
  }
  if (creditUsage.period_remain_count <= 0) {
    return -2;
  }
  if (creditUsage.period_remain_count < credit) {
    if (creditUsage.is_subscription_active !== true) {
      return -2;
    } else {
      return -3;
    }
  }
  return 1;
}


export async function getCreditUsageByUserId(user_id: string) {
  return await getByUserId(user_id);
}

export async function reducePeriodRemainCountByUserId(user_id: string, credit: number) {
  return await reducePeriodRemainCount(user_id, credit);
}

export async function updateCreditUsage(creditUsage: CreditUsage) {
  return await update(creditUsage);
}
