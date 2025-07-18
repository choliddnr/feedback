import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Rating from '../../../../app/components/Rating.vue';

describe('Rating.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(Rating);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findAll('svg').length).toBe(5); // Assuming 5 stars
  });

  it('renders correct number of filled stars based on value prop', () => {
    const wrapper = mount(Rating, {
      props: { modelValue: 3 },
    });
    const filledStars = wrapper.findAll('path[fill="currentColor"]');
    expect(filledStars.length).toBe(3);
  });

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Rating);
    const firstStar = wrapper.findAll('svg')[0];
    await firstStar.trigger('click');
    expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
    expect(wrapper.emitted()['update:modelValue'][0][0]).toBe(1);
  });
});