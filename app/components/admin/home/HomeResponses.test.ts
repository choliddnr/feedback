import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HomeResponses from '~/components/admin/home/HomeResponses.vue';

describe('HomeResponses.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = mount(HomeResponses, {
      global: {
        stubs: {
          // Stub any Nuxt-specific components or async components
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
