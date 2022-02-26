---
title: 六种设计难题的CSS实用技巧！
---

## 前言
最近在恶补`css`的知识，看到《css揭秘》一书，如获至宝。下面节选一部分笔记。

## 一、扩大按钮的点击范围
对于哪些较小的、难以瞄准的控件来说，如果不能把它的视觉尺寸直接放大，将其可点击区域向外扩大也能大幅度提升用户体验。因为一个点来点去都点不到的按钮可不招人喜欢。

只要加上`cursor: pointer`这个简单的`css`属性，它能以视觉的方式来提示如何与之进行交互，也能试探它的交互范围有多大。  
<img src='https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d1962e311c34da29db1d6e6b892359a~tplv-k3u1fbpfcp-zoom-1.image'>
<img src='https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f39e359133d4610905e353184e03496~tplv-k3u1fbpfcp-zoom-1.image'>

### 解决方案一
最简单的方法就是设置一圈透明边框，因为鼠标对元素边框的交互也会触发鼠标事件的。
```css
border: 10px solid transparent;
```
上述代码就是将元素的边框扩大了`10px`，但是效果并不好，因为它同时让按钮变大了。
<img src='https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad95ab25e16b4ee6b53366cbf14f72c6~tplv-k3u1fbpfcp-zoom-1.image'>
<img src='https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4623bb487fe2477bbc7e270cbdf5e50d~tplv-k3u1fbpfcp-zoom-1.image'>

使用`border`的之所以会使按钮变大，是因为背景在默认的情况下会蔓延到边框的下层。这时使用`background-clip`属性将背景限制在原来区域的下层就行。
```css
border: 10px solid transparent;
background-clip: padding-box;
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bd749cec7094fb094a337c3e4dda77c~tplv-k3u1fbpfcp-zoom-1.image)

而且当按钮真正需要边框时，可以用`box-shadow`来模拟出边框
```css
border: 10px solid transparent;
box-shadow: 0 0 0 2px red inset;
background-clip: padding-box;
```
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f718a28be9d741ccbd13ed86b31bac37~tplv-k3u1fbpfcp-zoom-1.image)

perfect

### 解决方案二
不用边框，而是采用伪元素来代表宿主元素来影响鼠标交互。

可以在按钮的上层覆盖一层透明的比按钮大`10px`的伪元素。
```css
btn: {
	position: relative;
}
.btn::before{
	content: '';
  	position: absolute;
  	top: -10px;
  	right: -10px;
  	botttom: -10px;
  	left: -10px;
}
```
这个方法的好处是只要有一个伪元素可利用，就能发挥效果，也不会干扰到其他的`css`属性。

[codepen试一试](https://codepen.io/zhang_SUPER/pen/ExKqyav)

## 二、遮罩层
很多时候，需要通过一层半透明的遮罩层来把后面的一切遮挡住，来凸显某个特定的`UI`元素，吸引用户的注意。比如弹窗等。

这个效果最常见的方案是增加一个额外的`HTML`元素用于遮挡背景
```css
.overlay{
	position: fixed;
  	top: 0;
  	right: 0;
  	bottom: 0;
  	left: 0;
  	background: rgba(0,0,0, .8);
}
.dialog{
	position: absolute;
   	z-index: 1;
}
```
`.overlay`负责把这个关键元素背后的所以东西遮挡住，`.dialog`需要指定一个更高的`z-index`。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/643bc70aef2d406cbdc99af18df6005c~tplv-k3u1fbpfcp-zoom-1.image)
虽然这个方法很好，但是需要一个额外的`HTML`元素。


### 解决方案一
可以使用伪元素来替代额外的`HTML`元素
```css
body.overlay::before{
	position: fixed;
  	top: 0;
  	right: 0;
  	bottom: 0;
  	left: 0;
  	z-index: 1;
  	background: rgba(0,0,0, .8);
}
```
这个方案可以直接在`CSS`层达到遮罩层的效果，但还是有一些缺点：
* 如果`body`元素上已经有其他效果占用的`::before`伪元素
* 往往还需要`JavaScript`给`body`添加`overlay`类名

### 解决方案二
伪元素可以满足绝大多数遮罩层的需要，但对于一些简单的应用场景来说，可以利用`box-shadow`来达到这个效果。
```css
box-shadow: 0 0 0 999px rgab(0,0,0, .8);
```
`box-shadow`的扩张参数可以把元素的投影向各个方向延伸放大。就是生成一个巨大的投影，简单的实现遮罩层的效果。

但存在一个问题就是无法在较大的屏幕分辨率中正常工作（上述设置就无法在`2000px`以上的屏幕中正常工作）。要么就加大数字来缓解，要么换成视口单位。
```css
box-shadow: 0 0 0 50vmax rgab(0,0,0, .8);
```
由于投影是同时往四个方向中扩展的，所以设置为`50vmax`就能满足需求。

但缺点还是很明显：
* 由于使用视口单位，当页面滚动时，遮罩层的边缘会显示出来。除非加上`fixed`定位或者没有滚动
* 当使用一个独立的元素来实现遮罩层时，这个遮罩层还可以防止用户与页面其他元素发生交互，但`box-shadow`并没有这个能力。

### 解决方案三
如果是想凸显一个弹窗元素`<dialog\>`，而去实现一个遮罩层的话，`<dialog\>`它会自带一个遮罩层。借助`::backdrop`伪元素，这个原声的遮罩层也可以设置样式
```css
dialog::backdrop{
	background: rgba(0, 0 ,0, .8)
}
```

## 三、自定义下划线
尽管`CSS`有一个下划线属性`text-decoration: underline`，但这个属性非常简陋而且不能修改效果。

### 解决方案一
使用`border`属性
```css
{
	border-bottom: 1px solid gray;
   	text-decoration: none;
}
```
使用`border-bottom`模拟出来的下划线可以自定义颜色、线条宽度和线的形状。但是线与字之间的距离或者说空隙很大
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1538b426146c4a198cd7cbb6a87a6079~tplv-k3u1fbpfcp-zoom-1.image)

如果设置比较小的`line-height`，比如`line-height: .9`，距离的确能缩小，但又产生另一个问题：阻止正常的文本换行。

### 解决方案二
使用`background-image`属性
```css
background: linear-gradient(gray, gray) no-repeat;
background-size: 100% 1px;
background-position: 0 1.115em;
text-shadow: .05em 0 white, -0.05em  0 white;
```
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d45faa255fa34fa2b25890660ea1e88e~tplv-k3u1fbpfcp-zoom-1.image)

效果非常棒。也可以实现不同的线条类型：比如虚线下划线
```css
background: linear-gradient(90deg, gray 66%, transparent 0) repeat-x;
background-size: .2em 2px;
backgrond-position: 0 1em;
```
通过色标的百分比位置值来微调虚线的虚实比例，还可以通过background-size来改变虚线的疏密。
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5efb36ee1e954f3d9329abc6887c9762~tplv-k3u1fbpfcp-zoom-1.image)

[codepen试一试](https://codepen.io/zhang_SUPER/pen/oNxKLGa?editors=1100)


## 四、自适应内部元素
如果不给元素一个具体的`height`，它会自动适应其内容的高度。那`width`能不能设置成这样的行为呢？
比如，如下`html`代码
```html
<p>Some text</p>
<figure>
	<img src='adacatlace.jgp'>
    <figcaption>
    	The great Sir Adam Catlace was named after
        Countess Ada Lovelace, the first programmer
    </figcaption>
</figure>
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00f64ec933df4fe9bb9a40fb42eeb10b~tplv-k3u1fbpfcp-zoom-1.image)
在默认情况下，如上图所示，但系需求是这个`figure`元素能跟它包含的图片一样宽（尺寸往往不是固定的）而且是水平居中的。

比如说让`figure`元素浮动起来，这样就会得到正确的宽度，但这种方法的副作用非常明显，将布局模式都改变了。

### 解决方案
使用`min-content`属性
```css
figure{
	width: min-content;
   	margin: auto;
}
```
两行`css`代码就能完成。
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/974c5d17f1fa4b7da64badd8a83c32b0~tplv-k3u1fbpfcp-zoom-1.image)

`min-content`关键字将解析为这个容器内部最大的不可断元素的宽度————最宽的单词、图片或具有固定宽度的盒元素。

[codepen试一试](https://codepen.io/zhang_SUPER/pen/gOrVMNa?editors=1100)

## 五、紧贴底部的页脚
具有块级样式的页脚，怎么让它紧贴内容的下方呢？

假设页面的`HTML`结构如下:
```html
<header>
	<h1></h1>
</header>
<main>
...
</main>
<footer>
...
</footer>
```


### 解决方法
使用`flexbox`布局，首先对`body`元素设置`display: flex`，因为它是这三个元素的父元素，还需要设置`flex-flow: column`，否则子元素会被水平的排放在一行上。设置高度为`100vh`占满整个视口的高度。

页头和页脚的高度是由`main`来决定的，所有给`main`的`flex`属性指定一个大于`0`的值。
```css
body{
	height: 100vh;
	display: flex;
	flex-flow: column;
}
main{
	flex: 1;
}
```

## 六、根据兄弟元素的数量来设置样式
在某些场景下，需要根据兄弟元素的总数来为它们设置样式。最常见的场景就是，当一个列表不断延长的时候，通过隐藏控件或压缩控件等方式来节省屏幕空间，以此提升用户体验。

### 解决方案
1、只有一个列表项的特殊场景来说，使用`:only-child`伪类选择器。

当列表只有一个列表项时，把删除按钮隐藏起来，就需要`:only-child`选择器来完成
```css
li:only-child{
	background: red;
}
```
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a384319fb3141bd926b7b6fb521d2d9~tplv-k3u1fbpfcp-zoom-1.image)
`:only-chil`d等效于`:first-child:last-child`，因为第一项同时也是最后一项，那么它就是唯一的。

`:last-child`也是一个语法糖，它等价于`:nth-last-child(1)`。

2、列表正好包含四个列表项时，命中它的每一项
```css
li:first-child:nth-last-child(4),
li:first-child:nth-last-child(4) ~ li{
	background: red;
}
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7aa1e0a4c4d84534a0616bd5bcd333d4~tplv-k3u1fbpfcp-zoom-1.image)
当然拉，这部分代码还是十分繁琐的，可以利用`scss`预处理器来避免这个问题
```css
@mixin n-item($n) {
	&:first-child:nth-last-child(#{$n}),
	&:first-child:nth-last-child(#{$n}) ~ & {
    	@content
    }
}

li {
	@include n-item(4) {
    	// 具体样式写这里
    }
}
```

3、列表项的总数是4或者更多时，选中所有的列表项
```css
li:first-child:nth-last-child(n+4),
li:first-child:nth-last-child(n+4) ~ li{
	background: gray;
}
```
少于4个`li`元素时：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/411220a45dc44e1788dccb55555392f5~tplv-k3u1fbpfcp-zoom-1.image)

多于4个`li`元素时：
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab43c86791cb46d589e853f9af5ae716~tplv-k3u1fbpfcp-zoom-1.image)

4、同理，仅当列表中有4个或更少时，选中所有列表项
```css
li:first-child:nth-last-child(-n+4),
li:first-child:nth-last-child(-n+4) ~ li{
	background: yellow;
}
```
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/64dcf24a91084816a1faee71ee46df0a~tplv-k3u1fbpfcp-zoom-1.image)

5、列表包含2~6个列表项时命中所有列表项
```css
li:first-child:nth-last-child(n+2):nth-last-child(-n+6),
li:first-child:nth-last-child(n+2):nth-last-child(-n+6) ~ li{
	background: #456789;
}
```
大于6个：
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8085f5e1cd134fb4b08c6db60c89b9bf~tplv-k3u1fbpfcp-zoom-1.image)

大于等于2个，少于等于6个：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bb9ec91c9cc41ea933ed2475737d09f~tplv-k3u1fbpfcp-zoom-1.image)

少于2个：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fcfb11d904ad474fba899861b19c6007~tplv-k3u1fbpfcp-zoom-1.image)

[codepen试一试](https://codepen.io/zhang_SUPER/pen/abNeZPa)

参考：
>《css揭秘》  
