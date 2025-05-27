export default defineEventHandler(async (e) => {
  const response = Number(getRouterParam(e, "response"));
  const answers = await db(e)
    .select({
      product: products.title,
      question: questions.question,
      type: questions.type,
      answer: response_answers.answer,
    })
    .from(response_answers)
    .where(eq(response_answers.response, response))
    .innerJoin(questions, eq(questions.id, response_answers.question))
    .innerJoin(products, eq(products.id, questions.product))
    .orderBy(products.title);

  const type = await db(e)
    .select({ id: question_types.id, title: question_types.title })
    .from(question_types);

  const type_map = new Map(type.map((t) => [t.id, t.title]));
  return answers.map((answer) => ({
    ...answer,
    type: type_map.get(answer.type),
  }));
});
