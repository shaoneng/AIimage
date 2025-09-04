import { getUserSubscriptionInfoByUserId } from "@/backend/service/user_subscription";

export async function POST(request: Request) {
  const { user_id } = await request.json();
  const userSubscriptionInfo = await getUserSubscriptionInfoByUserId(user_id);
  return Response.json(userSubscriptionInfo);
}
