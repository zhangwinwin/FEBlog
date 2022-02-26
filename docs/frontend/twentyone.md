---
title: 简述VUE的响应式原理
---

## 前言
掘金或其他论坛也有很多讲vue原理的文章，我并不是想炒冷饭或什么的。我只是想记录一下自己的理解，帮助自己查漏补缺。很多东西以为自己都懂，但一讲出来就卡壳。特别是在面试的时候，一个熟悉的知识点，就是不知道该如何说起。

进入正题：  
vue之所以能在前端领域所向披靡，它的响应式原理功不可没。Vue对数据进行拦截/代理，这使它在侦测数据变化的方面变得非常敏感和非常精确。Vue采用的依赖追踪，默认就是优化状态：你动了多少数据，就触发多少更新，不多也不少。

所以vue的响应式原理非常值得学习，下面介绍一下我的理解。

## 数据拦截
在JavaScript中，通过使用Object.defineProperty和ES6的proxy就能进行数据的拦截，这分别也是Vue2.0和Vue3.0数据拦截的所使用的API。

ECMAScript5中定义了对象的两种属性：数据属性和访问器属性。进行拦截的主要是使用访问器属性。

### 访问器属性与Object.defineProperty()
访问器属性包含一对getter和setter函数，在读取访问器属性时，会调用getter函数，这个函数负责返回有效的值；在写入访问器属性时，会调用setter函数并传入新值，这个函数负责决定如何处理数据。

访问器属性有如下4个特性：
* [[Configurable]]: 表示能否通过delete删除属性从而重新定义属性，能否修改属性的特性，默认值为true。
* [[Enumerable]]: 表示能否通过for-in循环返回属性，默认值为true。
* [[Get]]: 在读取属性时调用的函数，默认值为undefined。
* [[Set]]: 在写入属性时调用的函数，默认值为undefined。

访问器属性不能直接定义，必须使用Object.defineProperty()来定义。这个方法接收三个参数：属性所在的对象、属性的名字和一个描述符对象。这里使用的描述符对象就是访问器属性。

通过上面的知识，就能写出一个defineReactive函数来侦测数据的变化。
```
function defineReactive (data, key, val) {
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
            return val
        },
        set(newVal) {
            if (val === newVal) {
                return
            }
            val = newVal
        }
    })
}
```
defineReactive函数接收三个参数：data(属性所在的对象)、key(属性的名字)和val(属性对应的值)。当读取到data中的key时，get函数就会被触发。设置data中的key时，set函数就被触发。


## 依赖收集
Vue能够知道当一个数据更改时，视图就跟着变化，而且使用到这个数据的其他地方也会同步刷新。是因为它们都依赖这个数据。

实现这种机制的技术叫做依赖收集。

现在有了defineProperty函数，就能把数据变成可侦听的。在模版渲染时访问某个数据，就触发它的getter函数，在触发时，进行依赖收集。

当某个数据进行变更了，就触发它的setter函数。在触发时，通知到依赖这个数据的地方，从而告诉render函数进行刷新。

### 观察者模式
> 观察者模式 在软件设计中是一个对象，维护一个依赖列表，当任何状态发生改变自动通知它们。

一个数据变更，多个依赖这数据的地方作出处理。这种一对多的场景符合观察者模式。

在Vue依赖收集里：
* 依赖的数据是观察目标。
* 视图、计算数据和watcher是观察者

维护一个数组dep，用于存储当前数据的依赖，并且假设window.watcher这个全局函数依赖这个数据。改写defineReactive
```
function defineReactive (data, key, val) {
+   const dep = [] // 维护一个存储依赖的数据
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
+           dep.push(window.watcher) // 收集依赖
            return val
        },
        set(newVal) {
            if (val === newVal) {
                return
            }
+           for (let i=0; i<dep.length; i++) {
+               dep[i](newval, val) // 通知依赖
+           }
            val = newVal
        }
    })
}
```
根据一个函数只做一件事策略，将这部分功能解耦出来
```
class Dep{
    static target: ?Watcher;
    id: number;
    subs: Array<Watcher>;
    
    constructor () {
        this.id = uid++;
        this.subs = []
    }
    
    addSub (sub: Watcher) {
        this.subs.push(sub)
    }
    
    removeSub (sub: Wathcer) {
        remove(this.subs, sub)
    }
    
    depend () {
        if (Dep.target) {
            this.addSub(Dep.target)
        }
    }
    
    notify () {
        const subs = this.subs.slice()
        for (let i=0, l=subs.length; i<l; i++) {
            subs[i].update()
        }
    }
}
```
改写definePeoperty函数
```
function defineReactive (data, key, val) {
+   const dep = new Dep() // 维护一个存储依赖的数据
-   const dep = [] // 维护一个存储依赖的数据
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
-           dep.push(window.watcher) // 收集依赖
+           dep.depend() // 收集依赖
            return val
        },
        set(newVal) {
            if (val === newVal) {
                return
            }
-           for (let i=0; i<dep.length; i++) {
-               dep[i](newval, val) // 通知依赖
-           }
+           dep.notify() // 通知依赖
            val = newVal
        }
    })
}
```

## Watcher
Watcher扮演观察者的角色，进行观察者函数的包装处理。

从代码上看，dep.depend()进行依赖收集，在dep.depend()中的Dep.target对应着一个Watcher实例，要做的就是收集这个Watcher实例。

尽管会有多个观察者函数，但由于JavaScript的单线程关系，同一时刻，只能执行一个观察者函数。所以只要访问Dep.target就能知道当前的观察者函数是哪一个。

watcher的用法：
```
var watcherVM = new Vue({
    data: {
        question: ''
    },
    watch: {
        // 如果 `question` 发生改变，这个函数就会运行
        question: function (newVal, oldVal) {...}
    }
})
```
给question注册一个回调函数，只要question发生变化，就把这个回调函数执行。

只要把这个watcher实例添加到queston的Dep中，然后question触发时，会通知到watcher执行这个回调函数。

```
class Watcher {
    constructor (expOrFn, cb) {
        this.getter = parsePath(expOrFn)
        this.cb = cb
        this.value() = this.get()
    }
    get () {
        Dep.target = this
        value = this.getter.call(vm, vm)
        Dep.target = undefined
    }
    update () {
        const oldValue = this.value
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldValue)
    }
}
```
首先在get函数中，把this也就是当前Watcher实例赋予Dep.target。

然后执行this.getter()就能拿到question，相当于读取了question的值，触发getter函数，就把当前Watcher添加到Dep中。(奇妙的想法)

当question的值发生改变后，就把所有的依赖都触发update方法。update方法会触发回调函数，将this.value和oldvalue传到参数中。

到此为止，就完成一个属性的响应。

### 多个属性的侦听
其实就是递归侦测这个对象的所有属性。
```
function walk (obj: Object) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
}

function defineReactive (data, key, val) {
    walk(val)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            dep.depend()
            return val
        },
        set: function (newVal) {
            if(val === newVal){
                return
            }

            dep.notify()
            val = newVal
        }
    })
}
```

## 侦测Array
对Array使用Object.definepProperty()会出现一些问题，除了重新赋值以外，其他的操作都不会被setter检测到。所以为了能检测到Array的变化，Vue做了以下操作
```
if (Array.isArray(value)) {
    const augment = hasProto
        ? protoAugment
        : copyAugment
    augment(value, arrayMethods, arrayKeys)
    this.observeArray(value)
}
```
其实就是对数组做了一些增强操作。
* 先继承Array.prototype。
* 对继承对象上的一些方法例如push使用Object.defineProperty做拦截。
* 通过__proto__赋值到Array.prototype上

例如
```
// 第一步
const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

// 第二步
const originalPush = arrayMethods.push;
Object.defineProperty(arrayMethods, 'push', {
    configurable: true,
    enumerable: false,
    writable: true,
    value(...args) {
        const result = originalPush.apply(this, args);
        console.log('pushing：', args);
        return result;
    }
})

// 第三步
data.arr.__proto__ = arrayMethods

data.arr.push(1) // pushing：1  
```

## 总结
现在看官方给出的图，应该理解起来就容易了。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/24/1710ca1e7cdff10b~tplv-t2oaga2asx-image.image' width='600'>
