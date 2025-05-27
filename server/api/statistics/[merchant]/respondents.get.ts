export default defineEventHandler(async (e) => {
  return await db(e).select().from(respondents);
});
