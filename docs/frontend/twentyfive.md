---
title: 在Vue中使用HOC模式
---

## 前言
`HOC`是`React`常用的一种模式，但`HOC`只能是在`React`才能玩吗？先来看看`React`官方文档是怎么介绍`HOC`的：  
> 高阶组件（HOC）是React中用于复用组件逻辑的一种高级技巧。HOC自身不是ReactAPI的一部分，它是一种基于React的组合特性而形成的设计模式。

`HOC`它是一个模式，是一种思想，并不是只能在`React`中才能用。所以结合`Vue`的特性，一样能在`Vue`中玩`HOC`。

## HOC
### HOC要解决的问题
并不是说哪种技术新颖，就得使用哪一种。得看这种技术能够解决哪些痛点。

`HOC`主要解决的是可复用性的问题。在`Vue`中，这种问题一般是用`Mixin`解决的。`Mixin`是一种通过扩展收集功能的方式，它本质上是将一个对象的属性拷贝到另一个对象上去。

最初`React`也是使用`Mixin`的，但是后面发现`Mixin`在`React`中并不是一种好的模式，它有以下的缺点：
* `mixin`与组件之间容易导致命名冲突
* `mixin`是侵入式的，改变了原组件，复杂性大大提高。

所以`React`就慢慢的脱离了`mixin`，从而推荐使用`HOC`。并不是`mixin`不优秀，只是`mixin`不适合`React`。

### HOC是什么
`HOC`全称：`high-order component`--也就是高阶组件。具体而言，高阶组件是参数为组件，返回值为新组件的函数。

而在`React`和`Vue`中组件就是函数，所以的高阶组件其实就是高阶函数，也就是返回一个函数的函数。

来看看`HOC`在`React`的用法：
```js
function withComponent(WrappedComponent) {
    return class extends Component {
        componentDidMount () {
          	console.log('已经挂载完成')
        }
        render() {
         	return <WrappedComponent {...props} />;
        }
    }
}
```
`withComponent`就是一个高阶组件，它有以下特点：
* `HOC`是一个纯函数，且不应该修改原组件
* `HOC`不关心传递的`props`是什么，并且`WrappedComponent`不关心数据来源
* `HOC`接收到的`props`应该透传给`WrapperComponent`

### 在Vue中使用HOC
怎么样才能将`Vue`上使用HOC的模式呢？

我们一般书写的`Vue`组件是这样的：
```html
<template>
  <div>
    <p>{{title}}</p>
    <button @click="changeTitle"></button>
  </div>
</template>

<script>
export default {
  name: 'ChildComponent',
  props: ['title'],
  methods: {
  	changeTitle () {
  		this.$emit('changeTitle');
  	}
  }
}
</script>
```
而`withCompone`t函数的功能是在每次挂载完成后都打印一句：已经挂载完成。  
既然`HOC`是替代`mixin`的，所以我们先用`mixin`书写一遍：
```js
export default {
	mounted () {
    	console.log('已经挂载完成')
    }
}
```
然后导入到`ChildComponent`中
```js
import withComponent from './withComponent';
export default {
	...
    mixins: ['withComponet'],
}
```

对于这个组件，我们在父组件中是这样调用的
```html
<child-component :title='title' @changeTitle='changeTitle'></child-component>

<script>
import ChildComponent from './childComponent.vue';
export default {
	...
  	components: {ChildComponent}
}
</script>
```

大家有没有发现，当我们导入一个`Vue`组件时，其实是导入一个对象。
```
export default {}
```
至于说组件是函数，其实是经过处理之后的结果。所以`Vue`中的高阶组件也可以是：接收一个纯对象，返回一个纯对象。

所以改为`HOC`模式，是这样的：
```js
export default function withComponent (WrapperComponent) {
	return {
        mounted () {
            console.log('已经挂载完成')
        },
        props: WrappedComponent.props,
        render (h) {
            return h(WrapperComponent, {
                on: this.$listeners,
                attrs: this.$attrs,
                props: this.$props
            })
        }
    }
}
```
注意`{on: this.$listeners,attr: this.$attrs, props: this.props}`这一句就是透传`props`的原理，等价于`React`中的`<WrappedComponent {...props} />;`

`this.$props`是指已经被声明的`props`属性，`this.$attrs`是指没被声明的`props`属性。这一定要两个一起透传，缺少哪一个，`props`都不完整。

为了通用性，这里使用了`render`函数来构建，这是因为`template`只有在完整版的`Vue`中才能使用。

这样似乎还不错，但是还有一个重要的问题，在`Vue`组件中是可以使用插槽的。

比如：
```html
<template>
  <div>
    <p>{{title}}</p>
    <button @click="changeTitle"></button>
    <slot></slot>
  </div>
</template>
```
在父组件中
```html
<child-component :title='title' @changeTitle='changeTitle'>Hello, HOC</child-component>
```

可以用`this.$solts`访问到被插槽分发的内容。每个具名插槽都有其相应的`property`，例如`v-slot:foo`中的内容将会在`this.$slots.foo`中被找到。而`default property`包括了所有没有被包含在具名插槽中的节点，或`v-slot:default`的内容。

所以在使用渲染函数书写一个组件时，访问`this.$slots`最有帮助的。

先将`this.$slots`转化为数组，因为渲染函数的第三个参数是子节点，是一个数组
```js
export default function withComponent (WrapperComponent) {
	return {
        mounted () {
			      console.log('已经挂载完成')
        },
        props: WrappedComponent.props,
        render (h) {
            const keys = Object.keys(this.$slots);
            const slotList = keys.reduce((arr, key) => arr.concat(this.$slots[key]), []);
            return h(WrapperComponent, {
                on: this.$listeners,
                attrs: this.$attrs,
                props: this.$props
            }, slotList)
        }
    }
}
```
总算是有模有样了，但这还没结束，你会发现使不使用具名插槽都一样，最后都是按默认插槽来处理的。

有点纳闷，去看看`Vue`源码中是怎么具名插槽的。  
在`src/core/instance/render.js`文件中找到了`initRender`函数，在初始化`render`函数时
```
const options = vm.$options
const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
const renderContext = parentVnode && parentVnode.context
vm.$slots = resolveSlots(options._renderChildren, renderContext)
```
这一段代码是`Vue`解析并处理`slot`的。  
将`vm.$options._parentVnode`赋值为`vm.$vnode`，也就是`$vnode`就是父组件的`vnode`。如果父组件存在，定义`renderContext = vm.$vnode.context`。`renderContext`就是父组件要渲染的实例。 然后把`renderContext`和`$options._renderChildren`作为参数传进`resolveSlots()`函数中。

接下里看看`resolveSlots()`函数，在`src/core/instance/render-helper/resolve-slots.js`文件中
```js
export function resolveSlots (
  children: ?Array<VNode>,
  context: ?Component
): { [key: string]: Array<VNode> } {
  if (!children || !children.length) {
    return {}
  }
  const slots = {}
  for (let i = 0, l = children.length; i < l; i++) {
    const child = children[i]
    const data = child.data
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      const name = data.slot
      const slot = (slots[name] || (slots[name] = []))
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || [])
      } else {
        slot.push(child)
      }
    } else {
      (slots.default || (slots.default = [])).push(child)
    }
  }
  // ignore slots that contains only whitespace
  for (const name in slots) {
    if (slots[name].every(isWhitespace)) {
      delete slots[name]
    }
  }
  return slots
}
```
重点来看里面的一段`if`语句
```
// named slots should only be respected if the vnode was rendered in the
// same context.
if ((child.context === context || child.fnContext === context) &&
  data && data.slot != null
) {
  const name = data.slot
  const slot = (slots[name] || (slots[name] = []))
  if (child.tag === 'template') {
    slot.push.apply(slot, child.children || [])
  } else {
    slot.push(child)
  }
} else {
  (slots.default || (slots.default = [])).push(child)
}
```
只有当`if ((child.context === context || child.fnContext === context) &&
  data && data.slot != null
) `为真时，才处理为具名插槽，否则不管具名不具名，都当成默认插槽处理
```
else {
  (slots.default || (slots.default = [])).push(child)
}
```

那为什么`HOC`上的`if`条件是不成立的呢？

这是因为由于`HOC`的介入，在原本的父组件与子组件之间插入了一个组件--也就是`HOC`，这导致了子组件中访问的`this.$vode`已经不是原本的父组件的`vnode`了，而是`HOC`中的`vnode`，所以这时的`this.$vnode.context`引用的是高阶组件，但是我们却将`slot`透传了，`slot`中的`VNode`的`context`引用的还是原来的父组件实例，所以就导致不成立。

从而都被处理为默认插槽。

解决方法也很简单，只需手动的将`slot`中的`vnode`的`context`指向为`HOC`实例即可。注意当前实例 `_self` 属性访问当前实例本身，而不是直接使用 `this`，因为 `this` 是一个代理对象。
```js
export default function withComponent (WrapperComponent) {
	return {
        mounted () {
			      console.log('已经挂载完成')
        },
        props: WrappedComponent.props,
        render (h) {
            const keys = Object.keys(this.$slots);
            const slotList = keys.reduce((arr, key) => arr.concat(this.$slots[key]), []).map(vnode => {
                vnode.context = this._self
                return vnode
            });
            return h(WrapperComponent, {
            	on: this.$listeners,
                attrs: this.$attrs,
        		props: this.$props
            }, slotList)
        }
    }
}
```


而且`scopeSlot`与`slot`的处理方式是不同的，所以将`scopeSlot`一起透传
```js
export default function withComponent (WrapperComponent) {
	return {
        mounted () {
			      console.log('已经挂载完成')
        },
        props: WrappedComponent.props,
        render (h) {
            const keys = Object.keys(this.$slots);
            const slotList = keys.reduce((arr, key) => arr.concat(this.$slots[key]), []).map(vnode => {
                vnode.context = this._self
                return vnode
            });
            return h(WrapperComponent, {
                on: this.$listeners,
                attrs: this.$attrs,
                props: this.$props,
                scopedSlots: this.$scopedSlots
            }, slotList)
        }
    }
}
```
这样就行了。