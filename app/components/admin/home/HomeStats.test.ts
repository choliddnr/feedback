import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import HomeStats from '~/components/admin/home/HomeStats.vue';

describe('HomeStats.vue', () => {
  it('mounts successfully', async () => {
    const wrapper = mount(HomeStats, {
      props: {
        period: 'day',
        range: 'last_7_days',
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