import {
  InsertRespondentsSchema,
  InsertResponseAnswerSchema,
} from "~~/server/utils/db/schema";

interface SQLiteTransactionConfig {
  behavior?: "deferred" | "immediate" | "exclusive";
}

export default defineEventHandler(async (e) => {
  const body = (await readBody(e)) as {
    respondent: any;
    answers: { [key: string]: string };
    merchant: string;
  };
  // const b = await readValidatedBody(e, );
  const respondent_validation = InsertRespondentsSchema.safeParse(
    body.respondent
  );
  if (!respondent_validation.success)
    return sendError(
      e,
      createError({
        statusCode: 422,
        statusMessage: "Invalid respondent data!",
      })
    );

  /**
   * parse and validate answer
   * @return
   * { product_id : {
   *    question_id: string
   *  }
   * }
   */

  const parseKey = (key: string): [number, number] => {
    const arr = key.split("_", 2);
    return [Number(arr[0]), Number(arr[1])];
  };

  Object.keys(body.answers).forEach((key) => {
    // const  = body.answers[key];
    if (!body.answers[key] || body.answers[key] === "") {
      return sendError(
        e,
        createError({
          statusCode: 422,
          statusMessage: "Invalid answers data!",
        })
      );
    }
  });

  const runTransactionAsync = async () => {
    return await Promise.resolve(
      db(e).transaction(
        (tx) => {
          const answers = [] as {
            response: number;
            question: number;
            answer: string;
          }[];
          const respondent_id = tx
            .insert(respondents)
            .values(body.respondent)
            .returning({ inserted_id: respondents.id })
            .get();

          const response_id = tx
            .insert(responses)
            .values({
              respondent: respondent_id.inserted_id,
              merchant: Number(body.merchant),
            })
            .returning({ inserted_id: responses.id })
            .get();

          Object.keys(body.answers).forEach((key) => {
            const ids = parseKey(key);
            answers.push({
              response: response_id.inserted_id,
              question: ids[1],
              answer: body.answers[key],
            });
          });
          tx.insert(response_answers).values(answers).run();
        },
        {
          behavior: "deferred",
        }
      )
    );
  };

  // const parse = () => {
  // state;
  // };
  await runTransactionAsync();
  return { success: true, message: "Response procecced successfully." };
});
