export default defineEventHandler(async (e) => {
  const username = getRouterParam(e, 'username') as string;
  return db(e)
    .select()
    .from(user)
    .where(eq(user.username, username))
    .limit(1)
    .get();
});
