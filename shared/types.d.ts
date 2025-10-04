// type User = typeof auth.$Infer.Session.user & { id?: number };

import { InferModel } from "drizzle-orm";
import { products, questions, question_types } from "~~/server/utils/db/schema";

import type { AvatarProps } from "@nuxt/ui";

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

export type Stat = {
  title: string;
  icon: string;
  value: number | string;
  variation: number;
  formatter?: (value: number) => string;
};

export type UserStatus = "subscribed" | "unsubscribed" | "bounced";
export type SaleStatus = "paid" | "failed" | "refunded";

export type Mail = {
  id: number;
  unread?: boolean;
  from: User;
  subject: string;
  body: string;
  date: string;
};

export type Member = {
  name: string;
  username: string;
  role: "member" | "owner";
  avatar: Avatar;
};

export type Stat = {
  title: string;
  icon: string;
  value: number | string;
  variation: number;
  formatter?: (value: number) => string;
};

export type ResponseTable = {
  name: string;
  age: number;
  gender: boolean;
  whatsapp: number;
  created_at: number;
  respondent_id: number;
  response_id: number;
};

export type Notification = {
  id: number;
  unread?: boolean;
  sender: User;
  body: string;
  date: string;
};

export type Period = "daily" | "weekly" | "monthly";

export type Range = {
  start: Date;
  end: Date;
};

export type AIOutput = [
  {
    output: string;
  }
];

export type ProductAnalysis = {
  product?: number;
  name?: string;
  sentiment?: { positive: number; neutral: number; negative: number };
  net_promoter_score?: number;
  summary?: string;
  highlight?: string;
  themes?: string[];
  trends?: string[];
  average_rating?: number;
  recomendations?: string[];
  un_analyzed_responses?: number;
};

export type Kpi = {
  label: string;
  value: string;
  class?: string;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export type Session = typeof _auth.$Infer.Session;
export type User = typeof _auth.$Infer.Session.user;
