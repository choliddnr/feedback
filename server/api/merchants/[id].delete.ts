export default defineEventHandler(async (e) => {
  const id = getRouterParam(e, "id");
  return db.delete(merchants).where(eq(merchants.id, Number(id)));
});
