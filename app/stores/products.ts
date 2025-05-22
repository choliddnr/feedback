import { defineStore, acceptHMRUpdate } from "pinia";
import type { Product } from "~~/shared/types";

export const useProductsStore = defineStore("products", () => {
  const { active_merchant } = storeToRefs(useMerchantsStore());
  const active_product = ref<number>();
  const products = ref<Product[]>([]);
  // const fetch = async () => {
  //   await $fetch("/api/products", {
  //     onResponse: ({ response }) => {
  //       if (response.ok) {
  //         products.value = response._data;
  //       }
  //     },
  //   },  {
  //     watch:[merchant_id]
  //   });
  // };

  const { refresh: fetch } = useLazyFetch(
    () => `/api/products/${active_merchant.value}`,
    {
      immediate: true,
      watch: [active_merchant],
      onRequest: () => {},
      onResponse: ({ response }) => {
        if (response.ok) {
          products.value = response._data;
          if (!active_product.value) {
            active_product.value = products.value[0]?.id;
          }
        }
      },
    }
  );

  // fetch();
  return { products, active_product, fetch };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductsStore, import.meta.hot));
}
