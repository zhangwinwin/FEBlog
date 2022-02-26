---
title: http1.1协议基础
---

## http协议格式
### ABNF
巴科斯范式的英文缩写为**BNF**，它是以美国人巴科斯(Backus) 和丹麦人诺尔 (Naur) 的名字命名的一种形式化的语法表示方法，用于描述语法的一种形式体系，是一种典型的元语言。又称巴科斯-诺尔形式(Backus-Naurform)。它不仅能严格地表示语法规则，而且所描述的语法是与上下文无关的。它具有语法简单，表示明确，便于语法分析和编译的特点。  

扩充巴科斯-瑙尔范式（ABNF）是一种基于巴科斯-瑙尔范式（BNF）的元语言。  

**问：为什么用ABNF来定义HTTP协议呢**  
答：举个例子，如图所示
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/17/16fb29548a94bacf~tplv-t2oaga2asx-image.image)  
这种表达看似挺正确的，其实稍不注意就错误百出，而且并不容易发现。比如Host:后没有空格, Content-Type中间不是-而是_。这就造成了协议的错误。  

这就需要严谨的表达协议的格式：[ABNF格式](https://tools.ietf.org/html/rfc5234)  
下面简单介绍ABNF中常用的操作符，具体请点击上面的链接。  

* 空白字符：用来分割定义中的各个元素。  
* 选择/：表示多个规则都是可供选择的规则
* 值范围%c##-##：OCTAL = "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7"与OCTAL = %x30-37等价  
* 序列组合()：将规则组合起来，视为单个元素。
* 不定量重复m*n：  
1、\*元素表示零个或更多元素  
2、1\*元素表示一个或更多元素
* 可选序列[]

再来看看核心规则：  
|    规则    | 形式定义 | 意义 | 
| ---------- | -------- | ---- |
|   DIGIT    | %x30-39  | 数字(0-9) |
| HEXDIF | DIGIT / "A" / "B" / "C" / "D" / "E" / "F" | 十六进制数字(0-9, A-F, a-f) |
| SP | %x20 | 空格 |
| HTAB | %x09 | 横向制表符 |
| VCHAR | %x21-7E | 可见打印字符 |
| CRLF | %x0D %x0A | 互联网标准换行 |

### 基于ABNF描述的HTTP协议格式
HTTP-message = start-line *(header-fielf CRLF) CRLF [message-body]
* start-line = request-line / status-line  
1、request-line = method SP request-target SP HTTP-version CRLF  
2、status-line = HTTP-version SP status-code SP reason-phrase CRLF
* header-field = field-name ":" OWS field-value OWS  
1、OWS = *(SP / HTAB)  
2、field-name = token  
3、field-value = *(field-content / obs-fold)  
* message-body = *OCTET  

在wireshark中
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/28/16feb2a9531997be~tplv-t2oaga2asx-image.image)
可以看到Host中是以0d0a结尾的，也就是CRLF换行。  
接下来逐行解释HTTP协议  

### 请求行
request-line = method SP request-target SP HTTP-version CRLF
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/28/16feb38ae8d2ae6e~tplv-t2oaga2asx-image.image' width=400>
* method方法：指明操作目的，动词
* request-target = origin-form / absoulte-form / authority-form / asterisk-form  
origin-form = absolute-path["?" query]。  
向origin server发起的请求，path为空时必须传递/  
* absolut-form = absolute-URI  
仅用于向正向代理proxy发起请求时
* authority-form = authority  
仅用于CONNECT方法
* asterisk-form = "*"  
仅用于OPTIONS方法  

HTTP-version版本号：
* HTTP/0.9： 只支持GET方法，过时
* HTTP/1.0： RFC1945， 1996， 常见使用于代理服务器
* HTTP/1.1： RFC2616， 1999
* HTTP/2.0： 2015年正式发布  

Method常见方法：
* GET：获取资源，幂等。
* HEAD：类似GET，但服务器不发送body，用以获取HEAD元数据，幂等。
* POST：用于提交form表单，新增资源等。
* PUT：更新资源，带条件时时幂等。
* DELETE：删除资源，幂等。
* CONNECT：建立tunnel隧道。
* OPTIONS：显示服务器对访问资源支持的方法，幂等。


### 响应行
status-line = HTTP-version SP status-code SP reason-phrase CRLF
<img src='https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/28/16feb523c096dd19~tplv-t2oaga2asx-image.image' width=500>
* status-code = 3DIGIT
* reason-phrase = *(HTAB / SP / VCHAR / obs-text)

status-code：  
1、1xx：请求已收到，需要进一步处理才能完成，HTTP1.0不支持  
* 100Continue：上传大文件前使用，由客户端发起请求中携带Expect:100-continue头部触发
* 101Switch Protocols：协议升级使用，由客户端发起请求中携带Upgrade:头部触发
* 102Processing：表示服务器已经收到并正在处理请求，但无响应可用。  

2、2xx：成功处理请求  
* 200OK：成功返回响应
* 201Created：有新资源在服务器端被成功创建
* 202Accepted：服务器接收并开始处理请求，但请求未处理完成
* 203Non-Authoriative Informatino：当代理服务器修改了origin server的原始响应包体时，代理服务器可以通过修改200为203方式告知客户端这一事实
* 204No Content：成功执行了请求且不携带响应包体，并暗示客户端无需更新当前的页面
* 205Reset Content：成功执行了请求且不携带响应体，同时指明客户端需要更新当前页面
* 206Partial Content：使用range协议时返回部分响应内容的响应码
* 207Multi-Status：在WEBDAV协议中以XML返回多个资源的状态
* 208Already Reportd：为避免相同集合下资源在207响应码下重复上报，使用208可以使用父集合的响应码

3、3xx：重定向使用Location指向的资源或者缓存中的资源。而且规定客户端重定向次数不应该超过5次，以防止死循环。
* 300Multiple Choiecs：资源有多种表述，通过300返回给客户端后由其自行选择访问哪一种表述。
* 301Moved Permanently：资源永久性的重定向到另一个URI中
* 302Found：资源临时的重定向到另一个URI中。
* 303See Other：重定向到其他资源，常用于POST/PUT等方法的响应中。
* 304Not Modified：当客户端拥有可能过期的缓存时，会携带缓存的标示etag、时间等信息询问服务器缓存是否仍可复用，而304是告诉客户端可以重用缓存
* 307Temporary Redirect：类似302，但明确重定向后请求方法必须与原请求方法相同，不得改变。

4、4xx：客户端出现错误
* 400Bad Request：服务器认为客户端出现了错误，但不能明确判断为一下哪种错误时，使用此错误码
* 401Unauthorized：用户认证信息确实或者不正确，导致服务器无法处理请求
* 403Forbidden：服务器理解请求的含义，但没有权限执行此请求
* 404Not Found：服务器没有找到对应的资源
* 405Method Not Allowed：服务器不支持请求行中的method方法
* 406Not Acceptable：对客户端指定的资源表述不存在，服务器返回表述列表供客户端选择
* 407Proxy Authentication Required：对需要经由代理的请求，认证信息未通过服务器的验证
* 408Reqest Timeout：服务器接收请求超时
* 409Confli：资源冲突
* 410Gone：服务器没有找到对应的资源，且明确的知道该位置永久性找不到该资源
* 411Length Required：如果请求含有包体且为携带Content-Length头部，且不属于chunk类请求时返回
* 412Precondition Failed：复用缓存时传递的If-Umodified-Since或If-None-Match头部不被满足
* 413Payload Too Large/Request Entity Too Large：请求的包体超出服务器能处理的最大长度
* 414URI Too Long：请求的URI超出服务器能接受的最大长度
* 415Unsupported Media Type：上传的文件类型不被服务器支持
* 416Range Not Satisfiable：无法提供Range请求中的指定的那段包体
* 417Expectation Failed：对于Expect请求头部期待的情况无法满足时的响应码
* 421Misdirected Request：服务器认为这个请求不该发给它，因为它没能力处理
* 426Upgrade Required：服务器拒绝基于当前HTTP协议提供服务，通过Upgrade头部告知客户端必须升级协议才能继续处理
* 428Precondition Required：用户请求中缺失了条件类头部，例如If-Match
* 429Too Many Requests：客户端发送请求的速率过快
* 431Request Header Fields Too Large：请求的HEADER头部大小超出限制
* 451Unavailable For Legal Reasons：由于法律原因不可访问

5、5xx：服务器出现错误
* 500Internal Server Error：服务器内部错误，且不属于以下错误类型
* 501Not Implemented：服务器不支持实现请求所需要的功能
* 502Bad Gateway：代理服务器无法获取到合法资源
* 503Service Unavailable：服务器资源尚未准备好处理当前请求
* 504Gateway Timeout：代理服务器无法及时的从上游获得响应
* 505HTTP Verson Not Supported：请求使用的HTTP协议版本不支持
* 507Insufficient Storage：服务器没有足够的空间处理请求
* 508Loop Detected：访问资源时检测到循环
* 511Network Authentication Required：代理服务器发现客户端需要进行身份验证才能获得网络访问权限


### 总结
学习ABNF语法，有助于我们更好的理解和更为严谨学习HTTP协议。

