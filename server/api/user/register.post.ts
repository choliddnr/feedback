import { User, UserSession } from "#auth-utils";
import { users } from "../../../shared/db.schema";
import { toNumber } from "@vue/shared";
export default defineEventHandler(async (e) => {
  let data;
  try {
    const user = (await getUserSession(e)).user as User;
    const body = await readBody(e);
    console.log("session", user);
    data = await useDB()
      .insert(users)
      .values({
        email: user.email,
        name: body.name,
        username: body.username,
        picture: user.picture,
        default_merchant: null,
      })
      .returning();
  } catch (error) {
    console.log("error", error);
  }
  console.log("body", data);
  await setUserSession(e, { user: data![0], loggedInAt: new Date() });
  return { thebody: data };
});
