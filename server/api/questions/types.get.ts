export default defineEventHandler(async (e) => {
  return db.select().from(question_types);
});
