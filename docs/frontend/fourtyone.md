---
title: 献给在这铜三铁四中寻找工作的前端的一份面试复习计划
---

## 前言
在公司工作一年后，可以尝试一下每半年时间在市场上试一试水，这样做的好处：
* 第一、可以了解一下现在的大公司的岗位要求，作为今后学习的重点。
* 第二、可以了解一下大公司的面试流程，为以后跳槽打下基础。因为有很多有实力的程序员因为不熟悉流程而没准备某些方面内容，从而挂了的情况。

**问：八股文是必须的吗？**  
答：八股文确实不是必须的。但可以想一想，一个公司仅凭几次面试就能全面了解一个程序员的实力了吗？是不可能的，这涉及到一个成本问题，考察一个程序员的基础能力，最简单的方法就是考察目前流行的技术。

这时候八股文就能起到一个题海的作用，当然并不是千篇一律的回答就能满足面试官的要求，回答要有自己的见解以及一定的深度。八股文只是列出一些问题，而这些问题的答案需要自己去挖掘和深究。

## 简历
推荐阅读：
* [一份优秀的前端开发工程师简历是怎么样的？](https://www.zhihu.com/question/23150301/answer/1229870117)
* [如何写「前端简历」，能敲开字节跳动的大门？](https://mp.weixin.qq.com/s/py_HLqOjNdL4l0CZHjMwqw)
简历模版：
* [超级简历](https://www.wondercv.com/cvs)

总的来说，一份优秀的简历应该满足以下三个条件：
* 技术能力的描述真实清晰，切中招聘方需求。
* 项目经历的描述完整、具体，能体现自身价值。
* 有博客或开源作品、社区贡献等，这些会让你更具竞争力。

第一、简历中技术能力的描述要切中招聘方的需求，也就是说要针对每一个家公司的JD都要微调一下简历。千万不能一份简历就吃遍天。  

第二、项目要熟悉，最好是把项目介绍、总体设计、应用场景、难题以及解决方案都写下来准备好，避免临时发挥（口才好的忽略）。阿里真题：你觉得你自己最满意的一个项目是什么？ 选一个切合JD的项目，完整而流畅的介绍项目，重点是说出关于项目的理解与遇到什么难题以及怎么解决。

第三、面试前几个月可以按周更新一下博客；github也类似，充满颜色才是最好的。

## 有关浏览器面试题
要求三年以上的岗位，浏览器相关的知识可谓是重中之重，掌握得越详细越好。

### 从输入URL到页面展示，这中间发生了什么？
这是一道经典的面试题，能够比较全面地考察应聘者知识掌握的程度。涉及的知识领域也很广，包括浏览器、网络等。所以将这些知识点串联起来，系统地回答才能得到面试官的首肯。

这里并不打算事无巨细的把整个过程列出来（也列不出来），上面说过八股文只起到题目的作用，具体的答案需要自身去寻找与深入。这样才能加强理解，把知识转化为自己的。

下面是简单的回答（浏览器的变化日新月异，如果某个过程已经是过去式，请在评论区指出）
* [从输入URL到页面展示，这中间都发生了什么（一）](https://juejin.cn/post/6844904025121521678)
* [从输入URL到页面展示，这中间都发生了什么（二）](https://juejin.cn/post/6844904035670032397)
* [从输入URL到页面展示，这中间都发生了什么（三）](https://juejin.cn/post/6844904039289716743)
有能力的同学可以阅读google的这份ppt，以及对应的视频:
* [ppt：Life of a Pixel](https://docs.google.com/presentation/d/1boPxbgNrTU0ddsc144rcXayGA_WF53k96imRH8Mp34Y/edit#slide=id.ga884fe665f_64_15)
* [视频：英文Life of a Pixel (Chrome University 2020)](https://www.bilibili.com/video/BV1qS4y1y7W6?spm_id_from=333.337.search-card.all.click)
* [视频：中字Life of a Pixel (Chrome University 2018)](https://www.bilibili.com/video/BV12b411w78Y?spm_id_from=333.337.search-card.all.click)

### 浏览器的渲染原理
《从输入URL到页面展示，这中间发生了什么？》这道题是全面考核浏览器的知识。接下来就是与我们前端必须重点关注的渲染原理知识。虽然不同的渲染引擎都会有些差异，但大概的流程和原理基本上都是差不多的。

比如以webkit为例：
* 渲染基础：renderObject -> renderLayer -> GraphicsLayer的变化过程以及生成条件
* 软件绘制与硬件加速
* 光栅化流程、分块渲染与合成加速
* 重绘、重排与合成

这里三言两语说不清楚，而且大部分文章都过时了。建议大家发挥主观能动性挖掘出较新的原理和过程，最好就是找出不同渲染引擎的不同之处，这样才能给面试官耳目一新的回答。

推荐阅读：
* [从浏览器渲染原理谈动画性能优化](https://zhuanlan.zhihu.com/p/458424384)

### EventLoop
说完渲染原理，接下来就是鼎鼎大名的EventLoop了。相关问题：
* 浏览器是怎么执行JS的？
* 宏任务和微任务的工作原理？
* 每一轮EventLoop就必定伴随着一次重渲染吗？
* 浏览器是怎么保证requestAnimationFrame与屏幕同步刷新的？
* requestIdleCallback在哪个阶段执行，是如何去执行？

推荐阅读：
* [Event Loop的规范和实现](https://juejin.cn/post/6844903552402325511)
* [深入解析你不知道的 EventLoop 和浏览器渲染、帧动画、空闲回调](https://juejin.cn/post/6844904165462769678)

### V8的工作原理
知识点主要关注三个方面：
* 内存机制
* 垃圾回收
* V8的工作原理

1、对于前端开发来说，JavaScript的内存机制是一个不被经常提及的概念，因此很容易被忽视。但如果想向高级前端甚至前端技术专家前进，打造出高性能的前端应用，这方面的知识是必不可少的。

推荐阅读：  
* [JavaScript的内存模型](https://segmentfault.com/a/1190000018854431)

2、了解完数据的内存分配相关的知识，接下来就是垃圾回收功能。数据使用完之后，就可能不再需要了，这种状态的数据就称为垃圾数据。如果这些垃圾数据不及时清理掉，那就可能造成内存泄漏，所以就需要对这些垃圾数据进行回收，释放有限的内存空间。

推荐阅读：
* [内存管理+如何处理4个常见的内存泄漏](https://segmentfault.com/a/1190000017392370)

3、前端工具和框架的更新速度非常快，而且还不断有新的出现。要想追赶上前端工具和框架的更新速度，就需要抓住那些本质的知识，然后才能快速的理解这些上层应用。学习V8的执行机制，能帮助你从底层了解JavaScript，也能帮助深入理解Babel、ESLint和VUE、React的一些底层原理。

推荐阅读：
* [深入V8引擎&编写优化代码的5个技巧](https://segmentfault.com/a/1190000017369465)

**如果不是从事浏览器相关的开发，上面的知识点应该足够应付面试了。**

## JavaScript面试题
JavaScript方面的知识博大精深，并不是看一两篇文章就能深入，还得靠经典的JavaScript书籍。这里推荐几本书：
* [JavaScript权威指南（原书第7版）](https://book.douban.com/subject/35396470/)
* [你不知道的JavaScript（上卷）](https://book.douban.com/subject/26351021/)
* [JavaScript语言精粹](https://book.douban.com/subject/11874748/)
* [JavaScript语言精髓与编程实践（第3版）](https://book.douban.com/subject/35085910/)
以上这几本书，看多少遍都不为过。特别是犀牛书，建议买一本在家，买一本放公司。

但面试毕竟是时间有限的，所以可以将精力集中在以下这几个方面：
* 作用域与闭包
* 原型继承与类继承
* this
* 构造
* promise、Generator、async/await
* proxy和Reflect
* ES2015及以上的语言新特性

### 手撕JS
在现在的这个越来越卷的前端行业中，如何正确的使用JavaScript已经不满足招聘要求，还得深入了解语言原理。所以怎么实现这个功能成为各大公司的笔试题。

包括但不限于：
* 实现一个new操作符
* 实现JSON.stringify与JSON.parse
* 实现call、apply与bind
* 继承：原型继承、寄生组合式继承、类继承
* 实现函数柯理化
* 实现Promise，以及静态方法all、resolve、reject等（大厂必考）
* 防抖和节流
* 深拷贝

推荐阅读：
* [「中高级前端面试」JavaScript手写代码无敌秘籍](https://juejin.cn/post/6844903809206976520)
* [32个手写JS，巩固你的JS基础（面试高频）](https://juejin.cn/post/6875152247714480136)
* [死磕 36 个 JS 手写题（搞懂后，提升真的大）](https://juejin.cn/post/6946022649768181774)

### 设计模式
这个没什么说的，一本书搞定：
* [JavaScript设计模式与开发实践](https://book.douban.com/subject/26382780/)

## 前端框架
无论是招1到3年，还是3年以上的岗位，它们的JD都必有：熟练使用VUE或者REACT，并深入了解实现原理。所以考核VUE和REACT都变成了常见的面试流程。

它们的学习首选就是官方文档：
* [VUE2](https://cn.vuejs.org/v2/guide/)
* [VUE3](https://v3.cn.vuejs.org/guide/introduction.html)
* [REACT](https://reactjs.org/docs/getting-started.html)

### VUE
vue的文档非常详细，基本上很多面试题都可以在官方文档上找到答案。所以通读文档，应该能应付绝大多数使用层面上的问题。

常见的面试题如下：
* 说说MVVM的理解，以及vue与MVVM的关系
* vue的响应式原理（vue2和vue3的区别）
* vue的依赖收集原理（vue2和vue3的区别）
* nextTick与异步更新
* vue的生命周期以及对应的实例状态，父子组件的渲染流程
* computed和watch的区别以及使用场景
* vue是怎么监听数组的
* 组件的本质，以及为什么要输出虚拟dom
* vue的diff算法（vue2和vue3的区别）
* 请说明key值的作用
* 组件的传值方式有哪些
* v-model的实现原理
* 作用域slot和普通的slot区别
* 指令的原理
* keep-alive的原理
* vuex的使用场景与EventBus的区别
* vue3做了哪些改变和优化
* vue3的function-base API是什么
* vue3的Reactivity API有哪些，以及作用
* 你做过哪些vue的性能优化
经过这几年的发展，vue的实现原理已经被拆解的七七八八了，这种文章充满了各大博客平台。但这也提高了面试官的阈值，千篇一律回答已经无法满足要求了，必须要带有自己的见解。

推荐阅读：
* [揭秘 Vue.js 九个性能优化技巧](https://juejin.cn/post/6922641008106668045)
* [细说 Vue.js 3.2 关于响应式部分的优化](https://juejin.cn/post/6995732683435278344)
* [Vue.js设计与实现](https://book.douban.com/subject/35768338/)

### React
同样，react的学习首选官方文档，但相比于vue来说react的官方文档就显得不那么详细了。而且react的版本升级频率以及新版本的颠覆性更强，所以react比较多新玩意。

面试题：
* React事件机制，16和17之间的区别
* React的生命周期
* React Hooks原理
* React Filer的原理
* React.memo和React.useMemo的区别
* useEffect和useLayoutEffect的区别
* React的性能优化
推荐阅读:
* [你要的 React 面试知识点，都在这了](https://segmentfault.com/a/1190000019339210)
* [我打破了 React Hook 必须按顺序、不能在条件语句中调用的枷锁](https://juejin.cn/post/6939766434159394830)
* [这可能是最通俗的 React Fiber(时间分片) 打开方式](https://juejin.cn/post/6844903975112671239)

### vue和react的区别
推荐阅读：
* [Vue和React的优点分别是什么？](https://www.zhihu.com/question/301860721)

### wepback
相信很多前端开发都很少参与配置过webpack，或者对其做过什么优化。但这并不代表着，你要忽视它。因为webpack已经是占据打包届绝大多数的地盘，想升级高级前端，也是必不可少的技能。

跟着官方文档配置一遍绝对可以称为入门。但是想要深入了解却又不知从何下手，所以这时可以从面试题入手，了解面试官具体希望面试者具备哪些webpack方面的知识。

面试题：
* 在项目中常用的Loader和Plugin有哪些？
* Loader和Plugin的作用是什么，它们之间又有什么区别？
* 怎么开发Loader和Plugin？
* tree-shaking实现原理是什么？
* 热更新（HMR）的实现原理是什么？
* Bebel插件是怎么工作的？
* 做过哪些Webpack的性能优化？
* Webpack和Rollup、Vite的区别是什么？
* Wepback5出了哪些新的特性？

推荐阅读：
* [2020年了,再不会webpack敲得代码就不香了(近万字实战)](https://juejin.cn/post/6844904031240863758)
* [「吐血整理」再来一打Webpack面试题](https://juejin.cn/post/6844904094281236487)
* [一文吃透 Webpack 核心原理](https://zhuanlan.zhihu.com/p/363928061)
* [带你深度解锁Webpack系列(优化篇)](https://juejin.cn/post/6844904093463347208)
* [玩转 webpack，使你的打包速度提升 90%](https://juejin.cn/post/6844904071736852487)
* [Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)

### vite
vite是近两年都推出的，是属于比较新的工具。所以对其需要掌握的程度就比webpack低不少，除了了解vite的原理以及与webpack的区别之外，还是建议用到具体的场景，记录下踩到的坑。

比如将一个项目从webpack转移到vite上。

推荐阅读:
* [官方文档](https://cn.vitejs.dev/guide/#using-unreleased-commits)
* [Vite 2.0 发布了](https://zhuanlan.zhihu.com/p/351147547)
* [vite多久后能干掉webpack？](https://www.zhihu.com/question/477139054)
* [备战2021：vite工程化实践，建议收藏](https://juejin.cn/post/6910014283707318279)
* [深入理解Vite核心原理](https://juejin.cn/post/7064853960636989454)

## TypeScript和Node.js
现在的前端界越来越卷了，TypeScript和Node.js放几年前都是高级进阶才要求，现在招2，3年经验的岗位JD都写着熟悉Node.js或者一门后端语言，和熟练使用TypeScript。

所以掌握了才有竞争力。
### TypeScript
TypeScript这些年越来越火，几乎可以说是前端工程师的必备技能了，各大框架都基于它实现。

但是对于公司不用TS的程序员来说有没有必要学习TS呢？我觉得这是一个自我提升的机会，我认为TS这么火，学习一下还是可以的，TS学起来并不难。如果不在项目中用的话，可以不用了解的那么深入，通读官方手册也就足够了，当然官方手册知识点还是很多的，所以也有一些好心的程序员总结的入门手册。

推荐阅读:
* [官方手册](https://www.typescriptlang.org/docs/handbook/basic-types.html)
* [TypeScript 入门教程](http://ts.xcatliu.com/)


### Node.js
对于很多公司来说Node.js应该都是高P的开发才玩的，所以对于我们这些普通的开发来说，直接给出github才是最能说服面试官的操作。

Node.js相关的书籍都是比较久的。现在2022年，最推荐的入门还得是2014出版的《node.js实战》，讲原理还得是2013年出版的《深入浅出Node.js》。

饿么了提供了他们招聘Node.js的考试范围，大家也可以按照这个范围去学习，但这个范围是要求全职Node.js开发，所以自己把握这个度吧。

推荐阅读:
* [Node.js实战](https://book.douban.com/subject/25870705/)
* [深入浅出Node.js](https://book.douban.com/subject/25768396/)
* [如何通过饿了么 Node.js 面试](https://elemefe.github.io/node-interview/#/sections/zh-cn/?id=%e5%a6%82%e4%bd%95%e9%80%9a%e8%bf%87%e9%a5%bf%e4%ba%86%e4%b9%88-nodejs-%e9%9d%a2%e8%af%95)

## 算法
现在不把《剑指offer》刷一遍，leetcode刷个一两百道常见题，都不好意思去面试大厂。前端的算法考核是比后端容易一点，但随着越来越卷，题目的难度也有所增加，动不动就是动态规划+双指针。

这个没有捷径，只能老老实实的开刷。普遍的做法就是找各种题型并进行分类，每种题型都刷一些基础和常见的题目，唯手熟尔。

看到题目先自己思考，不要一上来就抄答案或者凭记忆做题，这样很快就忘记。想不出就看题解，做完后总结套路和思路，整理起来方便自己复习。

推荐阅读：
* [剑指Offer](https://book.douban.com/subject/27008702/)
* [LeetCode 101：和你一起你轻松刷题](https://github.com/changgyhub/leetcode_101)

## 结尾
创作不易，烦请动动手指点一点赞。

祝大家在这严寒的互联网冬天中，都能找到满意的工作。

[楼主github](https://github.com/zhangwinwin/FEBlog/), 如果喜欢请点一下star,对作者也是一种鼓励。 