---
title: VUE单元测试--开启测试之旅
---

## 前言
作为程序员，没有比临上线前发现之前的更改的代码导致应用崩溃更糟糕的事了。而唯一能够确保应用正常的工作的只有进行程序的测试。所以说对应用进行全面的测试是很重要的一件事了。

高效的测试方法可以加快开发速度，提高代码质量，尽早发现并去除代码中的`BUG`。测试驱动开发`（TDD）`是一种在编写代码先编写测试代码的工作流程，即在编写代码前，得先编写能够确保组件正常运行的测试代码。

而单元测试是对应用程序最小的单元运行测试的过程。通常是函数，但在`VUE`中，组件也是单元，因为组件的本质就是函数。

下面简单的说说如何使用`JEST`进行`VUE`的单元测试。如果不熟悉`JEST`与`VUE`，建议看看官网。

示例代码在[github](https://github.com/zhangwinwin/FEBlog/tree/master/unitest)

## 组件的单元测试
单元是应用中最小的可测试部分。在`VUE`中，组件与函数都是可测试的单元。

### 搭载测试环境
对于新项目来说，可以使用`VUE-CLI`工具创建项目（版本如图所示）
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43575777a7254a8eaf32bd7b0e522503~tplv-k3u1fbpfcp-watermark.image)
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb0b878cd8c2461c99551fedf4ef9179~tplv-k3u1fbpfcp-watermark.image)

只需要在选择配置时`☑️Unit Testing`，并选择`JEST`作为测试框架即可。

而对于现有项目而言（针对`@vue/cli`）想增加`jest`测试模块。运行以下命令行就会帮我们去安装`jest`模块。
```
vue add unit-jest
```

如果你是一个动手能力较强的同学，还可以自己去搭建测试环境，可以参考[Vue Test Utils](https://vue-test-utils.vuejs.org/zh/guides/#%E8%B5%B7%E6%AD%A5)

好了，现在可以进行单元测试了。

### 挂载组件
当导入一个`VUE`组件时，它只是一个带有渲染函数和一些属性的对象或者函数。要测试组件行为，则首先得启动它并开启渲染过程。按照`VUE`的说法就是需要挂载组件。

挂载组件，需要将组件选项转换为一个`VUE`构造函数。而组件选项对象不是一个有效的的构造函数，它只是一个普通的`JavaScript`对象。这时可以使用`Vue.extend`方法从选项中创建一个`VUE`构造函数:
```
import Vue from 'vue';
import Home from '@/views/Home.vue';
const Ctor = Vue.extend(Home);
```
这时，就可以使用`new`操作符来创建一个实例：
```
const vm = new Ctor();
```
通常，`VUE`使用`el`选项在文档中查找添加的被渲染`DOM`节点。但一般的组件构造函数并没有`el`选项，因此在创建实例时，它不会自动挂载并生成`DOM`节点，需要手动调用`$mount`方法：
```
const vm = new Ctor().$mount()
```
当调用`$mount`时，`VUE`将生成一些`DOM`节点，可以使用实例中`$el`属性在测试中访问这些节点:
```
expect(vm.$el.textContent).toContain('Welcome to Your Vue.js App')
```
`VUE`要使用`DOM`方法创建一个`DOM`树。这不意味着`VUE`组件的单元测试必须在浏览器环境中运行。因为在默认情况下，`Jest`会在`jsdom`库创建的浏览器环境中运行测试。`jsdom`是一个`DOM`实现，它完全是由运行在`DOM`中的`JavaScript`编写的。
```
import Vue from 'vue';
import Home from '@/views/Home.vue';

describe('Home.vue', () => {
  it('renders msg when mounted', () => {
    const msg = 'Welcome to Your Vue.js App';
    // 使用Home选项创建一个新的Vue构造函数
    const Ctor = Vue.extend(Home);
    // 创建一个新的Vue实例并挂载该实例
    const vm = new Ctor().$mount();
    // 访问DOM元素，检查文本内容
    expect(vm.$el.textContent).toContain(msg)
  })
})
```
运行`yarn run test:unit`，测试通过
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ed9b2dd886a4829870a125a2d7a18d9~tplv-k3u1fbpfcp-watermark.image)

### 使用`Vue Test Utils`
挂载组件需要自己去创建构造函数并且手动挂载。与其自己编写这些代码，不如使用`Vue Test Utils`库来帮忙实现。

`Vue Test Utils`库会让`Vue`组件单元测试变得更加简单。它包含一些辅助方法可以实现组件挂载、与组件交互以及断言组件输出。

`Vue Test Utils`会导出一个`mount`方法，该方法在接收一个组件后，会将其挂载并返回一个包含被挂载组件实例`vm`的包装器对象。之所以会返回包装器对象而不直接返回`vm`实例，是因为包装器不仅仅只有实例`vm`，还包括一些辅助方法。其中一个方法就是`text`，它返回实例的`textContent`。

使用`Vue Test Utils`库改造刚刚的测试
```
import { mount } from '@vue/test-utils';
import Home from '@/views/Home.vue';

describe('Home.vue', () => {
  it('renders msg when mounted', () => {
    const msg = 'Welcome to Your Vue.js App';
    // 使用mount方法挂载组件
    const wrapper = mount(Home);
    // 检查文本内容
    expect(wrapper.text()).toContain(msg)
  })
})
```

#### 使用`shallowMount`
除了`mount`方法，`Vue Test Utils`还包含一个`shallowMount`方法。`shallowMount`不会像`mount`一样渲染整个组件树，它只渲染一层组件树
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/130620b309254f75bbb66bfc5d48bf2d~tplv-k3u1fbpfcp-watermark.image)
与`mount`相似，`shallowMount`挂载一个组件并返回一个包装器。不同之处在于，`shallowMount`在挂载组件之前对所有子组件进行存根。

`shallowMount`可以确保对一个组件进行独立测试，有助于避免测试中因子组件的渲染输出而混乱结果。
```
describe('Home.vue', () => {
  it('renders msg when mounted', () => {
    const msg = 'Welcome to Your Vue.js App';
    // 使用shallowMount方法挂载组件
    const wrapper = shallowMount(Home);
    // 检查文本内容
    expect(wrapper.text()).toContain(msg)
  })
})
```

### 输出测试
#### 测试`prop`
为一个组件编写单元测试时，需要为组件提供生成环境中接收到的输入数据。如果组件在生产环境中接收一个`prop`，需要在组件挂载到测试时为组件提供该`prop`。

使用`Vue Test Utils`将`prop`作为一个选项对象传递给组件：
```
import { shallowMount } from '@vue/test-utils';
import Hello from '@/components/HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders msg when mounted', () => {
    const msg = 'hello, world';
    // 使用shallowMount方法挂载组件
    const wrapper = shallowMount(Hello, {
      propsData: {
        msg
      }
    });
    // 检查文本内容
    expect(wrapper.text()).toContain(msg)
  })
})
```
运行`yarn run test:unit`，测试通过!

包装器`text`方法将返回组件渲染的所有文本。`toContain`匹配器会检查一个值是否包含在它所检查的字符串中的某个位置，它有点像`string.prorotype.includes`方法。

而像上面例子，`props`中的`msg`变量是渲染在`<h1>`标签上的，没有必要去匹配组件下的全部文本，需要测试`<h1>`标签上的文本是否匹配即可。这时可以使用包装器的`find`方法。

`find`方法可以为渲染输出中的每个节点获取包装器，而且`find`会搜索与选择器匹配的第一个节点的渲染输出，并返回包含给匹配节点的包装器。
```
/ 检查文本内容
    expect(wrapper.find('h1').text()).toContain(msg)
```

并不是所有`prop`都渲染出文本。所以还要检查组件实例是否接收正确的`prop`。这时可以使用`props`方法。

`props`方法是一个包装器方法。它返回一个对象，其中包含一个包装器组件实例及它们的值`prop`。
```
expect(wrapper.props().msg).toBe(msg)
```
使用`toBe`匹配器检查组件所有的渲染文本是否违反此原则。

还可以检查当前组件传值是否正确
```
const wrapper = shallowMount(fatherComponent)
expect(wrapper.find(ChildComponent).props().propA).toBe('example')
```
这里需要注意的是，如果一个组件未声明要接收一个`prop`，则`prop`不会被添加到这个`Vue`实例中。

#### 测试DOM属性
在`Vue Test Utils`包装器中，有一个`attribute`方法，可以返回组件属性对象。可以使用该对象来测试属性值
```
const a = wrapper.find('a');
expect(a.attributes().href === 'http://cli.vuejs.org').toBa(true)
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5eec37ee949b4f83a710865eb8000280~tplv-k3u1fbpfcp-watermark.image)
错误信息显示：期望是`true`，返回的是`false`。这是一个`Boolean`断言，这样的信息并没有很清晰的了解到测试为什么会失败，所以应该要避免`Boolean`断言。应该使用值断言代替它
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c846b7f034e946fab50ab6f071e4284a~tplv-k3u1fbpfcp-watermark.image)
这样就非常清楚是哪里的问题导致测试失败了。

#### 测试样式
在`Vue Test Utils`包装器中，有一个`classes`方法，返回一个`class`数组。可以对此进行断言，查看元素是否具有一个`class`。
```
expect(a.classes()).toContain('firstA')
```
`toContain`匹配器不仅可以检查一个字符串中是否包含另一个字符串，还能比较数组中的值。

通常来说测试内联样式是没有价值的，但有时候不得不去测试一个内联样式。比如说：进度条组件，动态地添加一个内联样式。这时就需要直接访问包装器元素并获取样式属性值。

每一个包装器都包含一个`element`属性，它是对包装器包含的`DOM`根节点的引用。可以使用它来访问内联元素
```
expect(a.element.style.fontSize).toBe('14px')
```
