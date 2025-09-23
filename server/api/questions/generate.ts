import { GoogleGenAI, Type, type ContentListUnion } from "@google/genai";
import { Product } from "~~/shared/types";

const ai = new GoogleGenAI({
  apiKey: useRuntimeConfig().geminiApiKey,
});

export default defineEventHandler(async (e) => {
  const { id, title, description, keys } = (await readBody(e)) as {
    id: number;
    title: string;
    description: string;
    keys: string;
  };
  if (!id) {
    return sendError(
      e,
      createError({ statusCode: 400, statusMessage: "ID is required" })
    );
  }

  // const product = await e.$fetch<Product>("/api/products/one/" + id);

  //   console.log("id", product);
  //   const kf = await ai.models.generateContent({
  //     model: "gemini-2.5-flash",
  //     contents: [
  //       {
  //         role: "user",
  //         parts: [
  //           {
  //             text: `

  // ### Product Details
  // - Title: 'Mie Hebew'
  // - Description: hidangan mie pedas khas Garut, Jawa Barat, memiliki rasa pedas gurih yang ekstrem dan menggugah selera, sehingga memberikan sensasi "jebew" (bibir bengkak karena pedas).
  // Menggunakan racikan bumbu pedas dari minyak cabai dan minyak bawang, dipadukan dengan berbagai topping seperti bakso, ayam, atau pangsit.
  // Karakteristik:
  // Rasa: menonjolkan rasa pedas yang pedih dan gurih, ditambah sedikit manis dari bumbu khasnya.
  // Mie: menggunakan mie telur yang kenyal dan tebal, yang tidak mudah hancur meskipun dimasak dengan bumbu pedas yang kuat.
  // Bumbu Khas: Menggunakan campuran cabai dan minyak cabai yang berlimpah, serta minyak bawang yang wangi, yang memberikan rasa pedas berlapis dan aroma lebih tajam.
  // Pilihan Toping: bakso ayam, sosis, telur, ayam suwir, pangsit goreng.
  // `,
  //           },
  //         ],
  //       },
  //     ],
  //     config: {
  //       systemInstruction: `You are a product key extractor. your job is to Extract Key Features
  // From the product title and description, identify the main product features, components, or attributes that customers would have an opinion about.
  // Examples:
  // - For "Bakso Malang" → broth/liquid, meatballs, noodles, toppings, portion size, packaging.
  // - For "Smartphone" → screen, battery, camera, performance, design, price.

  // ### Output Requirements
  // - Respond ONLY with JSON (array of string).
  // - Output Schema:
  //   - "keys" (array of strings)

  // ### Guidelines
  // - Cover taste, texture, usability, design, packaging, or other relevant aspects depending on the product.`,
  //       responseMimeType: "application/json",
  //       responseSchema: {
  //         type: Type.ARRAY,
  //         items: {
  //           type: Type.STRING,
  //         },
  //       },
  //     },
  //   });

  const generatedQuestions = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
  # Product Details
  - Title: ${title}
  - Description: ${description}
  - keys: ${keys}`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: `You are an expert in market research and survey design. your job is to create unbiased survey questions about provided product title, description, and keys.

  ### Output Requirements
  - Respond ONLY with JSON (no explanations).
  - Schema for each question:
    - "question" (string)
    - "type" (integer: 0 = text-based, 1 = multiple-choice, 2 = rating)
    - "answer_options" (array of strings)
      - For type 1 → 3–5 options
      - For type 2 and 0 → always []
  - Always include 1 rating-based question about **overall satisfaction**.
  - Then generate multiple-choice questions for each **product feature** 
  - Generate text-based questions (type 0) for gathering respondents' thoughts about the product.
  - Output order by type: multiple-choice (1) first, then text-based (0), then rating (2). 

  ### Guidelines
  - Include **1 overall satisfaction rating** (type: 2).
  - For **each key**, generate at least 1 multiple-choice question (type: 1). Do not skip any key.
  - Make the answer options realistic, clear, and mutually exclusive.
  - Create at least 1 text-based question (type: 0) to get what respondents think about the product, such as improvement suggestions.
  - Questions must be **short, clear, and unbiased**.
  - Answer options must reflect realistic customer opinions. Avoid generic placeholders like 'Option A' or 'Good/Bad'." 
  - Options must be **mutually exclusive and exhaustive**.
  - Cover taste, texture, usability, design, packaging, or other relevant aspects depending on the product.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            type: { type: Type.INTEGER },
            answer_options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          propertyOrdering: ["question", "type", "answer_options"],
          required: ["question", "type", "answer_options"],
        },
      },
    },
  });

  const questions = JSON.parse(generatedQuestions.text!) as {
    question: string;
    type: number | string;
    answer_options: string[];
  }[];
  const generatedQuestionsError = [] as {
    message: string;
    question: {
      question: string;
      type: number | string;
      answer_options: string[];
    };
  }[];
  const _q = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const reqBody = {
      question: q.question,
      answer_options: q.answer_options,
      type: Number(q.type) === 0 ? 1 : Number(q.type),
      product: Number(id),
    };
    await e.$fetch<Response>("/api/questions", {
      method: "post",
      body: {
        question: q.question,
        answer_options: q.answer_options,
        type: Number(q.type) === 0 ? 1 : Number(q.type),
        product: Number(id),
      },
      onResponseError: ({ response, error }) => {
        if (!response.ok) {
          generatedQuestionsError.push({
            message: `Failed to insert question: ${response.status} ${response.statusText}`,
            question: q,
          });
        }
      },
    });
    _q.push(reqBody);
  }
  return {
    questions,
    generatedQuestionsError,
    _q,
    jgq: JSON.parse(generatedQuestions.text!)[0].question,
  };
});

// You will help design a product survey.

//   ### Step 1: Extract Key Features
//   From the product title and description, identify the main product features, components, or attributes that customers would have an opinion about.
//   Examples:
//   - For "Bakso Malang" → broth/liquid, meatballs, noodles, toppings, portion size, packaging.
//   - For "Smartphone" → screen, battery, camera, performance, design, price.

//   ### Step 2: Generate Survey Questions
//   Using the extracted features:
//   - Include **1 overall satisfaction rating** (type: 2).
//   - For **each feature**, generate at least 1 multiple-choice question (type: 1).
//   - Make the answer options realistic, clear, and mutually exclusive.
