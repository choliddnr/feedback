import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditLogo from '~/components/admin/merchant/EditLogo.vue';

describe('EditLogo.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(EditLogo, {
      props: { image: 'test.png' },
    });
    expect(wrapper.exists()).toBe(true);
  });
});