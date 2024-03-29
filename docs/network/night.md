---
title: 一文弄清“缓存”
---

## 前言
缓存是指：为了降低服务器端的访问频率，减少通信数量，前端将获取的数据信息保存下来，当再次需要时，就使用所保存的数据。

缓存对用户体验和通信成本都会造成很大的影响，所以要尽可能地去灵活使用缓存机制。

## 缓存的工作原理
`HTTP`缓存是一个以时间为维度的缓存。

浏览器在第一次请求中缓存了响应，而后续的请求可以从缓存提取第一次请求的响应。从而达到：减少时延而且还能降低带宽消耗，因为可能压根就没有发出请求，所以网络的吞吐量也下降了。

### 工作原理
浏览器发出第一次请求，服务器返回响应。如果得到响应中有信息告诉浏览器可以缓存此响应。那么浏览器就把这个响应缓存到浏览器缓存中。

如果后续再发出请求时，浏览器会先判断缓存是否过期。如果没有过期，浏览器压根就不会向服务器发出请求，而是直接从缓存中提取结果。

比如：访问掘金站点  
<img src='//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d16ed48d598041c2a369ad19a263b1c4~tplv-k3u1fbpfcp-zoom-1.image' width='600'>  
从`Size`中可以看出，`disk cache`是从硬盘中提取的缓存信息。

### 缓存过期了
如果缓存过期了，也并不一定向第一个请求那样服务器直接返回响应。

浏览器的缓存时间过过期了，就把该请求带上缓存的标签发送给服务器。这时如果服务器觉得这份缓存还能用，那就返回304响应码。浏览器将继续使用这份缓存。

比如：选择上面图中的其中一份缓存文件，`copy`请求`url`在`curl`中展示
<img src='//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be4f609f804b4745b3552533936c8074~tplv-k3u1fbpfcp-zoom-1.image' width='600'>  
首先加`-I`获取原始请求，查看`etag`或`last-modified`头部。

因为浏览器缓存过期之后，请求就会带上这些头部一起发送给服务器，让服务器判断是否还能用。  
针对`etag`头部，加一个`if-none-match`头部带上`etag`的值询问服务器。当然也可以针对`last-modified`头部，加一个`if-modified-since`头部询问。    
<img src='//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/23c740f21baf4d67b6bf8767e2df4a1e~tplv-k3u1fbpfcp-zoom-1.image' width='600'>  
返回的是304。304的好处就是不携带包体，也就是说`content-length`为0，这样就节省了大量的带宽。

### 共享缓存
浏览器缓存是私有缓存，只提供给一个用户使用的。

而共享缓存是放在服务器上的，可以提供多个用户使用。比如说某个比较热点的视频等热点资源就会放在代理代理服务器的缓存中，以减低源服务器的压力，提升网络效率。

怎么分辨这个资源是代理服务器的缓存还是源服务器发送的呢？  

仍然使用掘金的例子  
<img src='//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40e67ef6cf934fd887d534b653756f10~tplv-k3u1fbpfcp-zoom-1.image' width='600'>  
从图中看出这个请求的`Response Headers`中的`age`头部，单位是秒。

说明这个缓存是共享缓存返回的，`age`说明了它在共享缓存存在的时间，图中是327784，也就是在共享缓存中存在了327784秒。

共享缓存也有过期的时候，下面看看共享缓存的工作原理。  
<img src='//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/184a2e4246964b0da7d7ea734fec4629~tplv-k3u1fbpfcp-zoom-1.image' width='500'>  
如图所示：   
1、当`client1`发起请求时，`Cache`也就是代理服务器（共享缓存），转发这条请求给源服务器。源服务器返回响应，并在`Cache-Control`头部中设定可以缓存100秒。接着在`Cache`中就会开启一个定时器`Age`，将响应带上`Age：0`头部返回给`client1`。  

2、过了10秒后，`client2`发送相同的请求，`Cache`中的缓存还没有过期，就带上`Age：10`头部返回缓存中的响应给`client2`。

3、过了100秒后，`client3`发送同样的请求，这时`Cache`中的缓存已经过期了，就像前面说到那样用条件请求头部`If-None-Match`带上缓存的指纹发给源服务器。当源服务认为此缓存还能用，就返回304状态码给`Cache`。`Cache`就重新计时，从缓存中找出响应带上`Age：0`头部返回给`Client3`。

## 缓存机制
`HTTP`协议中存在相关的缓存机制，`API`中也可以直接使用这些机制来管理缓存。`HTTP`的缓存机制在`RFC7234`中进行了详细的定义，分为：过期模型`(Expiration Model)`和验证模型`(Validation Model)`两类
* 过期模型是指预先决定响应数据的保存期限，当到达期限后就会再次访问服务器端来重新获得所需的数据
* 验证模型是指会轮询当前保存的缓存数据是否为最新数据，并只在服务器端进行数据更新时，才会重新获得数据。

在`HTTP`中，缓存处于可用的状态时称为`fresh`（新鲜）状态，而处于不可用的状态时则称为`stale`（不新鲜）状态。

### 过期模型
过期模型可以通过服务器的响应消息里包含何时过期的信息来实现。`HTTP1.1`中定义了两种实现方法：一个方法是用`Cache-Control`响应消息首部，另一个方法就是用`Expires`响应消息首部。
```
// 1
Expires: Fri, 01 Oct 2020  00:00:00 GMT
// 2
Cache-Control: max-age=3600
```
`Expires`首部从`HTTP1.0`就已经存在了，它是用绝对时间来表示到期，并使用`RFC1123`中定义的时间格式来描述。`Cache-Control`则是`HTTP1.1`中定义的表示从当前时间开始所经过的秒数。

这两个首部该使用哪个，则是由返回的数据的性质决定的。对于一开始就知道在某个特定的日期会更新的数据，比如天气预报这种每天在相同时间进行更新的数据，可以使用`Expires`首部来指定执行更新操作的时间。对于今后不会使用更新的数据或静态数据等，可以通过指定一个未来非常遥远的日期，使得获取的缓存数据始终保存下去。但根据`HTTP1.1`的规定，不允许设置超过1年以上的时间，因此未来非常遥远的时间最多也只能是1年后的日期了。
```
Expires: Fri, 01 Oct 2021  00:00:00 GMT
```

而对于不是定期更新，但如果更新频率在某种程度上是一定的，或者虽然更新频率不低但不希望频繁访问服务器端，对于这种情况可以使用`Cache-Control`首部。

如果`Expires`和`Cache-Control`首部同时使用时，`Cache-Control`首部优先判断。

上面`Cache-Control`示例中使用到了`max-age`关键字，`max-age`计算会使用名为`Date`的首部。该首部用来显示服务器端生成响应信息的时间信息。从该时间开始计算，当经过的时间超过`max-age`值时，就可以认为缓存已到期。
```
Date: Expires: Fri, 30 Sep 2020  00:00:00 GMT
```
`Date`首部表示服务器端生成响应信息的时间信息。根据`HTTP`协议的规定，除了几个特殊的情况之外，所有的`HTTP`消息都要加上`Date`首部。

`Date`首部的时间信息必须使用名为`HTTP`时间的格式来描述。在计算缓存时间时，会用到该首部的时间信息，这时就可以使用`Date`首部信息来完成时间的同步操作，做到即便客户端擅自修改日期等配置信息。

### 验证模型
与到期模型只根据所接收的响应信息来决定缓存的保存时间相对，验证模型采用了询问服务器的方式来判断当前时间所保存的缓存是否有效。

验证模型在检查缓存的过程中会不时地去访问网络。在执行验证模型时，需要应用程序服务器支持附带条件地请求。附带条件地请求是指前端向服务器端发送地“如果现在保存地信息有更新，请给我更新后地信息”。在整个处理的过程中，前端会发送同“过去某个时间点所获得的数据”有关的信息，随后只有在服务器端的数据发生更新时，服务器端才会返回更新的数据，不然就只会返回`304(Not Modified)`状态码来告知前端当前服务器端没有更新的数据。

要进行附带条件的请求，就必须向服务器端传达“前端当前保存的信息的状态”，为此需要用到最后更新日期或实体标签`（Entity Tag）`作为指标。顾名思义，最后更新日期表示当前数据最后一次更新的日期：而实体标签则是表示某个特定资源版本的标识符，十一串表示指纹印`（Finger Print)`的字符串。例如响应数据的MD5散列值等，整个字符串会随着消息内容的变化而变化。这些信息会在服务器端生成，并被包含在响应信息的首部发送给前端，前端会将其缓存一同保存下来，用于附带条件的请求。

最后更新日期和实体标签会被分别填充到`Last-Modified`和`ETag`响应消息首部返回给前端
```
Last-Modified: Fri, 01 Oct 2021  00:00:00 GMT
ETag: 'ff568sdf4545687fadf4dsa545e4f5s4f5se45'
```
前端使用最后更新日期执行附带条件的请求时，会用到`Modified-Since`首部。在使用实体标签时，会用到`If-None-Match`首部
```
GET /v1/user/1
If-Modified-Since: Fri, 01 Oct 2021  00:00:00 GMT

GET /v1/user/1
If-None-Match: 'ff568sdf4545687fadf4dsa545e4f5s4f5se45'
```
服务器端会检查前端发送过来的信息和当前信息，如果没有发生更新则返回304状态码。如果有更新，则会同应答普通请求一样，在返回200状态码的同时将更新内容一并返回给前端，这时也会带上新的最后更新日期和实体标签。当服务器返回304状态码时，响应消息为空，从而节约了传输的数据量。

在`HTTP`协议中，`ETag`有强验证与弱验证两个概念。
* 执行强验证的`ETag`  
  `ETag: 'ffsd5f46s12wef13we2f13dsd21fsd32f1'`
  
* 执行弱验证的`ETag `  
  `ETag: W/'ffsd5f46s12wef13we2f13dsd21fsd32f1'`
  
强验证是指服务器端同客户端的数据不能有一个字节的差别，必须完全一样；而弱验证是指即使数据不完全一样，只要从资源意义的角度来看没有发生变化，就可以视为相同的数据。例如广告信息，虽然每次访问时这些广告的内容都会有所改变，但它们依然是相同的资源，这种情况下便可以使用弱验证。

### 启发式过期
`HTTP1.1`里提到了当服务器端没有给出明确的过期时间时，客户端可以决定大约需要将缓存数据保存多久。这时客户端就要根据服务器端的更新频率、具体状况等信息，自行决定缓存的过期时间，这个方法称为启发式过期。

例如前端通过观察`Last-Modified`，如果发现最后一次更新是在1年前，那就意味着再将缓存数据保存一段时间也不会有什么问题；如果发现到目前为止访问的结果是1天只有1次更新，那就意味着将缓存保存半天的时间或许可行。像这样，前端能通过独立判断来减少访问次数。

虽然`API`是否允许使用启发式过期的方法取决于API的特性，但由于服务端对缓存的更新和控制理解最为深刻，因此服务器端通过`Cache-Control`、`Expires`等准确无误地向前端返回“将缓存数据保存多久”的信息，对于交互双方而言都是比较理想的做法。但如果不返回，服务器端就需要通过`Last-Modified`等首部信息来告知前端

### 使用`Vary`指定缓存单位
在实施缓存时可能还需要同时指定`Vary`首部。在实施缓存时，`Vary`用于指定除`URI`外使用哪个请求首部项目来确定唯一的数据。使用`Vary`是因为即使`URI`相同，获取的数据有时也会因请求首部内容的不同而发生变化。只有`vary`头部指定的头部必须与请求中的头部相匹配才能使用缓存。

`vary`的定义：
* "*"： 意味着一定匹配失败
* 1个或多个`field-name`：指定的头部必须与请求中的头部相匹配才能使用缓存

<img src='//p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5ae1409731841b6a2c2daf0de48060c~tplv-k3u1fbpfcp-zoom-1.image' width='500'>  

如图所示：  
1、 当`Client1`携带`Accept-Encoding：*`头部的`GET`请求发送给`server`。`server`返回的是`gzip`编码的响应，以及`vary：Content-Encoding`头部，表示着编码方式一样的时候才能使用缓存。  

2、当`Client2`携带`Accept-Encoding：br`头部的`GET`请求发送给`server`，这时请求的是`br`编码。所以`Cache`不能使用缓存，因为不匹配`vary`的中的值，只能转发请求给源服务器`server`。

3、当`Client3`携带`Accept-Encoding：br`头部的`GET`请求发送给`server`，这时`Cache`有`br`编码的缓存，能匹配`vary`头部的值，所以能使用缓存返回。

一般而言，`Vary`首部用于HTTP经由代理服务器进行交互的场景，特别是在代理服务器拥有缓存功能时。但是有时服务端无法得知前端的访问是否经由代理服务器，这种情况下就需要用到服务器驱动的内容协商机制，`Vary`首部也就成了必选项。

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
