export interface User {
  id?: number;
  uuid: string;
  email: string;
  created_at?: string;
  nickname: string;
  avatar_url: string;
  locale?: string;
  signin_type?: string;
  signin_ip?: string;
  signin_provider?: string;
  signin_openid?: string;
  update_time?: Date;
}

export interface Effect {
  id: number;
  name: string;
  type: number;
  des: string;
  platform: string;
  link: string;
  api: string;
  is_open: number;
  credit: number;
  created_at: Date;
  link_name: string;
  model: string;
  version: string;
  pre_prompt: string;
}

export interface EffectResult {
  id?: number;
  result_id: string;
  original_id: string;
  user_id: string;
  effect_id: number;
  effect_name: string;
  prompt: string;
  url: string;
  original_url: string;
  storage_type: string;
  running_time: number;
  credit: number;
  request_params: string;
  status: string;
  created_at: Date;
  updated_at?: Date;
}

// 订阅计划表 - 存储不同的订阅方案
export interface SubscriptionPlan {
  id: number;
  name: string; // 计划名称，如"月度专业版"
  interval: string; // 订阅周期：'month' 或 'year'
  price: number; // 价格
  currency: string; // 货币单位
  credit_per_interval: number; // 每周期可用次数（这里是100次）
  stripe_price_id: string; // Stripe价格ID
  is_active: boolean; // 是否激活
  created_at: Date;
  updated_at: Date;
}

// 用户订阅表
export interface UserSubscription {
  id?: number;
  user_id: string; // 关联到你的用户表
  stripe_price_id: string;
  stripe_subscription_id: string; // Stripe订阅ID
  stripe_customer_id: string; // Stripe客户ID
  status: string; // 订阅状态：'active', 'canceled', 'past_due'等
  subscription_plans_id: number; // REFERENCES subscription_plans(id)
  current_period_start: Date; // 当前订阅周期开始时间
  current_period_end?: Date; // 当前订阅周期结束时间
  cancel_at_period_end?: boolean; // 是否在周期结束时取消
  canceled_at?: Date; // 取消订阅的时间
  cancellation_reason?: string; // 取消原因
  ends_at?: Date; // 实际结束时间（可能与周期结束时间不同）
  created_at: Date;
  updated_at?: Date;
}

// 修改配额使用记录表，添加订阅状态检查
export interface CreditUsage {
  id?: number;
  user_id: string;
  user_subscriptions_id: number; // REFERENCES user_subscriptions(id)
  used_count: number; // 已使用次数
  period_remain_count: number; // 剩余次数
  period_start: Date; // 统计周期开始时间
  period_end?: Date; // 统计周期结束时间
  is_subscription_active: boolean; // 使用时的订阅状态
  created_at: Date;
  updated_at?: Date;
}

// 订阅支付记录表 - 记录所有支付历史
export interface PaymentHistory {
  id?: number;
  user_id: string; // 关联到用户表
  stripe_price_id: string;
  stripe_subscription_id: string; // Stripe订阅ID
  stripe_customer_id: string; // Stripe客户ID
  subscription_plans_id: number; // REFERENCES subscription_plans(id)
  stripe_payment_intent_id: string; // Stripe支付意向ID
  amount: number; // 支付金额
  currency: string; // 货币单位
  status: string; // 支付状态
  created_at: Date;
}

// 订阅取消记录表
export interface CancelHistory {
  id?: number;
  subscription_id: number; // REFERENCES user_subscriptions(id)
  user_id: string;
  cancellation_date: Date;
  effective_end_date: Date; // 实际结束服务的日期
  reason: string; // 取消原因
  type: string; // 取消类型：immediate（立即）, end_of_period（周期结束）
  amount: number; // 退款金额（如果有）
  status: string; // 退款状态
  stripe_refund_id: string; // Stripe退款ID
  feedback: string; // 用户反馈
  created_by: string; // 由谁执行的取消操作（用户/管理员）
  created_at: Date;
}
