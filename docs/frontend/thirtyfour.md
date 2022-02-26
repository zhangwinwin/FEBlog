---
title: CSS居中的常用方式以及优缺点
---

## 前言
居中是页面开发中经常遇到的问题。

使用合适的、简单的、兼容性好的居中方式是我们页面仔在整个工作生涯中都要面对的问题。

## text-align:center
来看这个例子，一张图片和文字进行居中。如下图所示：  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/1726347baeb77762~tplv-t2oaga2asx-image.image' width='400'>  
`img`与文字内容都是行内元素，因此直接使用`text-align`就行了。代码如下图所示：
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172634982220dd6c~tplv-t2oaga2asx-image.image)  

在最外层的`div`中使用`text-align：center`的问题是，会导致所有的子元素都会继承这个属性。如果还有一段文字用作介绍该图片的作用时，这段文字也会被居中。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172635418cce4edd~tplv-t2oaga2asx-image.image' width='400'>  
而我们希望这段文字是左对齐的，就不得不单独设置其`text-align：left`属性，以覆盖其父元素的属性。并且如果还有更多的子元素也需要这样做，覆盖属性本身就是下策，因此要采用其他方法。

## margin: 0 auto
由于显示的图片可能是变化的，宽高是不定的，但显示区域是固定的，所以一般会显式地给图片设置一个宽高。这个时候知道宽度就可以设置`margin：0 auto`方法，左右的`margin`设置为`auto`，浏览器就会自动设置左右的`margin`值为容器剩余宽度的一半。  

<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172635b0f1330ade~tplv-t2oaga2asx-image.image' width=400>

使用`margin: 0 auto`可以说是最常用的左右居中的方法，不仅适用于块级元素也适用于行内元素。很多网页的布局都是使用`margin: 0 auto`，例如淘宝pc端，如下图所示：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172635d048be2096~tplv-t2oaga2asx-image.image)

## display: table-cell
第一个垂直居中的方法是借助`table-cell`属性，效果图如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172637d3c8cd6450~tplv-t2oaga2asx-image.image)

`table-cell`的一个好处就是它可以兼容到`IE8`。

`table-cell`属性的缺点：
* 容器的`margin`属性失效，因为`margin`不适用于表格布局。所以使用`margin: 0 auto`属性是不能使`container`左右居中的。解决的方法也很简单：只需要在`container`外层再多套一个div容器，然后设置这个外层容器的`margin: 0 auto`即可。
* 设置了`table-cell`的元素再设置宽高为百分比是不起作用的。常见的场景是要将宽度属性设置为外层容器宽度的100%，解决方法是将`container`的宽度设置成一个很大的值，例如`5000px`，这样就达到100%的目的。
* 如果`container`需要设置`position`为`absolute`，`table-cell`属性就会失效。因为设置`position: absolute`就会把元素`display`强制设置为`block`类型。解决办法还是在外层套一层`div`容器，将`position: absolute`属性作用于这个容器上。

## position: relative
上面所说`table-cell`的第三缺点的解决方法有一个副作用，就是设置内层`container`的`height`和`width`为百分比时会失效。由于这个原因，导致有一种情况不能使用`display：table-cell`垂直居中。

就是需要在页面弹出一个框，这个框的位置需要在当前屏幕中左右上下居中。这时候通常需要将这个框的`position`设置为`absolute`，这个时候`table-cell`就不能发挥作用了。

解决办法是使用`relative`定位，设置`top`为50%，将弹窗的起始位置放到页面中间，再设置`margin-top`为元素高度的负一半，这样使得弹窗在页面中间位置再往上移到一半自身的高度，这就正好在中间了，左右居中也可类似处理。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/1726392a98c63f04~tplv-t2oaga2asx-image.image)

使用此方法的缺点是需要知道具体的高度，无法根据内容长短自适应。

## tranform: translate
用`tranform`方法，将`margin-top`一个具体像素的负值改成`transform: translate(0, -50%)`，因为`translate`里面的百分比是根据元素本身的高度计算的，所以就可以达到自适应的效果。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172640f7ec0d8b85~tplv-t2oaga2asx-image.image)

这个办法十分方便，而且加上`-webkit-`前缀，可以兼容到IE9。

而`margin-top：-100px`与`transform：translate(0, -50%)`都有一个缺点，就是如果设置`left`为50%是借助`position`为`absolute`的话，可能会导致换行

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/1726415e43482bb1~tplv-t2oaga2asx-image.image)

本来应该是一行显式的`p`元素却换行了，这是因为在一个`relative`元素里面的`absolute`定位的子元素会通过行内元素换行的方式，尽可能不超过容器的边界。由于设置`left`为50%，导致`p`元素超了边界，所以就换行了，即使再设置`translate：-50%`也已经晚了。

## flex布局
`flex`布局十分容器和方便，只需在副容器设置3个属性就行了
```
.container{
    display: flex;
    align-items: center;
    justify-content: center;
}
```
但`flex`的缺点是不支持`IE`

## vertical-aligin:middle
`vertical-aligin:middle`主要是运用在行内元素中的。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172641f578769005~tplv-t2oaga2asx-image.image)

如果不做任何处理，那么默认的垂直居中是以`baseline`为基准的。

为了能够垂直居中，需要改变居中方式。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172642132490de66~tplv-t2oaga2asx-image.image)

要每个元素都要设置。

如果`container`的高度比图片要高，就会有留空的效果，如下：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/17264222c2aad92c~tplv-t2oaga2asx-image.image)

为了让中间的内容能够在`container`里上下居中，可以设置文字的`line-height`为`container`的高度，这样文字就上下居中了。由于图片与文字是垂直居中的，所以图片在`container`里也是上下居中了。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172642509661497d~tplv-t2oaga2asx-image.image)

也就是说，如果需要垂直居中一个`div`里的比`div`高度小的图片，可以添加一个元素，让它的`line-height`等于`div`的高度。下面使用伪元素`::before`来添加`line-height`。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172642ba21df757e~tplv-t2oaga2asx-image.image)

或者使用`display: inline-block`属性，加上`height: 100%`。这个方法兼容性更好。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/172642df00ad87db~tplv-t2oaga2asx-image.image)

## absolute与margin：auto
使用`absolute`定位与`margin：auto`方法也可以实现居中。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/1726432d25323f1b~tplv-t2oaga2asx-image.image)

如果图片比`container`大，这种方法就不适用了。因为有一个种比较常见的场景：图片有一边和`contianer`一样大，另一边按图片的比例缩放，图片居中显示，超出的截断。这种情况下，只需把`left/right/top/bottom`设置为一个很大的负值即可。

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/30/1726436fdd035a35~tplv-t2oaga2asx-image.image)

## 总结
以上就是`css`中常用的居中方法，如果有更好的方法可以在评论区留言教教我。

## 参考
本文参考以下资料
* [盘点8种CSS实现垂直居中水平居中的绝对定位居中技术](https://blog.csdn.net/freshlover/article/details/11579669)
* [六种实现元素水平居中](https://www.w3cplus.com/css/elements-horizontally-center-with-css.html)
* 高效前端：Web高效编程与优化实践
