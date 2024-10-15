export default defineNuxtRouteMiddleware((to, from) => {
  if (to.params.merchant) {
    const { merchantId } = storeToRefs(useFeedbackStore());
    merchantId.value = to.params.merchant as string;

    if (to.name !== "merchant") {
      const { merchant } = storeToRefs(useFeedbackStore());
      if (!merchant.value) {
        console.log(to.params.merchant, to, merchant.value);
        return navigateTo({ name: "merchant" });
      }
    }
  }
  // In a real app you would probably not redirect every route to `/`
  // however it is important to check `to.path` before redirecting or you
  // might get an infinite redirect loop
  //   if (to.path !== "/") {
  //     return navigateTo("/");
  //   }
});
