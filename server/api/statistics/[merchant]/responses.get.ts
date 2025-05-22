import { avg } from "drizzle-orm";

export default defineEventHandler(async (e) => {
  const merchant = Number(getRouterParam(e, "merchant"));

  const sq = db
    .$with("sq")
    .as(db.select().from(responses).where(eq(responses.merchant, merchant)));
  const respondent = await db
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
  //     questions: await db.select().from(questions),
  //     products: await db.select().from(products),
  //     merchants: await db.select().from(merchants),
  //     merchant_categories: await db.select().from(merchant_categories),
  //     question_types: await db.select().from(question_types),
  //     respondents: await db.select().from(respondents),
  //     responses: await db.select().from(responses),
  //     response_answers: await db.select().from(response_answers),
  //   };
});
