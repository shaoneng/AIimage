import { checkUserHasSuccessfulPayment } from "@/backend/service/payment_history";

export async function POST(request: Request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return Response.json({ error: "user_id is required" }, { status: 400 });
    }

    const hasSuccessfulPayment = await checkUserHasSuccessfulPayment(user_id);

    return Response.json({
      isPro: hasSuccessfulPayment,
      user_id,
    });
  } catch (error) {
    console.error("Error checking pro status:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
