---
title: 符号与可迭代对象
---

## 前言
符号是`ES6`新增的基本值类型，是`JavaScript`中的第7种数据类型。符号是独一无二的数据类型，而且不具备字面量表示形式。 符号起初被设计用于创建对象私有成员。在符号诞生之前，将字符串作为属性名称导致属性可以被轻易访问，无论命名规则如何。而“私有名称”意味着开发者可以创建非字符串类型的属性名称，由此可以防止使用常规手段来探查这些名称。

## Symbol
符号有3种类型，每种类型是用不同的方式访问：
* 本地符号：通过内置符号包装对象创建，并通过存储引用或反射来访问。
* 全局符号：通过`API`创建，并跨代码域共享。
* 内部符号：内置于`JavaScript`中，用于定义内部语言行为。

### 本地符号
可以使用符号包装对象来创建符号：
```
const symbol = Symbol();
```
不能使用`new`关键字创建符号，否则会报错:
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba63a242d4554fc097f4db12a2ac1eff~tplv-k3u1fbpfcp-watermark.image)

`Symbol`还可以接受一个额外的参数用于描述符号值，该描述并不能用来访问对应属性， 但它能用于调试。符号的描述信息被存储在内部属性 `[Description]]`，当符号的`toString()`方法被显式或隐式调用时，该属性都会被读取。
```
const symbol = Symbol('unique symbol');
console.log(symbol) // Symbol('unique symbol')
```
`console.log()`隐式调用了`symbol`变量的`toString()`方法，于是描述信息就被输出到日志。此外没有任何办法可以从代码中直接访问 `[[Description]]`属性

符号值是独一无二的，描述并不会影响这一特性：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c604557a4f604957b25ce5ad30bc6956~tplv-k3u1fbpfcp-watermark.image)

符号可以用作对象的属性名，为了访问对应的符号属性，需要保存创建属性的符号值引用。
```
const age = Symbol('age')
const person = {
    name: 'zhang',
    [age]: '25'
}
console.log(person[age])
// '25'
```
注意，`for...in`、`Object.keys`和`Object.getOwnPropertyNames`均无法获取符号属性。而且符号属性也不会出现在`JSON`字符串化的结果中：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/880c287ade8a47e2a8f493886a2f39e7~tplv-k3u1fbpfcp-watermark.image)

但这不意味着符号是一种隐藏属性，它只是简单的隐藏。可以通过`Object.getOwnPropertySymbols`获取给定对象中所有用作属性名的符号值。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24c37a754e1049e988df81145ffd17f3~tplv-k3u1fbpfcp-watermark.image)

类型转换是`JS`语言重要的一部分，能够非常灵活地将一种数据类型转换为另一种。然而符号类型在进行转换时非常不灵活，因为其他类型缺乏与符号值的合理等价，尤其是符号值无法被转换为字符串值或数值。
```
const newAge = age + 2;
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61618734b5a8420ea54f4cd0afc1809f~tplv-k3u1fbpfcp-watermark.image)

#### 【实际用法】
1、符号可以用在将对象映射到`dom`元素中，比如：将时间的`API`对象关联到`DOM`元素上。由于它的独一无二的特性，所以不用担心其他库用到这个属性，或者将来语言本身使用到这个属性，可以放心大胆的映射。
```
const cache = Symbol('time')
function createTime(el) {
    if (cache in el) {
        return el[cache]
    }
    const api = el[cache] = {
    	// timeApi
    }
    return api
}
```
搭配上`ES6`的`WeakMap`那就更配了，它可以将对象映射到其他对象上，且不需要借助数据或在所有应用对象上添加额外属性，而且使用传统的数组来存储的话，在长时间运行的应用中，表会变的越来越大，查询数据就会大大下降。而`WeakMap`查询的时间复杂度是常量`O(1)`。

2、用符号定义协议  
协议是一种定义行为的通信契约或约定，具体到符号：如果一个库使用一个符号值，那么遵循这个库约定的对象也能够使用这个符号值。

比如说，使用`toJSON`方法来决定对象通过`JSON.stringify`序列化的结果。
```
const person = {
    name: 'zhang',
    toJSON: () => ({
        key: 'value'
    })
}
console.log(JSON.stringify(person))
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da12a760c2b14e62a2bf58f123935ca9~tplv-k3u1fbpfcp-watermark.image)
然而，`toJSON`不是一个函数，那么就按整个对象都会序列化，包括`toJSON`属性：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6762c3eba821443a90297097c831a403~tplv-k3u1fbpfcp-watermark.image)

之所以会出现这个情况，是因为依赖常规属性来定义行为。使用符号来实现`toJSON`会更好，因为这样不会与其他对象属性名产生冲突。因为符号是独一无二的，不会被序列化。所以符号值很适合对象用来定义自己的序列化逻辑。
```
const json = Symbol('unique JSON')
const person = {
    name: 'zhang',
    [json]: () => ({
        key: 'value'
    })
}
function stringify (target) {
    if (json in target) {
        return JSON.stringify(target[json]())
    }
    return JSON.stringift(target)
}
```

### 全局符号
全局注册的符号，可以在整个代码域中访问。代码域是指任何一种`JavaScript`执行上下文，比如说：
* 应用所在页面、页面中的`<ifame>`
* 通过`eval`执行的脚本，
* 以及各种`web workers`。这些执行上下文都有自己独有的全局对象。
比如，定义在页面的`window`对象上的全局变量不可在`ServiceWorker`中使用，但全局符号在所有代码域中是共享的。

有两种方法可以访问运行环境下的全局符号注册表：
* `Symbol.for`
* `Symbol.keyFor`
#### 1、Symbol.for
`Symbol.for(key)`可以用来查找运行环境下的全局符号注册表中的`key`值。如果全局注册表中存在所传入`key`对应的符号值，则返回该值。如果不存在，则用传入的`key`创建一个并在全局中注册。也就是说`Symbol.for(key)`是幂等的。
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc2e9cd4105e4a53ac4f12a9dd68e029~tplv-k3u1fbpfcp-watermark.image)

全局注册表通过`key`保存符号。注意，当符号被创建并添加到全局注册表时，`key`会用作它的描述。

#### 2、Symbol.keyFor(symbol)
`Symbol.keyFor(symbol)`能够返回一个符号类型的符号值在添加到全局注册表时所关联的`key`。
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f1475a4354143d2921612a24b412153~tplv-k3u1fbpfcp-watermark.image)

如果给定的符号值不在全局符号注册表中，则返回`undefined`
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9618982756c14f5d838cffac0053ed04~tplv-k3u1fbpfcp-watermark.image)

别忘了，符号的独一无二的特性
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c2c16cf90b2438ab194f92ef2f98bb9~tplv-k3u1fbpfcp-watermark.image)

全局注册表意味着整个代码域内都能访问符号值，而且在任何代码域内返回的都是同一个对象的引用。
```
var frame = document.appendChild(document.createElement('iframe'))
var symbol1 = window.Symbol.for('example')
var symbol2 = frame.contentWindow.Symbol.for('example')
console.log(symbol1 === symbol2)
// true
```
使用全局可用的符号值时需要做好权衡。一方面，全局符号使得类库能够方便地暴露其中的符号值。另一方面，类库也可能会使用本地符号在其`API`上暴露符号值。显然当符号需要在任意两个代码作用域共享时，全局符号注册表就非常有用了。同时，使用全局符号注册表的`API`可以不必存储符号值的引用，因为用一个给定的`key`值会返回相同的符号值。

### 内部符号
这些符号值是语言自带的，它们提供了内部语言行为的钩子，对原先属于语言内部逻辑的部分进行了进一步的暴露，允许使用符号类型的原型属性来定义某些对象的基础行为。

内部符号是跨代码域共享的
```js
var frame = document.createElement('iframe')
document.body.appendChild(frame)
Symbol.iterator === frame.contentWindow.Symbol.iterator
```
但它们不在全局注册表上
```
console.log(Symbol.keyFor(Symbol.iterator))
// undefined
```

#### 1、Symbol.hasInstance
每个函数都具有一个`Symbol.hasInstance`方法，用于判断指定对象是否为本函数的一个实例。这个方法定义在`Function.prototype`上，因此所有函数都继承了面对`instanceof`运算符时的默认行为。`Symbol.hasInstance`属性自身是不可写入、不可配置、不可枚举的，从而保证它不会被错误地重写。`Symbol.hasInstance`方法只接受单个参数，即需要检测的值。如果该值是本函数的一个实例，则方法会返回`true`。
```
obj instanceof Array
// 等价于
Array[Symbol.hasInstance](obj)
```
`ES6`从本质上将`instanceof`运算符重定义为上述方法调用的简写语法，这样使用`instanceof`便会触发一次方法调用，实际上允许你改变该运算符的工作。
```
function MyObjecyt () {}
Object.defineProperty(MyObject, Symbol.hasInstance, {
    value () {
        return false
    }
})
const obj = new MyObject();
console.log(obj instanceof MyObject); // false
```

#### 2、Symbol.isConcatSpreadable
`Symbol.isConcatSpreadable`属性是一个布尔类型的属性，它表示目标对象拥有长度属性与数值类型的键、并且数值类型键所对应的属性值在参与`concat()`调用时需要被分离为个体。 该符号与其他符号不同，默认情况下并不会作为任意常规对象的属性。它只出现在特定类型的对象上，用来标示该对象在作为`concat()`参数时应如何工作，从而有效改变该对象的默认行为。
```
let greeting = {
    0: 'are',
    1: 'you',
    length: 2,
    [Symbol.isConcatSpreadable]: true
}
let message = ['how'].concat(greeting)
console.log(messge.length) // 3
console.log(message) // ['how', 'are', 'you']
```
可以用它来定义任意类型的对象，让该对象在参与`concat()`调用时能够表现得像数组一样。

#### 3、Symbol.toPrimitive
`JS`经常在使用特定运算符的时候试图进行隐式转换，以便将对象转换为基本类型值。而`ES6`则通过`Symbol.toPrimitive`方法将其暴露出来，以便让对应方法可以被修改。可以将一个函数赋予给它，该函数将决定对象如何转换成基本值。函数接受一个可以为`string`、`number`或者`default`的`hint`参数，以指定所要转换成的初始类型。
```
var changing = {
    [Symbol.toPrimitive] (hint) {
        if (hint === 'number') {
            return Infinity
        } else if (hint === 'string') {
            return 'a lot'
        }
        return '[object changing]'
    }
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6dcc6950c3a540c1b983f7e738078cdd~tplv-k3u1fbpfcp-watermark.image)

#### 4、Symbol.match
如果将一个正则表达式的`Symbol.match`属性设为`false`，当传入`.startsWith`、`.endsWith`或者`.includes`时，该正则表达式会被当作字符串字面量。
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b09f43de45914c46bea792d2bc7eca2a~tplv-k3u1fbpfcp-watermark.image)

#### 5、Symbol.iterator
`ES6`引入了两个新的概念：迭代器与可迭代对象。这两个概念可以为任何对象定义迭代行为。  

给普通对象的`Symbol.iterator`属性赋予一个函数，就可以把这个普通对象转为可迭代对象。而且每次迭代都会调用赋予给`Symbol.iterator`函数。

赋予给`Symbol.iterator`的函数必须返回一个对象，该对象必须遵守迭代器协议。这个协议规定了如何从可迭代对象中取值。根据协议，迭代函数返回的对象必须有一个`next`方法。`next`方法不接受参数，并且返回一个包含以下两个属性的对象：
* `value`-当前值
* `done`-`boolean`，表示该迭代是否结束
比如：
```
var items = ['i', 't', 'e', 'r', 'a', 't', 'o', 'r']
var sequence = {
    [Symbol.iterator] () {
        let i = 0
        return {
            next () {
                const value = items[i]
                i++
                const done = i > items.length
                return { value, done }
            }
        }
    }
}
```
`ES6`新增几种方法去迭代可迭代对象：
* `for..of` 
* 扩展运算符...
* `Array.from`
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/269047c945df4003a5028a72ff7553e0~tplv-k3u1fbpfcp-watermark.image)

在`ES6`中，`Array`、`String`、`DOM`的`NodeList`以及`arguments`默认都是可迭代对象。

这两个协议的优势在于它们提供了有意义的方式，让使用者能够轻松地迭代集合和类似数组的对象。

将普通对象转换为可迭代对象有非常多的使用场景。通常来说，使用对象来表示字符串键与任意值之间的映射。
```
var colors = {
    green: '#0e0'
    orange: '#f50',
    pink: '#e07'
}
```
有时候需要遍历其中的颜色名，这时给`Symbol.iterator`赋值为`colors`产生`[key, value]`序列的可迭代能力
```
var colors = {
    green: '#0e0',
    orange: '#f50',
    pink: '#e07',
    [Symbol.iterator] () {
        const keys = Object.keys(colors)
        return {
            next () {
                const done = keys.length === 0
                const key = keys.shift()
                return {
                    done,
                    value: [key, colors[key]]
                }
            }
        }
    }
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e0dc3c43de54f3fb543f8580b824a09~tplv-k3u1fbpfcp-watermark.image)

