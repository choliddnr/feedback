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
});
