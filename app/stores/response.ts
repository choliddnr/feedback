import { defineStore, acceptHMRUpdate } from "pinia";
import type {
  Product,
  Merchant,
  RespondentForm,
  Question,
  Respondent,
  ResponseTable,
} from "~~/shared/types";

export const useResponseStore = defineStore("response", () => {
  const merchant = ref<Merchant>();
  const respondent = ref<RespondentForm>();
  const selected_product = ref<number[]>([]);
  const products = ref<Product[]>([]);
  const answers = ref(new Map());
  const all_questions = ref<Question[]>();
  const responses = ref<ResponseTable[]>([]);

  return {
    merchant,
    respondent,
    selected_product,
    products,
    all_questions,
    answers,
    responses,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useResponseStore, import.meta.hot));
}
