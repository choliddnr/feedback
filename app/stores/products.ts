import type { Product } from "~~/shared/types";
import { useMerchantStore } from "./merchant";

export const useProductsStore = defineStore("products", () => {
  const { merchant } = storeToRefs(useMerchantStore());
  const { data: products, execute } = useFetch<Product[]>("/api/product", {
    query: {
      merchant: merchant.value?.id,
    },
    immediate: false,
    watch: [merchant],
  });
  const productToDelete = ref<Product | undefined>();

  return { productToDelete, products };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useProductsStore, (import.meta as any).hot)
  );
}
