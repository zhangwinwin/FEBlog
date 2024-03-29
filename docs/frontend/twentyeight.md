---
title: VUE单元测试--进阶之路
---

## 前言
全方位的介绍如何使用`JEST`测试一个VUE组件。  
（如果不知道怎么开始`VUE`单元测试的同学们，请查看之前的文章[VUE单元测试--开启测试之旅](https://juejin.cn/post/6906295144505409549)）

着重介绍在使用`Vue.extend`创建构造函数的形式注册的组件，包括：
* 测试定时器函数
* 测试`HTTP`请求
* 测试事件
等这几个部分的介绍

代码在[github](https://github.com/zhangwinwin/FEBlog/tree/master/unitest)欢迎点赞👍

## 测试组件
测试组件，其实就是测试组件的方法以及方法所依赖的模块。  
测试组件方法很简单：调用组件方法并断言方法能用正确地影响了组件的输出即可。

从一个例子出发，测试一个进度条组件
```
<template>
  <div class="Progress-Bar" :class="{hidden: hidden}">
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  data () {
    return {
      hidden: true
    }
  },
  methods: {
    start () {
      this.hidden = false;
    },
    finally () {
      this.hidden = true;
    }
  },
}
</script>
```
代码一目了然，当调用`start`方法时，应该展示进度条；当调用`finally`方法时，应该屏蔽进度条。
```
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
```
运行`yarn test:unit`时，测试通过。

这是简单的组件测试。

### Vue实例添加属性
事实上还有一种非常常见的组件模式，就是往`Vue`实例添加属性。在之前的文章中也介绍过，用这[VUE的“动态”案例](https://juejin.cn/post/6893303835251441677)介绍的组件来做例子，组件的具体开发就不多作介绍了，代码在代码在[github](https://github.com/zhangwinwin/FEBlog/tree/master/unitest)中。  
（进入到`unitest`文件夹中，运行`yarn serve`。）

功能：点击按钮触发`handleCheck`事件，弹出`alarm`弹窗，弹窗`id`就是在`primaryId`基础上增加1。  
测试用例如下：
```
describe('test alarm', () => {
  it('when handleCheck is clicked, show the alarm', () => {
    const wrapper = shallowMount(Home);
    const count = wrapper.vm.primaryId;
    wrapper.vm.handleCheck();
    const newCount = wrapper.vm.primaryId;
    expect(newCount).toBe(count + 1)
  })
})
```
运行`yarn test:uni`时会发生错误
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/512eb096fd1844b49c8900c436e0f67e~tplv-k3u1fbpfcp-watermark.image)

这是因为在测试中直接挂载了组件，而这个组件实例是使用`Vue.extend`函数创建的，并在`main.js`引入和添加到`Vue`的原型中的。换而言之，`main.js`并没有被执行，这个组件就没有被创建，`$alarm`属性就永远不会被添加。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/696f8ef28fe34eeb940d479d2a28e1a1~tplv-k3u1fbpfcp-watermark.image)

这时需要在加载组件到测试之前先为`Vue`实例添加属性。可以使用`mocks`来实现。
```
shallowMount(Home, {
  mocks: {
    $alarm: () => {}
  }
})
```
再次运行`yarn test:uni`时就完美的通过了。

### 测试定时器函数
定时器函数包括`JavaScript`异步函数都是前端中常见的功能，所以都需要测试对应的代码。但肯定不是等待定时器函数走完，需要使用`Jest.useFakeTimers`替换全局定时器函数，替换后可以使用`runTimersToTime`推进时间。

#### 测试setTimeout
功能：`handleCheck`事件触发后，会将`alarm`组件`id unshift`到`idList`数组中，弹出3秒后组件就会被销毁，`idList`也会将其`id`给删除掉。  
测试用例如下：
```
it('when handleCheck is clicked, 3second later alarm would be disappeared', () => {
  // 测试之前，替换全局定时函数
  jest.useFakeTimers();
  const wrapper = shallowMount(Home, {
    mocks: {
      $alarm: () => {}
    }
  });
  wrapper.vm.handleCheck();
  expect(wrapper.vm.idList.length).toBe(1);
  // 将时间推进3000毫秒
  jest.runTimersToTime(3000);
  expect(wrapper.vm.idList.length).toBe(0);
})
```

#### 测试clearTimeout
功能：当`alarm`弹窗超过一个的时候，就会调用`clearTimeout`销毁前一个的`timer`。这时就要监听`clearTimeout`是否被调用。

使用`Jest.spyOn`函数创建一个`spy`，可以使用`toHaveBeenCalled`匹配器来检测`spy`是否被调用，更进一步地可以使用`toHaveBeenCalledWith`匹配器测试`spy`是否带有指定参数被调用。

所以在测试中，需要得到`setTimeout`的返回值，`Jest.mockReturnValue`可以实现这个需求。`mockReturnValue`可以将`setTimeout`的返回值设置为任何值，比如将返回值设置为123：`setTimeOut.mockReturnValue(123)`  
测试用例如下：
```
it('when handleCheck is clicked and the number of alarm exceeds 1 , The previous alarm disappears immediately', () => {
    // 监听clearTimeout
    jest.spyOn(window, 'clearTimeout')
    const wrapper = shallowMount(Home, {
      mocks: {
        $alarm: () => {}
      }
    });
    // 设置setTimeout返回值为123
    setTimeout.mockReturnValue(123)
    wrapper.vm.handleCheck();
    // 设置setTimeout返回值为456
    setTimeout.mockReturnValue(456)
    wrapper.vm.handleCheck();
    expect(window.clearTimeout).toHaveBeenCalledWith(123)
  })
```

### 测试模拟HTTP请求
`HTTP`请求不在单元测试范围，因为它会降低单元测试的速度；降低单元测试的可靠性，因为`HTTP`请求不会100%请求成功。所以需要在单元测试中模拟`api`文件，从而使得`fetchAlarmDetail`永远不会发送一个`HTTP`请求。

`Jest`提供了一个`API`，用于选择当一个模块导入另一个模块时返回哪些文件或函数。首先的创建一个`mock`文件，而不是直接在测试中引入真正的文件。

在`api`目录中创建一个`__mocks__`目录，里面创建一个模拟的需要测试的`alarmApi`文件
```
// src/api/__mocks__/alarmApi.js
export const fetchAlarmDetail = jest.fn(() => Promise.resolve('人机'));
```
然后在测试文件中加入
```
// alarm.spec.js
jest.mock('../../src/api/alarmApi.js');
```

调用`jest.mock('../../src/api/alarmApi.js')`后，当模块导入了`src/api/alarmApi.js`后，`Jest`将使用创建的`mock`文件而不是原文件。

测试用例如下：
```
it('fetch the alarm detail by http', async () => {
  // 设置断言数量，如果一个promise被拒绝，测试会失败
  expect.assertions(1);
  const name = await alarmApi.fetchAlarmDetail();
  expect(name).toBe('人机')
})
```
设置断言数量是在异步测试中非常常用的方法，因为这可以确保在测试结束前执行完所有断言。

#### 在组件中调用HTTP请求函数
一般来说，`HTTP`请求是在组件中使用的，单独测试作用并不大。那么在组件中载入其他异步依赖，应该怎么去测试呢？

首先在`home.vue`中导入请求文件
```
import * as alarmApi from '@/api/alarmApi.js';

// 在handleCheck中使用
async handleCheck () {
    // ...
    const name = await alarmApi.fetchAlarmDetail();
    // ...
}
```
当测试调用异步代码的时候，并不总是可以访问需要等待的异步函数。这意味着不能在测试中使用`await`来等待异步函数结束。

这时可以使用`flush-promises`库来帮忙，它能等待异步函数结束。例如：
```
let loading = true;
Promise.resolve().then(() => {
    loading = false;
}
await flushPromise();
expect(loading).toBe(false)
```
基于此，将之前的测试用例修改为：
```
// 2.1
  it('when handleCheck is clicked, show the alarm', async () => {
    expect.assertions(1);
    const wrapper = shallowMount(Home, {
      mocks
    });
    const count = wrapper.vm.primaryId;
    alarmApi.fetchAlarmDetail.mockImplementationOnce(() => Promise.resolve('人机'));
    wrapper.vm.handleCheck();
    await flushPromises();
    const newCount = wrapper.vm.primaryId;
    expect(newCount).toBe(count + 1)
  })
```
加入一个`expect.assertions(1)`设置断言数量，设置`fetchAlarmDetail`函数的返回结果，最后调用`await flushPromises();`等待所有异步函数结束。（之后的测试用例修改，不再展开讨论，详情请看代码。）

在命令行中输入`yarn test:uni`
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cff34a12d99e428c9bb1d62160e7ea63~tplv-k3u1fbpfcp-watermark.image)

### 测试事件
#### 测试DOM事件
功能：点击一个按钮，触发一个`click`事件
测试用例：
```
it('click the button then the $alarm will be called', () => {
  const wrapper = shallowMount(Home, {
    mocks
  });
  wrapper.find('button.check').trigger('click');
  expect($alarm).toHaveBeenCalled();
})
```
每个包装器都有一个`trigger`方法，用于在包装器上分发一个事件。
```
// 键盘事件
wrapper.trigger('keydown.up')；
wrapper.trigger('keydown', {
  key: 'a'
})
// 鼠标事件
wrapper.trigger('mouseenter')；
```

#### 测试自定义事件
`VUE`自定义事件是由带有`VUE`实例`$emit`方法的组件事件发射出去的。在子组件中发射一个事件：
```
// son.vue
this.$emit('eventName', payload);
```
在父组件中接收一个事件：
```
// father
<son @eventName='handleEvent'></son>
```
功能： 点击位于`HelloWorld`组件的`class`为`hello`的`button`元素，触发`sayHello`事件并携带`hello`。位于`Home`组件的`handleSayHello`触发，将`greeting`从`hi`变成`hello`。
```
it('click the check button, home.greeting will change to hello', () => {
    const wrapper = shallowMount(Home);
    wrapper.findComponent(Hello).vm.$emit('sayHello', 'hello');
    expect(wrapper.vm.greeting).toBe('hello')
  })
```