import { DB } from "better-auth/adapters/drizzle";
import { AIOutput } from "~~/shared/types";

export default defineEventHandler(async (e) => {
  const id = Number(getRouterParam(e, "id"));
  if (!id) {
    return sendError(
      e,
      createError({
        statusCode: 400,
        statusMessage: "ID is required for analysis",
      })
    );
  }

  type FlatRecord = {
    product_id: number;
    product_title: string;
    product_description: string;
    // questionId: number;
    question: string;
    // responseId: number;
    answer: string;
  };
  type FormattedData = {
    product_title: string;
    product_description: string;
    questions: Record<string, string[]>;
  }[];

  try {
    const q = async (db: DB) =>
      db
        .select({
          product_id: products.id,
          product_title: products.title,
          product_description: products.description,
          question_id: questions.id,
          question: questions.question,
          response_id: response_answers.response,
          answer: response_answers.answer,
        })
        .from(response_answers)
        .innerJoin(questions, eq(response_answers.question, questions.id))
        .innerJoin(products, eq(questions.product, products.id))
        .orderBy(products.id, response_answers.response, questions.id);

    const rows = await q(db(e));

    const records: FlatRecord[] = [];
    const group = [] as any[]; // Initialize group array

    // for (const row of rows) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      records.push({
        product_id: row.product_id,
        product_title: row.product_title,
        product_description: row.product_description,
        question: row.question,
        answer: row.answer,
      });
    }

    const grouped: Record<
      number,
      {
        product_title: string;
        product_description: string;
        questions: Record<string, string[]>;
      }
    > = {};

    for (const record of records as FlatRecord[]) {
      if (!grouped[record.product_id]) {
        grouped[record.product_id] = {
          product_title: record.product_title,
          product_description: record.product_description,
          questions: {},
        };
      }
      const group = grouped[record.product_id];
      if (!group.questions[record.question]) {
        group.questions[record.question] = [];
      }
      grouped[record.product_id].questions[record.question].push(record.answer);
    }
    const text_responses = JSON.stringify(Object.values(grouped));
    // return Object.values(grouped);
    return rows;

    // const analysis = await $fetch<AIOutput>(
    //   useRuntimeConfig().N8N_API + '/webhook-test/analyze_response',
    //   {
    //     method: 'POST',
    //     body: {
    //       data: text_responses,
    //       id,
    //     },
    //   },
    // );
    // return await $fetch('/api/analysis/' + id, {
    //   method: 'POST',
    //   body: {
    //     data: analysis[0].output,
    //   },
    // });
    // console.log("Analysis result:", analysis);
    // return analysis[0].output;
  } catch (error) {
    return sendError(
      e,
      createError({
        statusCode: 500,
        statusMessage: "Internal Server Error: " + e,
      })
    );
  }
});
