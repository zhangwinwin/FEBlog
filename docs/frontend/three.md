---
title: 从输入URL到页面展示(二)
---

## 前言
从[上篇](https://juejin.im/post/6844904025121521678)中了解到从输入URL到页面展示要经历的几个阶段：  
* 用户输入  
* 网络请求过程
* 响应数据类型处理
* 准备渲染进程
* 提交文档

这篇着重讲解后续的渲染阶段。

## HTML、CSS与JavaScript  
**HTML**（超文本标记语言——HyperText Markup Language）是构成 Web 世界的一砖一瓦。它定义了网页内容的含义和结构。如果需要改变 HTML 的字体颜色、大小等信息，就需要用到 CSS。  
**CSS** (层叠样式表--Cascading Style Sheet），是一种 样式表 语言，用来描述 HTML 或 XML文档的呈现。CSS描述了在屏幕、纸质、音频等其它媒体上的元素应该如何被渲染的问题。  
**JavaScript**则是可以用于修改HTML与CSS的脚本语言。  
而渲染阶段就是将这三者经过中间渲染模块的处理，最终输出为屏幕上的像素。  

## 渲染流水线
大致的渲染流水线如图所示：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/30/16f56cb5e00a1637~tplv-t2oaga2asx-image.image' width='600'/>  
按照渲染的时间顺序，流水线可分为如下几个子阶段：构建 DOM树、样式计算、布局阶段、分层、绘制、分块、光栅化和合成。  
在每个子阶段中：  
* 每个子阶段都有其输入的内容
* 每个子阶段都有其处理过程  
* 每个子阶段都会生成输出内容

## 构建DOM树
由于浏览器无法识别HTML，所以得将HTML转化为浏览器能够识别的结构——DOM树。
```
<html>
    <head>
        <title>文档标题</title>
    </head>
    <body>
        <a href=“”>我的链接</a>
        <h1>我的标题</h1>
    </body>
</html>
```
比如上面的HTML经过HTML解释器后转化为下图所示的DOM树结:  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/30/16f573e5280b9cfa~tplv-t2oaga2asx-image.image' width='600'>  
在chrome的开发者工具中能更清晰的看到DOM结构。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/30/16f5743da63cf49a~tplv-t2oaga2asx-image.image' width='600'>  
图中的document就是DOM结构，你可以看到，DOM和HTML内容几乎是一样的，但是和HTML不同的是DOM是保存在内存中树状结构，可以通过JavaScript来查询或修改其内容。  
比如在id为juejin的div中添加一个p标签。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/30/16f5748da131bbfe~tplv-t2oaga2asx-image.image' width='600'>  

## 样式计算
样式计算的目的是为了计算每个DOM节点的具体样式。  
**1、构建CSSOM**  
与HTML一样，浏览器无法识别CSS样式，所以也会进行一个转换操作，将CSS样式转为浏览器能够识别的结构———styleSheets。  
CSS来源主要有三种：  
* 通过link引用的外部CSS文件  
* style标签内的CSS   
* 元素的style属性内嵌的CSS  

在chrome的开发者工具中能更清晰的看到styleSheets结构。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/31/16f5b4bba18ebf61~tplv-t2oaga2asx-image.image' width='600'>  

**2、转换样式表中的属性值，使其标准化**  
很多时候我们都会写一些CSS高级属性，比如：  
```

body { font-size: 2em }
p {color:blue;}
span  {display: none}
div {font-weight: bold}
div  p {color:green;}
div {color:red; }
```
图中的em、blue等都不容易被浏览器识别，所以得把它们转化为标准的计算值。     
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/31/16f5b4ed40355f98~tplv-t2oaga2asx-image.image' width='600'>  

**3、计算出 DOM 树中每个节点的具体样式**  
接下来就要计算DOM树中的每个节点的具体样式。这就到了CSS继承与层叠规则出手。  
首先，CSS继承：当元素的一个继承属性 （inherited property）没有指定值时，则取父元素的同属性的计算值 computed value。  
继承属性的一个典型例子就是 color 属性。给出以下样式规则： 
```
p { color: green; }
```
若将其应用在下面这段 HTML 代码上…  
```
<p>This paragraph has <em>emphasized text</em> in it.</p>
```
文本 "emphasized text" 就会呈现为绿色，因为 em 元素继承了 p 元素 color 属性的值，而没有获取 color 属性的初始值（这个 color 值用于页面没有指定 color 时的根元素）。  

然后接着是**层叠规则**：层叠是CSS的一个基本特征，它是一个定义了如何合并来自多个源的属性值的算法。它在CSS处于核心地位，CSS的全称层叠样式表正是强调了这一点。  

哪些CSS实体会参与层叠计算？  
只有CSS声明，就是属性名值对，会参与层叠计算。这表示包含CSS声明以外实体的@规则不参与层叠计算，比如包含描述符（descriptors）的@font-face。  

## 布局运算
现在有了DOM树与DOM树中的样式，但这还不足以显现页面。还需要知道DOM树中每个节点的几何位置。  
Chrome 在布局阶段需要完成两个任务：创建布局树和布局计算。  

**1、创建布局树**  
在DOM树中有很多元素标签是不可见的。比如head标签，使用display：none的元素。所以还得构建可见的布局树  
* 遍历 DOM 树中的所有可见节点，并把这些节点加到布局中；  
* 而不可见的节点会被布局树忽略掉，如 head 标签下面的全部内容，再比如 body.p.span 这个元素，因为它的属性包含 dispaly:none，所以这个元素也没有被包进布局树。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/12/31/16f5b5f27801ea18~tplv-t2oaga2asx-image.image' width='600'>

**2、布局计算**     
接下来计算布局树节点的坐标位置。  

**未完待续**
