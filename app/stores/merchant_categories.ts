import { defineStore, acceptHMRUpdate } from "pinia";
import type { MerchantCategory } from "~~/shared/types";

export const useMerchantCategoriesStore = defineStore(
  "merchant_categories",
  () => {
    const { data: merchant_categories } = useAsyncData<MerchantCategory[]>(
      "merchant_categories",
      () => $fetch("/api/merchants/categories")
    );

    // console.log(merchant_categories);

    return { merchant_categories };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useMerchantCategoriesStore, import.meta.hot)
  );
}
