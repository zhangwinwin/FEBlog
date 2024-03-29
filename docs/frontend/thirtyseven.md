---
title: 8个有点优秀的CSS实践
---

### CSS计算选中标签元素
这是一种社交平台的常见需求，比如说在掘金平台中让用户选择感兴趣的标签，通常都是用JS来处理已经选择了的标签数量。今天给出一个`css`版本：
```html
<p>请选择你感兴趣的标签:</p>
<input type="checkbox" id="topic1"><label for="topic1" class="topic">Vue</label>
...
<p>您已选择<span class="topic-counter"></span>个标签。</p>
```
首先将`checkbox`隐藏起来：
```css
[type="checkbox"]{
    position: absolute;
    clip: rect(0 0 0 0);
}
```
然后自定义`label`样式，接着设置`CSS`计算器。
```css
// 在body中创建或者重置计算器
body {
    counter-reset: topicCounter;
}
// 当checkbox在选中状态时递增变量
:checked + .topic {
    counter-increment: topicCounter;
}
//使用counter（）函数将计算器的值添加到元素中。
.topic-counter::before {
    color: red;
    content: counter(topicCounter);
}
```

效果图如下：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9fddfac217a474a9555c5165104a802~tplv-k3u1fbpfcp-watermark.image)

### 多行文本溢出省略
文本溢出省略是很常见的业务需求，然而大多数都是处理单行文本：
```css
overflow: hidden;
white-space: nowrap;
text-overflow: ellipsis;
```
这3个`CSS`语句的意思是：
* 设置如果文字长度超出指定的宽度，则隐藏超出宽度的内容。
* 设置文字在一行显示，不能换行。
* 设置文本溢出时，用省略符号来代表被裁剪的文本。

那么处理多行文本又是怎么样的？这里提供一个`CSS`版本：
```css
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
```
上面`CSS`语句的意思是：
* 设置元素为弹性伸缩盒子模型。
* 设置显示文本的行数。
* 设置伸缩盒子元素的子元素排列方式（以上三个要一起使用）
* 设置文本溢出时，用省略符号来代表被裁剪的文本。
效果如下：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c97ff2a0883451399862618012be154~tplv-k3u1fbpfcp-watermark.image)

但这种方法缺点也很明显，只适用在`WebKit`内核的浏览器。

### 增加CSS选择器优先级
在平常开发中，会有不少几率遇到需要增加`CSS`选择器优先级的场景。如何实现才会更好，比如说需要增强下面这个`CSS`选择器优先级：
```css
.bar { background: #DDD; }
```
我相信不少人会选择增加嵌套的方法：
```css
.foo .bar { background: #DDD; }
```
或者选择增加一个标签选择器：
```css
div.bar{ background: #DDD; }
```
这些都不是最好的方法，因为上述方法会增加了耦合导致可维护性的降低，如果后续父节点类名更改了，或者换成不同的标签，都会影响到样式效果。

***最佳方法***  
* 重复选择器自身
```css
.bar.bar { background: #DDD; }
```
* 借助存在的属性选择器
```css
.bar[class] { background: #DDD; }
#bar[id] { background: #DDD; }
```
这样即提高了优先级，又不会增加耦合度。

### 全局调整盒模型
`box-sizing`的默认值是`content-box`，这意味着指定的宽高都只会设置内容盒子的大小。如果设置了内边距或者边框都会使该元素宽高大于指定的宽高值。最笨的办法就是减少`width`或`height`的值，这不是一个理想的办法，因为这是通过改值试出来的，而且往往难以解释这个值生成的原因。

设置`box-sizing`值为`border-box`，这样`height`和`width`属性会设置为内容、内边距以及边框的大小总和，这就解决了上述问题。
```css
.main{
    box-sizing: border-box
}
```
这样`main`元素就更好符合预期了，但其他元素还会遇到相同的事情。所以将其设置为全局
```css
*, 
::before,
::after{
    box-sizing: box;
}
```
这样就能给页面上所有元素与伪元素都设置`border-box`了。

但这样还是有些问题，现在很多业务都会使用带样式的第三方组件，就可能会因此破坏其中一些组件的布局，尤其是当第三方组件在开发`css`的过程中没有考虑到使用者会修改盒模型。

利用继承就能解决上述问题了：
```css
:root{
    box-sizing: border-box;
}

*, 
::before,
::after{
    box-sizing: inherit;
}
```
盒模型通常不会被继承，但使用`inherit`关键字会强制继承。可以在必要时选中第三方组件的顶级容器，将其恢复为`content-box`。这样组件的内部元素就会继承该盒模型:
```css
.third-component{
    box-sizing: content-box;
}
```

### hover伪类与延时实现下拉列表
实现一个鼠标经过按钮来展示下拉菜单的交互效果：
```html
<button class='btn'>菜单</button>
<ul class='panel'>
  <li class='panel-item'>苹果</li>
  <li class='panel-item'>葡萄</li>
  <li class='panel-item'>香蕉</li>
  <li class='panel-item'>橙子</li>
</ul>
```
目标是鼠标经过按钮时，下拉菜单展示。`css`代码很简单：
```css
.btn:hover + .panel, .panel:hover{
  visibility: visible
}
.panel{
  visibility: hidden;
  width: 100px;
  height: 200px;
  background: #DDD;
}
.panel-item{
  width: 100%;
  height: 50px;
  list-style: none;
  line-height: 50px;
}
```
然而上面的实现有一个小缺陷，如果按钮与菜单之间有空隙，鼠标还没移动到下拉框上时，下拉框就已经收起来了。借助`transition`增加延时效果就可以解决这个问题。

只需要在`.panel`增加如下属性即可:
```css
.panel{
	transition: visibility .2s;
}
```
效果图如下：
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae80e6b5b0cb45e59c4d1f1136297d90~tplv-k3u1fbpfcp-watermark.image)

### 使用视口单位定义字号
一般来说，构建响应式面板是使用媒体查询根据不同型号的屏幕尺寸，修改元素的字号就能渲染出不同大小的面板，当然前提是使用相对单位`em`或者`rem`。比如说:
```css
@media (min-width: 800px) {
    :root{
        font-size: 0.875em;
    }
}
@media (min-width: 1200px) {
    :root{
        font-size: 1em;
    }
}
```
根据给页面根元素设置不同字号，响应式地重新定义了整个页面的`em`和`rem`。但这属于硬编码的形式，只能响应设定的屏幕尺寸。

我们知道视口单位`vm`与`vh`是相对屏幕来说的，如果将视口单位用于设置字号，那比设置宽度还要实用
```css
font-size: 2vw;
```
设置上面属性会发生什么？当屏幕宽度为`1440px`时，字号就是`28.8px`了。在一个`1920px`的屏幕时，字号就变成了`38.4px`。这样做的好处就是元素能够在这两种大小之间平滑地过渡，不会在某个断点突然改变。

但还是有些问题， 常见的`1920px`屏幕中，`38.4px`的字号太大了。而在手机上比如`iPhone6`上就缩小到了`7.5px`，那就太小了。

使用`CSS`的`cal`c函数结合`em`和`vw`两个单位就能解决问题：
```css
:root{
    font-size: calc(0.5em + 1vw);
}
```
`0.5em`保证了最小字号，`1vw`则确保了字体能随着视口缩放。能保证基础字号从`iPhone6`里的`11.75px`一直过渡到`1200px`屏幕的`20px`。

### 占位符交互
具体效果：输入框处于聚焦状态时，输入框的占位符内容以动画形式移动到左上角作为标题。借助`:placeholder-shown`伪类就可以只用`CSS`实现这种效果。
```html
<div class="input-box">
   <input class="input-control input-outline" placeholder="账号">
   <label class="input-label">账号</label>
</div>
```
首先，让浏览器默认的`placeholder`效果不可见
```css
.input-control:placeholder-shown::placeholder {
    color: transparent;
}
```
第二，使用`.input-label`元素代替浏览器原声的占位符
```css
.input-box{
  position: relative;
}
.input-label {
  position: absolute;
  left: 16px; top: 14px;
  pointer-events: none;
}
```
最后，在输入框聚焦以及占位符不显示的时候对`<label>`元素进行重定位，效果是缩小并移动到上方
```css
.input-control:not(:placeholder-shown) ~ .input-label,
.input-control:focus ~ .input-label {
  color: #2486ff;
  transform: scale(0.75) translate(-2px, -32px);
}
```
效果如下：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14c27825a3f54e46b0a0bff4929fd555~tplv-k3u1fbpfcp-watermark.image)

### 使用mix-blend-mode混合元素
使用`mix-blend-mode`属性，不仅可以混合图片，还可以把元素的文本和边框与容器的背景图片混合在一起。

目标是在图片上添加标题：
```html
<div class='blend'>
  <h1>熊出没</h1>
</div>
```
为h1增加样式，最终效果为红色的纯背景通栏、亮灰色顶部和底部宽边框。然后应用融合混合模式，整个元素被视为一个图层，和下面的容器里的背景图片混合在一起。
```css
.blend{
  background-image: url('image');
  background-size: cover;
  background-position: center;
}
.blend > h1{
  mix-blend-mode: hard-light;
  background-color: #c33;
  color: #808080;
  border: 0.1em solid #ccc;
  border-width: 0.1em 0;
}
```
效果如下：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ff2c5c11e1340b5b94003345a385330~tplv-k3u1fbpfcp-watermark.image)
融合后的效果很有意思，文字看上去是透明的，就像是红色横幅被剪掉。这里使用`hard-light`混合模式和中灰色文字颜色。对比混合模式在使用很亮或很暗的颜色时才能有更好的效果。

