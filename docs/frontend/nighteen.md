---
title: 全面解读SUPER关键字
---

## 前言
就一般而言，对super这个关键字来说，了解它的使用方法就可以了。

然而，随着es6的不断普及，class用法也不断“玩”出新花样。super作为class的重要组成部分，深入super就显得很有必要。

## SUPER：一种~~全新~~（已发布6，7年了）的语法
super是什么？

在回答这个问题之前，先来了解为什么要引入super这个关键字。

### SUPER的出现
super是伴随着class语法出现的。在class之前，原型继承是JavaScript唯一的方式来实现对象系统的继承特性。

在原型继承中需要手动去维护“构造器原型链”。比如说：
```js
function Person () {}
function Student () {}

Student.prototype = new Person();
```
上述代码会导致子类Student实例拥有一个错误的constructor属性:
```js
var xiaoming = new Student();
xiaoming.constructor === Person; // true;
```
所以需要手动的维护constructor
```js
Student.prototype = new Person();
Student.prototype.constructor = Student
```
但这样一来就切断了原型与父类的关系，无法有效的调用父类方法。

比如说，student原型的say方法重写person原型的say方法：
```js
Student.prototype.say = function (options) {
    const thisClass = this.constructor;
    const parentClass = thisClass.prototype.constructor;
    ... // 做一些参数合并
    parentClass.prototype.say(newOptions);
    ... // 记录某些结果
}
```
一旦加上`Student.prototype.constructor = Student`这一句，上面调用父类方法就会失效。因为thisClass和parentClass一样都是指向Student。

super就是为了解决这件事才被创造出来的。

### SUPER的指向
在esma262中介绍到，super有两种语法:
```js
// 第一种
[SuperCall]: super[Arguments]

// 第二种
[SuperProperty]: super[Expression]
[SuperProperty]: super.IdentifierName

```

* 第一种情况，super作为函数调用时，表示父类的构造函数。
```js
class Person {}

class Student extends Person {
    constructor() {
        super();
    }
}
```
子类的Student的构造函数中super()，表示调用父类的构造函数。


* 第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类
```js
class Person {
    sayHi () {
        return 'hi' 
    }
}
class Student extends Person {
    constructor() {
        super();
        console.log(super.sayHi())  // 'hi'
    }
}
```
子类student中的super.sayHi()，就是将super当作一个对象使用，相当于person.prototype.sayHi()。

这似乎很完美的回答了问题，但真的吗？看看下面例子:
```js
// 示例1
class Person {
    static say () {
        console.log('hi', super.toString())
    }
}
```
按照用法，super应该是指向Object的，也就是说打印出来的是Object
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/566663d837bd45b585212f4804a4e6ce~tplv-k3u1fbpfcp-watermark.image?)
啊，这？不太对吧，难道super指向了Person，而不是它的父类Object吗？

当然这种解释肯定是错的，那究竟是为什么呢？

其实在不同的上下文中，super的语义也是不相同的。在讨论super语义的时候，要弄清楚super作为语法关键字的一个附加效果：在第二种情况下，将会隐式地传入当前方法中的this对象。

请看下面例子：
```js
// 示例二
// class声明
class Student extends Person {
    constructor () {
        super(); // 语义1
        super.toString(); // 语义2
    }
    static getNum () {
        super.getId(); // 语义3
    }
}

// 对象声明
const xiaoming = {
    sayName () {
        super.toString(); // 语义4
    }
    sayAge: function () {
        // 语义5
    };
}
```
请大家猜一猜上述的super到底代表什么以及this的指向。

             -----------------------我是一条✂分割线---------------------------

现在来一一解答：
* 语义1：在类的constructor中，super指向父类的构造器，而this则是指向new创建的实例。
```js
super = Person.bind(this);
```
* 语义2：在语法super.xxx中，super指向父类原型，在构造过程中this指向创建的实例
```js
super.toString = Person.prototype.toString.bind(this);
```
* 语义3：在静态类方法中使用语法super.xxx，其super指向父类，this指向调用当前方法的类
```js
super.getId = Person.getId.bind(this)
```
* 语义4： 在方法声明中使用super.xxx，super指向对象xiaoming的原型，this指向调用该方法时的this对象。
```js
super.toString = Object.getPrototypeOf(xiaoming).toString.bind(this)
```
* 语义5：不能引用super（下一节解释）

按照以上的解读，来回答示例一。在示例一中，say()是类声明的类静态方法声明，对应语义3的效果，也就是说：
```js
super.toString = Object.toString.bind(Person)
```
所以super.toString中的super最终并没有指向Person，反而是正确的指向了它的父类Object。

### SUPER的计算
介绍到这，相信各位同学的脑袋都有一个大大的疑问，super到底是怎么运行的呢？在第一部分介绍到，即要维护好constroctor还要能调用父类的方法，这似乎是不可能的事。

为了提供解决方法，JavaScript为函数添加了一个特殊的内部属性：**[[HomeObject]]**。

当一个函数被定义为类或者对象方法时，它的`[[HomeObject]]`属性就成为了该对象，然后super使用它来解析父类原型及其方法。请看下列示例：
```js
var person = {
    name: "Person",
    say() { // person.say.[[HomeObject]] == person
        console.log(this.name); 
    } 
}; 
var student = { 
    __proto__: person, 
    name: "Student", 
    say() { // student.say.[[HomeObject]] == student 
        super.say(); 
    } 
}; 
var collegeStd = { 
    __proto__: student, 
    name: "College Student", 
    say() { // collegeStd.say.[[HomeObject]] == collegeStd 
        super.say(); 
    } 
};
collegeStd.say(); // College Student
```
super之所以能够找到父类，全依赖于`[[HomeObject]]`内部槽的运行机制。

`[[HomeObject]]`内部槽使方法记住了它们的对象，而且该内部槽不能被更改，这个绑定是永久的。值得注意的是，该内部槽仅被用于super。

所以，当一个方法不使用super时，仍然可以将其动态调用以及复制。但使用了super就可能出错。

最后关于语义5中不能使用super的解释：  
`[[HomeObject]]`是为类和普通对象中的方法定义的。但对于对象而言，方法必须是`method(){}`的形式，而不是`method: function ()`。

这个差别可能对比我们来说不重要，但对JavaScript来说却非常重要。使用非方法定义的是不会设置`[[HomeObject]]`内部槽的，所以使用super是会导致错误。

这点可以在ecma262中了解：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2354130bde3b4f5589f548c461fa69d6~tplv-k3u1fbpfcp-watermark.image?)
在文档中，有一个MethodDefinition的语法概念，它是介绍方法定义的规则。显然`sayName () {}`是一种MethodDefinition的语法，`sayAge: function() {}`则不是。

再往下了解会发现，MethodDefinition语法会调用MakeMethod。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4bf3218f26c94ebda0d7252905f84c0e~tplv-k3u1fbpfcp-watermark.image?)
第3条可以发现，设置了`[[HomeObject]]`。所以方法必须是`method(){}`的形式。

## 结尾
本文引用以下资料： 
* *[ECMA262](https://tc39.es/ecma262/)*
* *[类继承](https://zh.javascript.info/class-inheritance#shen-ru-nei-bu-tan-jiu-he-homeobject)*
* *[《JavaScript语言精髓与编程实践》](https://book.douban.com/subject/35085910/)*
