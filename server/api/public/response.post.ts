import { D1Database } from "@cloudflare/workers-types";
import { DB } from "better-auth/adapters/drizzle";
import { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
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

  if (import.meta.dev) {
    /**
     * Running on development
     * @returns
     */
    const runTransactionAsync = async () => {
      return await Promise.resolve(
        (db(e) as DB).transaction(
          (tx: DB) => {
            const answers = [] as {
              response: number;
              question: number;
              answer: string;
            }[];
            const products_to_responses_data = [] as {
              product_id: number;
              response_id: number;
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
              const product_list = [] as number[];
              answers.push({
                response: response_id.inserted_id,
                question: ids[1],
                answer: body.answers[key],
              });
              if (!product_list.includes(ids[0])) {
                products_to_responses_data.push({
                  product_id: ids[0],
                  response_id: response_id.inserted_id,
                });
                product_list.push(ids[0]);
              }
            });
            tx.insert(response_answers).values(answers).run();
            tx.insert(products_to_responses)
              .values(products_to_responses_data)
              .run();
          },
          {
            behavior: "deferred",
          }
        )
      );
    };
    await runTransactionAsync();
  } else {
    /**
     * Since D1 does'nt support transactions, to ensure ACID properties,
     * we will perform the operations sequentially. and save each successfull state into array.
     * If any operation fails, we will rollback the changes by deleting the inserted data saved in the array.
     */
    const insertedData: {
      inserted_id: number;
      table: SQLiteTableWithColumns<any>;
    }[] = [];

    try {
      const respondent = await db(e)
        .insert(respondents)
        .values(body.respondent)
        .returning()
        .get();
      insertedData.push({ inserted_id: respondent.id, table: respondents });

      const response = await db(e)
        .insert(responses)
        .values({
          respondent: respondent.id,
          merchant: Number(body.merchant),
        })
        .returning()
        .get();
      insertedData.push({ inserted_id: response.id, table: responses });

      const answers = [] as {
        response: number;
        question: number;
        answer: string;
      }[];

      Object.keys(body.answers).forEach((key) => {
        const ids = parseKey(key);
        answers.push({
          response: response.id,
          question: ids[1],
          answer: body.answers[key],
        });
      });

      await db(e).insert(response_answers).values(answers).run();
    } catch (error) {
      // rollback logic
      for (const data of insertedData) {
        await db(e)
          .delete(data.table)
          .where(eq(data.table.id, data.inserted_id))
          .run();
      }
      return sendError(
        e,
        createError({
          statusCode: 500,
          statusMessage: "Failed to process response!",
        })
      );
    }
  }
  return { success: true, message: "Response procecced successfully." };
});
