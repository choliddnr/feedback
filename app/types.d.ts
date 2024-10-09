export type Product = {
  id?: string;
  title: string;
  description?: string;
  image?: string;
};

export type Question = {
  id: string;
  product: string;
  q: string;
  type: "input" | "textarea" | "boolean" | "radio" | "checkbox" | "rating";
  options: string[];
};

export type Respondent = {
  name: string;
  gender: string;
  age: number;
  whatsapp: number;
};
