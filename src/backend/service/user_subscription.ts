import { UserSubscription } from "../type/type";
import {
  create,
  update,
  getByUserIdAndStatus,
  getInfoByUserId,
  getByUserId
} from "../models/user_subscription";
import { getByUserId as getCreditUsageByUserId } from "../models/credit_usage";
import { getById } from "../models/subscription_plan";
import { UserSubscriptionInfo } from "../type/domain/user_subscription_info";
export async function createUserSubscription(userSubscription: UserSubscription) {
  return await create(userSubscription);
}

export async function updateUserSubscription(userSubscription: UserSubscription) {
  return await update(userSubscription);
}

export async function getUserSubscriptionByUserIdAndStatus(user_uuid: string, status: string[]) {
  const userSubscriptions = await getByUserIdAndStatus(user_uuid, status);
  return userSubscriptions;
}

export async function getUserSubscriptionByUserId(user_id: string) {
  return await getByUserId(user_id);
}

export async function getUserSubscriptionInfoByUserId(user_id: string) {
  const userSubscription = await getInfoByUserId(user_id);
  if (!userSubscription) {  
    // 没订阅，查看使用量
    const creditUsage = await getCreditUsageByUserId(user_id);
    const userSubscriptionInfo: UserSubscriptionInfo = {
      plan_name: "Free User",
      plan_interval: "month",
      plan_price: 0,
      subscription_status: "inactive",
      remain_count: creditUsage?.period_remain_count || 0,
      current_period_start: creditUsage?.period_start || new Date(),
      current_period_end: creditUsage?.period_end || new Date(),
      cancel_at_period_end: false,
    }
    return userSubscriptionInfo;
  }
  const subscriptionPlan = await getById(userSubscription.subscription_plans_id);
  if (!subscriptionPlan) {
    return null;
  }

  const creditUsage = await getCreditUsageByUserId(user_id);

  const userSubscriptionInfo: UserSubscriptionInfo = {
    plan_name: subscriptionPlan.name,
    plan_interval: subscriptionPlan.interval,
    plan_price: subscriptionPlan.price,
    remain_count: creditUsage.period_remain_count,
    subscription_status: creditUsage.is_subscription_active ? "active" : "inactive",
    current_period_start: userSubscription.current_period_start,
    current_period_end: userSubscription.current_period_end,
    cancel_at_period_end: userSubscription.cancel_at_period_end,
  }
  return userSubscriptionInfo;
}