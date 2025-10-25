import { authClient } from "~/utils/client";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: session } = await authClient.useSession(useFetch);
  if (!session.value) {
    return navigateTo("/signon");
  }
});
