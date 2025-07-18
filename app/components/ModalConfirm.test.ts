import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ModalConfirm from '~/components/ModalConfirm.vue';

describe('ModalConfirm.vue', () => {
  it('mounts successfully', () => {
    const wrapper = mount(ModalConfirm, {
      props: { message: 'Are you sure?' },
    });
    expect(wrapper.exists()).toBe(true);
  });
});