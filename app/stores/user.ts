import { type AuthModel } from "pocketbase";
import skipHydrate from "@pinia/nuxt";
import type { User } from "~~/shared/types";
// import { type User } from "~/schemas/user.schema.ts";

export const useUserStore = defineStore("user", () => {
  const { $pb } = useNuxtApp();
  const user = ref<User>($pb.authStore.record as unknown as User);
  const userToken = useCookie("token");
  $pb.authStore.onChange((token, model) => {
    userToken.value = token;
    user.value = model as unknown as User;
  }, true);

  const avatarBlob = ref<string>("");
  watch(
    user,
    () => {
      if (!user.value) return;
      if (user.value.avatar) {
        $fetch($pb.files.getURL(user.value, user.value.avatar), {
          onResponse: ({ response }) => {
            avatarBlob.value = URL.createObjectURL(response._data);
          },
        });
      }
    },
    {
      immediate: true,
      deep: true,
    }
  );
  computed(() => {
    if (user.value.avatar) {
      const objUrl = $fetch<Blob>(
        $pb.files.getURL(user.value, user.value.avatar)
      )
        .then((res) => URL.createObjectURL(res))
        .then((res) => res);
      console.log("objUrl", objUrl);
    }
    return "";
  });
  return { userToken, user, avatarBlob };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useUserStore, (import.meta as any).hot)
  );
}
