import { defineStore, acceptHMRUpdate } from "pinia";
import type { Product, Merchant, RespondentForm } from "~~/shared/types";

export const useResponseStore = defineStore("response", () => {
  const merchant = ref<Merchant>();
  const respondent = ref<RespondentForm>();
  const selected_product = ref<number[]>([]);
  const products = ref<Product[]>([]);
  const answers = ref(new Map());

  return { merchant, respondent, selected_product, products, answers };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useResponseStore, import.meta.hot));
}
