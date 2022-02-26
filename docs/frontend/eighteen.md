---
title: Any与Unknown傻傻分不清楚？
---

## 类型断言
有时候你会遇到这样的情况，你会比TypeScript更了解某个值的详细信息。 通常这会发生在你清楚地知道一个实体具有比它现有类型更确切的类型。

通过**类型断言**这种方式可以告诉编译器，“相信我，我知道自己在干什么”。 类型断言好比其它语言里的类型转换，但是不进行特殊的数据检查和解构。 它没有运行时的影响，只是在编译阶段起作用。 TypeScript会假设你已经进行了必须的检查。

```ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

## any
在工作中有时候需要描述一个根本不知道类型的变量时，any类型是一个选择。在TypeScript中，任何数据都能赋值给any。这种特性通常被称为**Top Type**，意思就是说any是任何类型的父类。举个例子：
```ts
interface Cat {
    type: String
}
interface dog {
    type: String
}

const cat: Cat = { type: 'Garfield' };
const dog = cat as Dog;
```
很明显这样的不行的，不能将cat当成dog。as只能转换存在子类型关系的两个类型，但加上any却能编译通过。因为any是任何类型的父类。
```ts
const dog = cat as any as Dog;
```
这也是any的存在的意义--暴力转换。如果将TypeScript中所有类型都改为any，恭喜你，你发现了JavaScript！

## unknown
unkonwn也是一个父类型，继续上面的例子
```ts
interface Animal {}

interface Cat extends Animal{
    type: String
}
interface Dog extends Animal{
    type: String
}

const cat: Cat = { type: 'Garfield' };
const dog = cat as Dog; // error
const dog = cat as Animal as Dog; // work
```
首先要将Cat类型转换为它的父类Animal，然后再转换父类Animal的另一个子类Dog，这是可行的。因为它们有共同的父类Animal。

这就是问题所在，并不是所有需要转换的两个类型都有共同的父类（当然你也可以造出来，可这样就相当麻烦），所以TypeScript引入了unknown类型，它也是任何类型的父类。
```ts
const dog = cat as unknow as Dog; // work
```

## any与unknown的区别
unknow类型只是一个**Top Type**，而any既是一个**Top Type**也是一个**Bottom Type**。正因为如此编辑器才不会对any进行类型检查。

总的来说：使用unknow还能保持类型安全，使用any就默认放弃类型检查。所以any是一个危险的类型，它可以自由转换为其他类型，其他类型也可以自由转换为any类型，编译器不对该类型的实例进行类型检查。所以开发者有义务确保不会发生错误解释类型的情况。


## 使用unknow代替any
举个例子，使用反序列化一个JSON时，往往不知道结果是拥有什么属性的，所以也无法制定一个类型。这时只能使用any了。
```ts
class Point {
    latlng: string;
    constructor(latlng: string) {
        this.latlng = latlng;
    }    
}

function deserialize(input: string) : any {
    return JSON.parse(input);
}
function draw(point: Point): void {
    console.log(`draw point in ${point.latlng}!`};
}
draw(deserialize('{"latlng": "23.23, 113.26"}'));
```
上面的结果碰巧能正常使用。但是一旦deserialize函数反序列化一个不是Point对象的对象时，将其结果放入draw函数中就会报错。
```ts
draw(deserialize("{}"));
```
问题是：这个报错是运行时报错，我们希望要在编译时就能发现这个问题。

所以要确保获取的对象要有一个string类型的latlng属性，并且还要检查对象不为null或undefined。在调用draw之前调用该检查方法
```ts
function isPoint(point: any): point is Point {
    if (user === null || user === undefined) {
        return false;
    }
    return typeof point.latlng === 'string';
}
const point: any = deserialize('{"latlng": "23.23, 113.26"}'));
if (isPoint(point)) {
    draw(point);
}
```
增加一个isPoint函数判断是否函数是否函数string类型的latlng属性。

point is Point返回类型是TypeScript特有的语法。该类型与boolean返回类型非常相似，但对编译器来说，它具有额外的意义。如果该函数返回true，则变量point的类型为Point。

该方法是可行的。但如果调用者忘记调用isPoint函数，那就没什么意义，因为编译器不会去检查。这时候就需要有一种类型，它时类型系统中任何类型的父类型，无论JSON.parse()返回什么，都会是该类型子类型。

**unknow**登场  
将any改为unknow，类型系统将确保在把它转换为Point之前，添加合适的类型检查。
```ts
function deserialize(input: string) : unknown {
    return JSON.parse(input);
}
const user: unknown = deserialize('{"latlng": "23.23, 113.26"}');
```
修改的地方很小，只是将deserialize返回类型和point类型改为unknown，但这个效果确实异常的强大。一旦从JSON.parse取得值，就将其从any转换为unknown。这个过程是安全的，因为任何类型都可以转换为unknown。将isPoint的实参保留为any，这让实现变得更加简单。因为不做额外的转换，是不能对unknown类型做typeof point.latlng这样的类型检查。

这段代码的效果与之前相比在于：如果没有isPoint调用，代码就不能再通过编译。会出现错误：
```ts
Argument of type 'unknown' is not assignable to parameter of type 'Point'
```
不能简单地把unknown类型的变量传递给draw，因为后者期望收到的是Point。使用isPoint会有帮助，因为每当该函数返回true，编译器就会自动认为变量类型为Point。

