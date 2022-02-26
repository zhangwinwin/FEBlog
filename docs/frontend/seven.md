---
title: JavaScript代码是怎么执行的
---

## 前言
众所周知，JavaScript是单线程语言。所以JavaScript是按顺序执行的！本文完（狗头）

## 先编译再执行
### 变量提升
请看下面的例子：
```
console.log(cat)
catName("Chloe");
var cat = 'Chloe'
function catName(name) {
    console.log("我的猫名叫 " + name);
}
```
按照得出的结论："JavaScript是按顺序执行的"来看，步骤如下：  
* 执行第一句的时候，cat并没有定义，结果应该是抛出一个错误，然后结束执行。  
```
Uncaught ReferenceError: cat is not defined
```

但实际的执行结果并不是这样：  
不仅可以执行，catName()执行结果也输出了。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/16/170e267441de4f13~tplv-t2oaga2asx-image.image' width='600'>  

这种现象就是： **变量提升**

从概念的字面意义上说，“变量提升”就是把变量和函数的声明移动到代码的最前面，变量被提升后，会给变量设置默认值--undefined。  

调整之后的执行顺序如下：  
* 首先执行var cat = undefined和function catName(){}
* 然后执行console.log(cat) // undefined
* 接着调用catName()
* 最后给cat赋值cat = 'Chloe'

移动一词容易造成误解。实际在物理层面上代码的位置并没有改变。JavaScript是解析执行的语言，在执行前会先经过编译阶段。造成这种现象的原因是：**JavaScript引擎在编译阶段中将变量和函数的声明放在了内存中。**  

### 执行上下文
>变量提升（Hoisting）被认为是， Javascript中执行上下文 （特别是创建和执行阶段）工作方式的一种认识

在编译阶段，JavaScript会为上述代码创建一个执行上下文和可执行代码。 
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/16/170e2a26108b775f~tplv-t2oaga2asx-image.image' width='600'>  

执行上下文是JavaScript执行一段代码时的运行环境，包含this、变量、对象以及函数等。

1、在编译阶段
* JavaScript引擎会将var变量声明和函数声明等的变量提升内容放在变量环境中。
* 接下来JavaScript引擎会把声明以外的代码编译为字节码--可执行代码。

2、执行阶段  
* 执行到console.log(cat)时，JavaScript引擎在变量环境中查找cat这个变量，由于变量环境存在cat变量，并且其值为undefined，所以这时候就输出undefined。
* 当执行到catName函数时，引擎在变量环境中查找该函数，由于变量环境中存在该函数的引用，所以引擎执行该函数，并输出执行结果。
* 执行cat赋值，引擎在变量环境查找到cat变量，并进行赋值。


**创建执行上下文的三种情况：**  
1、**全局执行上下文**：JS引擎在编译全局代码时，创建全局执行上下文。在当前页面中，全局执行上下文仅有一个。  

2、**函数执行上下文**：在调用一个函数时，JS引擎会创建一个函数执行上下文。一般情况下，当函数执行完毕后就会销毁此函数执行上下文。  

3、**eval函数执行上下文**：执行eval函数时，也会创建一个执行上下文。  

### 调用栈
JS引擎通过栈的数据结构来管理多个执行上下文。
> 栈是计算机科学中的一种抽象数据类型，只允许在有序的线性数据集合的一端（称为堆栈顶端，英语：top）进行加入数据（英语：push）和移除数据（英语：pop）的运算。因而按照后进先出（LIFO, Last In First Out）的原理运作

<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e67ac52aa05c2~tplv-t2oaga2asx-image.image' width='600'>  

在一个执行上下文创建好后，JS引擎就会它压进栈中。管理执行上下文的栈结构就称为调用栈，或者执行上下文栈。

请看下面例子：  
```
function foo() {
    var a = 0
    console.log(a)
}
function bar() {
    var b = 1
    foo()
    console.log(b)
}
bar()
```
步骤如下：  
1、创建全局执行上下文，并将其压入栈底。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e69424bf675d0~tplv-t2oaga2asx-image.image' width='600'>  

2、执行全局代码：bar()。调用bar函数时，JS引擎会编译bar函数，并为其创建一个函数执行上下文。最后将其执行上下文压入栈中，并且将变量b赋予默认值undefined。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e69aaf6dd6778~tplv-t2oaga2asx-image.image' width='600'>

3、执行bar函数内部的代码。先执行b = 1的赋值操作，然后调用foo函数。JS引擎编译foo函数，并为其创建一个函数执行上下文。最后将其执行上下文压入栈中，并且将变量a赋予默认值undefined。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e6a11c28be205~tplv-t2oaga2asx-image.image' width='600'>

4、执行foo内部的代码。执行a = 1赋值操作，然后输出a的值。foo函数执行完毕后，调用栈就将其执行上下文从栈顶弹出。接着执行bar函数。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e6a4df5aa6f2a~tplv-t2oaga2asx-image.image' width='600'>

5、执行完bar函数后，调用栈就将其执行上下文从栈顶弹出。剩下全局执行上下文  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e69424bf675d0~tplv-t2oaga2asx-image.image' width='600'> 

整个JavaScript流程执行就到此结束了。  

调用栈是JS引擎追踪函数执行的一个机制，当一次有多个函数被调用时，通过调用栈就能够追踪到哪个函数正在被执行以及各函数之间的调用关系。

## var缺陷与块级作用域
### 变量提升带来的问题
1、变量被覆盖
```
var cat = "foo"
function catName(){
  console.log(cat);
  if(false){
   var cat = "bar"
  }
  console.log(cat);
}
catName()
```
调用catName时，调用栈如下图所示：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e76dbc5f68f5d~tplv-t2oaga2asx-image.image' width='600'>  

* 创建catName执行上下文时，JavaScript引擎会将var变量声明cat提升内容放在变量环境中，赋予默认值undefined。
* 执行到catName内部的console.log(cat)时，在catName执行上下文中的变量环境找到了cat的值，输出undefined。
* if判断为false，不执行。
* 执行console.log(cat)，参照第二步，输出undefined。

2、变量没被销毁
```
function foo () {
    for (var i=0; i<10; i++){}
    console.log(i)
}
foo()
```
直观的来说，会以为for循环结束后，i会被销毁。结果并非如此，console.log(i)输出10。

原因也是变量提升，在创建foo执行上下文时，i被提升了。所以for循环结束后，i并没有被销毁。 

### 块级作用域
存储变量中的值以及对这个值进行访问或修改，是编程语言的基本功能。而 **作用域** 则是如何存储变量以及如何访问这些变量的规则。

在ES6前，JavaScript只支持两种方法创建作用域：
* 全局作用域
* 函数作用域

而其他编程语言则都普遍支持块级作用域。

**块级作用域** 就是使用一对大括号包裹的一段代码，比如函数、判断语句、循环语句，甚至单独的一个{}都可以被看作是一个块级作用域。

简单来讲，在块级作用域内部定义的变量在其块级作用域外部是访问不到的，并且等该内部代码执行完成之后，其定义的变量会被销毁。

由于JavaScript不支持块级作用域，所以才会有变量提升带来的问题。

幸好，ES6改变了现状，引入了新的let和const关键字，提供了除var以外的另一种变量声明方式。

let和const关键字可以将变量绑定到所在的任意作用域中(通常是{}内部)。换句话说，let为其声明的变量创建了块作用域。

块级作用域的作用，请看下面例子：
```
var cat = "foo"
function catName(){
  if(true){
   var cat = "bar"
   console.log(cat);
  }
  console.log(cat);
}
catName()
```
在这段代码中，有两处声明了cat变量，一处在全局作用域，一处在catName函数作用域中的if语句里面。  

在执行if语句内部时，调用栈如下图所示:
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e7c29f9d840a2~tplv-t2oaga2asx-image.image' width='600'>  

从图中可看出两处console.log(cat)都输出bar。  

使用let改写上面代码
```
var cat = "foo"
function catName(){
  if(true){
   let cat = "bar"
   console.log(cat);
  }
  console.log(cat);
}
catName()
```
if语句执行结束后，let声明的cat变量就会被销毁，第二处的console.log(cat)就会输出foo
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e7c5f695f102d~tplv-t2oaga2asx-image.image' width='600'>  

### JavaScript内部实现块级作用域
请看下面的例子
```
function foo(){
    var a = 1
    let b = 2
    {
      let b = 3
      var c = 4
      let d = 5
      console.log(a)
      console.log(b)
    }
    console.log(b) 
    console.log(c)
    console.log(d)
}   
foo()
```
步骤如下：  
1、第一步创建全局执行上下文  
2、执行foo()，创建foo函数的执行上下文  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e7d9faed0e025~tplv-t2oaga2asx-image.image' width='600'>  
* 在函数内部使用var声明的变量都放在变量环境中，并赋予一个默认值undefined。
* 在函数内部使用let声明的变量被放在词法环境中，没有赋予一个默认值。
* 在函数内部中的{}内部使用let声明的变量没有放在词法环境中。  

3、执行foo函数内部的{}块，此时a和b的已经初始化了，并且进入作用域块时，作用域块中通过let声明的变量，会被存放在词法环境的一个单独的区域中，这个区域中的变量并不影响作用域块外面的变量。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e7e03d12024c1~tplv-t2oaga2asx-image.image' width='600'>

在词法环境内部维护了一个栈结构，栈底是函数最外层的变量，进入一个作用域块后，就会把该作用域块内部的变量压入栈中；当作用域执行完成之后，该作用域的let和const声明的变量就会从栈顶弹出。

4、作用域块执行结束后，词法环境的栈结构就把其信息从栈顶弹出。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/17/170e7e53a0960ba0~tplv-t2oaga2asx-image.image' width='600'>  

使用let或const声明的变量，在达到声明处之前都是无法访问的，试图访问会导致一个 引用错误，即使在通常是安全的操作时（例如使用typeof运算符）也是如此。示例如 下：
```
if (true) {
    console.log(typeof value); // 引用错误
    let value = 'blue'
}
```
因为value位于暂时性死区(temporal dead zone, TDZ)的区域内--该名称并没有在ECMAScript规范中被明确命名，但经常被用于描述let或const声明的变量为何在声明之前无法被访问。

## 总结
1、JavaScript代码是先编译再执行的。

2、执行是按顺序一段一段执行的，一段代码是指一个执行上下文。

3、执行上下文有三种情况：
* 全局执行上下文
* 函数执行上下文
* eval执行上下文

4、let和const支持块级作用域

