---
title: (二)viewing变换及其数学基础
---

## 前言
变换在图形学中有两个：
* 一种就是[上一篇文章](https://juejin.cn/post/6950819358645944351)说的`modeling`变换。
* 还有一种就是接下来说的`viewing`变换。

`Viewing`变换也包含两种:
* 视图/摄像机变换
* 投影变换

## Viewing
### 视图变换
首先模型不能像“问题”，不能每个人看到的都不一样。所以要先定义好一个场景需要怎么展示。要回答这个问题就要思考一下现实中是怎么样拍一张照片。
* 第一：找一个好地方，把大家或者物体摆好`pose`（这一步也就是模型变换）
* 第二：找一个好的角度用放置好照相机，并让相机往某个方向看（这一步就是视图变换）
* 最后：“茄子”（这一步就是投影变换）
在图形学中也是经过这三个步骤将图形展示到屏幕上的。

视图变换就是找角度摆照相机的过程。联想到现实中，就是如何摆放一个照相机？
* 很明显位置是非常重要的，所以第一步就是定义好位置-`position`(用$\vec e$表示)
* 相机照向哪里也是决定成像的因数，第二步定义相机看向哪里-`look-at`(用$\vec g$表示)
* 还得定义相机的向上方向，因为如果相机旋转的话，拍出来肯定会有差异，所以定义好向上方向就能把相机固定住(用$\vec t$表示)。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4868bd0a20aa4b36870121e44dc70a7a~tplv-k3u1fbpfcp-watermark.image)

下一步就是如何去进行视图变换，首先根据初中的“相对运动”物理知识，只要相机与物体的距离，角度等都不发生变化，照出来的图片一定是一样的。不管相机与物体是否发生移动。所以为了让操作简化，大家约定俗成的就是**相机永远放置在原点，y轴永远是向上方向，相机永远看向-z方向。进行变换的永远是物体**
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a602760aed94ea6b44cf19ec410bb63~tplv-k3u1fbpfcp-watermark.image)

所以视图变换就是将照相机从当前点变换到原点的变换
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/507b2372171041a7bbf4e2f9c42e16ea~tplv-k3u1fbpfcp-watermark.image)
* 首先，将位置$\vec e$移动的原点
* 第二，将观察的方向$\vec g$旋转到`-z`方向上
* 第三，将向上方向$\vec t$旋转到`y`方向上
* 那$\vec g$ x $\vec t$方向自然而然的就会旋转到`x`方向上
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee1f7d0660404f75bce7c0984d936034~tplv-k3u1fbpfcp-watermark.image)

用上一篇文章中学到过的矩阵知识，把上述过程写成变换矩阵$M_{view} = R_{view}T_{view}$。注意顺序，先平移后旋转。

平移到原点，自然得是减去位置值($x_e, y_e, z_e$)：$T_{view}$ = $$\begin{bmatrix}
{1}&{0}&{0}&{-x_{e}}\\
{0}&{1}&{0}&{-y_{e}}\\
{0}&{0}&{1}&{-z_{e}}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

接下来就是旋转矩阵，将$\vec g$旋转到`-z`，$\vec t$旋转到`y`，$\vec g$ x $\vec t$旋转到`x`。但是把任意轴旋转到规范轴，比如说到`-z（0，0，-1）`非常困难，但反过来写却相对容易：比如将`x（1，0，0）`旋转到$\vec g$ x $\vec t$。也就是说正着旋转不好求，但可以求逆变换。  
1、首先确定一下这个逆变换矩阵的形式$R_{view}^{-1}$ = $$\begin{bmatrix}
{a}&{b}&{c}&{0}\\
{d}&{e}&{f}&{0}\\
{f}&{h}&{i}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$，所以是要求这a-i的这几个变量。

2、第一步将x轴（1,0,0)旋转到$\vec g$ x $\vec t$。在齐次坐标里，`x`轴向量表示为$$\begin{bmatrix}
{1}\\
{0}\\
{0}\\
{0}\\
\end{bmatrix}$$，最后一位是0。可以求出$R_{view}^{-1}$ = $$\begin{bmatrix}
{x_{\vec g x \vec t}}&{b}&{c}&{0}\\
{y_{\vec g x \vec t}}&{e}&{f}&{0}\\
{z_{\vec g x \vec t}}&{h}&{i}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

3、第二步将`y`轴(0,1,0)旋转到$\vec t$中，可以得出$R_{view}^{-1}$ = $$\begin{bmatrix}
{x_{\vec g x \vec t}}&{x_{\vec t}}&{c}&{0}\\
{y_{\vec g x \vec t}}&{y_{\vec t}}&{f}&{0}\\
{z_{\vec g x \vec t}}&{z_{\vec t}}&{i}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

4、第三步将`z`轴(0,0,1)旋转到-$\vec g$，同理$R_{view}^{-1}$ = $$\begin{bmatrix}
{x_{\vec g x \vec t}}&{x_{\vec t}}&{x_{\vec {-g}}}&{0}\\
{y_{\vec g x \vec t}}&{y_{\vec t}}&{y_{\vec {-g}}}&{0}\\
{z_{\vec g x \vec t}}&{z_{\vec t}}&{z_{\vec {-g}}}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

5、旋转矩阵是正交矩阵，所以求逆变换就是其转秩。$R_{view}^{-1}$ -> $R_{view}$，得出$R_{view}$ = $$\begin{bmatrix}
{x_{\vec g x \vec t}}&{y_{\vec g x \vec t}}&{z_{\vec g x \vec t}}&{0}\\
{x_{\vec t}}&{y_{\vec t}}&{z_{\vec t}}&{0}\\
{x_{\vec {-g}}}&{y_{\vec {-g}}}&{z_{\vec {-g}}}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

### 投影变换
人已经摆好`pose`，相机也已经准备就绪了。所以接下来就是拍照了！拍照就是将三维的物体变成二维的一张照片，这个过程就是投影。

投影变换有两个模式：
* 正交投影
* 透视投影
这两种投影的本质区别就是是否有“近大远小”的性质。有这种性质就是透视投影，否则就是正交投影。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/154e830bed194878bc1bfc7e15e4195b~tplv-k3u1fbpfcp-watermark.image)

如图所示：  
左边为透视投影：认为摄像机放置在一个点上，从摄像机出发连出一个四棱锥，从四棱锥中某个深度到另外一个深度的这块区域，把这片区域所有东西都显示到近处的平面上。

右边为正交投影：假设摄像机在无限远的地方，形成区域的近处平面与远处平面是大小一致的。

#### 正交投影
正交投影比较简单，只需要将区域中的物体压扁在近处的平面上就行了。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7c02c85e2e94a8b99f5a6eac43bdf49~tplv-k3u1fbpfcp-watermark.image)
如图所示：
* 将摄像机放置到原点，看向`-Z`方向，向上方向为`y`轴方向。
* 对比正交投影来说，将物体压扁的操作只需把z轴坐标放弃掉就行
* 然后将所有物体移动和缩放在[-1, 1]的矩形框中。

在图形学中，先定义一个立方体。立方体的左`（l）`右`(r)`在`x`轴上，上`(t)`下`(r)`在`y`轴上，远`(f)`近`(n)`在`z`轴上。然后将这个立方体通过平移和缩放变换到原点的$[-1, 1]^3$，这是一个正则、规范、标准的立方体。也就是说不管什么样的立方体，都能变换成这个标准的立方体。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cb36896078e4f8c9335823cf9e8b3db~tplv-k3u1fbpfcp-watermark.image)

仔细看远和近，上面说到摄像机是看向`-z`方向的。所以说一个面离得远，`z`值是更小的。相反一个面离的近说明`z`值反而是更大的。所以说`f`是小于`n`的。

用矩阵的方式将上述变换写出来。  
1、首先将这个立方体的中心点平移到原点。中心点也就是左和右的中心$\frac{r+l}{2}$，上和下的中心$\frac{t+b}{2}$，远和近的中心$\frac{n+f}{2}$。所以能得出$M_t$ = $$\begin{bmatrix}
{1}&{0}&{0}&{-\frac{r+l}{2}}\\
{0}&{1}&{0}&{-\frac{t+b}{2}}\\
{0}&{0}&{1}&{-\frac{n+f}{2}}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

2、然后通过`scale`变换将立方体缩放为$[-1, 1]^3$，也就是把这个立方体的边长都变成2，因为[-1,1]。左和右$\frac{2}{r-l}$，上和下$\frac{2}{t-b}$，远和近$\frac{2}{n-f}$。所以是$M_s$ = $$\begin{bmatrix}
{\frac{2}{r-l}}&{0}&{0}&{0}\\
{0}&{\frac{2}{t-b}}&{0}&{0}\\
{0}&{0}&{\frac{2}{n-f}}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

3、最后得出$M_ortho = M_s M_t$

### 透视投影
透视投影是图形学中用的最广泛的投影，满足“近大远小”这个性质的投影就是透视投影。

一般认为把摄像机放置在一个点上，从摄像机出发连出一个四棱锥，从四棱锥中某个深度到另外一个深度的这块区域，把这片区域所有东西都显示到近处的平面上就叫做透视投影。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4702e8a3bfe84267b9438f1c64f0e55d~tplv-k3u1fbpfcp-watermark.image)
与正交投影一样，也定义近与远（`n`和`f`）两个面。如图所示，透视投影也就是将远处面上的点变换在近面上的点。通过将两点连线可以直观的看出点变换的规律。可以将透视投影分为两个步骤：
* 首先，将远面通过缩放变换将其变换与近面一样大小的面，将透视投影变为正交投影
* 第二，进行正交投影
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae853ad8320343ef8b59539ff97b511f~tplv-k3u1fbpfcp-watermark.image)

从侧面看
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6838e621bca14d89abc345b9a84bc3f7~tplv-k3u1fbpfcp-watermark.image)
左边点就是相机摆放位置，向上方向是`y`，看向`-z`方向。直观的看出$y^{'}$ = $\frac{n}{z}$y，因为相似三角形的性质。

同理求得$x^{'}$ = $\frac{n}{z}$x，剩下$z$还不清楚。那么写成齐次坐标的形式$$\begin{bmatrix}
{x}\\
{y}\\
{z}\\
{1}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{nx/z}\\
{ny/z}\\
{?}\\
{1}\\
\end{bmatrix}$$。

回顾一下上一篇文章的内容，在齐次坐标中$$\begin{bmatrix}
{x}\\
{y}\\
{z}\\
{1}\\
\end{bmatrix}$$表示的是空间中的一个点，然后将其中的x,y,z,1都乘上一个相同的数k(k不等于0)仍然表示相同的点。那么将$$\begin{bmatrix}
{nx/z}\\
{ny/z}\\
{?}\\
{1}\\
\end{bmatrix}$$乘上`z`得到的仍然是相同的点$$\begin{bmatrix}
{nx}\\
{ny}\\
{?}\\
{z}\\
\end{bmatrix}$$。根据这个性质，我们可以推倒出变换矩阵$M_{persp->ortho}$ = $$\begin{bmatrix}
{n}&{0}&{0}&{0}\\
{0}&{n}&{0}&{0}\\
{?}&{?}&{?}&{?}\\
{0}&{0}&{1}&{0}\\
\end{bmatrix}$$

那么`z`到底是怎么变换？上面说透视投影是将远面挤压成和近面一样的大小，所以能得出两个结论
* 在近面上的所有点经过变换后都不会变换
* 在远面上点中的z经过变换后也不会发生变换
根据第一点性质近面上的点经过变换后$$\begin{bmatrix}
{x}\\
{y}\\
{n}\\
{1}\\
\end{bmatrix}$$（为啥是n？因为近面上z轴的值为n） = $$\begin{bmatrix}
{nx}\\
{ny}\\
{n^{2}}\\
{n}\\
\end{bmatrix}$$，那么矩阵的第三行一定是(0 0 A B)。也就是说(0 0 A B)$$\begin{bmatrix}
{x}\\
{y}\\
{n}\\
{1}\\
\end{bmatrix}$$ = $n^2$ => An + B = $n^2$

根据第二个性质，取远面的中心点z，也就是$$\begin{bmatrix}
{0}\\
{0}\\
{z}\\
{1}\\
\end{bmatrix}$$，经过变换后还是一样的点，表示为$$\begin{bmatrix}
{0}\\
{0}\\
{f^{2}}\\
{f}\\
\end{bmatrix}$$ => Af + B = $f^2$

结合这两个展开式
$$\begin{cases}
An + B = n^2\\
Af + B = f^2\\
$$
可以求到A、B的值
$$\begin{cases}
A = n + f\\
B = -nf\\
$$

最终得出$M_{persp->ortho}$ = $$\begin{bmatrix}
{n}&{0}&{0}&{0}\\
{0}&{n}&{0}&{0}\\
{0}&{0}&{n+f}&{-nf}\\
{0}&{0}&{1}&{0}\\
\end{bmatrix}$$

然后透视投影的矩阵$M_{persp} = M_{ortho}M_{persp->ortho}$

到这里viewing变换已经讲清楚了！
