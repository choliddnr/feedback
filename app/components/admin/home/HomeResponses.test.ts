import { describe, it, expect, beforeAll } from "vitest";
import HomeResponses from "./HomeResponses.vue";
import { mountSuspended } from "@nuxt/test-utils/runtime";

describe("HomeResponses", () => {
  it("can mount the component", async () => {
    const component = await mountSuspended(HomeResponses);
    expect(component.html()).toContain("Respondent ID");
    // expect(true).toBe(true); // Placeholder for actual test
  });
});
