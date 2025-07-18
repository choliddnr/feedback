import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditImage from '~/components/admin/products/EditImage.vue';

describe('EditImage.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(EditImage, {
      props: { image: 'test.png' },
      global: {
        stubs: {
          UModal: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});