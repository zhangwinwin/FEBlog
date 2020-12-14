import { shallowMount } from '@vue/test-utils';
import Hello from '@/components/HelloWorld.vue';

// describe('HelloWorld.vue', () => {
//   it('renders msg when mounted', () => {
//     const msg = 'hello, world';
//     // 使用shallowMount方法挂载组件
//     const wrapper = shallowMount(Hello, {
//       propsData: {
//         msg
//       }
//     });
//     // 检查文本内容
//     expect(wrapper.find('h1').text()).toContain(msg)
//   })
// })

describe('HelloWorld.vue', () => {
  it('renders msg when mounted', () => {
    const msg = 'hello, world';
    // 使用shallowMount方法挂载组件
    const wrapper = shallowMount(Hello, {
      propsData: {
        msg
      }
    });
    const a = wrapper.find('a');
    expect(a.attributes().href).toBe('https://cli.vuejs.org')
    expect(wrapper.props().msg).toBe(msg)
    expect(a.classes()).toContain('firstA')
    expect(a.element.style.fontSize).toBe('14px')
  })
})