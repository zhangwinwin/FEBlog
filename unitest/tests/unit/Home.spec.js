// import Vue from 'vue';
// import Home from '@/views/Home.vue';

// describe('Home.vue', () => {
//   it('renders msg when mounted', () => {
//     const msg = 'Welcome to Your Vue.js App';
//     // 使用Home选项创建一个新的Vue构造函数
//     const Ctor = Vue.extend(Home);
//     // 创建一个新的Vue实例并挂载该实例
//     const vm = new Ctor().$mount();
//     // 访问DOM元素，检查文本内容
//     expect(vm.$el.textContent).toContain(msg)
//   })
// })

import { mount, shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import Hello from '@/components/HelloWorld.vue';

describe('Home.vue', () => {
  it('renders msg when mounted', () => {
    const msg = 'Welcome to Your Vue.js App';
    // 使用shallowMount方法挂载组件
    // const wrapper = mount(Home);
    const wrapper = shallowMount(Home);
    // 检查文本内容
    expect(wrapper.text()).toContain(msg)
  })
  it('click the check button, home.greeting will change to hello', () => {
    const wrapper = shallowMount(Home);
    wrapper.findComponent(Hello).vm.$emit('sayHello', 'hello');
    expect(wrapper.vm.greeting).toBe('hello')
  })
})