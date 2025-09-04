import Stripe from "stripe";
import {
  createUserSubscription,
  updateUserSubscription,
  getUserSubscriptionByUserId,
} from "@/backend/service/user_subscription";
import {
  createCreditUsage,
  getCreditUsageByUserId,
  updateCreditUsage,
} from "@/backend/service/credit_usage";
import {
  CreditUsage,
  PaymentHistory,
  UserSubscription,
} from "@/backend/type/type";
import {
  getPaymentHistoryById,
  updatePaymentHistory,
  createPaymentHistory,
} from "@/backend/service/payment_history";
import { UserSubscriptionStatusEnum } from "@/backend/type/enum/user_subscription_enum";
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    return Response.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data
          .object as Stripe.PaymentIntent;
        console.log("payment_intent.succeeded: ", paymentIntentSucceeded);
        break;

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          "customer.subscription.created, stripe_price_id, stripe_subscription_id, stripe_customer_id: ",
          subscription.items.data[0].price.id,
          subscription.id,
          subscription.customer.toString()
        );
        break;

      // 一次性购买
      case "checkout.session.completed":
        console.log("checkout.session.completed");
        const checkoutSessionCompleted = event.data
          .object as Stripe.Checkout.Session;
        if (
          checkoutSessionCompleted.metadata?.project !== "ai-video-generator"
        ) {
          console.log("checkout.session.completed, project not match, return");
          return Response.json({ received: true });
        }

        const currentDate_1 = new Date();
        let newPeriodEnd = new Date(currentDate_1);
        newPeriodEnd.setMonth(currentDate_1.getMonth() + 1);
        if (
          checkoutSessionCompleted.metadata?.subscriptionPlanId !== "1" &&
          checkoutSessionCompleted.metadata?.subscriptionPlanId !== "9" &&
          checkoutSessionCompleted.metadata?.subscriptionPlanId !== "11"
        ) {
          return Response.json({ received: true });
        }
        let credit_usage_from_db_1: CreditUsage = await getCreditUsageByUserId(
          checkoutSessionCompleted.metadata.userId
        );
        if (
          credit_usage_from_db_1.period_end &&
          credit_usage_from_db_1.period_end > newPeriodEnd
        ) {
          newPeriodEnd = new Date(credit_usage_from_db_1.period_end);
        }
        if (!credit_usage_from_db_1) {
          const credit_usage_1: CreditUsage = {
            user_id: checkoutSessionCompleted.metadata.userId,
            user_subscriptions_id: -1,
            is_subscription_active: false,
            used_count: 0,
            period_remain_count: parseInt(
              checkoutSessionCompleted.metadata.credit
            ),
            period_start: currentDate_1,
            period_end: newPeriodEnd,
            created_at: new Date(),
          };
          await createCreditUsage(credit_usage_1);
        } else {
          credit_usage_from_db_1.period_remain_count =
            credit_usage_from_db_1.period_remain_count +
            parseInt(checkoutSessionCompleted.metadata.credit);
          // credit_usage_from_db_1.period_start = currentDate_1;
          credit_usage_from_db_1.period_end = newPeriodEnd;
          credit_usage_from_db_1.updated_at = new Date();
          await updateCreditUsage(credit_usage_from_db_1);
        }

        // step3: update payment history
        let paymentHistory_1: PaymentHistory = await getPaymentHistoryById(
          checkoutSessionCompleted.metadata.paymentHistoryId
        );
        paymentHistory_1.stripe_subscription_id = checkoutSessionCompleted.id;
        paymentHistory_1.stripe_customer_id =
          checkoutSessionCompleted.customer?.toString() || "";
        paymentHistory_1.status = "success";
        await updatePaymentHistory(paymentHistory_1);

        break;

      // 用户订阅
      case "customer.subscription.updated":
        console.log("customer.subscription.updated");
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        if (subscriptionUpdated.metadata?.project !== "ai-video-generator") {
          console.log(
            "customer.subscription.updated, project not match, return"
          );
          return Response.json({ received: true });
        }
        // 如果订阅用户取消订阅，则不更新积分
        if (subscriptionUpdated.cancel_at_period_end) {
          console.log(
            "customer.subscription.updated, cancel_at_period_end, return"
          );
          return Response.json({ received: true });
        }
        const currentDate = new Date();
        const oneMonthLater = new Date(currentDate);
        const current_period_end = new Date(currentDate);
        if (subscriptionUpdated.metadata.interval === "year") {
          current_period_end.setFullYear(currentDate.getFullYear() + 1);
        } else {
          current_period_end.setMonth(currentDate.getMonth() + 1);
        }

        const userSubscription = await getUserSubscriptionByUserId(
          subscriptionUpdated.metadata.userId
        );

        // step1: create/update user subscription
        const operateUserSubscriptionParams: UserSubscription = {
          user_id: subscriptionUpdated.metadata.userId,
          subscription_plans_id: parseInt(
            subscriptionUpdated.metadata.subscriptionPlanId
          ),
          stripe_price_id: subscriptionUpdated.items.data[0].price.id,
          stripe_subscription_id: subscriptionUpdated.id,
          stripe_customer_id: subscriptionUpdated.customer.toString(),
          status: UserSubscriptionStatusEnum.ACTIVE,
          current_period_start: currentDate,
          current_period_end: current_period_end,
          created_at: new Date(),
        };

        let user_subscriptions: UserSubscription;
        if (userSubscription) {
          user_subscriptions = await updateUserSubscription(
            operateUserSubscriptionParams
          );
        } else {
          user_subscriptions = await createUserSubscription(
            operateUserSubscriptionParams
          );
          if (!user_subscriptions.id) {
            throw new Error(
              "create user_subscriptions failed, subscription id : " +
                user_subscriptions.id
            );
          }
        }

        // step2: create credit_usage
        let credit_usage_from_db: CreditUsage = await getCreditUsageByUserId(
          subscriptionUpdated.metadata.userId
        );
        if (!credit_usage_from_db) {
          const credit_usage: CreditUsage = {
            user_id: subscriptionUpdated.metadata.userId,
            user_subscriptions_id: user_subscriptions.id!,
            is_subscription_active: true,
            used_count: 0,
            period_remain_count: parseInt(subscriptionUpdated.metadata.credit),
            period_start: currentDate,
            period_end: oneMonthLater,
            created_at: new Date(),
          };
          await createCreditUsage(credit_usage);
        } else {
          // 订阅用户续费
          if (credit_usage_from_db.is_subscription_active === true) {
            credit_usage_from_db.period_remain_count = parseInt(
              subscriptionUpdated.metadata.credit
            );
            credit_usage_from_db.period_start = currentDate;
            credit_usage_from_db.period_end = current_period_end;
            credit_usage_from_db.user_subscriptions_id = user_subscriptions.id!;
            await updateCreditUsage(credit_usage_from_db);
          }
          // 如果用户之前不是订阅用户，且剩余积分大于0且没过期，则需要把之前剩余的积分加上
          if (
            credit_usage_from_db.period_remain_count > 0 &&
            credit_usage_from_db.period_end &&
            credit_usage_from_db.period_end >= currentDate &&
            credit_usage_from_db.is_subscription_active === false
          ) {
            credit_usage_from_db.period_remain_count += parseInt(
              subscriptionUpdated.metadata.credit
            );
            credit_usage_from_db.is_subscription_active = true;
            credit_usage_from_db.period_start = currentDate;
            credit_usage_from_db.period_end = current_period_end;
            credit_usage_from_db.user_subscriptions_id = user_subscriptions.id!;
            credit_usage_from_db.updated_at = new Date();
            console.log("credit_usage_from_db", credit_usage_from_db);
            await updateCreditUsage(credit_usage_from_db);
          } else {
            credit_usage_from_db.period_remain_count = parseInt(
              subscriptionUpdated.metadata.credit
            );
            credit_usage_from_db.is_subscription_active = true;
            credit_usage_from_db.period_start = currentDate;
            credit_usage_from_db.period_end = current_period_end;
            credit_usage_from_db.user_subscriptions_id = user_subscriptions.id!;
            credit_usage_from_db.updated_at = new Date();
            await updateCreditUsage(credit_usage_from_db);
          }
        }

        // step3: update payment history
        let paymentHistory: PaymentHistory = await getPaymentHistoryById(
          subscriptionUpdated.metadata.paymentHistoryId
        );
        paymentHistory.stripe_subscription_id = subscriptionUpdated.id;
        paymentHistory.stripe_customer_id =
          subscriptionUpdated.customer.toString();
        paymentHistory.stripe_price_id =
          subscriptionUpdated.items.data[0].price.id;
        paymentHistory.status = "success";
        paymentHistory.user_id = subscriptionUpdated.metadata.userId;
        paymentHistory.created_at = new Date();
        await createPaymentHistory(paymentHistory);
        break;

      case "customer.subscription.deleted":
        const subscriptionDeleted = event.data.object as Stripe.Subscription;
        console.log("customer.subscription.deleted");
        const user_id = subscriptionDeleted.metadata.userId;
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error processing Stripe webhook:", error);
    return Response.json(
      { error: "Error processing Stripe webhook" },
      { status: 500 }
    );
  }

  return Response.json({ received: true });
}
