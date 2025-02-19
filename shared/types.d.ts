export type Product = {
  id?: string;
  title: string;
  description?: string;
  images?: string;
};

export type Question = {
  id: string;
  product: string;
  q: string;
  type:
    | "text"
    | "number"
    | "select"
    | "select-multiple"
    | "radio"
    | "radio-multiple"
    | "long-text";
  answer_options: string[];
};

export type Respondent = {
  id?: string;
  name: string;
  gender: string;
  age: number;
  whatsapp: number;
};

export type Merchant = {
  id: number;
  title: string;
  description: string;
  category: number;
  owner?: string;
  greeting: string;
  primary_color: string;
  image_background: string;
  logo?: string;
};

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
