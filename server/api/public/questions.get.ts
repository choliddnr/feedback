import { inArray } from 'drizzle-orm';

export default defineEventHandler(async (e) => {
  const q = getQuery(e).q as number | number[];
  if (q instanceof Array) {
    return await db(e)
      .select()
      .from(questions)
      .where(inArray(questions.product, q));
  } else {
    return await db(e).select().from(questions).where(eq(questions.product, q));
  }
});
