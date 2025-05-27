export default defineEventHandler(async (e) => {
  const merchant = Number(getRouterParam(e, "merchant"));

  const sq_response = db(e)
    .$with("sq_response")
    .as(db(e).select().from(responses).where(eq(responses.merchant, merchant)));
  // {
  //   id: questions.id;
  // }
  const sq = db(e)
    .$with("sq")
    .as(
      db(e)
        .with(sq_response)
        .select()
        .from(response_answers)
        .innerJoin(sq_response, eq(sq_response.id, response_answers.response))
        .innerJoin(questions, eq(questions.id, response_answers.question))
        .innerJoin(question_types, eq(question_types.id, questions.type))
        .where(and(eq(question_types.title, "rating")))
    );

  // const avg_rating = await db(e)
  //   .with(sq)
  //   .select({
  //     // questionId: sq.id,
  //     avg: sql<number>`avg(${response_answers.answer})`,
  //   })
  //   .from(sq)
  //   .innerJoin(response_answers, eq(response_answers.question, sq.id));
  // .groupBy(sq.id);

  // return avg_rating;
  return {
    respondent: (
      await db(e)
        .with(sq_response)
        .select({ count: sql<number>`cast(count(${sq_response.id}) as int)` })
        .from(respondents)
        .innerJoin(sq_response, eq(sq_response.respondent, respondents.id))
    )[0].count,
    response: (
      await db(e)
        .with(sq_response)
        .select({ count: sql<number>`cast(count(${sq_response.id}) as int)` })
        .from(sq_response)
    )[0].count,
    avg_rating: (
      await db(e)
        .with(sq)
        .select({ avg: sql<number>`avg(${sq.response_answers.answer})` })
        .from(sq)
    )[0].avg,
  };
});
