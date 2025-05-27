import { avg } from "drizzle-orm";

export default defineEventHandler(async (e) => {
  const merchant = Number(getRouterParam(e, "merchant"));

  const sq = db(e)
    .$with("sq")
    .as(db(e).select().from(responses).where(eq(responses.merchant, merchant)));
  const respondent = await db(e)
    .with(sq)
    .select({
      name: respondents.name,
      age: respondents.age,
      gender: respondents.gender,
      respondent_id: respondents.id,
      whatsapp: respondents.whatsapp,
      created_at: sq.createdAt,
      response_id: sq.id,
    })
    .from(sq)
    .innerJoin(respondents, eq(respondents.id, sq.respondent));
  // .groupBy(sq.id);
  return respondent;
  //   return {
  //     questions: await db(e).select().from(questions),
  //     products: await db(e).select().from(products),
  //     merchants: await db(e).select().from(merchants),
  //     merchant_categories: await db(e).select().from(merchant_categories),
  //     question_types: await db(e).select().from(question_types),
  //     respondents: await db(e).select().from(respondents),
  //     responses: await db(e).select().from(responses),
  //     response_answers: await db(e).select().from(response_answers),
  //   };
});
