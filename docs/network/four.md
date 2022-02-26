---
title: wireShark的基本用法
---

## 前言
wireShark可以说是迄今为止最为强大的抓包工具。  
掌握好它对学习网络协议有巨大的帮助。  

下面是本人学习整理有关wireShare的基本用法：

## 捕获网络报文
首先打开wireShark，点击菜单栏上的捕获(catpure)->选项(options)，打开捕获接口窗口
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/1704782753e9cf90~tplv-t2oaga2asx-image.image' width='600'>  

捕获接口窗口如下图所示：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/1704788dd87a08aa~tplv-t2oaga2asx-image.image' width='600'>  
需要关注4个部分：  
1、接口：展示本机上的网络接口。比如Wi-Fi接口、Loopback接口就是本机的环回地址：如果是访问127.0.0.1或者localhost，应该选择该接口进行抓包。  
2、输入与选项：下文有详细介绍  
3、流量：展示当前的网卡接口中所经过的流量。  
4、捕获过滤器：输入只想抓取的报文的格式  

输入(Output)  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/1704797cb3cba0b4~tplv-t2oaga2asx-image.image' width='600'>  
1、在抓包的时候，要么把报文存储到临时文件，要么存储到永久文件中。如果是永久文件，那么可以在文件(File)打开一个永久文件，输入格式(Output format)也是可以选择的。  
2、如果是临时文件，可以点击自动创建文件(Create a new file automatically)。比如说，经过多少字节、经过多少秒就换一个新的文件等。  
3、临时文件也可以用一个环形缓冲器(Use a ring buffer with)。比如说选择2个文件，就会循环使用这两个文件。当这两个文件都写好后，就重新使用第一个文件开始记录。  

选项(Options):
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047a0feadda865~tplv-t2oaga2asx-image.image' width='600'>  
主要关注两部分：  
1、一些显示的选项。比如是否实时的更新分组列表等。  
2、自动停止捕获。比如说经过多少字节、多少秒就停止捕获。

点击开始(start)就可以抓取报文了。  

### wireShark面板
抓取到报文后，来看一下wireShark面板功能：
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047b3202bd994a~tplv-t2oaga2asx-image.image' width='600'>  
1、工具栏：通过4条竖线分为5类。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047c83de3b0a63~tplv-t2oaga2asx-image.image' width='600'>  
2、显示过滤器：展示只想展示的报文。  
3、数据包列表：这其中有很多信息，比如有多少条报文，报文的获取时间，ip地址等。当点击其中一个数据包时就能在细节框中展示的细节。  
其中报文的时间默认是相对时间：从开始捕获为0s计算。  
可以在视图(view)->时间显示格式(Time Display Format)中转换。
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047cce08d86feb~tplv-t2oaga2asx-image.image' width='600'>  
如果想对某一个报文为时间零点来设置相对时间，可以对着基准报文点击右键选择设置时间参考(Set/Unset Time Reference)
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047d30af133c32~tplv-t2oaga2asx-image.image' width='600'>  
数据包列表中的标记符号
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047dd404ffe1cf~tplv-t2oaga2asx-image.image' width='600'>  
4、数据包细节：有一个分层的概念。  
* Frame是wireShark自己的分层
* Ethernet表示以太网
* Internet Protocol表示网络层
* Transmission Control Protocol表示传输层。

点击对应的层会有对应的细节。  
5、数据包字节流：可以看到左边的字节流对应着右边解析过的信息。  

### 追踪流
wireShark提供了一个便捷方式使得可以从如此庞大的数据报文中找到自己感兴趣的报文会话：追踪流  
比如选择感兴趣的报文，点击右键选择追踪流(Follow)->TCP流
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047e378a75d40d~tplv-t2oaga2asx-image.image' width='600'>  
就能筛选出感兴趣的会话, 实际上这个操作与在显示过滤器中输入tcp.stream eq 12是一样的。  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/17047e920cf9ae0c~tplv-t2oaga2asx-image.image' width='600'>

## 捕获过滤器
捕获过滤器又称BPF过滤器。  
* Berkeley Packet Filter，在设备驱动级别提供抓包过滤接口，多数抓包工具都支持此语法  
* expression表达式：由多个原语组成。  

所以只需搞清楚原语就能知道过滤器的用法。  
```
原语(primitives)：由名称或数字，以及描述它的多个限定词组成。  
  * 限定词(qualifiers)
    * Types：设置数字或者名称所指示类型，例如host www.baidu.com
        * host、post
        * net，设定子网， net 192.168.0.0 mask 255.255.255.0等价于net 192.168.0.0/24
        * portrange，设置端口范围，例如portrange 6000-8000
    * Dir：设置网络出入方向，例如dst port 80
        * src、dst、src or dst、src and dst(src：源端口，dst：目标端口)
    * Proto：指定协议类型，例如upd
        * ether、fddi、tr、wlan、ip、ip6、arp、rarp、decnet、tcp、udp、icmp、igmp、icmp、igrp、pim、ah、esp、vrrp
    * 其他
        * gateway：指明网关IP地址，等价于ether host 'ehost' and not host 'host'
        * broadcast：广播报文，例如ether broadcast或者ip broadcast
        * multicast：多播报文，例如ip multicast或者ip6 multicast
        * less、greater：小于或者大于
  * 原语运算符
    * 与：&&或者and
    * 或：||或者or
    * 非：!或者not
举例：src or dst portrange 6000-8000 && tcp or ip6
表示的意思就是源端口或者目的端口范围6000到8000，并且是一个tcp协议或者ipv6
```

## 显示过滤器
捕获过滤器格式可以应用到很多软件，而显示过滤器只能应用于wireShark。  

显示过滤器的功能同样也是非常强大的，这就意味着学习成本不低啊。  

首先得找到显示过滤器支持哪些属性？  
一般来说任何报文细节面板中解析出的字段名，都可以作为过滤属性。  
比如说这个Source Post
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/170480bdb35414a5~tplv-t2oaga2asx-image.image' width='600'>  
但是作为过滤属性的名称可不是这样。这个Source Post对应的是tcp.srcpost。  

打开视图(view)->内部(internals)->支持的协议(Supported Protocols)
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/170480efbe43cd99~tplv-t2oaga2asx-image.image' width='600'>  
找到名称所对应的过滤器属性  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/1704817c13b2bd43~tplv-t2oaga2asx-image.image' width='600'>  

### 过滤属性比较符号
|   英文    | 符号 | 描述及示例 |
| ---------- | --- | ---------- |
| eq |  == | 等于.ip.src == 10.0.0.5 | 
| ne |  != | 不等于.ip.src!=10.0.0.5 |
| gt |  >  | 大于.frame.len > 10 |
| lt |  <  | 小于.frame.len < 128 |
| ge |  >= | 大于等于.frame.len ge 0x100 |
| le |  <= | 小于等于.frame.len le 0x20 |
| contains | | 包含.sip.To contains 'a1763' |
| matches | ~ | 正则匹配.host matches 'acme\.(org)' |
| bitwise_and | & | 位与操作.tcp.flags & 0x02 |

### 过滤属性类型
* Unsigned integer：无符号整型，例如ip.len le 1500
* Signed integer：有符号整型
* Boolean：布尔值，例如tcp.flags.syn
* Ethernet address：以:、-或者.分隔的6字节地址，例如eth.dst == ff:ff:ff:ff:ff
* IPv4 address：例如ip.addr == 192.168.0.1
* IPv6 address: 例如ipv6.addr == ::1
* Test string：例如http.request.uri == 'https://www.wireshark.org/'


### 多个表达式间的组合
| 英文 | 符号 | 意义与示例 |
| ---- | ---- | ---------- |
| and  | &&   | AND逻辑与.ip.src == 10.0.0.5 and tcp.flags.fin |
| or   | ||   | OR逻辑或.ip.src == 10.0.0.5 or ip.src == 192.1.1.1 |
| xor  | ^^   | XOR逻辑异或.tr.dst[0:3] == 0.6.29 xor tr.src[0:3] == 0.6.29
| nor  | !    | NOT逻辑非 not llc |
| [...] |     | Slice切片操作符 |
| in   |      | 集合操作符 |

### 其他常用的操作符
1、大括号{}集合操作符
* 例如tcp.port in {443 4430..4434},等价于tcp.port == 443 || (tcp >= 4430 && tcp.port <= 4434)

2、中括号[]Slice切片操作符
* [n:m]表示n是起始偏移量，m是切片长度，例如eth.src[0:3] == 00:00:83
* [n-m]表示n是起始偏移量，m是截止偏移量，例如eth.src[1-2] == 00:83
* [:m]表示从开始到m截止偏移量，例如eth.src[:4] == 00:00:83:00
* [m:]表示m是起始偏移量，到字段末尾，例如eth.src[4:] == 20:20
* [m]表示取偏移量m处的字节，例如eth.src[2] == 83
* [,]使用逗号分隔时，允许以上方式同时出现

这么多知识难以记住怎么办，别担心。wireShark提供了一个显示过滤器的可视化表达式框  
打开分析(Analyze)->显示过滤器表达式(Display Filter Expression)  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/170483df7c5312e2~tplv-t2oaga2asx-image.image' width='600'>  
具体操作如下  
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/2/15/1704840ef1a0dca0~tplv-t2oaga2asx-image.image' width='600'>  

## 解密tls消息
最后分享一下wireshark解密TLS消息的方法。

原理：通过Chrome浏览器DEBUG日志中的握手信息生成密钥。

步骤：
* 配置Chrome输出DEBUG日志
* 在wireshark中配置解析DEBUG日志

在mac下操作方法：
* 首先创建output文件用于接收DEBUG日志，比如`/Users/username/sslkeylogs/output.log`
* 然后配置环境变量SSLKEYLOGFILE：`export SSLKEYLOGFILE=/Users/username/sslkeylogs/output.log`
* 配置wireshark，在首选项中选择protocol->ssl，选择output文件
