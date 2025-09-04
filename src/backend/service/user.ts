import { User } from "../type/type";
import { insertUser, getByEmail } from "../models/user";
import { getByUuidAndEmail } from "../models/user";

export async function saveUser(user: User) {
  try {
    const existUser = await getByEmail(user.email);
    if (!existUser) {
      await insertUser(user);
    } else {
      user.id = existUser.id;
      user.uuid = existUser.uuid;
      user.created_at = existUser.created_at;
    }
  } catch (e) {
    console.log("save user failed: ", e);
  }
}


export async function getUserByUuidAndEmail(uuid: string, email: string) {
  return await getByUuidAndEmail(uuid, email);
}
