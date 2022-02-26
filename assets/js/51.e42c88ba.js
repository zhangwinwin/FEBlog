(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{449:function(e,t,v){"use strict";v.r(t);var _=v(57),s=Object(_.a)({},(function(){var e=this,t=e.$createElement,v=e._self._c||t;return v("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[v("h2",{attrs:{id:"前言"}},[e._v("前言")]),e._v(" "),v("p",[e._v("之所以会写这么一篇文章，是因为我之前对HTTP没有一个整体的认识。工作3年来，时时刻刻都在使用HTTP协议，也曾写过几篇关于HTTP的某些细节的介绍和用法。但每当有人问起什么是HTTP的时候，总是卡住不知道说些什么。总不能说这么多年对HTTP的使用就是调库吧（不是🤐）。")]),e._v(" "),v("p",[e._v("发生这种情况一般是因为我们学HTTP时的用了一个低效的方法论——知识硬啃。有多少人像我一样打算通过《HTTP权威指南》来学习HTTP的知识，或者直接阅读RFC2616（我直呼大神）。结果是无功而返，看完等于没看，或者根本看不下去，因为知识真的太枯燥了！")]),e._v(" "),v("p",[e._v("有一种相对高效的方法论-"),v("strong",[e._v("WHAT-HOW-WHY")]),e._v("。")]),e._v(" "),v("p",[e._v("当面对一个新的知识点，如果上来直接讲原理，大概多数人都会懵逼")]),e._v(" "),v("p",[e._v("但如果从表象出发：")]),e._v(" "),v("ul",[v("li",[e._v("What - 先了解这个东西是什么？")]),e._v(" "),v("li",[e._v("How - 再了解这个东西它是怎么使用的？")]),e._v(" "),v("li",[e._v("Why - 最后再去了解这个东西的原理和为什么实现成这个样子的。")])]),e._v(" "),v("p",[e._v("那么这个学习过程就不会太过枯燥，多提问why，再去主动搜索资料解答。这种将被动死记硬背转换成主动学习方式更能长时间的保存记忆。")]),e._v(" "),v("p",[e._v("大家或多或少的知道点HTTP概念和怎么使用HTTP（调库🤭），所以本文选择WHY的角度来讲HTTP，希望能帮助到大家。")]),e._v(" "),v("h2",{attrs:{id:"why-http的形成"}},[e._v("WHY-HTTP的形成")]),e._v(" "),v("p",[e._v("在学习HTTP的过程中，或者更广泛的应用到学习其他计算机技术时，请记住这句话："),v("strong",[e._v("form follows function")]),e._v("！"),v("br"),e._v("\n功能决定形式。当你疑惑HTTP为什么要设计成这样的时候，你就得去了解HTTP是要解决什么问题。")]),e._v(" "),v("p",[e._v("说起HTTP就不得不提起它的主要作者：Roy Fielding以及他的那篇大名鼎鼎的论文"),v("a",{attrs:{href:"https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm",target:"_blank",rel:"noopener noreferrer"}},[e._v("《Architectural Styles and the Design of Network-based Software Architectures》"),v("OutboundLink")],1)]),e._v(" "),v("p",[e._v("Roy Fielding在这篇论文中的提到HTTP创建的原因:")]),e._v(" "),v("blockquote",[v("p",[e._v("Berners-Lee writes that the \"Web's major goal was to be a shared information space through which "),v("strong",[e._v("people")]),e._v(" and "),v("strong",[e._v("machines")]),e._v(' could communicate."')])]),e._v(" "),v("p",[e._v("Berners-Lee老爷子就是world-wide-web万维网的创始人，他说到万维网的主要目的是人和机器能够交流以及分享信息空间。重点是人和机器！")]),e._v(" "),v("p",[e._v("结合rfc2616中提到：")]),e._v(" "),v("blockquote",[v("p",[e._v("HTTP is the foundation of data communication for the World Wide Web")])]),e._v(" "),v("p",[e._v("也就是说HTTP是为了人和机器能够交流以及分享信息这个万维网主要目的而实现的这么一种协议。这就能说明很多问题：")]),e._v(" "),v("ul",[v("li",[e._v("不知道大家有没有想过，为什么HTTP协议报文是用ASCII码编写的，而其他协议报文是二进制格式（比如TCP、IP协议）。就是因为要服务于人，要便于人去阅读。")]),e._v(" "),v("li",[e._v("为什么脚本，样式运行在客户端？因为便于人操作和人看起来美观。")])]),e._v(" "),v("h3",{attrs:{id:"实现万维网必须面对的问题"}},[e._v("实现万维网必须面对的问题")]),e._v(" "),v("p",[e._v("实现万维网，web架构必须面对以下问题。Roy Fielding在论文中提到："),v("br"),e._v("\n(1) "),v("strong",[e._v("低门槛")]),e._v("：万维网的用户不仅仅是计算机从业人员，还是使用浏览器访问网站的普罗大众，所以要简单和通用，这也是选择Hypertext的主要原因。")]),e._v(" "),v("p",[e._v("(2) "),v("strong",[e._v("可扩展性")]),e._v("：虽然简单性使得部署分布式系统的初始实现成为可能，但可扩展性能够避免永远陷入部署的限制。 即使可以构建一个完全符合用户需求的软件系统，这些需求也会随着时间的推移而变化，一个想要像Web一样长期存在的系统必须准备好接受变化。")]),e._v(" "),v("p",[e._v("(3) "),v("strong",[e._v("分布式系统下的超媒体")]),e._v("：分布式超媒体允许将演示和控制信息存储在远程服务器。也就是说，分布式超媒体系统中的用户操作需要将大量数据从数据存储位置传输到客户端。因此，必须为大粒度数据传输设计Web架构。")]),e._v(" "),v("p",[e._v("(4) "),v("strong",[e._v("互联网规模")]),e._v("：万维网旨在成为一个互联网规模的分布式超媒体系统，这意味着不仅仅是地理上的分散。互联网是关于跨越多个组织边界的互连信息网络。信息服务供应商必须能够应对Anarchic可扩展性和软件组件独立部署的需求。")]),e._v(" "),v("ul",[v("li",[v("p",[e._v("Anarchic可扩展性：Anarchic是无秩序，无政府的意思。大多数软件系统的建立都有一个隐含的假设，就是整个系统都在一个实体的控制之下。但当一个系统在互联网上公开运行时，不能做出这个假设。Anarchic可扩展性是指当给定格式错误或者恶意构造的数据时，需要继续运行架构，因为它们可能与组织/政府控制之外的元素进行通信。多个组织边界意味着在任何通讯都可能存在多个信任边界。应用在交互中应该假设收到的任何信息都是不可信的，或者在给与信任之前需要一些额外的身份验证。")]),e._v(" "),v("p",[v("em",[e._v("HTTP提供了认证机制：基本认证机制与摘要认证机制")])])]),e._v(" "),v("li",[v("p",[e._v("独立部署：多个组织边界还意味着系统必须为渐进和碎片化的变化做好准备，在这个变化中需要新旧系统实现共存。")])]),e._v(" "),v("li",[v("p",[e._v("向前兼容：自1993年使用HTTP/0.9， 1996年使用HTTP/1.0。后续版本需要兼容前面的版本。")]),e._v(" "),v("p",[v("em",[e._v("HTTP被设计由主要和次要版本号区分，服务器必须遵守对包含在每个消息中的HTTP版本协议的约束。统一由http://进行访问。")]),v("br"),e._v(" "),v("em",[e._v("使用Upgrade头部兼容HTTP2和WebSocket协议")])])])]),e._v(" "),v("h3",{attrs:{id:"rest架构风格"}},[e._v("REST架构风格")]),e._v(" "),v("p",[e._v("Roy Fielding提出了一种REST架构风格试图解决上述问题。")]),e._v(" "),v("p",[e._v("REST全称："),v("strong",[e._v("Representtational State Transfer")]),e._v("，翻译成中文就是表述性状态转移。Roy Fielding提出的一组架构约束条件和原则，任何满足REST约束条件和原则的架构，都称为RESTful架构。")]),e._v(" "),v("p",[e._v("首先从表述和状态转移这两个关键词去理解REST")]),e._v(" "),v("ul",[v("li",[e._v("表述\nRESTful架构是基于资源的架构，资源的含义是广泛：任何可以命名的信息都可以是资源。比如文档、图像、时间服务等，资源是到一组实体的概念映射。")])]),e._v(" "),v("p",[e._v("所以表述指的是资源的某种形式的表示，通常是某个具体的URI。("),v("a",{attrs:{href:"https://juejin.cn/post/6844904167920631822",target:"_blank",rel:"noopener noreferrer"}},[e._v("有关URI的知识可看我的这篇文章"),v("OutboundLink")],1),e._v(")")]),e._v(" "),v("p",[e._v("那么怎样才算是一个REST风格的URI呢？重点是"),v("strong",[e._v("名词")]),e._v("。")]),e._v(" "),v("div",{staticClass:"language-html line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-html"}},[v("code",[e._v("http://example.com/tickets/1111\nhttp://example.com/orders/2021/12/25\n")])]),e._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[e._v("1")]),v("br"),v("span",{staticClass:"line-number"},[e._v("2")]),v("br")])]),v("p",[e._v("应该让调用者很容易地推测出URI的含义，它们明显地标识着单一的资源。")]),e._v(" "),v("div",{staticClass:"language-http line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-http"}},[v("code",[v("span",{pre:!0,attrs:{class:"token header"}},[v("span",{pre:!0,attrs:{class:"token header-name keyword"}},[e._v("http")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),v("span",{pre:!0,attrs:{class:"token header-value"}},[e._v("//example.com/tickets")])]),e._v("\n"),v("span",{pre:!0,attrs:{class:"token header"}},[v("span",{pre:!0,attrs:{class:"token header-name keyword"}},[e._v("http")]),v("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),v("span",{pre:!0,attrs:{class:"token header-value"}},[e._v("//example.com/orders/2021")])]),e._v("\n")])]),e._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[e._v("1")]),v("br"),v("span",{staticClass:"line-number"},[e._v("2")]),v("br")])]),v("p",[e._v("但请观察这两个URI与上面的区别。可以看到，这两个URI并不是对某个单一事物的标识，而是对一类事物集合的标识（假如第一个URI表示所有的门票，第二个则是对2021年的所有订单）。这些集合本身也是资源，也应该被标识。")]),e._v(" "),v("p",[e._v("可以看到无论是tickets还是orders都是用"),v("strong",[e._v("复数")]),e._v("的形式去标识资源，这是合适的。尽管语文老师可能反对用复数表示单个资源，但为了保持简单并且保持URI格式一致，统一使用复数好处多多，也不必再为了选择person还是people而烦恼。")]),e._v(" "),v("p",[v("em",[e._v("资源可以有很多种表述，比如不同语言的翻译，不同压缩方式等。HTTP用内容协商的方式去解决这种场景。")])]),e._v(" "),v("ul",[v("li",[e._v("状态转移\n状态指的是资源状态。资源状态存储在服务器中，客户端通过RESTful API，指定请求方法、资源路径和资源表述，对资源的状态进行CRUD从而改变资源的状态，称为状态转移。")])]),e._v(" "),v("p",[e._v("定义好资源后，这时候就需要确定哪些操作适用于它们以及这些操作将如何映射到API。RESTful提供了使用HTTP方法处理CRUD操作的策略，比如说：")]),e._v(" "),v("div",{staticClass:"language-http line-numbers-mode"},[v("pre",{pre:!0,attrs:{class:"language-http"}},[v("code",[e._v("GET /tickets - 获取所有的门票\nGET /tickets/12 - 获取某一张的门票\nPOST /tickets - 创建一张新门票\nPUT /tickets/12 - 修改某一张的门票信息\nPATCH /tickets/12 - 部分修改某一张的门票信息\nDELETE /tickets/12 - 删除某一张门票\n")])]),e._v(" "),v("div",{staticClass:"line-numbers-wrapper"},[v("span",{staticClass:"line-number"},[e._v("1")]),v("br"),v("span",{staticClass:"line-number"},[e._v("2")]),v("br"),v("span",{staticClass:"line-number"},[e._v("3")]),v("br"),v("span",{staticClass:"line-number"},[e._v("4")]),v("br"),v("span",{staticClass:"line-number"},[e._v("5")]),v("br"),v("span",{staticClass:"line-number"},[e._v("6")]),v("br")])]),v("p",[e._v("REST的伟大之处在于可以利用现有的HTTP方法在单个/tickets 端点上实现重要的功能。无需遵循任何方法命名约定，URI结构干净清晰。")]),e._v(" "),v("p",[e._v("Roy fielding在论文中从一个空架构开始一步步加约束推导出REST架构风格\n"),v("img",{attrs:{src:"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd78cc82bc104c25880663141450cd13~tplv-k3u1fbpfcp-watermark.image?",alt:"image.png"}})]),e._v(" "),v("h4",{attrs:{id:"rest的约束条件"}},[e._v("REST的约束条件")]),e._v(" "),v("p",[e._v("REST的约束条件有：")]),e._v(" "),v("ul",[v("li",[e._v("客户端-服务器")]),e._v(" "),v("li",[e._v("无状态")]),e._v(" "),v("li",[e._v("缓存")]),e._v(" "),v("li",[e._v("统一接口")]),e._v(" "),v("li",[e._v("分层系统")]),e._v(" "),v("li",[e._v("按需代码（可选）")])]),e._v(" "),v("p",[e._v("（1）客户端-服务器"),v("br"),e._v("\n客户端-服务器模式能够将用户界面问题与数据存储问题分开，提高了用户界面跨多个平台的可移植性，并通过简化服务器组件提高了可扩展性。对Web最重要的是分离允许组件独立发展，从而支持多个组织域的互联网规模需求。\n"),v("img",{attrs:{src:"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0983ad28953341e0a5dbcac25f7767ee~tplv-k3u1fbpfcp-watermark.image?",alt:"image.png"}}),e._v("\n资源存储在服务器上，客户端向服务器发送HTTP请求，服务器在HTTP响应中返回所请求的资源。所以客户端-服务器共同构成了web的基本组件。")]),e._v(" "),v("p",[e._v("（2）无状态"),v("br"),e._v("\n通信本质上必须是无状态的，也就是说指两次请求之间不存在依赖关系，这样从客户端到服务器必须包含请求的所需的所有信息，并且不能在服务器上存储任何上下文。这种约束导致了可见性、可靠性和可伸缩性得到了改善。缺点就是在一系列请求中发送重复的请求头信息。")]),e._v(" "),v("p",[v("em",[e._v("HTTP用cookie机制解决了识别用户，持久会话的场景")])]),e._v(" "),v("p",[e._v("（3）缓存"),v("br"),e._v("\n缓存约束条件主要是用于改善网络的效率。缓存约束条件要求一个请求的响应中的数据被隐式地或显式地标记为可缓存的或不可缓存的。如果响应是可缓存的，那么客户端缓存就可以为以后的相同请求重用这个响应的数据，减少了网络交互，提高了效率、可伸缩性和用户感知的性能。")]),e._v(" "),v("p",[v("em",[e._v("HTTP缓存分为共享缓存与私有缓存")])]),e._v(" "),v("p",[e._v("（4）统一接口"),v("br"),e._v("\n将REST架构风格与其他基于架构的风格区分开来的核心特征是它强调组件之间的统一接口。通过将通用性的软件工程原理应用于组件接口，简化了整个系统架构并提高了交互的可见性。实现与它们提供的服务分离，这鼓励了独立的可进化性。")]),e._v(" "),v("p",[e._v("然而，统一接口的代价是降低效率，因为信息是以标准化的形式而不是特定于应用程序需求的形式传输的。RESTful接口被设计为高效的大粒度超媒体数据传输，针对Web的常见情况进行优化，但导致接口对于其他形式的架构交互不是最佳的。")]),e._v(" "),v("p",[e._v("（5）分层"),v("br"),e._v("\n分层系统架构约束条件将架构分为若干层，划定每一层的边界，从而降低每一层设计的复杂度。同时，通过分层，可以抽象底层的异构性，给上层提供统一的接口，简化上层的逻辑。")]),e._v(" "),v("p",[e._v("（6）按需代码"),v("br"),e._v("\nREST允许通过下载和执行小程序或脚本形式的代码来扩展客户端功能。这通过减少需要预先实现的功能数量来简化客户端。允许在部署后下载功能提高了系统可扩展性。但是，它也会降低可见性，因此它只是REST中的一个可选约束。")]),e._v(" "),v("h3",{attrs:{id:"基于tcp协议"}},[e._v("基于TCP协议")]),e._v(" "),v("p",[e._v("世界上几乎所有的HTTP通信都是由TCP承载的，客户端app打开一条TCP连接，连接到可能运行在世界任何地方的服务器app中。一旦连接建立，在客户端和服务器的计算机之间交换的报文就永远不会丢失、受损或是失序。")]),e._v(" "),v("h4",{attrs:{id:"tcp协议"}},[e._v("TCP协议")]),e._v(" "),v("p",[e._v("HTTP连接实际上就是TCP连接和一些使用连接的规则。TCP连接是因特网上可靠的连接。想要正确、快速地发送数据，就需要了解TCP的一些基本认识。")]),e._v(" "),v("p",[e._v("TCP是一个面向连接、可靠的、基于字节流的传输层通讯协议。传输层协议指的是为运行在不同主机上应用程序进程之间的逻辑通讯。")]),e._v(" "),v("ul",[v("li",[v("p",[e._v("面向连接：1对1才叫面向连接（客户端与服务器机制），在HTTP报文开始发出前，TCP会先让客户与服务器之间互相交换TCP控制信息。这个握手过程提示客户端与服务器，使它们为大量分组的到来做好准备。在握手阶段后，一个TCP连接就在两个进程的套接字之间建立起来。这条连接是全双工的，即连接双方的进程可以在此连接上进行报文的收发。")])]),e._v(" "),v("li",[v("p",[e._v("可靠的数据传输：通信进程能够依靠TCP、无错误、按适当顺序交付所有发送的报文。当应用程序的一端将字节传进套接字时，它能够依靠TCP将相同的字节流交付给接收方的套接字，而没有字节的丢失和冗余。")])]),e._v(" "),v("li",[v("p",[e._v("基于字节流：消息是没有边界的，所以无论多大的消息都能传输。并且消息是按序的，当前一个报文丢失，后续的报文都不能用，只有重发丢失的报文之后才能用先前接收到的后续报文。")])])]),e._v(" "),v("p",[e._v("可能大家一开始看HTTP报文格式的时候，不会注意（也有很多文章不会提及）"),v("strong",[e._v("每一行都有明确的分段：crlf")]),e._v(" "),v("img",{attrs:{src:"https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20b911442bef4a138c6ff713ddec74f4~tplv-k3u1fbpfcp-watermark.image?",alt:"image.png"}}),e._v("\n这是为了适应TCP而设计的。TCP是基于字节流，当大报文传进TCP时，根据握手双方而制定的报文段大小（称为MSS），会将报文分为很多段。TCP只负责传输报文段，而不会做边界处理，这就需要HTTP来划分边界。除实体之外的HTTP报文要以crlf分段处理。")]),e._v(" "),v("p",[e._v("报文的实体主体（包体）一样需要边界处理。HTTP包体传输有两种方式：")]),e._v(" "),v("ul",[v("li",[e._v("定长包体，使用Content-Length表示。当Content-Length小于实际包体字节数，浏览器就会抛弃后续的字节。如果大于，则会报错。")]),e._v(" "),v("li",[e._v("不定长包体，使用Transfer-Encoding指明使用chunk传输。将包体分为一个个chunk传输，最后一个chunk使用last-chunk表明，最后携带包体总长度。")])]),e._v(" "),v("h3",{attrs:{id:"回过头来"}},[e._v("回过头来")]),e._v(" "),v("p",[e._v("由于篇幅原因，还没提到的内容留给读者去挖掘解读。"),v("br"),e._v("\n这时候再回过头看RFC7230中HTTP定义，这些个形容词是不是就显示通俗易懂拉？")]),e._v(" "),v("blockquote",[v("p",[e._v("The Hypertext Transfer Protocol (HTTP) is a "),v("em",[e._v("stateless")]),e._v(" "),v("em",[e._v("application-level")]),e._v(" "),v("em",[e._v("request/response")]),e._v(" protocol that uses "),v("em",[e._v("extensible semantics")]),e._v(" and "),v("em",[e._v("self-descriptive")]),e._v(" message payloads for "),v("em",[e._v("flexible")]),e._v(" interaction with network-based "),v("em",[e._v("hypertext")]),e._v(" information systems")])])])}),[],!1,null,null,null);t.default=s.exports}}]);