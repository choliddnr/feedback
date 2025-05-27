export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  return db(e).select().from(user).where(eq(user.id, id));
});
