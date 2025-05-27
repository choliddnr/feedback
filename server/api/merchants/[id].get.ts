import { merchants, eq, and } from "~~/server/utils/db/schema";

export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  const session = await auth(e).api.getSession({
    headers: e.headers,
  });

  return await db(e)
    .select()
    .from(merchants)
    .where(
      and(eq(merchants.owner, Number(session?.user.id)), eq(merchants.id, id))
    )
    .limit(1);
});
