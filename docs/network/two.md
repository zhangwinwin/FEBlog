---
title: 内容协商与资源表述
---

## 前言：
HTTP协议是超文本传输协议的缩写，英文是Hyper Text Transfer Protocol。超文本就是一种资源的表述，它（HTML）是从WEB服务器传输到本地浏览器用于展示。  
restful架构,它是http设计师所遵循的架构。全称为：REpresentational State Transfer，翻译过来就是：表现层状态转移。用@Ivony老师的一句话概括就是:
> URL定位资源，用HTTP动词（GET,POST,DELETE,DETC）描述操作。

它也是在描述资源状态的一种转移。由于一种资源有着多种状态，所以客户端在接收一种资源的转移时是需要进行协商的。比如在中国访问一个url时是接收的资源可能是中文的，而在其他国家访问同一个url时获得的资源可能是他们国家的语言。

## 内容协商
每个URL指向的资源可以是任何事物，可以有多种不同的表述，例如一份文档可以有不同语言的翻译、不同的媒体格式、可以针对不同的浏览器提供不同的压缩编码等

### 内容协商的两种方式
* Proactive 主动式内容协商：指由客户端现在请求头部中提出需要的表述形式，而服务器根据这些请求头部提供特定的representation表述。  
举例：  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/2/1700690f2a231682~tplv-t2oaga2asx-image.image' width=500> 

Accept-Language:en表示客户端要求URI是中文的；  
Accept-Encoding:br表示客户端可以接受br类型的压缩方式。  

而服务端接收到客户端的要求后，会返回符合要求的响应。


* Reactive 响应式内容协商：指服务器返回300Multiple Choices或者406 Not Acceptable，由客户端选择一种表述URI使用。  
举例：  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/3/1700b1b534a87981~tplv-t2oaga2asx-image.image' width=500>  
客户端将要求发给服务器，服务器觉得自己不能太武断，于是通过300响应码返回了一个列表给客户端，供客户端选择。  
客户端再从返回的列表中，再次选择一个URL，比如URLe。再次访问服务器，服务器返回正确响应。

### 常见的协商要素
* 质量因子q：内容的质量、可接受类型的优先级  
1、内容质量。举例，客户端发起一个图片的请求，这个图片只供快速浏览用的，那么就可以做非常高的压缩比，这时的质量q就可以比较低。如果这个图片用作医学的，那么q就比较大，因为不能容忍医用照片模糊以损失大量的细节。  
2、可接受类型的优先级。举例：有一个URI即支持中文，又支持英文。但是希望优先显示中文，就能用q来表示。
* 媒体资源的MIME类型及质量因子  
1、Accept: text/html, application/xhtml+xml,application/xml;q=0.9,\*/\*;q=0.8  
2、Axxept: text/html, application/xhtml+xml,application/xml;1=0.9,image/webp,image/apng,\*/\*;q=0.8,application/signed-exchange;v=b3  

* 内容编码：主要指压缩算法  
Accept-Encoding: gzip. deflate, br

* 表述语言  
1、Accept-Language: zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7  
2、Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2  

## 资源表述的元数据头部
* 媒体类型、编码  
Content-Type: text/html; chareset=utf-8
* 内容编码  
Content-Encoding: gzip
* 语言
Content-Language: de-DE, en-CA

## 总结
内容协商将决定服务器端生成不同的HTTP响应体传输给客户端。
