import Stripe from "stripe";
import { getUserByUuidAndEmail } from "@/backend/service/user";

import { getSubscriptionPlan } from "@/backend/service/subscription_plan";
import { UserSubscriptionStatusEnum } from "@/backend/type/enum/user_subscription_enum";
import { PaymentStatus } from "@/backend/type/enum/payment_status_enum";
import { PaymentHistory } from "@/backend/type/type";
import { createPaymentHistory } from "@/backend/service/payment_history";
import { getUserSubscriptionByUserIdAndStatus } from "@/backend/service/user_subscription";
export const maxDuration = 60; // Changed from 120 to 60 to comply with Vercel's hobby plan limits

export async function POST(req: Request) {
  try {
    const { plan_id, amount, interval, user_uuid, user_email } =
      await req.json();
    if (user_uuid === undefined || user_email === undefined) {
      return Response.json({ error: "invalid params" }, { status: 401 });
    }
    if (!plan_id || !amount || !interval) {
      return Response.json({ error: "invalid params" }, { status: 400 });
    }
    // check user
    const user = await getUserByUuidAndEmail(user_uuid, user_email);
    if (!user || user.uuid !== user_uuid) {
      return Response.json({ error: "user not found" }, { status: 401 });
    }
    // check subscription plan
    const subscriptionPlan = await getSubscriptionPlan(plan_id);

    if (
      !subscriptionPlan ||
      Math.round(amount) !== Math.round(subscriptionPlan.price * 100) ||
      subscriptionPlan.is_active === false ||
      subscriptionPlan.interval !== interval
    ) {
      return Response.json(
        { error: "subscription plan not found" },
        { status: 404 }
      );
    }

    // check user subscription
    if (plan_id !== 1 && plan_id !== 8 && plan_id !== 9) {
      const userSubscriptions = await getUserSubscriptionByUserIdAndStatus(
        user.uuid,
        [
          UserSubscriptionStatusEnum.ACTIVE,
          UserSubscriptionStatusEnum.CANCELLED,
        ]
      );
      if (userSubscriptions.length > 0) {
        return Response.json(
          { error: "You already has an active subscription" },
          { status: 500 }
        );
      }
    }

    // Determine if this is a one-time payment or subscription
    const isOneTimePayment = plan_id === 1 || plan_id === 9 || plan_id === 11;

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
    const price = await stripe.prices.retrieve(
      subscriptionPlan.stripe_price_id
    );

    // Only check recurring requirement for subscription plans
    if (!isOneTimePayment && !price.recurring) {
      return Response.json(
        { error: "price must be recurring type" },
        { status: 400 }
      );
    }

    const createPaymentHistoryRequest: PaymentHistory = {
      id: 0,
      user_id: user.uuid,
      subscription_plans_id: plan_id,
      stripe_price_id: subscriptionPlan.stripe_price_id,
      stripe_subscription_id: "",
      stripe_customer_id: "",
      stripe_payment_intent_id: "",
      amount: amount,
      currency: "USD",
      status: PaymentStatus.STARTED,
      created_at: new Date(),
    };

    const paymentHistory = await createPaymentHistory(
      createPaymentHistoryRequest
    );
    if (!paymentHistory || paymentHistory.id === 0) {
      return Response.json(
        { error: "create payment history failed" },
        { status: 500 }
      );
    }

    let options: Stripe.Checkout.SessionCreateParams = {
      client_reference_id: String(user.id),
      customer_email: user.email,
      line_items: [
        {
          price: subscriptionPlan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: isOneTimePayment ? "payment" : "subscription",
      payment_method_types: ["card"],
      metadata: {
        project: "ai-video-generator",
        interval: interval,
        userId: String(user.uuid),
        priceId: subscriptionPlan.stripe_price_id,
        quantity: 1,
        paymentHistoryId: String(paymentHistory.id),
        credit: subscriptionPlan.credit_per_interval,
        subscriptionPlanId: String(plan_id),
      },
      // Only include subscription_data if it's not a one-time payment
      ...(isOneTimePayment
        ? {}
        : {
            subscription_data: {
              metadata: {
                project: "ai-video-generator",
                userId: String(user.uuid),
                quantity: 1,
                priceId: subscriptionPlan.stripe_price_id,
                paymentHistoryId: String(paymentHistory.id),
                credit: subscriptionPlan.credit_per_interval,
                subscriptionPlanId: String(plan_id),
                interval: interval,
              },
            },
          }),
      success_url: `${process.env.WEB_BASE_URI}`,
      cancel_url: `${process.env.WEB_BASE_URI}/pricing`,
    };
    const session = await stripe.checkout.sessions.create(options);
    return Response.json({ session });
  } catch (e) {
    console.log("checkout failed: ", e);
  }
}
