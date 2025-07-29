import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditUserPicture from '~/components/admin/user/EditUserPicture.vue';

describe('EditUserPicture.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(EditUserPicture, {
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
