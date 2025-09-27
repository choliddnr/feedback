import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import HomeResponsesAnswers from "~/components/admin/responses/Answers.vue";

describe("HomeResponsesAnswers.vue", () => {
  it("mounts successfully", async () => {
    const wrapper = mount(HomeResponsesAnswers, {
      props: {
        response_id: 1,
        respondent: "Test User",
      },
      global: {
        stubs: {
          // Stub any Nuxt-specific components or async components
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
