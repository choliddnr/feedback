import { defineStore, acceptHMRUpdate } from "pinia";
import type { User } from "~~/shared/types";

export const useUserStore = defineStore("user", () => {
  const user = ref<User>();
  const { active_merchant } = storeToRefs(useMerchantsStore());
  const fetch = async () => {
    user.value = (await authClient.useSession(useFetch)).data.value
      ?.user as User;
    active_merchant.value =
      user.value.defaultMerchant !== "null"
        ? (Number(user.value.defaultMerchant) as number)
        : 0;
  };

  return { user, fetch };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
