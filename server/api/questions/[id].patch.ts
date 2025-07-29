import { UpdateQuestionSchema } from '~~/server/utils/db/schema';

export default defineEventHandler(async (e) => {
  const res = await readValidatedBody(e, UpdateQuestionSchema.safeParse);
  const questions_id = Number(getRouterParam(e, 'id'));
  if (!res.success) {
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: JSON.stringify(res.error),
      }),
    );
  }
  return await db(e)
    .update(questions)
    .set(res.data)
    .where(eq(questions.id, questions_id))
    .returning();
});
