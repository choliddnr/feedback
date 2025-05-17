type User = typeof auth.$Infer.Session.user & { id?: number };

import { InferModel } from "drizzle-orm";
import { products, questions, question_types } from "~~/server/utils/db/schema";

export type NewProduct = InferModel<typeof products, "insert">;
export type Product = InferModel<typeof products>;

// export type Product = {
//   id?: number;
//   title: string;
//   description?: string;
//   images?: string;
//   merchant: number;
// };
export type QuestionType = InferModel<typeof question_types>;

export type NewQuestion = InferModel<typeof questions, "insert">;
export type Question = InferModel<typeof questions>;
// export type Question = {
//   id: number;
//   product: string;
//   q: string;
//   type:
//     | "text"
//     | "number"
//     | "select"
//     | "select-multiple"
//     | "radio"
//     | "radio-multiple"
//     | "long-text";
//   answer_options: string[];
// };

export type NewRespondent = InferModel<typeof respondents, "insert">;
export type Respondent = InferModel<typeof respondents>;
export type RespondentForm = Omit<NewRespondent, "whatsapp" | "gender"> & {
  whatsapp: number;
  gender: "female" | "male";
};
// export type Respondent = {
//   id?: number;
//   name: string;
//   gender: string;
//   age: number;
//   whatsapp: number;
// };
export type NewMerchant = InferModel<typeof merchants, "insert">;
export type Merchant = InferModel<typeof merchants>;

// export type Merchant = {
//   id: number;
//   title: string;
//   description: string;
//   category: number;
//   owner?: number;
//   greeting: string;
//   primary_color: string;
//   image_background: string;
//   logo?: string;
// };

export type MerchantCategory = {
  id: number;
  title: string;
  description: string;
};

const colors = useAppConfig().primary_color;

export type Color = (typeof colors)[number];

export type ImageError = {
  isError: boolean;
  message: string;
};
