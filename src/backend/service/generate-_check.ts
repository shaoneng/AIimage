import { ResponseCodeEnum } from "@/backend/type/enum/response_code_enum";
import { getUserByUuidAndEmail } from "@/backend/service/user";
import { checkCreditUsageByUserId } from "@/backend/service/credit_usage";


export async function generateCheck(user_id: string, user_email: string, credit: string) {
  if (user_id === undefined || user_email === undefined) {
    return Response.json({ error: "Please login first" }, { status: ResponseCodeEnum.UNAUTHORIZED });
  }

  const user = await getUserByUuidAndEmail(user_id, user_email);
  if (!user || user.uuid !== user_id) {
    return Response.json({ error: "Please login first" }, { status: ResponseCodeEnum.UNAUTHORIZED });
  }

  const result = await checkCreditUsageByUserId(user_id, parseInt(credit));
  if (result !== 1) {
    // this situation generally does not exist because a credit_usage is created when the user is created
    if (result === -1) {
      return Response.json({ detail: "try again" }, { status: ResponseCodeEnum.CREDIT_NOT_INITED });
    }
    if (result === -2) {
      return Response.json({ detail: "You are not subscribed or your credit is not enough, please purchase credits or subscribe." }, { status: ResponseCodeEnum.NONE_SUBSCRIBED });
    }
    if (result === -3) {
      return Response.json({ detail: "Your current monthly credit usage is exceeded" }, { status: ResponseCodeEnum.FORBIDDEN });
    }   
  }
  return 1;
}