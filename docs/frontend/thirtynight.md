---
title: 使用CANVAS时一些鲜为人知的姿势！
---

## 前言
**canvas**元素可以说是HTML5中最强大的功能没有之一。Canvas提供了一个通过JavaScript和HTML的\<canvas\>元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。

**本文所介绍的都是关于2D方向的应用。**

## CANVAS一些鲜为人知的姿势
### 1、修改canvas大小
在默认情况下，浏览器所创建的canvas元素是300px\*150px，有两种方法修改canvas大小：
* 可以通过指定width属性和height属性来修改元素大小。*（值得注意的是，虽然浏览器普遍允许在指定width属性和height属性时使用px后缀，但从技术上来说这是不符合Canvas规范的。根据规范，只能指定非负整数。）*
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4585cb7dced84738a5b6d441dcf6a4eb~tplv-k3u1fbpfcp-watermark.image?)
* 还可以通过css属性来改变canvas元素的大小。
使用这种方法改变canvas元素的大小会产生意想不到的效果。这是因为canvas元素其实上有两套尺寸，一个是元素本身的大小，另一个是画布的大小。

当设置canvas的width和height属性时，实际上是同时修改元素本身尺寸以及画布的尺寸。而通过css修改canvas大小，则只会修改元素本身的大小，不会影响到画布尺寸。

但这种方法会造成canvas元素的尺寸与画布尺寸不一致。当width、height属性与css宽高属性不一致，这时候浏览器会缩放画布，使其适应元素的尺寸!
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a80c32c7f5b4b3dbf6d0dd6c546da97~tplv-k3u1fbpfcp-watermark.image?)

### 2、路径
#### 前置知识
图形的基本元素是路径，而路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合。不同于fillRect和strokeRect，其他canvas绘制图形的方法都是基于路径的。

使用路径绘制时，首先需要定义一个路径，然后再对其进行描边或填充。步骤如下：
* 首先调用beginPath方法开始一段新的路径。
* 然后使用rect或者arc等方法创建矩形或弧形路径。
* 最后调用stroke和fill方法，对刚刚创建的路径进行描边或填充。
#### 路径与子路径
在某一时刻，canvas有且仅有一条路径存在，称其为**当前路径**。但当前路径可以有多条子路径，而子路径则是由两个或以上的点组成的。
```js
ctx.beginPath();
ctx.rect(1, 1, 10, 10);
ctx.stroke();

ctx.beginPath();
ctx.rect(20, 20, 10, 10)
ctx.stroke();
```
在上述例子中，通过调用beginPath来开始一段新的路径，该方法会将当前路径中所有子路径都清除。然后调用rect方法向当前路径添加4个点的子路径。最后调用stroke方法将当前路径描绘出来。

第二个beginPath方法会将上一个路径清除掉，以创建新的当前路径。

那么问题来了，如果把第二个beginPath方法去掉会造成什么影响？
```js
ctx.beginPath();
ctx.rect(1, 1, 10, 10);
ctx.stroke();

ctx.rect(20, 20, 10, 10)
ctx.stroke();
```
首先第一步是一样的，通过调用beginPath来开始一段新的路径。然后调用rect方法向当前路径添加4个点的子路径。最后调用stroke方法将当前路径描绘出来。

接下来，再次调用rect方法，不过由于没有调用beginPath方法清除上一个路径，所以第二次调用时会在当前路径中增加一个子路径。*最后再次调用stroke方法时，会将当前路径中两条子路径都绘制，也就是第一个矩形被绘制了两遍！*

#### 路径方向与非零环绕规则
如果有一天，UI给了一个抽象派的设计给我时，应该怎么去实现呢？比如怎么用fill填充下面的图。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1b0656e0fcb74959b42e456ab1e1f03f~tplv-k3u1fbpfcp-watermark.image?)
这时候就要用到非零环绕规则了。

我们从简单的开始，一个圆环应该怎么画？相信不少同学想到用画家算法来绘制。
```js
context.strokeStyle = 'navy';

context.beginPath();
context.arc(300, 170, 150, 0, Math.PI*2);
context.fillStyle = 'white';
context.fill();
context.stroke();

context.beginPath();
context.arc(300, 170, 100, 0, Math.PI*2);
context.fillStyle = 'navy';
context.fill();
context.stroke();
```
如上面代码所示
* 首先绘制最底的大圆，使用fill填充为navy。
* 然后再绘制同心小圆，再使用fill填充了与画布一样的底色。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04e0714042ed418f81ba8c353a51a714~tplv-k3u1fbpfcp-watermark.image?)
这样确实能绘制出圆环，就是比较费劲。

其实有一个更简单快捷的方法，arc方法中有一个可选的参数`anticlockwise`。如果为true，逆时针绘制圆弧，反之，顺时针绘制。
```js
context.strokeStyle = 'navy';
context.fillStyle = 'navy';
context.beginPath();
context.arc(300, 170, 150, 0, Math.PI*2, false);
context.arc(300, 170, 100, 0, Math.PI*2, true);
context.fill();
context.stroke();
```
效果是一样的，但代码和性能都好不少。

如果当前路径包含多个相交的子路径，canvas的绘图环境变量就需要判断，当fill方法被调用时，应该如何对当前路径进行填充--此时就使用**非零环绕规则**来判断。
* 路径中任意给定的区域，从该区域内部画一条足够长的线段，使该线段的终点完全落在路径范围之外。
* 将计数器初始化为0，然后，每当这条线段与路径的线相交时，就改变计数器的值。如果与路径的顺时针部分相交就加1，否则减1。
* 若最终的计算器值不为0，就说明该区域在路径当中，那么调用fill时，就对其进行填充。否则就表示不在当前路径中，不对其进行填充。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/138aed5658df4effa01575d044fb99dd~tplv-k3u1fbpfcp-watermark.image?)
使用非零环绕规则，绘制出一些不规则的图形就不再是难题
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5141212dfa7641c5811d9c9ccfe4cdfe~tplv-k3u1fbpfcp-watermark.image?)

#### 路径与线段-绘制1像素的线段
canvas绘图环境提供了两个创建线性路径的方法：moveTo()和lineTo()。请看下面代码：
```js
context.lineWidth = 1;
context.beginPath();
context.moveTo(50, 10);
context.lineTo(450, 10);
context.stroke();

context.beginPath();
context.moveTo(50.5, 50.5);
context.lineTo(450.5, 50.5);
context.stroke();
```
上面代码画了两条线段，一条是从(50, 10)到(450, 10)，另一条是从(50.5, 50.5)到(450.5, 50.5)。并设置lineWidth为1，但结果却是不同的。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4f0bb130952a4e24bdc9b2bcec46b991~tplv-k3u1fbpfcp-watermark.image?)
很清楚的看到，上面那条线段是比下面那条要粗。这是为什么？

原因是在某2个像素的边界处绘制一条1像素宽度的线段时，实际上会占据2个像素的宽度。因为canvas绘图环境对象会试着将半个像素画在边界中线的右边，将另外半个像素画在边界中线的左边。

然而，在一整个像素范围内绘制半个像素宽的线段是不可能的，所以左右两边方向上的那半个像素都被扩展为1个像素。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be233983ac9a48f6b01248a76a1e3543~tplv-k3u1fbpfcp-watermark.image?)
而第二条线段绘制在两个像素之间，这样的话，中线左右两端的半个像素就不会延伸。它们合起来就刚好占满一个像素的宽度。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3a5ea872f2f4f3190a495feb937de36~tplv-k3u1fbpfcp-watermark.image?)

### canvas状态保存与恢复
不同于SVG这种保留模式的绘图系统，canvas是采用**立即模式**来绘制图形的，这意味着canvas会立即将指定的内容绘制在画布上，而且不会保存绘制的内容。

但Canvas并不是完全不保存“状态”的，它也有一些“状态”的保存与恢复功能。比如众所周知的属性状态的保存与恢复
#### 属性状态的保存与恢复
在使用Canvas开发过程中，经常会设置不同的绘制属性值。而且很多时候只是临时性的改变这些属性，比如说用浅色绘制底图，然后用深色在底图上进行后续的绘制。这时，需要临时的修改fillStyle属性。

它提供了的save()、restore()方法，用于保存及恢复当前canvas绘图环境的所有属性。
```js
function drawBg (fillStyle) {
    ctx.save();
    ctx.fillStyle = fillStyle
    // draw
    ctx.restore();
}
```
绘图环境的save方法会将当前的绘图环境状态信息压入栈顶。对应的restore方法则从栈顶弹出状态信息，已恢复原来的状态。

所以在绘制前先用save将绘图环境状态信息压入栈顶，绘制完成后用restore弹出状态信息，成为canvas开发的一个好的习惯。
#### 绘制表面的保存与恢复
不同于save、restore，接下来介绍的这两个方法却是鲜为人知的。
* getImageData
* putImageData
这俩方法是canvas绘制环境对象的重要功能，它们可以对绘图表面自身进行保存与恢复。

当需要动态绘制或者缩放一些图形时就非常有用。比方说在动态绘制一个正方形，你会怎么做？可能是mousemove事件中清空画布，再重新渲染，之后绘制这个正方形。这方法如果是在画布上拥有多个图形下就不好使了。

如果用getImageData和putImageData就显得非常简单
```js
// 在onmousedown事件中保存绘制表面
canvas.onmousedown = function () {
    currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ...
}
// 在onmousemove事件中恢复绘制表面，接着绘制正方形
canvas.onmousemove = function () {
    ctx.putImageData(currentImageData, 0, 0); // 恢复原来的表面，删除已绘制的正方形
    createSquare() // 根据鼠标拖动改变尺寸，动态绘制正方形
}
// 在onmouseup事件中恢复绘制表面，绘制最后确定的正方形
canvas.onmouseup = function () {
    ctx.putImageData(currentImageData, 0, 0);
    createSquare() // 绘制最后确定尺寸的正方形
}
```
来看看效果
![动画.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34e176496a13484ebd3753115be4d4a7~tplv-k3u1fbpfcp-watermark.image?)
