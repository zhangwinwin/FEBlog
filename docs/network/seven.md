---
title: 缓存与Cache-Control头部
---
## 前言
总所周知，缓存是解决`Http1.1`协议传输性能的问题中最主要的手段。

缓存既可以存在于浏览器上，也可以存在于服务器中。

而影响缓存的`Http`头部有很多，其中`Cache-Control`是比较重要的一个，也是取值比较复杂的一个。

下面先聊一聊缓存的工作原理，再说说`Cache-Control`的详细取值。

## 缓存的工作原理
`HTTP`缓存是一个以时间为维度的缓存。

浏览器在第一次请求中缓存了响应，而后续的请求可以从缓存提取第一次请求的响应。从而达到：减少时延而且还能降低带宽消耗，因为可能压根就没有发出请求，所以网络的吞吐量也下降了。

### 工作原理
浏览器发出第一次请求，服务器返回响应。如果得到响应中有信息告诉浏览器可以缓存此响应。那么浏览器就把这个响应缓存到浏览器缓存中。

如果后续再发出请求时，浏览器会先判断缓存是否过期。如果没有过期，浏览器压根就不会向服务器发出请求，而是直接从缓存中提取结果。

比如：访问掘金站点  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/16/1721c3012631b0b7~tplv-t2oaga2asx-image.image' width='600'>  
从`Size`中可以看出，`disk cache`是从硬盘中提取的缓存信息。

### 缓存过期了
如果缓存过期了，也并不一定向第一个请求那样服务器直接返回响应。

浏览器的缓存时间过过期了，就把该请求带上缓存的标签发送给服务器。这时如果服务器觉得这份缓存还能用，那就返回304响应码。浏览器将继续使用这份缓存。

比如：选择上面图中的其中一份缓存文件，`copy`请求`url`在`curl`中展示
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/16/1721c3b210536600~tplv-t2oaga2asx-image.image' width='600'>  
首先加`-I`获取原始请求，查看`etag`或`last-modified`头部。

因为浏览器缓存过期之后，请求就会带上这些头部一起发送给服务器，让服务器判断是否还能用。  
针对`etag`头部，加一个`if-none-match`头部带上`etag`的值询问服务器。当然也可以针对`last-modified`头部，加一个`if-modified-since`头部询问。    
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/16/1721c3ee3a13b6a3~tplv-t2oaga2asx-image.image' width='600'>  
返回的是304。304的好处就是不携带包体，也就是说`content-length`为0，这样就节省了大量的带宽。

### 共享缓存
浏览器缓存是私有缓存，只提供给一个用户使用的。

而共享缓存是放在服务器上的，可以提供多个用户使用。比如说某个比较热点的视频等热点资源就会放在代理代理服务器的缓存中，以减低源服务器的压力，提升网络效率。

怎么分辨这个资源是代理服务器的缓存还是源服务器发送的呢？  

仍然使用掘金的例子  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/16/1721c4a9513660be~tplv-t2oaga2asx-image.image' width='600'>  
从图中看出这个请求的`Response Headers`中的`age`头部，单位是秒。

说明这个缓存是共享缓存返回的，`age`说明了它在共享缓存存在的时间，图中是327784，也就是在共享缓存中存在了327784秒。

共享缓存也有过期的时候，下面看看共享缓存的工作原理。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/16/1721c4f730293ab8~tplv-t2oaga2asx-image.image' width='500'>  
如图所示：   
1、当`client1`发起请求时，`Cache`也就是代理服务器（共享缓存），转发这条请求给源服务器。源服务器返回响应，并在`Cache-Control`头部中设定可以缓存100秒。接着在`Cache`中就会开启一个定时器`Age`，将响应带上`Age：0`头部返回给`client1`。  

2、过了10秒后，`client2`发送相同的请求，`Cache`中的缓存还没有过期，就带上`Age：10`头部返回缓存中的响应给`client2`。

3、过了100秒后，`client3`发送同样的请求，这时`Cache`中的缓存已经过期了，就像前面说到那样用条件请求头部`If-None-Match`带上缓存的指纹发给源服务器。当源服务认为此缓存还能用，就返回304状态码给`Cache`。`Cache`就重新计时，从缓存中找出响应带上`Age：0`头部返回给`Client3`。

### vary缓存
`vary`头部是可以做一些更为复杂的缓存匹配条件，只有`vary`头部指定的头部必须与请求中的头部相匹配才能使用缓存。

`vary`的定义：
* "*"： 意味着一定匹配失败
* 1个或多个`field-name`：指定的头部必须与请求中的头部相匹配才能使用缓存

<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/17/172208925851bd48~tplv-t2oaga2asx-image.image' width='500'>  

如图所示：  
1、 当`Client1`携带`Accept-Encoding：*`头部的`GET`请求发送给`server`。`server`返回的是`gzip`编码的响应，以及`vary：Content-Encoding`头部，表示着编码方式一样的时候才能使用缓存。  

2、当`Client2`携带`Accept-Encoding：br`头部的`GET`请求发送给`server`，这时请求的是`br`编码。所以`Cache`不能使用缓存，因为不匹配`vary`的中的值，只能转发请求给源服务器`server`。

3、当`Client3`携带`Accept-Encoding：br`头部的`GET`请求发送给`server`，这时`Cache`有`br`编码的缓存，能匹配`vary`头部的值，所以能使用缓存返回。


## Cache-Control
`Cache-Control`头部取值范围非常复杂。

`Cache-Control`的定义是：
* 必选的`token`值
* 可选的“=”，加上带引号的值或者1个或多个十进制的数字也就是指定的秒数

`Cache-Control`既可以在请求中使用，也可以在响应是使用。而且相同的值在请求和响应中的含义是不一样的。

`Cache-Control`值有三种用法：
* 1、直接使用`token`
* 2、`token`值+ '=' + 十进制数字
* 3、`token`值+ '=' + 相应的头部 / 直接使用`token`值

### 在请求中的应用
在请求中`Cache-Control`的取值、用法及其含义：@后面表示第几种用法  
* max-age@2： 告诉服务器，客户端不会接收`Age`超出`max-age`秒的缓存
* max-stale@2： 告诉服务器，即使缓存不再新鲜，但过期秒数没有超过`max-stale`时，客户端仍打算使用。若`max-stale`后没有值，则表示无论过期多久，客户端都可使用。
* min-fresh@2： 告诉服务器，`Age`至少经过`min-fresh`秒后缓存才可使用
* no-cache@1： 告诉服务器，不能直接使用已有缓存作为响应返回，除非带着缓存条件到上游服务器得到304状态码才可使用现有缓存。
* no-store@1： 告诉各代理服务器，不要对该请求的响应缓存
* no-transform@1： 告诉代理服务器不要修改消息包体的内容
* only-if-cached@1： 告诉服务器仅能返回缓存的响应，否则若没有缓存则返回504错误码

### 在响应中的应用
在响应中`Cache-Control`的取值及其含义：
* max-age@2： 告诉客户端缓存`Age`超出`max-age`秒后则缓存过期
* s-maxage@2：与`max-age`类似，但仅针对共享缓存，且优先级高于`max-age`和`expires`
* must-revaildate@1： 告诉客户端一旦缓存过期，必须向服务器验证后才可使用
* proxy-revalidate@1： 与`must-revaildate`类似，但它仅对代理服务器的共享缓存有效
* no-cache@3： 1、告诉客户端不能直接使用缓存的响应，使用前必须在源服务器验证得到304返回码。2、如果`no-cache`后指定头部，则若客户端的后续请求及响应中不含有这些头部则可直接使用缓存
* no-store@1： 告诉所有下游服务器但不能对响应进行缓存
* no-transform： 告诉代理服务器不能修改消息包体的内容
* public@1： 表示无论私有缓存或者共享缓存，皆可将该响应缓存
* private@3： 1、表示该响应不能被代理服务器作用共享缓存使用。2、若`priate`后指定头部，则告诉代理服务器不能缓存指定的头部，可以缓存其他头部
