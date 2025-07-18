import { Merchant } from "~~/shared/types";

export default defineEventHandler(async (e) => {

  try {
    

  const rows = await db(e)
    .select({
      productId: products.id,
      productTitle: products.title,
      productDescription: products.description,
      questionId: questions.id,
      question: questions.question,
      responseId: response_answers.response,
      answer: response_answers.answer,
    })
    .from(response_answers)
    .innerJoin(questions, eq(response_answers.question, questions.id))
    .innerJoin(products, eq(questions.product, products.id))
    .orderBy(products.id, response_answers.response, questions.id);

  // Transform flat rows to nested format
  // type AnswerGrouped = { product_title: string,
  //   product_description: string, 
  //   response_id: string | number,
  //   question: string, 
  //   answer: string,
  // } 


  type FlatRecord = {
  product_id: number;
  product_title: string;
  product_description: string;
  // questionId: number;
  question: string;
  // responseId: number;
  answer: string;
};
  const records: FlatRecord[] = []; 
  const group = [] as any[]; // Initialize group array

  // for (const row of rows) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
   
    records.push({

      product_id: row.productId,
      product_title: row.productTitle,
      product_description: row.productDescription,
      // response_id: row.responseId,
      question: row.question,
      answer: row.answer,
    })
  }

// return records
// Original flat data type


type InputData = {
  data: FlatRecord[];
};

// Output structure
type FormattedData = {
  product_title: string;
  product_description: string;
  questions: Record<string, string[]>;
}[];

function formatSurveyData(input: FlatRecord[]): FormattedData {
  const grouped: Record<number, {
    product_title: string;
    product_description: string;
    questions: Record<string, string[]>;
  }> = {};

  for (const record of input) {
    if (!grouped[record.product_id]) {
      grouped[record.product_id] = {
        product_title: record.product_title,
        product_description: record.product_description,
        questions: {}
      };
    }
    
    
    const group = grouped[record.product_id];
    
    if (!group.questions[record.question]) {
      group.questions[record.question] = [];
    }
    
    grouped[record.product_id].questions[record.question].push(record.answer)
    // console.log(grouped[record.product_id].questions[record.question]);
  }

  return Object.values(grouped);
}

return { data: JSON.stringify(formatSurveyData(records))};


  
//   return {data:[
//   {
//     "product_title": "Mie Njerit",
//     "product_description": "Signature Noole By Tsurayya Food",
//     "questions": {
//       "What did you think about the portion size?": ["Too big", "Too big", "Too big", "Too small", "Just right", "Too small", "Too small", "Too big", "Just right", "Too big"],
//       "How do you find the spiciness level?": ["Too spicy", "Not spicy enough", "Perfect", "Not spicy enough", "Perfect", "Not spicy enough", "Not spicy enough", "Perfect", "Not spicy enough", "Perfect"],
//       "How would you rate the noodle texture?": ["Just right", "Too soft", "Too hard", "Too soft", "Too hard", "Too hard", "Too soft", "Too soft", "Too hard", "Too soft"],
//       "Did you enjoy the toppings and ingredients included?\n*What would you change or add?": ["Yes", "Yes", "No", "Yes", "No", "No", "No", "Yes", "Yes", "Yes"],
//       "How would you rate the value for money?": ["Excellent", "Poor", "Good", "Fair", "Fair", "Good", "Good", "Poor", "Fair", "Fair"],
//       "Would you order the hot noodle again?": ["Yes", "Yes", "Maybe", "Yes", "Maybe", "Yes", "No", "Yes", "No", "Yes"],
//       "What did you like most about the hot noodle?": ["Nice texture", "Great broth", "Great broth", "Nice texture", "Great broth", "Rich flavor", "Nice texture", "Nice texture", "Great broth", "Great broth"],
//       "What would you improve or change?": ["More meat", "Less salt", "Add egg", "More meat", "Add egg", "Add egg", "Add egg", "Less salt", "More meat", "More meat"],
//       "Any other comments or suggestions?": ["No suggestions", "Keep spicy level", "Keep spicy level", "No suggestions", "Loved it", "No suggestions", "Loved it", "Keep spicy level", "Keep spicy level", "Loved it"],
//       "How would you rate the hot noodle?": ["5", "5", "4", "2", "5", "4", "2", "4", "3", "3"]
//     }
//   },
//   {
//     "product_title": "Mie Jebew",
//     "product_description": "West Java signature noodle",
//     "questions": {
//       "What did you think about the portion size?": ["Just right", "Too small", "Too small", "Too small", "Too big", "Too big", "Too big", "Too small", "Too small", "Too big"],
//       "How do you find the spiciness level?": ["Not spicy enough", "Too spicy", "Not spicy enough", "Perfect", "Not spicy enough", "Too spicy", "Perfect", "Too spicy", "Not spicy enough", "Too spicy"],
//       "How would you rate the noodle texture?": ["Just right", "Just right", "Too hard", "Just right", "Too soft", "Just right", "Too hard", "Just right", "Too soft", "Too hard"],
//       "Did you enjoy the toppings and ingredients included?": ["No", "No", "Yes", "Yes", "Yes", "No", "Yes", "Yes", "No", "No"],
//       "How would you rate the value for money?": ["Excellent", "Excellent", "Poor", "Good", "Excellent", "Poor", "Poor", "Excellent", "Poor", "Good"],
//       "Would you order the hot noodle again?": ["Yes", "Yes", "No", "Maybe", "Yes", "Yes", "No", "Yes", "Maybe", "No"],
//       "What did you like most about the hot noodle?": ["Nice texture", "Rich flavor", "Great broth", "Nice texture", "Nice texture", "Great broth", "Nice texture", "Great broth", "Nice texture", "Nice texture"],
//       "What would you improve or change?": ["Add egg", "More meat", "Add egg", "More meat", "Add egg", "Add egg", "Less salt", "Add egg", "Less salt", "Less salt"],
//       "Any other comments or suggestions?": ["Loved it", "No suggestions", "Keep spicy level", "Loved it", "Loved it", "Keep spicy level", "Keep spicy level", "Keep spicy level", "No suggestions", "Keep spicy level"],
//       "How would you rate the hot noodle?": ["2", "3", "3", "1", "1", "5", "3", "4", "2", "4"]
//     }
//   }
// ]
// };
  } catch (error) {
    return sendError(e, createError({statusCode: 500, statusMessage: "Internal Server Error", data: error }));
  }
 
 
  // const slug = await $fetch<Merchant[]>(
  //   "/api/merchants/slug/merchant-demo-xxx",
  //   {
  //     headers: e.headers,
  //   }
  // );
  // if (slug.length > 0) {
  //   return sendError(
  //     e,
  //     createError({
  //       statusCode: 422,
  //       statusMessage: "slug is already taken",
  //       data: slug,
  //     })
  //   );
  // }
  // return slug;
});
