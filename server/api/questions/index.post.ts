import { InsertQuestionSchema } from "~~/server/utils/db/schema";

export default defineEventHandler(async (e) => {
  const res = await readValidatedBody(e, InsertQuestionSchema.safeParse);

  if (!res.success) {
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: "Invalid question",
      })
    );
  }
  return await db.insert(questions).values(res.data).returning();
});
