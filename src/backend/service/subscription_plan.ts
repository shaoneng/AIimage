import { getById, getByStripePriceId } from "../models/subscription_plan";

export async function getSubscriptionPlanById(id: number) {
  return await getById(id);
}

export async function getSubscriptionPlan(id: number) {
  const subscriptionPlan = await getById(id);
  return subscriptionPlan;
}