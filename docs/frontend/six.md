---
title: CommonJs与ES6Module
---

## 前言
现代前端开发每时每刻都和模块打交道。例如，在项目中引入一个插件，或者实现一个供全局使用组件的JS文件。这些都可以称为模块。  

在设计程序结构时，不可能把所有代码都放在一起。更为友好的组织方式时按照特定的功能将代码拆分为多个代码片段，每个片段实现一个功能或者一个特定的目的，然后通过接口的方式组合在一起。这就是模块思想。

## JavaScript里的模块
众所周知，JavaScript在早期是没有模块这一概念。唯有通过srcipt标签将多个js文件一个个的插入在HTML中。当项目越来越大时，这种方式会导致很多问题：
* 需要手动维护JavaScript的加载顺序。因为通常script之间会有很多依赖关系，但这种关系都是隐式的，除非一个个去查看注释（如果没有注释，那就...），否则很难指明谁依赖谁。  
* 命名冲突。所有script文件所定义的所有内容都由全局作用域共享。一个人开发还好，碰上多人协作开发，那就是灾害。  
* 如果script数量太多，这也会影响页面加载。因为script标签都需要向服务器请求资源，过多的请求会严重降低渲染的速度。

而模块化就能很好的解决以上问题。  

### 何为模块
模块是使用不同方式加载的JS文件。这种不同模式很有必要，因为它与脚本有着非常不同的语义，在ES6的模块中有着下列的语义：
* 模块自动运行在严格模式下。
* 在模块的顶层作用域创建的变量，不会被自动添加在共享的全局作用域中，它们之后在各自的模块顶层作用域下生存。
* 通过导入导出的语句，可以非常清晰的指明模块的依赖关系。

这些差异代表了JS代码加载与执行方面的显著改变。

### 模块的发展
从2009年开始，JavaScript社区开始对模块化不断进行尝试，并依次出现了AMD、CommonJs、CMD等解决方案。  

Nodejs是CommonJs规范的主要实践者，所以也是这几个方案里面使用最广泛的方案。但这些都只是由社区提出的规范，并不能算语言本身的特性。  

到了2015年，ECMAScript6.0正式定义了JavaScript模块标准。

## CommonJs
JavaScript在2009年提出了CommonJs规范，包含了模块、文件、IO、控制台在内的一系列标准。并且nodejs实现了CommonJS中的一部分，并在其基础上进行了一些调整。现在我们所说的CommonJs其实是Nodejs中的版本，并非它的原始定义。  

CommonJs最初只为服务器端服务的。因为它定义的两个主要概念：
* require函数，用于导入；
* module.exports变量，用于导出；

这两个关键字，浏览器都不支持。直到社区出现了诸如browserify编译库将commonjs编译成为浏览器所能支持的语法。这就意味着客户端代码可以遵循Commonjs标准来编写了。  

不仅如此，借助Nodejs的npm包管理器，开发人员还可以获取社区上的优秀代码库，或者将自己的代码发布出去以供需要的人使用。这种方式使CommonJs在前端开发中逐渐流行了起来。  

### 模块
CommonJs规范中规定了每一个文件都是一个模块。使用require导入的文件会形成一个属于自身的模块作用域，这样就不会在进行变量以及函数声明时会污染全局作用域。所有的变量和函数都只有模块自身能访问，对外不可见的。  

举例：
```
// foo.js
var name = 'foo';

// bar.js
var name = 'bar';
require('./foo.js');
console.log(name); // bar
```
在bar.js中通过require函数加载foo.js。运行之后输出的结果是‘bar’，这就说明了foo.js中的变量声明并不会影响bar.js。每个文件都拥有自己的作用域。

### 导出
导出是一个模块对外暴露自身的唯一方式。在CommonJs中，通过module.exports可以导出模块中的内容。  

举例:
```
module.exports = {
    name: 'foo'
}
```
CommonJs模块内部会有一个module对象用于存放当前模块的信息，可以理解为在每个模块的最开始中定义了以下对象：
```
var module = {};
// ...
module.exports = {};
```
CommonJs也支持另一种导出方式：exports。  
```
exports.name = 'foo'
```
在实现上，这段代码与上面的module.exports没有不同，其内在机制是将exports指向了module.exports。可以简单的理解为CommonJs在每个模块的开头默认添加了以下代码:
```
var module = {
    exports: {}
}
var exports = module.exports;
```
因此，为export.name赋值相当于在module.exports对象上添加了一个name属性。  

也很容易看出exports与module.exports只是指向同一个对象。所以对exports进行赋值操作，使其指向新的对象，就会失效了。  

举例:
```
exports = {
    name: 'foo'
}
```
此时name属性并不会被导出。

另外这两个方法，并不能一起运用。因为使用module.exports赋值就相当于使其指向新的对象。之前的exports赋值都会失效。

### 导入
CommonJs使用require函数进行导入操作。  

举例:
```
// foo.js
module.exports = {
    sayname: function () {
        console.log('foo');
    }
};

// bar.js
var sayname = require('./foo.js').sayname;
sayname(); // foo
```
在bar.js中导入了foo.js，并调用了它的sayname函数。  

当require一个模块时会有两种情况：
* 模块是第一次被require加载。这时会首先执行该模块，然后导出内容。
* 模块是曾经被require加载过。这时会直接导出执行得到的结果。  

举例：
```
// foo.js
console.log('running foo.js')
exports.name = 'foo';

// bar.js
var firstname = require('./foo').name;
console.log('firstname:', firstname); 

var lastname = require('./foo').name;
console.log('lastname:', lastname);
```
输出的是：

running foo.js  
fistname:foo

lastname:foo  

从上面代码看有两个地方都require了foo文件，但从结果看，只运行了一遍foo.js。

module对象中有一个loaded属性用于记录该模块是否被加载过。默认值为false，当模块第一次被加载时，会赋值为true，后面再次加载时会检查module.loaded是否为true，如果是，则直接返回结果，并不会再次执行代码。  

require函数可以接受表达式，借助这个特性可以动态地制定模块的加载路径。  

举例：
```
var path = ['foo.js', 'bar.js'];
path.forEach(name => {
    require('./' + name);
})
```

## ES6Module
CommonJs可以说是比较好的解决了模块的问题，但这些都只是由社区提出的规范，并不能算语言本身的特性。

到了2015年，ECMAScript6.0正式定义了JavaScript模块标准。从此 JavaScript 语言才具备了模块这一特性。

### 模块
将前面CommonJs的例子，用ES6Module方式改写。
```
// foo.js
export default {
    sayname: function () {
        console.log('foo');
    }
};

// bar.js
import foo from './foo.js'
foo.sayname(); // foo
```
ES6Module也是将每个文件作为一个模块，每个模块拥有自身的作用域，不同的是导入、导出语句。import和export也是作为保留关键字在ES6版本加入了进来，而且ES6Module会自动采用严格模式。  

### 导出
在ES6Module中使用export命令来导出模块。export有两种形式：
* 命名导出
* 默认导出

1、命令导出  
一个模块可以有多个命名导出，有两种不同的写法：
```
// 1
export const name = 'foo';

// 2
const name = 'foo';
export { name }
```
可以通过as关键字对变量重命名。  

例如：
```
const name = 'foo';
export { name as nickname }
```

2、默认导出  
默认导出只能有一个：
```
export default {
    name: 'foo'
}
```
可以将export default理解为对外输出一个名为default的变量。

### 导入
ES6Module使用import语法导入模块。  

举例：
```
// foo.js
export const name = 'foo';
// bar.js
import { name } from './foo'
console.log(name)
```
加载带有命令导出的模块时，import后面要跟一对大括号来将导入的变量名包裹起来，并且这写变量名需要与导出的变量名完全一致。导入变量的效果相当于在当前作用域下声明了这些变量，并且不可以对齐进行修改。  

与命令导出类似，也可以通过as关键字对导入的变量重命名。

举例：
```
// foo.js
export const name = 'foo';
// bar.js
import { name as nickname } from './foo'
console.log(nickname)

// 也可以通过整体导入的方法
import * as name from './foo'
console.log(name.name)
```

默认导入的例子：
```
// foo.js
export default {
    name: 'foo'
}

// bar
import name from './foo'
console.log(name.name)
```

## CommonJs与ES6Module的区别
### 对模块依赖的处理区别
CommonJs与ES6Module最本质的区别在于前者对模块依赖的解决是动态的，而后者是静态的。
* 动态：模块依赖关系的建立是发生在代码运行阶段；
* 静态：模块依赖关系的建立是发生在代码编译阶段；

在CommonJs中，当模块A加载模块B时，会执行B的代码，将其module.exports对象作为require函数的返回值进行返回。并且requrie的模块路径可以动态指定，支持传入一个表示式，甚至可以使用if语句判断是否加载某个模块。所以CommonJs模块被执行前，并没有办法确定明确的依赖关系，模块的导入，导出发生在代码的运行阶段。  

ES6Module的导入、导出语句都是声明式的，不支持导入的路径是一个表达式，并且导入、导出语句必须位于模块的顶层作用域。在ES6代码的编译阶段就可以分析出模块的依赖关系。

### 导入模块值的区别
在导入一个模块时，对于CommonJs来说是得到了一个导出值的拷贝；而在ES6Module中则是值的动态映射，并且这个映射是只读的。

举例：
```
// foo
var count = 0;
module.exports = {
    count: count,
    add: function (a, b) {
        count++;
        return a+b;
    }
}

// bar
var count = require('./foo').count;
var add = require('./foo').add;

console.log(count); // 0
add(2,3);
console.log(count); // 0

count += 1;
console.log(count); // 1(拷贝值可以更改)
```
bar中的count是对foo中count的一份值拷贝，因此在调用add函数时，虽然更改了foo中count的值，但是并不会对bar中导入值造成更改。

另一方面拷贝值可以进行更改。

使用ES6Module进行改写
```
// foo
let count = 0;
const add = function (a,b) {
    count++;
    return a+b;
}
export { count, add }

// bar
import { count, add } from './foo';
console.log(count); // 0
add(2,3);
console.log(count); // 1（实时反映foo中count的值）

count++; // 报错 count is read-only
```
可以将映射关系理解为一面镜子，从镜子中可以实时观察到原有的事物，但不能操作镜子中的影像。

### 循环依赖的区别
CommonJs中循环依赖的例子：
```
// foo
const bar = require('./bar')
console.log('来自bar：', bar);
module.exports = 'foo';

// bar
const foo = require('./foo');
console.log('来自foo：', foo);
module.exports = 'bar;

// index
require('./foo')
```
在控制台输出:
```
来自foo：()
来自bar：bar
```
首先来梳理执行流程：
* index文件中引入了foo，此时开始执行foo中的代码；
* foo第一句导入了bar，这是foo不会继续向下执行，而是进入了bar的内部。
* 在bar中又引入了foo，这里产生了循环依赖。但并不会再次执行foo，而是直接导出返回值，也就是module.exports。但由于foo未执行完，导出值是默认的空对象，因此当bar执行到console.log时，打印出来的是空对象。
* bar执行完毕，foo继续向下执行直到流程结束。

使用ES6Module重写上面例子：
```
// foo
import bar from './bar';
console.log('来自bar：', bar);
export default 'foo'

// bar
import foo from './foo'
console.log('来自foo：', foo);
export default 'bar'

// index
import foo from './foo'
```
结果是:
来自foo: undefined
来自bar：bar

在bar中同样无法得到foo正确的导出值，只不过和CommonJS默认导出一个空对象不同，这里获取到的是undefined。
