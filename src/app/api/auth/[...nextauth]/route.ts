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

providers.push(
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    authorization: {
      params: {
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || "",
      },
    },
  })
);

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
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
