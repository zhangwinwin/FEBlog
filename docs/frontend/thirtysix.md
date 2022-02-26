---
title: 一个CSS实现引发的思考 
---

## 前言
**从业务中思考，从实现中进步。**

每次实现都思考的深入一点，每次都会进步一点，这就是学习的能力的体现！
## 这一切都要从一个CSS实现说起
这是一个比较常见的设计需求，具体请看下图：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b42512c350b4233975aa1a03caba099~tplv-k3u1fbpfcp-watermark.image)
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d7f231d56f8406aa781793acd332255~tplv-k3u1fbpfcp-watermark.image)
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb56ab75550f411098219c52d7d5ef08~tplv-k3u1fbpfcp-watermark.image)

实现思路也比较简单：
```html
<div class='radio-group'>
    <div class='radio-group-item radio-group-left'></div>
    <div class='radio-group-item radio-group-middle'></div>
    <div class='radio-group-item radio-group-right'></div>
</div>
```
* 首先将每一个`item`都设置:`border:1px solid rgba(217,217,217,1);`
* 接着将中间`middle`设置`border`的左右两边都为`none`:`border-left: none;border-right: none;`
* 点击时更换`border`属性:`border:1px solid rgba(24,144,255,1);`
* 当点击到中间`middle`时，设置`left`的:`border-right: none;`和`right`的:`border-left: none;`

当处理第四步：点击到中间`middle`，处理`left`的样式时：我才发现没有选择前面兄弟元素的选择器。
* `+`兄弟选择器只会匹配它后面第一个兄弟元素。
* `~`兄弟选择器只会匹配它后面的所有兄弟元素。

无论是`+`选择器还是`~`选择器，它们都只能选择后面的兄弟元素。

**为什么没有选择前面兄弟元素的选择器呢？**

### 浏览器渲染流程
这得从浏览器渲染流程说起。

这是渲染流程的主要结构：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb4b644ea8414c6a8e4043c3279cd266~tplv-k3u1fbpfcp-watermark.image)
渲染引擎将解析`HTML`文档，并将元素转换为`DOM`节点形成`DOM`树。与此同时，引擎将解析外部`CSS`文件和行内样式。接着将样式信息与`DOM`树结合生成一颗渲染树。

渲染树构建之后，它将经历`Layout、Painting`等过程。为每个节点提供在屏幕上显示的确切位置和在UI后端层绘画出每个节点。

重要的是，这是一个循序渐进的过程。为了获得更好的用户体验，渲染引擎会尽可能快的在屏幕上显示页面内容。所以它不会等所有的`HTML`解析完成后才开始构建和`Layout`渲染树。哪部分被解析完成就显示哪部分，哪怕其他部分还在网络传输中。

所以如果说`CSS`支持了选择前面兄弟元素的选择器，那只会有两种处理方法：
* 1、等待`LayoutTree`全部渲染完才能显示出页面，因为所谓“可以选择前面兄弟元素的选择器”的意思就是后面的元素能够影响前面的元素，所以必须等待后面的`DOM`元素合成完才能确定前面`DOM`元素的显示方式。所以说如果真的支持这种选择器，页面显示速度肯定是大大减少，白屏时间大大增加。

* 2、如果依然采用渲染到哪，显示到哪的方式渲染，那就必然会出现大量的重排、重绘操作。试想一下，前面的`DOM`元素已经确定如何显示了。接着后面的元素渲染完成时，却影响到了前面`DOM`显示，那不得重新安排走一遍渲染流水线吗。

由于上述原因，所以不支持前面兄弟元素的选择器，同样的道理，选择父元素的选择器也是不支持的。

### 我大意了，没有闪
在看翻阅资料的时候发现了一个伪类`:focus-within`，它可以影响父元素的样式！

`:focus-within`看起来与`:focus`伪类很像。的确如此，它们都是当元素在聚焦行为触发时才生效的。区别就在于：
* `:focus`伪类仅适用于焦点元素本身。
* `:focus-within`则表示一个元素获得焦点，或该元素的后代元素获得焦点。换句话说，元素自身或者它的某个后代匹配`:focus`伪类。（`shadow DOM` 树中的后代也包括在内）。

举个例子：
```html
/* 当<form>的某个后代获得焦点时，匹配<form>*/
form:focus-within {
  background: #ff8;
}
```
表单中的某个`<input>`字段获得焦点时，整个表单的`<form>`元素都可被高亮。

```html
<p>试试在这个表单中输入点什么。</p>

<form>
  <label for="given_name">Given Name:</label>
  <input id="given_name" type="text">
  <br>
  <label for="family_name">Family Name:</label>
  <input id="family_name" type="text">
</form>
```
```css
form {
  border: 1px solid;
  color: gray;
  padding: 4px;
}

form:focus-within {
  background: #ff8;
  color: black;
}

input {
  margin: 4px;
}
```
当form元素内的input没有聚焦行为触发时的样式
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/097069a2f92d4b159818d599e20f1957~tplv-k3u1fbpfcp-watermark.image)

当往input输入几个词时，form元素的样式改变了
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/34476b909aa4491bbe8d0e85efb4ccad~tplv-k3u1fbpfcp-watermark.image)

所以`:focus-within`伪类本质上是一种“父元素选择器”的行为，子元素的状态影响父元素的样式。  
**但**  
`:focus-within`伪类需要借助用户的行为才能触发，是属于“后渲染”的，不会与现有的渲染机制发生冲突。所以并不违反上面所说的。

这是`:focus-within`的适用范围：
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b171fa538db3437b999f531efebfec68~tplv-k3u1fbpfcp-watermark.image)
年轻“伪类”，你耗子尾汁！

## 结尾
如果觉得有帮助的请点点赞，支持一下。看了不点赞都是不讲武德。

