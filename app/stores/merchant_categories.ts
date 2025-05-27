import { defineStore, acceptHMRUpdate } from "pinia";
import type { MerchantCategory } from "~~/shared/types";

export const useMerchantCategoriesStore = defineStore(
  "merchant_categories",
  () => {
    const { data: merchant_categories, refresh: fetch } = useFetch<
      MerchantCategory[]
    >("/api/merchants/categories", {
      onRequest: ({ request }) => {
        console.log("Fetching merchant categories", request);
      },
    });
    return { merchant_categories, fetch };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useMerchantCategoriesStore, import.meta.hot)
  );
}
