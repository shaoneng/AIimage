import { Provider } from "next-auth/providers/index";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth";
import { genUniSeq, getIsoTimestr } from "@/backend/utils";
import { saveUser } from "@/backend/service/user";
import { User } from "@/backend/type/type";
import { createCreditUsage } from "@/backend/service/credit_usage";
import { getCreditUsageByUserId } from "@/backend/service/credit_usage";

let providers: Provider[] = [];

// 计算回调地址：优先使用 NEXTAUTH_URL，避免与 Google 控制台允许的 Redirect URI 不一致
const nextauthBase = (process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
const computedRedirect = nextauthBase
  ? `${nextauthBase}/api/auth/callback/google`
  : undefined;

providers.push(
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    ...(computedRedirect
      ? { authorization: { params: { redirect_uri: computedRedirect } } }
      : {}),
  })
);

export const dynamic = "force-dynamic";

const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/`;
    },
    async session({ session, token, user }) {
      if (token && token.user) {
        session.user = token.user;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user && user.email && account) {
        try {
          const dbUser: User = {
            uuid: genUniSeq(),
            email: user.email,
            nickname: user.name || "",
            avatar_url: user.image || "",
            signin_type: account.type,
            signin_provider: account.provider,
            signin_openid: account.providerAccountId,
            created_at: getIsoTimestr(),
            signin_ip: "",
          };
          await saveUser(dbUser);
          const creditUsage = await getCreditUsageByUserId(dbUser.uuid);
          if (!creditUsage) {
            await createCreditUsage({
              user_id: dbUser.uuid,
              user_subscriptions_id: -1,
              is_subscription_active: false,
              used_count: 0,
              // 赠送的积分数
              period_remain_count: 6,
              period_start: new Date(),
              period_end: new Date(
                new Date().setMonth(new Date().getMonth() + 1)
              ),
              created_at: new Date(),
            });
          }
          token.user = {
            uuid: dbUser.uuid,
            nickname: dbUser.nickname,
            email: dbUser.email,
            avatar_url: dbUser.avatar_url,
            created_at: dbUser.created_at,
          };
        } catch (e) {
          console.error("NextAuth JWT 回调中的数据库操作失败：", (e as any)?.message || e);
          // 降级：不要让登录流程整体失败，先返回最小用户信息（功能可能受限）
          token.user = {
            uuid: (token as any)?.user?.uuid || "",
            nickname: user.name || "",
            email: user.email || "",
            avatar_url: user.image || "",
            created_at: getIsoTimestr(),
          } as any;
        }
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
