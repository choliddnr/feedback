import { merchants, eq } from "~~/server/utils/db/schema";

export default defineEventHandler(async (e) => {
  const session = await auth.api.getSession({
    headers: e.headers,
  });
  if (!session?.user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

  return await db
    .select()
    .from(merchants)
    .where(eq(merchants.owner, Number(session?.user.id)));
});
