import { type Merchant, type MerchantCategory } from "~~/shared/types";
import { useUserStore } from "./user";

export const useMerchantStore = defineStore("merchant", () => {
  const { user } = storeToRefs(useUserStore());
  const { data: merchants, execute } = useFetch<Merchant[]>("/api/merchant", {
    immediate: false,
    watch: [user],
  });
  if (!merchants.value) {
    if (user.value) execute();
    const unwatch = watch(user, () => {
      if (user.value) {
        execute();
        unwatch();
      }
    });
  }
  const { data: merchant_categories } = useFetch<MerchantCategory[]>(
    "/api/merchant/categories"
  );

  return { merchants, merchant_categories };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useMerchantStore, (import.meta as any).hot)
  );
}
