---
title: 使用wireSharp分析TLS握手过程
---

## 前言
如果还没尝试过使用`wiresharp`的话，可以参照我之前写过的文章[《wireSharp的基本用法》](https://juejin.im/post/6844904066229747720)。

本篇文章不会详细说`TLS`的内容，请结合我上一篇文章[《深入TLS/SSL协议》](https://juejin.im/post/6844904148719124488)一起观看。

## Handshake
### 基本概念
`TLS1.2`中的握手过程主要有三个目的：
* 验证身份
* 达成安全套件共识
* 传递密钥

如图所示:  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fd8980c864a55~tplv-t2oaga2asx-image.image' width='600'>  
1、客户端发送一个`Client Hello`，包含：
* 协议版本号。
* 客户端生成的随机数-`Client random`。
* 客户端所支持的安全套件列表。

2、服务器回一个`Server Hello`，包括：
* `server`所选择的安全套件。
* `server`发送自己的数字证书-`server Certificates`。
* `server`发送自己生成的公钥-`serverKey`。  

3、客户端发送自己生成的公钥-`clientKey`。  
4、客户端与服务器根据自己的私钥与对方的公钥生成对称加密的密钥。  
5、进行加密通讯

### 使用wiresharp抓包分析
下面抓取`www.juejin.im`为例：  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fda7260c92022~tplv-t2oaga2asx-image.image' width='600'>  

1、`Client hello`：  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fda9f26ec64ec~tplv-t2oaga2asx-image.image' width='600'>  
* 协议版本号`Version：TLS 1.2`
* 随机数`Random`
* 支持17种安全套件的列表

2、`Server hello`中：  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdbb8c91c4469~tplv-t2oaga2asx-image.image' width='600'>  
* 协议版本号`Version：TLS 1.2`
* 选中了一个安全套件：`TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
* 随机数`Random`

* 发送数字证书:  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdaeedc8176b2~tplv-t2oaga2asx-image.image' width='600'> 

* 发送`server`的公钥以及所用的签名算法：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdb162e11a8be~tplv-t2oaga2asx-image.image' width='600'>

3、`Client`发送自己的公钥  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdb7ff15829ca~tplv-t2oaga2asx-image.image' width='600'>

4、`client`与`server`根据自己的私钥与对方的公钥生成对称加密的密钥

5、`Change Cipher Spec`这一步是客户端通知服务端后面再发送的消息都会使用前面协商出来的密钥加密了并通知`server`握手结束。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdcc3e16e4311~tplv-t2oaga2asx-image.image' width='600'>

6、`Change Cipher Spec`这一步是服务端通知客户端后面再发送的消息都会使用加密并通知`client`握手结束。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdcdf83b9eb3b~tplv-t2oaga2asx-image.image' width='600'>

### TLS1.3握手
`TLS1.3`中，大大减少了所支持的安全套件。比如在`openssl1.1`中只支持5种安全套件
* `TLS13-AES-256-GCM-SHA384`
* `TLS13-CHACHA20-POLY1305-SHA256`
* `TLS-AES-128-GCM-SHA256`
* `TLS-AES-128-CCM-8-SHA256`
* `TLS-AES-128-CCM-SHA256`

`TLS1.3`握手的变化:  
由于安全套件的减少，`client`可以在第一次请求中将5种安全套件全部生成一对密钥，将5种`publicKey`发送给`server`，然后`server`选择其中一种安全套件来生成自己的一对密钥。从而相比上面说的TLS1.2的握手过程减少了一次`RTT`。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fe0c26981d526~tplv-t2oaga2asx-image.image' width='600'>

## 握手过程的优化
`TLS`握手中消耗的那一个或两个`RTT`时间是对于安全性而言的。

但对于应用层的信息传递而言并没有意义。

所以`TLS`提供了许多种手段来减少握手过程中所消耗的`RTT`的时间。比如：`session`缓存、`ticket`票据等

### session缓存
第一次握手后服务器会生成一个`sessionID`，然后传给浏览器。

在一定时间内，比如几个小时、几天内。浏览器携带这个`sessionID`再次访问服务器时，服务器会从缓存中提取这个`sessionID`所指向的加密密钥。没有必要再次根据`ECDH`协议生成新的密钥，从而减少消耗的`RTT`时间。
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdd6c551cb374~tplv-t2oaga2asx-image.image)

下面以百度站点为例：  
当再次访问百度站点时，`client hello`就会携带一个`sessionID`：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fddf8a56f2d45~tplv-t2oaga2asx-image.image' width='600'>

而`client Hello`步骤之后直接到了`Change Cipher Spec`。并没有进行`DH`或者`ECDH`密钥交换协议  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fde769afb2544~tplv-t2oaga2asx-image.image' width='600'>  

`Change Cipher Spec`里面就告诉`Client`，使用之前的密钥  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdea45af009ca~tplv-t2oaga2asx-image.image' width='600'>

### ticket票据
与`sesion`机制不同的是，`ticket`机制不需要`server`花费缓存来存放。而是基于一个独特的密码，这个密码是集群中所共享的。基于这个密码将`ticket`解密后，就可以获取到上一次生成的密钥。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdee2ded9ad2b~tplv-t2oaga2asx-image.image' width='600'>

### TLS1.3中的0RTT握手
所谓`0RTT`，指的是：第一次请求时就携带`GET`数据，在一次`RTT`后就马上得到`RESPONSE`。握手时间就是`0RTT`了。

事实上这也是第二次握手中才有的。当第一次握手时，`client`与`server`就会把密钥信息缓存下来。第二次访问时，基于第一次缓存的，基于一定时间内有效的信息对报文进行加密。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdf35ad4e970e~tplv-t2oaga2asx-image.image' width='600'>

### 重放攻击
无论是`session`、`ticket`还是`TLS1.3`中的`0RTT`都面临着一个危险：重放攻击  
如图所示：  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/5/10/171fdfdeaf984b21~tplv-t2oaga2asx-image.image' width='600'>  

如果`Client`发送一个使用上一次的密钥加密的`post`请求给`server`，而通常一个`post`请求是会改变数据库的。

如果这个报文被中间人获取下来了，而且并不需要解密这份报文。然后在随后的时间内，不断的发送这个报文，就可以不断的改变数据库以造成攻击效果。

所以设定一个合适的过期时间是必要的。
