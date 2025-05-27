export default defineEventHandler(async (e) => {
  return db(e).select().from(question_types);
});
