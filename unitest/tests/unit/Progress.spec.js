import { shallowMount } from '@vue/test-utils';
import ProgressBar from '@/views/ProgressBar.vue';

describe('test progress', () => {
  it('when start is clicked, show the progressBar', () => {
    const wrapper = shallowMount(ProgressBar);
    expect(wrapper.classes()).toContain('hidden');
    wrapper.vm.start();
    wrapper.vm.finally();
    expect(wrapper.classes()).toContain('hidden');
  })
})