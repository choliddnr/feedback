import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DeleteAccountModal from '~/components/admin/user/DeleteAccountModal.vue';

describe('DeleteAccountModal.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(DeleteAccountModal, {
      global: {
        stubs: {
          UModal: true,
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });
});
