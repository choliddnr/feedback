import { defineStore, acceptHMRUpdate } from "pinia";
import type { Merchant } from "~~/shared/types";

export const useMerchantsStore = defineStore("merchants", () => {
  const active_merchant = ref<number>(0);
  const { data: merchants, execute: fetch } = useFetch<Merchant[]>(
    "/api/merchants",
    {
      onResponse: ({ response }) => {
        if (
          response.ok &&
          active_merchant.value === 0 &&
          response._data!.length > 0
        ) {
          active_merchant.value = response._data![0]!.id;
        }
      },
    }
  );

  return { merchants, active_merchant, fetch };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMerchantsStore, import.meta.hot));
}
