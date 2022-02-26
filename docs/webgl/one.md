---
title: (一)模型变换及其数学基础
---
 
## 前言
最近在学习计算机图形学的知识，为学习WebGL打下基础，下面是闫令琪老师的《现代计算机图形学入门》课程的笔记+自己的总结与感悟。

变换在WebGL中一般是分为两种：
* Modeling--模型变换
* Viewing--视图变换
举几个模型变换的例子：  
1、比如在一个静态模型中，摄像机在移动
![translation.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5d1ab67025a4d0a9d0a270b18ef9c6a~tplv-k3u1fbpfcp-watermark.image)
2、又比如一个机器人模型在跳舞
![2021-04-03 11_06_00.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cfae28582a848dda4394a4263de5f26~tplv-k3u1fbpfcp-watermark.image)

而视图变换的一个重要例子就是投影，如图所示：在人眼的地方放一个摄像机，然后拍一张照片，就将三维的场景变成二维的照片，这中间发生的过程从三维到二维的变换就是投影。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78f2752e145f4876bb72130882b40669~tplv-k3u1fbpfcp-watermark.image)

这其中涉及的原理需要线性代数一些数学知识。线性代数是高等数学的一部分，它的研究对象是向量和矩阵。接下来说一说WebGL是怎么和向量、矩阵关联在一起的。

## 线性变换
### 线性空间
首先WebGL是一个用来在Web中生成三维图形效果的应用API。三维图形当然是在三维空间中活动的，也就是我们最熟悉并生活在其中的空间。

那么问题来了：什么是空间，或者说空间的定义是什么？，从数学上来讲，大致是“空间是一个定义某些概念，具有某些性质的集合“。比如说一个线性空间定义了范数，就形成了赋范线性空间。

那么空间的特点有什么呢？比如说三维空间里：
* 由很多个位置点组成的
* 在空间中可以定义长度、角度和方向等这些概念
* 空间可以存在运动（变换），也就是一个点到另一个点的移动（不是微积分意义上连续的运动）
* ...
其中最重要的就是第三点：空间存在运动（变换），毫不夸张的说这就是空间的本质。所以不管是三维空间，还是其他空间，都必须存在和支持符合规则的运动（变换）。比如说线性空间存在着线性变换，拓扑空间存在拓扑变换。这些变换就是对应空间中允许的运动。

所以简单来说空间是一个存在运动的集合，而变换则规定了对应空间的运动。

线性空间也是一个空间，当然也是一个对象集合，而且**线性空间中的任何一个对象，都可以通过选取基和坐标的方式，表达为向量的的形式**。所以向量很是厉害，只要找到合适的基，向量可以表示线性空间里任何一个对象。

这句话怎么理解呢，我们从一片空白开始：  
随便选取一个点作为原点，以此原点作两个单位正交的向量（先从二维空间开始）
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2cf35bd1d1044faab53664412ea9d4b2~tplv-k3u1fbpfcp-watermark.image)
所以在平面上某个点，可以这样表示：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b5db975cda3426590ec648279080762~tplv-k3u1fbpfcp-watermark.image)

所以整个二维平面上的点，显然都可以通过$ai + bj$的方式来表示。用数学的语言就是整个二维平面是$i, j$所张成的线性空间。例如：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4ea5f6ed0f774407bc3256bdb038f917~tplv-k3u1fbpfcp-watermark.image)

如果$i, j$不正交，长度也不相等，依然张成整个二维空间，只是网格有所不同
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/93cd1a0e62594693a3425b960ca3c911~tplv-k3u1fbpfcp-watermark.image)

这就有了很大的启发。举个例子，比如说接下来要说的旋转变换$T_{rotate} \vec x = \vec x'$  
变换前：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71180e9c168d4d70a37adc0cce547ebb~tplv-k3u1fbpfcp-watermark.image)
变换后：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bba113fdebaa414b8e32a8707b864f95~tplv-k3u1fbpfcp-watermark.image)
在整个变换过程中$\vec x$以$\vec i, \vec j$为基的坐标并没有发生变换。而是$\vec i, \vec j$这两个基发生了旋转，导致$\vec x$发生了变换。  
也就是说$\vec x = 2\hat i + 2\hat j$，经过变换后$\vec x' = 2\hat i_t + 2\hat j_t$而将变换后的基在原来的基上表示为$\hat i_t$ = $$\begin{bmatrix}
{0}\\
{1}\\
\end{bmatrix}$$，$\hat j_t$ = $$\begin{bmatrix}
{-1}\\
{0}\\
\end{bmatrix}$$，所以经过变换后得到新的向量为$\vec x' =$2$$\begin{bmatrix}
{0}\\
{1}\\
\end{bmatrix}$$ + 2$$\begin{bmatrix}
{-1}\\
{0}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{-2}\\
{2}\\
\end{bmatrix}$$。将$\hat i_t$和$\hat j_t$放在一起变成一个2 x 2的矩阵$$\begin{bmatrix}
{0}&{-1}\\
{1}&{0}\\
\end{bmatrix}$$其实就是[$\hat i_t$, $\hat j_t$] = $T_{rotate}$。


所以$T_{rotate}$实际上是改变了基，其中$\vec x = a\vec i + b\vec j, \vec x' = a\vec i' + b\vec j'$，通过$T_{rotate}$把$\vec i — \vec i', \vec j — \vec j'$

$T_{rotate}$就是空间中的运动描述，表述为一个矩阵。  

**所以说，在线性空间中，当选定一组基后，不仅可以用向量来描述空间中的对象，而且还能用矩阵描述该空间的任何一个运动（变换）。而使某个对象发生对应运动的方法，就是用代表运动的矩阵，乘以表示对象的向量。**

这就是学习WebGL要先学习向量和矩阵的原因。

### 向量
线性代数中最基础、最根源的组成部分就是向量。  
向量是高中的数学知识，相信大家都学习过，这里不再啰嗦，只帮大家回忆一下知识。

**1、向量**：既有大小又有方向的量，记为$\vec {AB}$或者$\vec a$，在物理上由称为矢量。向量常用有向线段来表示，但也不能说向量就是有向线段，因为向量是“自由的”，可以平移等；而有向线段有固定的起点和终点，不能随便移动。

**2、向量的模**：向量的大小又叫向量的模，指的是：向量的有向线段的长度。记为:$|\vec {AB}|$或者$|\vec a|$。向量本身不能比大小，只有向量的模才能比大小。

**3、零向量**：模为0的向量叫零向量，记为$\vec 0$，零向量的特点是方向是任意的，也就是说与所有向量都平行

**4、单位向量**：模为1个单位长度的非零向量叫单位向量，比如在二维坐标系中，指向正右方的称为$\hat i$，指向正上方的称为$\hat j$。$\hat i$和$\hat j$被称为二维坐标系的基。

**5、向量的表示**：根据这两个特殊的基向量构成的坐标系中任一向量$\vec a$都可以表示为$\vec a = x\vec i + y\vec j = $ $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$，此时$|\vec a| = \sqrt {x^2 + y^2} sin\theta$。记住每当用数字描述向量时，它都依赖于正在使用的基。

#### 向量的线性运算
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0dedc03ca9434db3a42603712f31c250~tplv-k3u1fbpfcp-watermark.image)
**1、向量加法**：  
从图中可以得出: $\vec u + \vec v = \vec w = (u_x + v_x, u_y + v_y)$

**2、向量减法**：  
举一反三，减法如下：$\vec u = \vec w - \vec v = (w_x - v_x, w_y - v_y)$

向量的加减法的运算法则：
* 三角形法则
* 平行四边形法则

**3、向量点乘**  
* 已知两个非零向量$\vec a$与$\vec b$和它们的夹角$\theta$，则$\vec a * \vec b = |\vec a| * |\vec b| cos\theta $。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8a9b2572c5d4eafadf23485e5fec009~tplv-k3u1fbpfcp-watermark.image)
证明，利用余弦定理：$|\vec C|^2 = |\vec A|^2 + |\vec B|^2 - 2|A||B|cos \theta$  
另外有：$|\vec C|^2 = \vec C * \vec C = (\vec A - \vec B) * (\vec A - \vec B) = \vec A * \vec A + \vec B * \vec B - 2\vec A * \vec B$  
比较两式可得：$\vec A * \vec B = |\vec A||\vec B|cos\theta$
* 符合交换律、分配律，不符合结合律
* 当角度为90度时，两个向量的点乘为0，这两个向量正交。

向量点乘在笛卡尔坐标系中定义就更加简单: 对应元素相乘相加$\vec a * \vec b = \sum{x_i y_i}$。比如两个向量$\vec a$与$\vec b$：   
1、在二维里，$\vec a * \vec b$ = $$\begin{bmatrix}
{x_a}\\
{y_a}\\
\end{bmatrix}$$ * $$\begin{bmatrix}
{x_b}\\
{y_b}\\
\end{bmatrix}$$ = $x_ax_b + y_ay_b$  
2、在三维里，$\vec a * \vec b$ = $$\begin{bmatrix}
{x_a}\\
{y_a}\\
{z_a}\\
\end{bmatrix}$$ * $$\begin{bmatrix}
{x_b}\\
{y_b}\\
{z_b}\\
\end{bmatrix}$$ = $x_ax_b + y_ay_b + z_az_b$

点乘的意义在图形学中有两个重要的作用：
* 找到两个向量间的夹角或者余弦夹角
* 得出一个向量在另一个向量中的投影

比如，有一束光垂直着向量$\vec a$照射，向量$\vec b$自然会在得出一个阴影在向量$\vec a$上，这就是$\vec b$在$\vec a$上的投影
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9898fbce2fc34f089be6bcb107ec772f~tplv-k3u1fbpfcp-watermark.image)
如图所示，怎么计算这个$\vec b$在$\vec a$上的投影-称为$\vec {b_{\tau}}$(图中的符号打不出来），看图可以得出以下几个结论：
* $\vec {b_{\tau}}$的方向一定和$\vec a$是一样的
* 用a表示$\vec a$单位向量，那么$\vec {b_{\tau}} = ka$
* $\vec {b_{\tau}}$与$\vec b$组成一个直角三角型
根据上述结论可以得出：$k = |\vec {b_{\tau}}| = |\vec b|cos\theta$，又由于$cos \theta = \frac{\vec a * \vec b}{|\vec a| * |\vec b|}$  
得出$k = \frac{\vec a * \vec b}{|\vec a|}$

点乘还能给出一个很重要的信息，两向量的方向信息
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1990155a441644729777a97a438d6d77~tplv-k3u1fbpfcp-watermark.image)
如图所示，以向量$\vec a$为起点，形成一个圆，这个圆分为两部分：上半部分与下半部分。向量$\vec b$的是落在上半部分的，就可以说向量$\vec a$和向量$\vec b$算是方向基本一致。否则如向量$\vec c$与向量$\vec a$方向基本相反。这就是点乘可以告诉的信息。


**4、向量叉乘**  
这种乘法的计算结果是一个向量：$\vec a$ x $\vec b = \vec c$，向量$\vec c$的大小是$|\vec c| = |\vec a||\vec b| sin \theta$，向量$\vec c$的方向则是由“右手法则”规定：右手的四个手指指向向量$\vec a$，然后四指弯曲向第二个向量$\vec b$的方向，大拇指方向就是向量$\vec c$的方向。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/44d27f99dd1c46bc97b1fb8e6b016560~tplv-k3u1fbpfcp-watermark.image)
应用这个定则会发现，$\vec a$ x $\vec b$正好与$\vec b$ x $\vec a$方向相反，所以向量的叉乘并不满足交换律。

向量叉乘可以建立三维空间中的直角坐标系。比如说给定x轴与y轴，用x轴叉乘y轴就能得到x轴。举一反三用y轴叉乘z轴就能得到x轴
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b760952e51f442928bdac526d9f9b68e~tplv-k3u1fbpfcp-watermark.image)

向量叉乘也可以用代数表示，如果向量$\vec a =$ $$\begin{bmatrix}
{x_a}\\
{y_a}\\
{z_a}\\
\end{bmatrix}$$， 向量$\vec b =$ $$\begin{bmatrix}
{x_b}\\
{y_b}\\
{z_b}\\
\end{bmatrix}$$，那么$\vec a$ x $\vec b =$ $$\begin{bmatrix}
{y_az_b - y_bz_a}\\
{z_ax_b - x_az_b}\\
{x_ay_b - y_ax_b}\\
\end{bmatrix}$$ = $A * \vec b$ = $$\begin{bmatrix}
{0}&{-z_a}&{y_a}\\
{z_a}&{0}&{-x_a}\\
{-y_a}&{x_a}&{0}\\
\end{bmatrix}$$ $$\begin{bmatrix}
{x_b}\\
{y_b}\\
{z_b}\\
\end{bmatrix}$$

**叉乘在图形学的作用**
* 判定左和右
* 判定内与外
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33adc32fcefb406392c3c957d48b7bf3~tplv-k3u1fbpfcp-watermark.image)
比如说左边的图所示，想要知道向量$\vec b$在向量$\vec a$的左边还是右边，或者说向量$\vec a$向逆时针旋转还是顺时针旋转。  
如果$\vec a$ x $\vec b$的结果是正的，那就说明$\vec b$在$\vec a$的左侧。

如右图所示，判定p点是否在三角形的内部。如果
* $\vec AB$ x $\vec AP$得出的结果是$\vec AP$在$\vec AB$左侧
* $\vec BC$ x $\vec BP$得出的结果是$\vec BP$在$\vec BC$左侧
* $\vec CA$ x $\vec CP$得出的结果是$\vec CP$在$\vec CA$左侧
所以就可以说p点在三角形的内部，这是光栅化的基础，要判定某个三角形覆盖了哪些像素，就得判断这些像素是否在三角形的内部。

### 矩阵
矩阵的定义如上所说的，它是描述空间中任何一个运动，也就是变换。  

矩阵表示为$$\begin{bmatrix}
{1}&{3}\\
{5}&{2}\\
{0}&{4}\\
\end{bmatrix}$$ 这称为(3 x 2)的矩阵，3行2列。

 矩阵的乘法:只有第一个矩阵的列数与第二个矩阵的行数相同，相乘才有意义（M x N）(N x P) = (M x P)   
举例：$$\begin{bmatrix}
{1}&{3}\\
{5}&{2}\\
{0}&{4}\\
\end{bmatrix}$$ * $$\begin{bmatrix}
{3}&{6}&{9}&{4}\\
{2}&{7}&{8}&{3}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{9}&{27}&{33}&{13}\\
{19}&{44}&{61}&{26}\\
{8}&{28}&{32}&{12}\\
\end{bmatrix}$$

结果是这样算的，比如结果中第一行第四列的13，就是取第一个矩阵的第一行[1 3]和第二个矩阵的第四列[4 3]相乘相加$1*4 + 3*3$得到的13。

矩阵符合结合律和分配律，不符合交换律。

那么矩阵与向量怎么结合在一样？那就是将向量表示为一个[N x 1]的矩阵，这样矩阵就能与向量相乘。

比如在二维中将一个向量按y轴做一个对称变换：$$\begin{bmatrix}
{-1}&{0}\\
{0}&{1}\\
\end{bmatrix}$$ $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{-x}\\
{y}\\
\end{bmatrix}$$

矩阵还有几个性质：转秩
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee16814a74944d86828a8426d49004c3~tplv-k3u1fbpfcp-watermark.image)
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f5fa0057f8e4dfba2ad3165df7263eb~tplv-k3u1fbpfcp-watermark.image)

向量的点乘和叉乘都可以表示为矩阵的乘法
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5bed73d088e4f589500546276fbff89~tplv-k3u1fbpfcp-watermark.image)

### 模型变换
先介绍一下什么是线性变换--linear transformation：

事实上变换只是函数的一种说法；接收一个数，并输出对应的结果，在线性代数的情况下，这个数指的就是一个向量。就变成了接收一个向量并输出一个向量。使用变换这个名词大概是以特定的方式来可视化这一输入-输出关系。似乎在说向量通过运动变成另一个向量。

如果一个变换具有以下两条性质，就可以称它为线性变换：
* 直线在变换后仍然保持为直线，不能弯曲
* 原点必须保持固定
总的来说，线性变换可以看作是**保持网格线平行且等距分布**的变换。
#### Scale--缩放变换
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14b87382537a4642bf9f3ea1e05c1825~tplv-k3u1fbpfcp-watermark.image)
如图所示：左边的图形经过$S_{0.5}$的缩放变成右边的图形，因为是在二维坐标系中，所以具体来说就是x轴和y轴都缩放0.5倍。

方程组如下  
$$\begin{cases}
x^{'}=sx\\
y^{'}=sy\\
$$
用矩阵的方式表示$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{s}&{0}\\
{0}&{s}\\
\end{bmatrix}$$ $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4018f8bda9354af48a6345aa9278e790~tplv-k3u1fbpfcp-watermark.image)
如图所示，如果x轴缩放0.5倍y轴不变，那么表达式就变成了$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{s_{x}}&{0}\\
{0}&{s_{y}}\\
\end{bmatrix}$$ $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$

缩放变换有一个特殊的变换叫做反射变换
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6de6cf7263f6470fab81d8288867a417~tplv-k3u1fbpfcp-watermark.image)
如图所示，图形相对于y轴做一个对称变换，也就是x轴取反，y轴不变： $$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{-1}&{0}\\
{0}&{1}\\
\end{bmatrix}$$ $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$

#### Shear--切变
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0bf7617448641ddb0c93983ad91b86d~tplv-k3u1fbpfcp-watermark.image)
如图所示：边长都为1的正方形变换为了一个平行四边形，对比左右图型可以发现：y轴坐标都没有发生变化，图形的下边x轴没有发生变化，只有上边的x轴都加上a，所以中间的点的x左边都要加上ay
列出方程组
$$\begin{cases}
x^{'}=x + ay\\
y^{'}=y\\
$$
用矩阵的方式表示$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{1}&{a}\\
{0}&{1}\\
\end{bmatrix}$$  $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$

#### Rotate--旋转变换
为了简化旋转变换，先作出两个定义
* 只要不作具体说明，认为都是围绕着原点（0，0）旋转
* 只要不作具体的旋转方向，都认为是逆时针方向
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e5db47e0f55d4e3bbcb2a44bce2bffd9~tplv-k3u1fbpfcp-watermark.image)
如图所示边长为1的正方形，围绕原点(0,0)旋转，旋转$\theta$角度。A点从(1, 0)到$A^{'}(cos \theta，sin \theta)$，B点从(0, 1)到$B^{'}(-sin\theta, cos\theta)$

所以可以列出方程组
$$\begin{cases}
x^{'}=cos\theta x - sin\theta y\\
y^{'}=sin\theta x + cos\theta y\\
$$
得出矩阵$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{cos{\theta}}&{-sin{\theta}}\\
{sin{\theta}}&{cos{\theta}}\\
\end{bmatrix}$$  $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$

**线性变换本质**从上面的几个例子中得出，在二维中，从A点移动到$A^{'}$点都可以用列出一个方程组求解
$$\begin{cases}
x^{'}=ax + by\\
y^{'}=cx + dy\\
$$
而这些方程组都可以表达为矩阵的形式:$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{a}&{b}\\
{c}&{d}\\
\end{bmatrix}$$  $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$

写成更一般的公式：$\vec x^{'} = M\vec x$。在几何中的意义就是，通过M让$\vec x$运动到$\vec x^{'}$，这也认证了前面的结论。

#### Translation--平移变换
经过上面的介绍，平移变换就显得非常简单。物体平移$t_x$,$t_y$，从几何上来说就是x轴坐标都加上$t_x$，y轴坐标都加上$t_y$。
方程组求解
$$\begin{cases}
x^{'}=x + t_x\\
y^{'}=y + t_y\\
$$
因为$t_x$,$t_y$都是常数，所以这方程组无法写成一般的$\vec x^{'} = M\vec x$的公式，只能写成$\vec x^{'} = M\vec x + t$表示为矩阵形式就是$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{a}&{b}\\
{c}&{d}\\
\end{bmatrix}$$  $$\begin{bmatrix}
{x}\\
{y}\\
\end{bmatrix}$$ + $$\begin{bmatrix}
{t_{x}}\\
{t_{y}}\\
\end{bmatrix}$$
所以可以得出一个结论，**平移变换不属于线性变换**。很吃惊，平移怎么不是线性变换呢，因为在线性空间中是用向量来表示物体的，向量具有平移不变性，也就是说一个向量移动到某一个点但方向和大小都没有发生变化，就表示这个向量根本没有变换。但数学家们不满足于单独将平移当作特殊处理，仍然希望将其与线性变换统一处理。所以引入了**齐次坐标**。

#### 齐次坐标
数学家发现，通过将坐标都增加一个纬度，比如说在二维中
* 点表示为(x, y, 1)
* 向量表示为(x, y, 0)
就可以将平移表示为：$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
{w^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{1}&{0}&{t_{x}}\\
{0}&{1}&{t_{y}}\\
{0}&{0}&{1}\\
\end{bmatrix}$$  $$\begin{bmatrix}
{x+t_{x}}\\
{y+t_{y}}\\
{1}
\end{bmatrix}$$

这就能写成$\vec x^{'} = M\vec x$这种形式了。

而且引入齐次坐标将点与向量分开表示了，这是因为如上面所讲的，向量具有平移不变性。而上面公式中经过平移，x变成了$x+t_x$，y变成了$y+t_y$，这在向量里是不允许的。所以向量表示为(x, y, 0)就是保护它的平移不变性

加上了齐次坐标之后，就可以将线性变换与平移合到一起，数学家将这个变换称为Affine（仿射变换）= linear tranformation + translation。齐次坐标形式为：$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
{w^{'}}\\
\end{bmatrix}$$ = $$\begin{bmatrix}
{a}&{b}&{t_{x}}\\
{c}&{d}&{t_{y}}\\
{0}&{0}&{1}\\
\end{bmatrix}$$  $$\begin{bmatrix}
{x+t_{x}}\\
{y+t_{y}}\\
{1}
\end{bmatrix}$$

上次介绍的线性变换都改为以下形式：   
1、Scale：$S({s_x, s_y})$ = $$\begin{bmatrix}
{s_{x}}&{0}&{0}\\
{0}&{s_{y}}&{0}\\
{0}&{0}&{1}\\
\end{bmatrix}$$

2、Rotation：$R(\theta$)$ = $$\begin{bmatrix}
{cos{\theta}}&{-sin{\theta}}&{0}\\
{sin{\theta}}&{cos{\theta}}&{0}\\
{0}&{0}&{1}\\
\end{bmatrix}$$

3、Translation：$T(t_x, t_y)$ = $$\begin{bmatrix}
{1}&{0}&{t_{x}}\\
{0}&{1}&{t_{y}}\\
{0}&{0}&{1}\\
\end{bmatrix}$$

#### 变换组合
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/531bdd1e574246eaabd485a622fb6962~tplv-k3u1fbpfcp-watermark.image)
如图所示，左边的图怎么变换到右边的图呢？很简单就是平移加旋转，那应该是先平移在旋转还是先旋转再平移？

如果是先平移在旋转：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/243a9fea9dc54a6abd32e1540621b5c7~tplv-k3u1fbpfcp-watermark.image)
会发现不对，结果并不是变换后的结果

所以是先旋转再平移：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eaa78411f7644409b5c279c8dab735d3~tplv-k3u1fbpfcp-watermark.image)

所以得出两个结论
* 一个复杂的变换能分解成基础变换的组合
* 基础变换的顺序是至关重要的
这也反应出矩阵不符合交换律

所以上述变换组合写成矩阵形式：  
$T_{(1, 0)} R_{45}$ $$\begin{bmatrix}
{x}\\
{y}\\
{1}
\end{bmatrix}$$ = $$\begin{bmatrix}
{1}&{0}&{1}\\
{0}&{1}&{0}\\
{0}&{0}&{1}\\
\end{bmatrix}$$ $$\begin{bmatrix}
{cos45}&{-sin45}&{0}\\
{sin45}&{cos45}&{0}\\
{0}&{0}&{1}\\
\end{bmatrix}$$ $$\begin{bmatrix}
{x}\\
{y}\\
{1}
\end{bmatrix}$$

注意顺序，顺序是从右到左的顺序相乘的，这是因为向量在最右边，依次向左乘上变换矩阵

### 三维变换
从二维变换推广到三维变换很容易，先看齐次坐标的定义
* 点表示为(x, y, z, 1)
* 向量表示为(x, y, z, 0)
可以使用（4 x 4）的矩阵形式表示三维的线性变换:$$\begin{bmatrix}
{x^{'}}\\
{y^{'}}\\
{z^{'}}\\
{1}
\end{bmatrix}$$ = $$\begin{bmatrix}
{a}&{b}&{c}&{t_{x}}\\
{d}&{e}&{f}&{t_{y}}\\
{g}&{h}&{i}&{t_{z}}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$  $$\begin{bmatrix}
{x}\\
{y}\\
{z}\\
{1}
\end{bmatrix}$$

三维变换公式：   
1、Scale：$S({s_x, s_y, s_z})$ = $$\begin{bmatrix}
{s_{x}}&{0}&{0}&{0}\\
{0}&{s_{y}}&{0}&{0}\\
{0}&{0}&{s_{z}}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

2、Translation：$T(t_x, t_y)$ = $$\begin{bmatrix}
{1}&{0}&{0}&{t_{x}}\\
{0}&{1}&{0}&{t_{y}}\\
{0}&{0}&{1}&{t_z}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

最复杂的就是旋转了，对于任意的旋转是非常困难的，所以先从简单旋转开始分析:  
（1）：围绕x轴旋转，也就是说x轴坐标不变，y轴与z轴的坐标在做旋转变换，反应到矩阵中：

$R_x(\theta)$ = $$\begin{bmatrix}
{1}&{0}&{0}&{0}\\
{0}&{cos{\theta}}&{-sin{\theta}}&{0}\\
{0}&{sin{\theta}}&{cos{\theta}}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

(2)：围绕y轴旋转，同理y轴坐标不变，z轴和x轴坐标做旋转

$R_y(\theta)$ = $$\begin{bmatrix}
{cos{\theta}}&{0}&{sin{\theta}}&{0}\\
{0}&{1}&{0}&{0}\\
{-sin{\theta}}&{0}&{cos{\theta}}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

(3)：围绕z轴旋转

$R_z(\theta)$ = $$\begin{bmatrix}
{cos{\theta}}&{-sin{\theta}}&{0}&{0}\\
{sin{\theta}}&{cos{\theta}}&{0}&{0}\\
{0}&{0}&{1}&{0}\\
{0}&{0}&{0}&{1}\\
\end{bmatrix}$$

复杂的变换都可以分解成基础变换的组合，所以对三维空间中任意的旋转可以分解为对x轴、y轴、z轴旋转的组合：$R_{xyz}(\alpha，\beta，\gamma) = R_x(\alpha)R_y(\beta)R_z(\gamma)$

总结成为罗德里格斯旋转公式：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bda606d7a2564586a7968cad68a2e824~tplv-k3u1fbpfcp-watermark.image)
