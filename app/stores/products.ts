import { defineStore, acceptHMRUpdate, skipHydrate } from "pinia";
import type { Product } from "~/types";

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const productsMap = computed(
    () => new Map(products.value.map((p) => [p.id, p]))
  );
  const selectedProducts = ref<string[]>([]);
  useFetch("/api/products", {
    method: "GET",
    onResponse: ({ response }) => {
      products.value = response._data;
    },
  });

  if (import.meta.client) {
    if (localStorage.getItem("selectedProducts")) {
      selectedProducts.value = JSON.parse(
        localStorage.getItem("selectedProducts")!
      );
      console.log(
        "selectedProducts client",
        selectedProducts.value,
        localStorage.getItem("selectedProducts")!
      );
    }
  }

  return {
    products,
    selectedProducts: skipHydrate(selectedProducts),
    productsMap: skipHydrate(productsMap),
  };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useProductsStore, (import.meta as any).hot)
  );
}
