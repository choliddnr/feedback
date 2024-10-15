import { defineStore, acceptHMRUpdate, skipHydrate } from "pinia";
import type { Product } from "~/types";

export const useProductsStore = defineStore("products", () => {
  const { $pb } = useNuxtApp();
  const { merchant } = storeToRefs(useMerchantStore());
  const products = ref<Product[]>();
  useAsyncData(
    async () => {
      if (!merchant.value?.id) return;
      const records = await $pb
        .collection("products")
        .getFullList({ filter: `merchant='${merchant.value?.id}'` });
      console.log("fetch product", structuredClone(records));
      products.value = structuredClone(records) as unknown as Product[];
    },
    {
      watch: [merchant],
    }
  );
  const productToDelete = ref<Product | undefined>();

  return { productToDelete, products };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useProductsStore, (import.meta as any).hot)
  );
}
