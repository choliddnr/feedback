import { type AuthModel } from "pocketbase";
import skipHydrate from "@pinia/nuxt";
// import type { User } from "~~/shared/user";
import type { UserSession, User } from "#auth-utils";
// import { type User } from "~/schemas/user.schema.ts";

export const useUserStore = defineStore("user", () => {
  const { user } = useUserSession();
  return { user };
});

if ((import.meta as any).hot) {
  (import.meta as any).hot.accept(
    acceptHMRUpdate(useUserStore, (import.meta as any).hot)
  );
}
