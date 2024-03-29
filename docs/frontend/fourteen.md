---
title: 一道“作用域”题引发的思考
---

## 前言
相信很多人都已经看过《你不知道的JavaScript》上卷这本书。我是在大三时看的这本书，这本书对我有思维上的冲击，第一次深入`JavaScript`语言内部。也由于当时我学`JS`不久，对书里很多知识都理解不透彻，比如下面这个在闭包章节中出现的例子:

（关于这个例子的前生后世在这不多解释，详情请看书）
```js
for (let i=1; i<=5; i++let) {
    setTimeout( function timer () {
        console.log(i);
    }, i*1000)
}
```
书上的解释大概是这样的：每次迭代时`let`都会创建一个新的块作用域，而且变量`i`在循环过程中不止被声明一次，每次迭代都会声明。随后的每个迭代都会使用上一个迭代结束时的值来初始化这个变量。

这带来几个问题：
* `for`语句的循环条件声明不是只会执行一次吗？为什么会多次执行呢
* `let/const`声明不是说不能重复声明吗？
* `var`与`let/const`在`for`循环中的机制到底是怎么样的？

那时似懂非懂，哪能想那么多，只能囫囵吞枣地背下这个例子，而且以后`for`循环都用上了`let`。

## 循环语句中的块作用域
`for`循环的语法：
```js
for ([initializaion]; [condition]; [final-expression])
    statement
```
从`for`循环说起，首先无论是`var`声明还是`let/const`声明，循环体总是被多次初始化的。

### 循环体总是被多次初始化的
首先并不是所有看起来使用了一对大括号的都是块语句。`for`和`for..in/of`语句中的循环体被称为`body`，它将循环执行于一个由`for`语句创建的作用域中。尽管这个作用域对`body`中的语句有效，并且是按“块的实例化环境”的方式构建的，但它的生存周期以及其内部的“声明的实例化”过程都是由`for`语句负责的。

循环体在每次迭代时都将处于一个全新的，为当前循环创建的实例化环境中。这就意味着所有的`let/const`声明将被重新初始化。例如在下面例子中：
```js
for (var i = 0; i < 3; i++) {
    let x;
    console.log(typeof x)
    console.log(x = i+1)
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee91df159ab2482cb7d0d6f28dbfbb86~tplv-k3u1fbpfcp-watermark.image)
在这个例子中，变量`x`在最后被赋予一个新值，而在上一行中总是显示`undefined`。这表明在下一次循环中，变量`x`并没有继承上一次迭代的值。

所以说在`for`循环里重复使用`const`定义一个变量是可以的。
```js
for (var i = 0; i < 3; i++) {
    const x = i + 1;
}
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/421d8923ab9649a9a9aa70fdd8d55dcb~tplv-k3u1fbpfcp-watermark.image)

### 循环条件
与`body`不同的是，`for`循环的3个表达式是处于同一个由`for`语句创建的环境中，这个环境也同时是循环体`body`每次创建的环境的父环境。

如果在`initialization`表达式中出现了`let/const`声明时，那么无论`statement`是否是块，`for`语句总是会有一个自己的块，以便使用独立环境来登记这些标识符，`let/const`声明的变量总是位于上述`for`语句中自有的块中，而且按照`for`语句的语义，`statement`是执行于该块中的唯一一个语句。

而`var`声明的变量将被独立登记并在执行期由外部的块创建，而`for`语句只是引用它，因为`var`总是将变量声明在全局、模块或函数上下文中，而并不一定是当前块的作用域中。例如：
```js
for (var x = 5; x < 10; x++) 
    console.log(x)
    
var x = 5;
for (var x = 11; x < 15; x++)
    console.log(x)
```

所以，`for...of`、`for await...of`和`for...in`等所有的`for`循环，只要在循环表达式部分使用了`let/const`声明，那么就具有一个自有的块，否则都没有这一特性。更进一步，所有的`while/do...while`循环也都不具有这一特性，因为它们不具备声明条件的语义。

而当循环条件使用了`let/const`时，`JavaScript`处理后续的循环体的方式也会有所不同。在正常情况下像上面一样，如果循环体中存在块（也就是用{}），那么该块的父级将指向`for`语句所在的块，由于`for`语句没有块，所以循环体的块的父级将指向当前块中。
```js
// 循环体的块的父级指向当前块，也就是全局作用域
for (var x = 5; x < 10; x++) {
    console.log(x)
}
```
一旦使用了`let/const`，那么循环体的块的父级将指向`for`语句自有的块。这样做的目的是上述块能够通过查询父级的块来找到`for`语句自有的块中的变量声明`x`。
```js
// 循环体的块的父级指向for语句自有的块
for (let x = 5; x < 10; x++) {
    console.log(x)
}
```
由于循环体可以不是一个块（也就是不使用{}），那么它应该执行在`for`语法所定义的块中。

而且`for`语句还会为每次循环创建一个新的环境，这也是`for...in，for...of`等能够实现的原因。
```js
for (let i=1; i<=5; i++let) {
    setTimeout( function timer () {
        console.log(i);
    }, i*1000)
}
```
由于每次循环都有一个新环境，因此能够起到闭包的效果，将`i`的引用保留到使用它的时候。

### 性能问题
使用在循环条件中使用`let/const`时，每次循环都会创建一个新环境，很明显这会增加系统消耗。所以除非是在`setTimeout`或者`Promise`等机制中，通常不建议使用`let/const`来声明`for`语句的循环条件中的变量。

但这并非不可避免的，只要弄清问题的本质！

```js
for (let i=1; i<=5; i++let) {
    setTimeout( function timer () {
        console.log(i);
    }, i*1000)
}
```
在这个例子中，本质是要保存`for`循环中每一个`i`值，而并非需要一个闭包来添加一个层。所以可以在循环过程中产生的不同的函数实例，由这些实例自己去保存值，从而避免`let/const`语法带来的新环境或者自己在外层包裹一个闭包带来的开销：
```js
for (var i=1; i<=5; i++) {
    (a = function timer () {
        console.log(timer.iValue);
    }).iValue = i
    setTimeout( a, i*1000)
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1248f41233d143758ccd4e0b6bfaefc2~tplv-k3u1fbpfcp-watermark.image)

使用匿名函数：
```js
for (var i=1; i<=5; i++) {
    (a = function () {
        console.log(arguments.callee.iValue);
    }).iValue = i
    setTimeout( a, i*1000)
}
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f9426d6c4394ca8a49b02a24efbf0fa~tplv-k3u1fbpfcp-watermark.image)

