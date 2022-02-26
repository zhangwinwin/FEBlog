---
title: 一只在蓝天白云下奔跑在草丛中的🐶
---

## 前言
说起来是这样的，有一天我逛某乎的时候看到一个帖子[用Canvas画一只会跟着鼠标走的小狗](https://zhuanlan.zhihu.com/p/34139676)。哎，还挺有意思的，一个短小精悍且有趣的demo。

然后我使用`canvas`精灵将其重现了，精灵能用于很多场景下的`canvas`动画。下面来介绍一下：

精灵`（sprite）`并不是`Canvas`某个`API`，它是一个抽象动画行为与制作方法的图形对象。下面你会看到如何在不影响动画背景的情况下移动精灵，并赋予它们各种行为，比如说：给🐶对象添加慢走行为，在一定的机制下变成奔跑。这些行为可以无限重复，也可以发生在一段时间内或者一段距离内，也可以随着时间来改变其样貌。

## 精灵
要制作一个有用的精灵，首先得把它绘制出来，能够将其放置在动画中的特定位置。而且还能接受不同的行为函数，作出某些特定的动作。

所以精灵对象`（sprite）`要包含两个方法
* `paint`
* `update`
`paint`是一个绘制精灵的方法，而`update`则是用于执行精灵的行为。

上面说到它是一个抽象动画行为与制作方法的图形对象，就是说sprite的这两个方法是抽象每个精灵对象的共有方法。`paint`方法执行精灵的绘制，这个绘制交由绘制器`（painter）`去做，因为有的精灵是用图像生成，有的则是`canvas`画出来的，而它们都有名字，大小和位置属性。而`update`方法则是执行一个`behaviors`对象数组，数组中每个对象都会以`execute`方法来对精灵中做某些操作。一个基本的精灵抽象就出来了：
```js
// 下面代码只是用于说明思路，实现具体看读者个人风格。
class Sprite {
    // 接受名称，绘制器和行为对象数组
    constructor(name, painter, behaviors) {
        this.name = name;
        this.painter = painter;
        this.behaviors = behaviors;
        // 一些默认的属性
        this.left = 0;
        this.top = 0;
        this.width = 10;
        this.height = 10;
    }
    paint (ctx) {
        this.painter.paint(this, ctx)
    },
    update (ctx, ...args) {
        for (var i = this.behaviors.length; i > 0; --i) {
            this.behaviors[i-1].execute(this, ctx, ...args)
        }
    }
}
```
用`Sprite`对象创建狗狗。
```js
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const dog = new Sprite('dog', {
    painter: function (sprite, ctx) {
        dogImg = new Image();
        dogImg.src = require('./assets/dog/dog1.png');
        dogImg.onload = function () {
            ctx.drawImage(dogImg, sprite.left, sprite.top, sprite.width, sprite.height)
        }
    }，
    []
});
dog.paint(ctx)
```
小狗已经出现了！
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52df32db0fa74329b4838160b79e74f9~tplv-k3u1fbpfcp-watermark.image)

### 精灵绘制器
精灵对象不需要自己去完成绘制，相反，它会将绘制操作代理给另外一个对象来实现。也就是`Sprite`对象与绘制器对象之间是解耦的。如此一来，就可以在程序运行时为精灵对象动态地设定绘制器了，这极大地提升了程序的灵活性。这也是策略模式的一种实际应用。

这个`demo`中，采用的是图像绘制器。图像绘制器对象含有一个指向图像对象的引用，它将此图像绘制到经由`paint()`方法所传入的绘图环境对象上。
```js
export class ImagePainter {
    constructor (img) {
        this.image = new Image();
        this.image.src = img;
    }
    paint (sprite, ctx) {
        if (this.image !== undefined) {
            if (!this.image.complete) {
                this.image.onload = function () {
                    sprite.width = this.width;
                    sprite.height = this.height;
                    ctx.drawImage(this, sprite.left, sprite.top, sprite.width, sprite.height)
                }
            } else {
                ctx.drawImage(this.image, sprite.left, sprite.top, sprite.width, sprite.height)
            }
        }
    }
}
```
分两种情况：
* 当图像没有完全加载出来的时候，创建一个函数包裹着`drawImage`方法并将此函数赋值给`image.onload`中，此时当图像加载完成后就会执行`onload`方法。从而执行`drawImage`将其画在`canvas`上。
* 当图像已经加载完成后，直接执行`drawImage`方法。

在创建图像绘制器时，需要将指向图像的URL的引用传给`ImagePainter`构造器。只用当图像完全载入后，图像绘制器才执行`paint()`将其绘制出来。
```js
const dog = new Sprite('dog', new ImagePainter('dog1.png'), []);
function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dog.paint(ctx);
    window.requestAnimationFrame(animate);
}
animate();
dog.paint(ctx);
```
因为精灵是要用在动画效果之中的，所以不仅仅是绘制一次就停下，要反复地绘制这个精灵对象。所以如果在调用图像绘制器，图像还没加载完毕，该方法是不会执行任何操作，直至完全加载之后，精灵才会显示。

因为要实现动画效果的精灵不可能只有一张图像，是多张图像的作用下才能展示动态的效果。所以需要一个精灵动画制作器--`SpriteAnimator`

### SpriteAnimator
`SpriteAnimator`对象用于控制精灵的动画图像，其中含有一个数组，该数组中每个元素都是一个实现了`paint`方法的对象，这些对象都可以绘制经历过你。每个精灵对象都有一个专门负责其绘制的精灵绘制器。

`SpriteAnimator`对象每隔一段时间，就会从数组对象中按次序选出一个绘制器对象，并用其绘制精灵。所以在创建`SpriteAnimator`对象时，要将精灵绘制器数组传给构造器。`SpriteAnimator.start`方法用于动画播放，接受要播放的精灵对象与动画维持的毫秒数。

```js
class SpriteAnimator {
    constructor (painters, elapsedCallback) {
        this.painters = painters;
        this.elapsedCallback = elapsedCallback;
        this.painter = [];
        this.timerList = [];
        this.duration = 1000;
        this.startTime = 0;
        this.index = 0;
    }
    start (sprite, duration) {
        let endTime = +new Date() + duration;
        let period = duration / this.painters.length;
        let interval = undefined;
        let originalPainter = sprite.painter

        this.index = 0;
        sprite.animating = true;
        sprite.painter = this.painters[this.index];

        interval = setInterval(() => {
            if (+new Date() < endTime) {
                sprite.painter = this.painters[++this.index]
            } else {
                this.end(sprite, originalPainter);
                clearInterval(interval)
            }
        }, period)
    }
    end (sprite, orginalPainter) {
        sprite.animating = false;
        this.elapsedCallback ? this.elapsedCallback(sprite) : sprite.painter = orginalPainter;
    }
}
```
为了播放动画效果，`SpriteAnimator`对象的`start`方法需要将动画持续时间与当前时间相加以算出动画的停止时间。然后根据动画持续时间与需要绘制的`painters`数组的长度，算出动画的“周期”`period`，也就是分配给每张动画图像的显示时间。使用`setInterval`以`period`为周期更换精灵的`painter`配合`requestAnimationFrame`在规定时间内展示当前的图像，当达到了指定时间后就调用`clearInterval`停止动画播放。

最后`SpriteAnimator.start`方法播放结束后，调用`end`方法来展示最后的`painter`。

看看效果，
```js
const dog = new Sprite('dog', new ImagePainter('dog1.png'), []);
let dogPainterList = ['dog1.png', 'dog2.png', 'dog3.png', 'dog4.png', 'dog5.png', 'dog6.png', 'dog7.png', 'dog8.png'].map(item => new ImagePainter(item));
let dogAnimator = new SpriteAnimator(dogPainterList)
function animate () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dog.paint(ctx);
    window.requestAnimationFrame(animate);
}
animate();
dog.paint(ctx);
dogAnimator.start(dog, 2000);
```
1、首先创建要播放的图像数组，由一系列的图像绘制器组成。  
2、将图像数组作为参数生成`SpriteAnimator`对象  
3、调用`SpriteAnimator`对象的`start`方法，参数是精灵和持续的时间。  
![dialog4.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9aa68053a894dc386cf7d88dc6164b6~tplv-k3u1fbpfcp-watermark.image)
动画持续两秒时间（使用`mouseenter`方法，鼠标移入的时候才进行动画效果）

### behavior
赋予狗狗一个加速的行为，先定义这个行为：
* 只有当`mousedown`的时候才执行这个行为，并记录下`mousedown`的位置，算出`canvas`222222222222222222的位置。
* 比较精灵的位置与点击的位置，如果小于点击的位置，则加速奔跑。
```js
const accelerate = {
    velocityX: 1,
    execute: function(sprite, ctx, pos) {
        this.velocityX = 1; // 重置加速度
        if (sprite.left + sprite.right < pos) {
            sprite.left += this.velocityX;
        } else {
            this.velocityX = 0;
        }
    }
}
const dog = new Sprite('dog', new ImagePainter('dog1.png'), [accelerate]);
```
![dialog5.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd81e046d9c34655a5f3ededa2edd75f~tplv-k3u1fbpfcp-watermark.image)

### 加上一点点细节
最后加上背景动画就完美了，这部分没有什么难度。分别根据不同的速率来设置`offset`，配合`translate`函数就能营造出背景后移的效果。
使用`mouseenter`方法，鼠标移入的时候才进行动画效果
![dialog6.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c4d5a27cc28949369bdf77310b64e3a9~tplv-k3u1fbpfcp-watermark.image)

使用`mousedown`方法，鼠标点击的时候执行奔跑行为
![dialog7.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee54764e5a4c48c0b813c6176a064779~tplv-k3u1fbpfcp-watermark.image)

配合`scale(-1, 1)`进行镜像处理，来实现向左向右移动。值得注意的是，`Canvas`中元素定位就出了很大的问题。这是因为`Canvas`的坐标变换系和`CSS`不一样，因此，如果想实现居中翻转效果，需要在翻转之前将目标元素的中心点移动到变换轴上。
```js
ctx.translate(dog.left, 0)
ctx.scale(-1, 1)
ctx.translate(- dog.left - dog.width, 0)
```
![dialog8.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/009a7b45ce764f86a1b84c2d5b2d10be~tplv-k3u1fbpfcp-watermark.image)

具体代码比较简单，就不贴出来了，同学们可以自己去尝试一下。
