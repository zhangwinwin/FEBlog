---
title: (四)Blinn-Phong反射模型
---

## 前言
[源码在这](https://github.com/zhangwinwin/FEBlog/tree/master/learn-webgl), 如果喜欢请点一下star

在这一章中，实现光线与对象表面之间的相互作用。目的是在渲染流水线中增加着色功能，所以这里只讨论最基础的局部光照模型。与全局光照不同，在局部光照模型中，着色点的颜色值只取决于着色点表面的材质属性、表面的局部几何性质以及光源的位置与属性，而与场景中其他的表面无关。

## 渲染流程与场景定义
因为不考虑全局光照，只考虑从光源发出的光线，具体来说只考虑光源和表面之间的一次单独的相互作用。所以这个问题可分解为两个独立的部分：
* 定义场景中的光源（这里只介绍点光源）
* 定义一个描述材质和光线之间相互作用的反射模型（phong与Blinn-Phong反射模型）。
首先从一个点光源发出的光线中，由于观察者只看到从光源出发后最终到达他眼睛的那些光线。也就是说可以分两种情况：
* 要么这条光线从光源出发后直接进入观察者的眼睛，这时候看到的就是光源的颜色。
* 要么这条光线经过一条复杂的路线并且与场景中的对象发生多次相互作用（这里只考虑一次），之后进入观察者的眼睛，这时候看到的是光源与表面材质之间的相互作用。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7324375d16ee4bfeaaa9f826a9774a33~tplv-k3u1fbpfcp-watermark.image?)
在webgl中，经常使用投影平面来代替观察者。从概念上来讲，投影平面上位于裁剪窗口内的部分被映射到显示器上，因此可以把投影平面用直线分割成许多小的矩形，每一个小矩形都对屏幕上的一个像素。也就是说光源和对象表面的颜色决定了一个或多个像素的颜色。
### 反射光类型
学过初中物理就知道，基本上分为3种不同的反射光类型。
* 环境光：它的特点是使场景获得均匀的照明，是光线与场景对象的多次相互作用的结果。这里简单的设置为一个常数来模拟。
* 漫反射光：它的特点是把入射光线向各个方向散射，而且向各个方向散射的光线的强度都相等，因此不同位置的观察者看到的反射光线都是一样的。
* 镜面反射光：它的特点是看起来有光泽，因为被反射出去的大多数光线的方向都是和反射角的方向很接近。反射光线的方向服从入射角等于反射角这一规律。

为了简单起见，下面说的光照是建立一个点上，这个点就是着色点。而且这个点应该是在物体的表面，所以这点的光照就是光源对这点的着色效果。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/874843bdf2f74f1eaf9b9b15ff932267~tplv-k3u1fbpfcp-watermark.image?)
如图所示，首先来定义一些单位向量：
* 着色点的法线n
* 光照方向l
* 摄像机观测方向v
* 物体表面的一些参数

### 光的传播与能量守恒
光在传播过程中是会有衰减的。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cad9fb89f2bc467eb085f280ee7f843a~tplv-k3u1fbpfcp-watermark.image?)
比如说一开始光集中在一个单位球上，也就是最里面的球，此时球上每个点的接收到的能量就是光的能量除以球的面积。

当光传播到半径为r的球上时，也就是最外面的球时。根据能量守恒定律，最外面的球上每个点所接收到的能量要比小，根据公式可得物体表面接收到的能量是与光传播的距离平方成反比。

也就是说要计算着色点所接收到光的能量，就要计算光到着色点的距离。

## Phong反射模型
该反射模型是由Phong首先提出的。实践上不但计算效率高而且模拟现实的效果非常好，以至于对各种各样的光照条件和材质属性都获得很好渲染效果。

Phong反射模型考虑了上述说明的三种相互作用：环境光、漫反射和镜面反射。对每个颜色分量来说，都有独立的环境光分量、漫反射光分量和镜面反射光分量。最后将这三个分量加起来组成最后的颜色。

使用4个向量来计算着色点p的颜色值。其中未知的是反射向量r，而r可以由n和l确定的
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5492c227a4804a73a31cbe120ebc2721~tplv-k3u1fbpfcp-watermark.image?)

### 环境光反射
在表面上所有点的环境光强度$L_{a}$都是相同的。环境光的一部分被表面吸收，还有一部分被表面反射，被反射的部分的强度由环境光反射系统$k_{a}$，所以此时$R_{a}$=$k_{a}$。其中0 <= $k_{a}$ <= 1。

所以$I_{a}$ = $k_{a}$ * $L_{a}$

#### 代码实现
在代码中，添加环境光非常的简单，只需设置一个很小的常量将其乘上物体颜色即可
```fs
void main () {
    vec3 ambient = 0.05 * color;
}
```

### 漫反射
当一束平行的入射光线射到粗糙的表面时，表面会把光线向着四面八方反射。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13a594d0707c4ad5bf7c30ca46230c2a~tplv-k3u1fbpfcp-watermark.image?)
可以看到平面法线与光照方向有一定的夹角，而且根据这个夹角的不同着色点得到的明暗是不一样的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2991b4d6c3ab41b7a11172eb62cc3d5e~tplv-k3u1fbpfcp-watermark.image?)
假如每根光线的能量是均等的。分析左边的图，可以看到当物体表面与光照方向是垂直的话，会接收到所有的6根光线。而中间图则是旋转了这个物体到一定的角度，只能接收到3根光线，按理说这个物体表面应该是比左边要暗的。

所以着色点的明亮程度与光照方向l和物体表面法线n的夹角是有关系的。而在现实中也能观察到，比如说地球的四季温度的不同，就是光照方向与地表法线的角度有关。

这个关系就是著名的**Lamber's consine law**定律：光照方向与表面法线方向的余弦是成正比的：

$cosθ = l * n$

所以漫反射又称为**Lambertian Shading**：

首先定义光的强度I，当光到达物体表面时的能量就是$I / r^2$。光被吸收多少就是根据夹角余弦来计算，这个余弦根据光照向量与法线向量的点乘计算得出。

$L_d = k_d(I / r^2)max(0, n * l)$

至于max(0, n * l)的意思是，排除余弦是负数的情况。因为在现实生活中（表面不透明的情况下），光是不可能从负角度来照亮物体的表面。出现这种情况，就赋值0.

至于k，它是一个吸收系数。它表示这物体表面吸收了多少光，反射多少光。当$k_d=1$时，也就是说物体表面完全不吸收光，全部反射出去。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bedb926f49974d879b6d0731796a05ea~tplv-k3u1fbpfcp-watermark.image?)

#### 代码实现
在代码中，法向量是已知的
```js
const aNormal = gl.getAttribLocation(program, 'aNormal');
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, gl.FALSE, fsize * 8, fsize * 3);
gl.enableVertexAttribArray(aNormal);
```
由顶点着色器传给片段着色器中
```c++
// 顶点着色器
attribute vec3 aNormal;
varying vec3 Normal;
void main () {
    Normal = aNormal;
    ...
}

// 片段着色器
varying vec3 Normal;
void main () {
    // 进行归一化
    vec3 norm = normalize(Normal);
}
```
由像素位置与光源方向计算出入射向量，像素的位置就是顶点也是已知的，光源位置是统一的用uniform变量存储
```c++
// 顶点着色器
attribute vec3 aPos;
varying vec3 FragPos;
void main () {
    FragPos = aPos;
    ...
}

// 片段着色器
varying vec3 FragPos;
uniform vec3 lightPos;
void main () {
    vec3 lightDir = normalize(lightPos - FragPos);
}
```
最后根据公式算出漫反射分量
```c++
// 片段着色器
void main () {
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * color;
}
```

### 镜面反射
当我们观察有光泽的对象时就会看到高光。这些高光通常表现出与环境光反射和漫反射不同的颜色。而且与漫反射表面是粗糙的相反，镜面反射表面是光滑的。表面越光滑，就越接近于镜面，反射出去的光线就越集中在一个角度的附近。

Phong提出了一个近似的模型，在考虑镜面反射时，把表面看成是光滑的。观察者所看到的光线强度取决于反射光线的方向r和观察者的方向v这两者之间的夹角α。

$L_s = k_sL_scos^pα$

其中系数$k_s$(0 <= $k_s$ <= 1)表示在入射的镜面反射光中的有多大一部分被反射。指数p是高光系数。从下图可以看出，当p增加时，反射的光线越来越集中在理想反射器的反射角附近。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e7618116270146d09d951a8c06397614~tplv-k3u1fbpfcp-watermark.image?)
当不加p时（即p=1），我们从反射角度是60度的时候看着色点，按理说是离的很偏的了，但反映出来还是能看见高光。这就不合理了，因为在现实中只有非常接近的时候才能看见高光，稍微离远一点就看不到。所以才加上一个指数让其正常化。

Phone反射模型优点在于，如果已经把r和v归一化为单位向量，那么可以像计算漫反射一样利用点积运算计算镜面反射分量：

$L_s = k_sL_smax((r * v)^p, 0)$

接下来只需计算出反射向量r即可！
#### 反射角计算
法向量是给出的，利用法向量n和入射向量l就可以算出反射角。理想的镜面反射有一个很好的特征：入射角等于反射角。如图所示：
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e085d0915a741c7a423b02fe86213ad~tplv-k3u1fbpfcp-watermark.image?)
入射角是法向量和入射向量的夹角，反射角是法向量和反射光线之间的夹角。在平面内，只有一个反射方向能满足入射角等于反射角这个条件。但在三维空间中就不行，因为有无数个方向都满足入射角等于反射角。所以要加上一个条件：在表面上的一点p，入射光线和反射光线必须位于同一个平面内。这两个条件可以由n和l确定r。

假设l和n已经是单位向量：

|l| = |n| = 1。

同时也假定r也是单位向量：

|r| = 1

如果$θ_I$=$θ_r$那么

$cosθ_i$ = $cosθ_r$

利用点积运算可得:

$cosθ_i$ = l * n = $cosθ_r$ = n * r

共面的条件意味着可以把r写成l和n的线性组合:

r = αl + βn（1）

等号两边都和n做点积可得等式（2）：

n * r = αl * n + β = l * n（2）

因为r是单位向量，所以代入等式（1）可得等式（3）:

1 = r * r = $α^2$ + 2αβl * n + $β^2$（3）

结合等式（2）和等式（3）可得

r = 2(l * n))n - l

#### 代码实现
上述计算反射角的公式，在glsl中有一个内置函数reflect实现了。所以在代码中实现非常简单，视线向量也是已知的。
```c++
// 片段着色器
uniform vec3 viewPos;
void main () {
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    vec3 specular = vec3(0.3) * pow(max(dot(viewDir, reflectDir), 0.0), 8.0);
}
```

### Phong反射模型结果
将上述3种分量加在一起就是Phong反射模型

$L = L_a + L_d + L_s$  
$= k_aI_a + k_d(I/r^2)max(0, n*l) + k_sL_smax((r * v)^p, 0)$

```c++
gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
```
效果图如下
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2e149184f034d70bfbc37e92dbcc8ab~tplv-k3u1fbpfcp-watermark.image?)

Phong反射模型不仅对真实光照有很好的近似，而且性能也很高。但它的镜面反射会在一些情况下出现问题，特别是物体反光度很低时，会导致大片高光区域。

出现这个问题的原因是观察向量和反射向量间的夹角不能大于90度。如果点积结果为负数，镜面反射会变为0。你可能会觉得，当光线与视线的夹角大于90度时，应该不会接收到任何光才对。这种想法仅仅适合于漫反射。

但在镜面反射中，测量的角度并不是光源与法线的夹角，而是视线与反射光线向量的夹角，如下图。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24752229707446149f216bd9d7b1ffdc~tplv-k3u1fbpfcp-watermark.image?)
右图中，视线与反射方向之间的夹角明显大于90度，这种情况下镜面光分量为0。这在大多数情况下是没问题的，因为观察方向离反射方向都非常远。然而，当物体的反光度非常小时，它产生的镜面高光半径足以让这些相反反向的光线对亮度产生足够大的影响，在这种情况下就不能忽略它们对镜面光分量的贡献了。

而且反射角也比较难算。

所以在Phong的基础上，Blinn对此加以拓展，引入了Blinn-Phong反射模型。

## Blinn-Phong反射模型
该模型与Phong模型的区别只有在镜面光分量处理上有一些差别。Blinn-Phong反射模型不再依赖反射角，而是采用半程向量，即光线与视线夹角一半的方向上的单位向量。

### 半程向量
当观察方向接近镜面反射方向时，物体表面法线方向与半程向量接近。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9e57a02224024f2ea2a71a4a49336235~tplv-k3u1fbpfcp-watermark.image?)
所谓的半程向量就是光照方向向量与观察方向向量根据平行四边形法则加起来再除以它的长度就能得到。

$h = (v + l) / |v + l|$

h与n接近就说明了v和r接近，这就是Blinn-Phong模型的特别之处。因为r和v的夹角比较难计算的，用了这个小技巧后，计算便简单很多。

与漫反射原理几乎差不多，只不过是将光照方向与法线方向的夹角换成了半程向量与法线方向的夹角而已

$L_s = k_s(I / r^2)max(0, n * h)^p$

#### 代码实现
```c++
vec3 halfwayDir = normalize(lightDir + viewDir);
vec3 specular = vec3(0.3) * pow(max(dot(norm, halfwayDir), 0.0), 32.0);
```
效果图如下
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc7015d8268e43deb4559d62b58a9992~tplv-k3u1fbpfcp-watermark.image?)
