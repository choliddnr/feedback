import { merchants, eq } from "../../../shared/db.schema";

export default defineEventHandler(async (e) => {
  const { user } = await getUserSession(e);
  if (!user)
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  return await useDB()
    .select()
    .from(merchants)
    .where(eq(merchants.owner, user.id!));
});
