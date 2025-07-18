import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HomeResponseAnalysis from '~/components/admin/home/HomeResponseAnalysis.vue';

describe('HomeResponseAnalysis.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = mount(HomeResponseAnalysis, {
      global: {
        stubs: {
          // Stub any Nuxt-specific components or async components
          // For example, if it uses <NuxtLink>, you can stub it:
          // NuxtLink: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});