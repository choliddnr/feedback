import { DB } from "better-auth/adapters/drizzle";
import { AIOutput } from "~~/shared/types";

import { GoogleGenAI, Type, type ContentListUnion } from "@google/genai";
import { Product } from "~~/shared/types";

const ai = new GoogleGenAI({
  apiKey: useRuntimeConfig().geminiApiKey,
});

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
        .from(products)
        .where(eq(products.id, id))
        .innerJoin(questions, eq(questions.product, products.id))
        .innerJoin(
          response_answers,
          eq(response_answers.question, questions.id)
        )
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
    const data = grouped[id];
    let prompt = `product title: ${data.product_title}\n product description: ${data.product_description}\n customer feedback data: `;
    for (const [question, answers] of Object.entries(data.questions)) {
      prompt += `\nQuestion: ${question}\nAnswers: ${answers.join("; ")}`;
    }

    const analysisResult = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      config: {
        systemInstruction: `You are a data analyst. Analyze the following customer feedback data for the product and provide insights, trends, and suggestions for improvement. Format the output in JSON with sections for Sentiment with 3 properties (positive, neutral, negative), Net Promoter Score (NPS), themes,
        Summary, Highlight, Trends, Average Rating, and Recommendations. Be concise and focus on actionable insights.
        # this is the example output:
        {
          sentiment: { positive: 70, neutral: 25, negative: 5 },
          net_promoter_score: 52,
          summary: "Customers love the spicy flavor and portion size. Some complain about packaging leakage.",
          highlight: "The noodles are delicious, but the cup leaks sometimes.",
          themes: [
            "Taste → 80% positive",
            "Packaging → 45% negative",
            "Price → 70% positive",
          ],
          trends: [
            "Increasing positive feedback on taste over the last quarter.",
            "Rising concerns about packaging durability.",
          ],
          average_rating: 4.3,
          recommendations: [
            "Improve packaging to prevent leakage.",
            "Maintain focus on flavor innovation.",
          ]
        },
        # use language based on the languages used in the user prompts.
        # the answers are ordered from the oldest response to the newest response.
        # the product response are provided in the user prompt.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.OBJECT,
              properties: {
                positive: { type: Type.INTEGER },
                neutral: { type: Type.INTEGER },
                negative: { type: Type.INTEGER },
              },
              required: ["positive", "neutral", "negative"],
            },
            net_promoter_score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            highlight: { type: Type.STRING },
            themes: { type: Type.ARRAY, items: { type: Type.STRING } },
            trends: { type: Type.ARRAY, items: { type: Type.STRING } },
            average_rating: { type: Type.NUMBER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: [
            "sentiment",
            "net_promoter_score",
            "summary",
            "highlight",
            "themes",
            "trends",
            "average_rating",
            "recommendations",
          ],
        },
      },
    });
    await e.$fetch("/api/analysis/" + id, {
      method: "POST",
      body: { data: JSON.stringify(analysisResult.text) },
    });
    return analysisResult.text;
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
