export interface UserSubscriptionInfo {
    plan_name: string;
    plan_interval: string;
    plan_price: number;
    subscription_status?: string;
    remain_count: number;
    current_period_start: Date;         // 当前订阅周期开始时间
    current_period_end?: Date;           // 当前订阅周期结束时间
    cancel_at_period_end?: boolean;      // 是否在周期结束时取消
}