---
title: 断点续传与多线程下载
---

## 前言
当下载电影时，我常常会想中断下载后，为什么点击开始时会在中断的地方继续下载呢？  
又或者在看在线电影时，为什么可以按着播放条拖动就能看到想看的片段呢？  

http的**range**请求将解决以上困惑。

## 多线程、断点续传、随机点播等的场景的步骤
1、客户端明确任务：从哪开始下载  
* 本地是否已有部分文件：文件已下载部分在服务器端发生改变？
* 使用几个线程并发下载  

2、下载文件的指定部分内容  
3、下载完毕后拼装成统一的文件

## HTTP Range规范
在RFC7233中有详细介绍  
1、允许服务器基于客户端的请求只发送响应包体的一部分给到客户端，而客户端自动将多个片段的包体组合成完整的体积更大的包体。  
* 支持断点续传
* 支持多线程下载
* 支持视频播放器实时拖动

2、服务器通过Accept-Range头部表示是否支持Range请求
* Accept-Ranges = acceptable-ranges
* 例如:   
Accept-Ranges: bytes: 支持；  
Accept-Ranges: none: 不支持

## Range请求范围的单位
基于字节为单位的时候，举例：设置响应体长度为10000
* 第1个500字节：  
bytes=0-499 // 从0开始
* 第2个500字节：  
bytes=500-999  
bytes=500-600, 601-999  
bytes=500-700, 601-999  
* 最后1个500字节  
bytes=-500  
bytes=9500-  
* 仅要第一个和最后一个字节：bytes=0-0, -1

通过Range头部传递请求范围，如：Range: bytes=0-499  

### 测试
下面用一些小例子有测试一下。  
用node搭了一个简单的服务器，返回的数字是22个字节的响应体
```
'Hello World 0123456789';
```
现在用curl命令获取全部的响应体，然后访问0-5的字节段：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/17024308e77fe71a~tplv-t2oaga2asx-image.image' width='500'>  

-H参数添加 HTTP 请求的标头。  
上面的命令就是添加HTTP头Range: bytes=0-5。  
返回的是Hello (加上空格)一共六个字节。  

现在获取第21个字节及以后的字节段，就可以用20-：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/1702433d07573559~tplv-t2oaga2asx-image.image' width='500'>  
返回的是89  

## Range条件请求
* 如果客户端已经得到了Range响应的一部分，并想在这部分响应未过期的情况下，获取其他部分的响应  
常与If-Unmodified-Since或者If-Match头部共同使用  
* If-Range = entity-tag / HTTP-date  
可以使用Etag或者Last-Modified  

### 测试
下面用etag测试一下Range条件请求  

首先获取0-5字节段  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/17024308e77fe71a~tplv-t2oaga2asx-image.image' width='500'>  

然后用-I来看看生成Hello 时服务器生成Etag的值
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/170243fddd82ee8e~tplv-t2oaga2asx-image.image' width='500'>  

接下来，用这个值放到If-Match中获取6-10字节段：World
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/1702442b74d27864~tplv-t2oaga2asx-image.image' width='500'>

如果Etag发生了变化，来看看结果会怎么样,将最后的0改为1
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/1702462dd88d06b5~tplv-t2oaga2asx-image.image' width='500'>  
返回412 Precondition Failed  

### 结论
通过条件请求可以判断两次下载之间，服务器端资源有没有发生变化。如果发生了变化，就可以通过412这个响应知道，资源已经发生了变化。

## 服务器响应
如果只获取部分的body，那么服务器端返回的响应码不是200，而是206。  
206 Partial Content
* Content-Range头部：显示当前片段响应体在完整包体中的位置
* Content-Range = byte-content-range / other-content-range  
{ btye-content-range = bytes-unit SP (byte-range-resp / unsatisfied-range)  
byte-range-resp = byte-range '/' (complete-length / '*')  
complete-length = 1*DIGIT // 完整资源的大小，如果未知则用\*号替代  
bytr-range = first-byte-pos "-" last-byte-pos } 

* 例如：  
1、Content-Range: bytes 42-1233/1234  
2、Content-Range: bytes 42-1233/*

### 测试
用一个视频播放的例子来看看206响应的样子。
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/17024f07e05e3dd8~tplv-t2oaga2asx-image.image)

416 Range Not Statisfiable  
* 请求范围不满足实际资源的大小，其中Content-Range中的complete-length显示完整响应的长度，例如  
Content-Range: bytes */1234  

### 测试
如果获取范围超出实际资源的大小，比如获取30-40。返回416
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/17024f86b1c2627d~tplv-t2oaga2asx-image.image)

200 OK  
* 服务器不支持Range请求时，则以200返回完整的响应包体


## 多重范围与multipart
* 请求：  
Range: bytes=0-50, 100-150  
* 响应:  
Content-Type: multipart/byteranges; boundary=...

### 测试
获取5-10， 10-15片段。
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/8/17024fb9b1b267e9~tplv-t2oaga2asx-image.image)

## 总结
1、客户端通过Range头部传递请求范围  

2、服务端返回Accept-Range头部表示是否支持Range请求。 

3、客户端如果在得到Range响应的一部分，并想在这部分响应未过期的情况下，获取其他部分的响应，可以用If-Range头部使用Etag或者Last-Modified为值。  

4、只获取部分的body，服务器返回206响应码，其中Content-Range头部显示当前片段响应体在完整包体中的位置  

5、客户端想多重范围下载资源，在Range头部的格式为Range: bytes=0-50, 100-150...(用逗号分隔)  
响应头部Content-Type: multipart/byteranges; boundary=...
