---
title: VUE单元测试--终点
---

## 前言
**虽然单元测试是暖暖的，但没人点赞，我的心是冰冰的**
<img src='https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4303b1dad7bb4199a9cf8c7b796b741f~tplv-k3u1fbpfcp-watermark.image' width=400>

本篇文章为此次VUE单元测试之旅的“终点站”，请各位乘客有序下车并点赞👍！

想要成为`VUE`单元测试的大师，怎么可能少的了`VUEX`的测试！这篇文章主要是介绍如何对`vuex`和`mixin`写单元测试。

如果还有小伙伴还没写过单元测试，请移步到我之前的文章：
* [VUE单元测试--开启测试之旅](https://juejin.cn/post/6906295144505409549)
* [VUE单元测试进阶](https://juejin.cn/post/6916677772962168845)

## 测试VUEX
其实测试`VUEX`是有两种方法：
* 第一种就是对`VUEX`的`store`组成部分分别进行测试。
* 第二种就是将它们组合到一个`store`实例上，然后测试该实例。

第一种方法的好处是简单，因为都是`JavaScript`函数。所以下面主要来介绍一下第二种方法（其实也挺简单的）

单元测试主要是提供输入和断言输出。在`VUEX`中的体现就是：`mutation`和`action`是`store`的输入，`getter`和`state`是`store`的输出，这样看就很清晰了。

先来看一个例子：
```js
test('commit a increment, state.count well plus 1', () => {
    Vue.use(Vuex)
    const store = new Vuex.Store(storeConfig)
    expect(state.state.count).toBe(0)
    
    store.commit('increment')
    expect(store.state.count).toBe(1)
}
```
看起来也是测试一个简单的`JavaScript`函数一样，没啥不同的。但是别高兴的太早，因为这个例子犯了一个错，可能是前端都犯过的错，对象引用！

一个`store`中的`state`对象是对`store`配置对象中定义的`state`对象的引用。`store.state`的任何更更改都会改变`store`配置的`state`。像上面例子一个，在测试中改变了`state.count`的值，那么在`store`配置的`state.count`也将会改变。

这是单元测试的大忌，因为进行单元测试从而更改了程序的运行。解决方案也简单，就是`clone`一个新的`store`配置对象。

`Vue Test Utils`有一个`createLocalVue`的`API`，它可以创建一个`localVue`构造函数。`localVue`构造函数是一个从`Vue`基础构造函数扩展而来的`VUE`构造函数，可以在其安装插件而不会影响`Vue`基础构造函数。

### 测试VUEX实例
创建一个`store module`。功能非常简单
* 使用`actions`发出一个`fetchAlarmDetail`请求，得到`alarm`的名字
* 然后在`commit`一个`changeAlarmName的mutation`，将结果写在`state.alarmName`上。
```js
import { fetchAlarmDetail } from '../api/alarmApi'
export const Alarm = {
  namespaced: true,
  state: {
    alarmName: ''
  },
  mutations: {
    changeAlarmName (state, data) {
      state.alarmName = data;
    },
  },
  actions: {
    fetchAlarmName ({commit}) {
      return fetchAlarmDetail().then(res => {
        commit('changeAlarmName', res)
      })
    }
  }
}
```
`fetchAlarmDetail`功能如下：
```js
export const fetchAlarmDetail = () => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        resolve('人机')
      })
      
    } catch (error) {
      reject(error)
    }
  })
}
```

创建一个`store.spec.js`测试
```js
// 模拟api
jest.mock('../../src/api/alarmApi.js')

// 创建localVue构造函数
const localVue = createLocalVue()
// 在localVue构造函数上安装Vuex
localVue.use(Vuex)

describe('storeConfig', () => {
  test('dispatching fetchAlarmName to update alarmName', async () => {
    expect.assertions(2);

    // 复制Alarm的store module
    const cloneAlarm = cloneDeep(Alarm)
    const store = new Vuex.Store({
      modules: {
        cloneAlarm
      }
    })

    expect(store.state.cloneAlarm.alarmName).toBe('')

    // 实现fetchAlarmDetail接口，并返回模拟数据
    alarmApi.fetchAlarmDetail.mockImplementationOnce(() => Promise.resolve('人机'));
    // dispatch actions
    store.dispatch('cloneAlarm/fetchAlarmName')
    await flushPromises()
    expect(store.state.cloneAlarm.alarmName).toBe('人机')
  })
})
```
运行`yarn test:uni`，通过！

### 测试组件中的VUEX
当然啦，不在组件使用`VUEX`，那么`VUEX`就毫无意义。

当组件中使用`VUEX`的`store`时，该`store`就变成了组件的一个依赖。通过`Vuex`和模拟数据创建一个`store`实例就能测试了

在组件中使用`dispatch`一个`action`
```js
// home.vue
async handleAlarmName () {
  this.$store.dispatch('Alarm/fetchAlarmName').then(res => {
    this.alarmName = res;
  })
},
```
在测试中
```js
test('call handleAlarmName to update the this.alarmName', async () => {
  // 定义Alarm，将在每一个测试之前被重新分配
  const Alarm = {
    namespaced: true,
    actions: {
      // 设置一个mock fetchListData  actions
      fetchListData: jest.fn(() => Promise.resolve())
    }
  }
  const store = new Vuex.Store({
    modules: {
      Alarm
    }
  })
  expect.assertions(1);
  store.dispatch = jest.fn(() => Promise.resolve('人机'))
  // 挂载实例，并注入store与localVue
  const wrapper = shallowMount(Home, { localVue, store })
  wrapper.vm.handleAlarmName();
  await flushPromises()
  expect(wrapper.vm.alarmName).toBe('人机')
})
```
完美

## 测试mixin
为`mixin`编写测试其实很简单。在代码中注册`mixin`，挂载组件，然后检测`mixin`是否产生了预期的行为即可。

编写`mixin`
```js
export const titleMixin = {
  mounted() {
    document.title = 'hello mixin'
  },
}
```
功能很简单，挂载之后将`document.title`改为`hello mixin`
```js
test('import titleMixin to change the title', () => {
  const component = {
    render() {},
    title: 'hello',
    // 注册mixin
    mixins: [titleMixin]
  }
  mount(component)
  expect(document.title).toBe('hello mixin')
})
```
