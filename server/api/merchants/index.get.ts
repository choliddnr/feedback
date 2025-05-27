import { merchants, eq } from "~~/server/utils/db/schema";

export default defineEventHandler(async (e) => {
  const session = await auth(e).api.getSession({
    headers: e.headers,
  });

  return await db(e)
    .select()
    .from(merchants)
    .where(eq(merchants.owner, Number(session?.user.id)));
});
