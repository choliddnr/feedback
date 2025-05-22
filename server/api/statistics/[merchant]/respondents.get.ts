export default defineEventHandler(async (e) => {
  return await db.select().from(respondents);
});
