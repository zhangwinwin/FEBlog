---
title: TypeScript大杀器：类型系统
---

## 前言
网络上关于TypeScript的教程大多都是语法上的教学与应用。但对于“纯”前端或者只使用过JavaScript的开发人员来说语法上的知识或许并不是最难的。难点是在于动态语言到静态语言思维上的转变。这种转变的关键点就在于**类型系统**的学习！

随着前端应用变得越来越复杂，我们越是迫切地需要保证程序能正确运行。虽然通过测试能在一定程度的保证在给定特定输入的情况下，程序的行为或结果是符合规定。但类型提供了更加一般性的证明，无论给定什么输入，程序都能按照规定运行。

现如今，随着类型系统的盛行，千禧年后诞生的语言基本上都是静态语言（Golang、Rust和Swift等），而且动态语言也陆续添加上了类型约束，典型的例子就是TypeScript。TypeScript大行其道的今天也说明了为代码添加类型是很有价值的，利用编程语言提供的类型系统特性，可以编写出更好、更安全的代码。

## 类型系统
学过编译原理的同学都知道，计算机存储的数据和执行的程序都是由0和1组合而成的。也就是说代码与数据其实在存储上是没有区别，所以当计算机误把代码当成数据或者把数据当成代码去解释就会很容易发生错误。

JavaScript中的eval()函数就是一个典型例子，它将一个字符串视为代码执行。它的输出是否成功就要看输入是不是有效的JavaScript表达式。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34401ba42e6e40aabbcc7bb3fcddabf7~tplv-k3u1fbpfcp-watermark.image?)

除了要区分代码与数据，还需要知道如何解释一条数据。比如16位序列的1100001010100011可以表示无符号16为整数49827还能表示带符号整数-15709。所以还需要有某些规范来为这些10组合赋予意义。

**类型**为数据赋予意义，类型是对数据做的一种分类，定义了能够对数据执行的操作、数据的意义，而且允许数据接受值的集合。编译器和runtime会检查类型，以确保数据的完整性，实施访问限制。

**类型系统**是一组规则，为编程语言的元素分配和实施类型。可以在代码中显示的指定类型，也可以类型系统根据上下文，隐式的推断出某个元素的类型。

### 语言类型
JavaScript是**动态类型**语言，该类型是不会在编译时施加任何类型约束。动态类型也称为“鸭子类型”：如果有一种动物走起来像鸭子，叫起来像鸭子，那么它就是鸭子。代码可按需要自由的使用一个变量，运行时将对变量应用类型。

TypeScript则是**静态类型**语言，该类型在编译时执行类型检查，传入错误的类型参数都将导致编译错误。在TypeScript中通过使用any关键字可模拟动态类型，any关键字允许未指定类型的变量。

另一方面，JavaScript是**弱类型**语言。比如在JavaScript中`"1" == 1`值为true。因为在运行时做了类型转换，这种类型转换就是隐式类型转换。隐式类型转换是非常方便和灵活，因为不需要编写更多的代码用于类型之间地转换，这也是动态语言的好处。但同时充满危险的气息，因为在很多情况下不希望发生隐式类型转换。

TypeScript则是**强类型**语言，在TypeScript中`"1" == 1`这种比较将无法通过编译。

类型的强弱是用于表示类型系统在实施类型约束时的严格程度。弱类型系统会隐式地尝试将值从其实际类型转换为使用该值时期望的类型。

行业流行一句话：**动态类型一时爽，代码重构火葬场**。可见灵活性带来的后果是可以相当严重的！

## 使用TypeScript编程
使用TypeScript编程就是想使用类型系统使得程序更加安全——也就是说尽可能减少BUG。

而实现这种目的有两种方式：
* 赋予意义：确保100千克不会被理解为100公里。
* 实施约束：编写额外的信息限制值的有效范围。

### 赋予意义
#### 计算两点间距离
假如要编写一个函数来计算两点间的距离。使用JavaScript轻而易举的写出如下代码：
```js
function calculateDistance (x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); 
}
```
虽然输入number类型的参数能得到正确的结果，一旦输入不是number类型的参数就会造成错误的结果甚至程序的崩溃。只能靠约定来告诉使用者，只能使用number类型参数。然而约定往往都是不可靠的，没有约束力的。

换成TypeScript注入类型约束：
```ts
function calculateDistance (x1: number, y1: number, x2: number, y2: number) : number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); 
}
```
这个函数能计算出期望的结果，也有足够的约束力来约束只能输入number类型的参数。但这还不够理想！因为在处理点的时候，只有在有对应的y坐标时，x坐标才有意义。所以将上述函数参数改为坐标点的组合形式。
```ts
type Point = [number, number];
function calculateDistance (point1: Point, point2: Point) : number {
    return Math.sqrt((point1[0]- point1[0]) ** 2 + (point2[1] - point2[1]) ** 2);
}
```
通过使用元组，把x与y坐标对作为一个点来传递。这让读写代码变得更加简单。

虽然将点定义为数值对可以得到期望的结果，但仍然失去一些意义。因为仍然需要假设第一个值为x坐标，第二个值是y坐标。更好的方法就是使类型具有意义，确保不会将x解释为y。

**创建新类型**赋予意义：
```ts
class Point {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
function calculateDistance (point1: Point, point2: Point) : number {
    return Math.sqrt((point1.x- point1.x) ** 2 + (point2.y - point2.y) ** 2);
```
创建Point类型，将两个分量分别定义为x和y，从而不给模糊解释留下空间。

#### 判断是否为周末  
0到6代表一周的某一天，其中0代表一周中的第一天，6代表着最后一天。编写出给定一个数字，判断是不是周末。
```ts
function isWeekend (dayOfWeek: number) : boolean {
    return [5, 6].includes(dayOfWeek);
}
```
上述函数看似很合理，但其实是错漏百出。
* 第一：不同国家地区对哪天是一周中的第一天是有争议的。比如美国、加拿大等北美地区的国家普遍认为周日是一周中的第一天，而我国却认为周一才是一周的第一天。所以不对数字施加意义，只是通过约定来约束，是无法防止错误出现的。
* 第二： 使用者调用该函数时不能清晰的知道number类型的实参的期望值是什么，不知道dayOfWeek:number应该使用哪个数字值。

**创建新类型**赋予意义：
```ts
enum DayOfWeek {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}
function isWeekend (dayOfWeek: DayOfWeek) : boolean {
    return [DayOfWeek.Saturday, DayOfWeek.Sunday].includes(dayOfWeek);
}
```
该实现解决了上面的两个问题：
* 第一：明确给出各天对应的数字，不再存在模糊解释。
* 第二：函数声明明确约束接受的是dayOfWeek: DayOfWeek类型的实参，可以清晰的告诉使用者应该传入DayOfWeek的一个成员，而不是传入一个数字。

### 实施约束
#### 进度条
实现一个进度条，表示0~100之间的值。首先创建Percentage类型来清晰表明这是进度条。
```ts
declare const percentageType = unique symbol;
class Percentage {
    value: number;
    [percentageType]: void;
    constructor (value: number) {
        this.value = value;
    }
}
```
不过请注意这有一个约束条件：不应该出现大于100和小于0的值。所以在构造函数中强制使值有效，小于0的值被置为0；大于100的值置为100。

**实施约束**使用构造器模式  
```ts
constructor (value: number) {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    this.value = value;
}
```

有一种需求：遇到错误值的时候，返回一个undefined值或者某些错误值表示失败而不是强制重置value。而上述的构造函数模式是做不到这点的，因为它要么完成初始化，要么抛出错误。而且构造函数应该专注于初始化对象的成员，不宜做过多的逻辑操作。

**实施约束**使用工厂模式  
```ts
declare const percentageType = unique symbol;
class Percentage {
    readonly value: number;
    [percentageType]: void;
    
    private constructor (value: number) {
        this.value = value;
    }
    
    static makePercentage (value: number) : Percentage | undefined {
        if (value < 0 || value > 100) return undefined;
        return new Percentage(value);
    }
}
```
在工厂函数makePercentage中实施约束，返回一个Percentage或者undefined。使用private声明构造函数，因为它不实施约束，所以只能通过工厂函数创建实例。
