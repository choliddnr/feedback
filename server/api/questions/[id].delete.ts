export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, 'id'));

  return await db(e).delete(questions).where(eq(questions.id, id));
});
