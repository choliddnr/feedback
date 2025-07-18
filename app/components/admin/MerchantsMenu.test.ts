import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MerchantsMenu from '~/components/admin/MerchantsMenu.vue';

describe('MerchantsMenu.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(MerchantsMenu);
    expect(wrapper.exists()).toBe(true);
  });
});