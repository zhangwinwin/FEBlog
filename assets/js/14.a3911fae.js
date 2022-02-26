(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{412:function(t,s,a){"use strict";a.r(s);var v=a(57),e=Object(v.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"前言"}},[t._v("前言")]),t._v(" "),a("p",[t._v("在"),a("a",{attrs:{href:"https://juejin.im/post/6844904035670032397",target:"_blank",rel:"noopener noreferrer"}},[t._v("上篇文章"),a("OutboundLink")],1),t._v("中，介绍了渲染流水线中的DOM生成、样式计算和布局三个阶段。")]),t._v(" "),a("ul",[a("li",[t._v("解析HTML：将HTML转换为DOM树；")]),t._v(" "),a("li",[t._v("根据CSS，计算出DOM树中所有节点的样式；")]),t._v(" "),a("li",[t._v("接着创建布局树，保存着每个节点的几何位置；")])]),t._v(" "),a("p",[t._v("接下来继续介绍后续流程。")]),t._v(" "),a("h2",{attrs:{id:"分层"}},[t._v("分层")]),t._v(" "),a("p",[t._v("即使有了布局树，也不能直接绘制页面。因为页面中有很多复杂的动画效果，比如：3D变换、页面滚动、使用z-index等。渲染引擎为了更为方便的实现这些效果，还需要为特定的节点生成专门的图层，并生成一颗对应的图层树（Layer Tree）。"),a("br"),t._v("\n渲染引擎给页面分了很多图层，这些图层按照一定顺序叠加在一起，就形成了最终的页面")]),t._v(" "),a("p",[t._v("图层和布局树节点之间的关系,如图所示\n"),a("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f74d9a0402fed7~tplv-t2oaga2asx-image.image",width:"600"}})]),t._v(" "),a("p",[t._v("通常情况下，并不是布局树的每一个节点都包含一个图层，如果一个节点没有对应的层，那么这个节点就从属于父节点的图层。如上图中span标签没有专属图层，那么它们就从属于它们的父节点图层。但不管怎样，最终每一个节点都会直接或间接地从属于一个层。")]),t._v(" "),a("p",[t._v("渲染引擎会为以下特定的节点创新的层：")]),t._v(" "),a("ul",[a("li",[a("p",[t._v("拥有层叠上下文属性的元素会被创建一个层。"),a("br"),t._v("\n层叠上下文能够让HTML元素具有三维视图，按照自身属性的优先级分布在垂直于这个二维平面的z轴上。如图所示："),a("br"),t._v(" "),a("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f74e8fa81e46ec~tplv-t2oaga2asx-image.image",width:"600"}})])]),t._v(" "),a("li",[a("p",[t._v("需要被clip的地方会被创建为单独图层。")])])]),t._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("{/* <style>\ndiv {\n      width: 200;\n      height: 200;\n      overflow:auto;\n      background: gray;\n  } \n</style>\n<body>\n<div >\n  <p>所以元素有了层叠上下文的属性或者需要被剪裁，那么就会被提升成为单独一层，你可以参看下图：</p>\n  <p>从上图我们可以看到，document层上有A和B层，而B层之上又有两个图层。这些图层组织在一起也是一颗树状结构。</p>        <p>图层树是基于布局树来创建的，为了找出哪些元素需要在哪些层中，渲染引擎会遍历布局树来创建层树（Update LayerTree）。</p> \n</div>\n</body> */}\n")])]),t._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[t._v("1")]),a("br"),a("span",{staticClass:"line-number"},[t._v("2")]),a("br"),a("span",{staticClass:"line-number"},[t._v("3")]),a("br"),a("span",{staticClass:"line-number"},[t._v("4")]),a("br"),a("span",{staticClass:"line-number"},[t._v("5")]),a("br"),a("span",{staticClass:"line-number"},[t._v("6")]),a("br"),a("span",{staticClass:"line-number"},[t._v("7")]),a("br"),a("span",{staticClass:"line-number"},[t._v("8")]),a("br"),a("span",{staticClass:"line-number"},[t._v("9")]),a("br"),a("span",{staticClass:"line-number"},[t._v("10")]),a("br"),a("span",{staticClass:"line-number"},[t._v("11")]),a("br"),a("span",{staticClass:"line-number"},[t._v("12")]),a("br"),a("span",{staticClass:"line-number"},[t._v("13")]),a("br"),a("span",{staticClass:"line-number"},[t._v("14")]),a("br")])]),a("p",[t._v("如上面代码所示，把div的大小设为200*200px，而div里的文字所显示的区域超出了设定的大小。这时候就发生了clip，渲染引擎会把clip文字内容的一部分显示在div上。如下图所示："),a("br"),t._v(" "),a("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f74eedd6f87566~tplv-t2oaga2asx-image.image",width:"600"}}),a("br"),t._v("\n出现这种裁剪情况的时候，渲染引擎会为文字部分单独创建一个层，如果出现滚动条，滚动条也会被提升为单独的层。")]),t._v(" "),a("h2",{attrs:{id:"图层绘制"}},[t._v("图层绘制")]),t._v(" "),a("p",[t._v("构建完图层树之后，渲染引擎会对图层树中的每个图层分别进行绘制。")]),t._v(" "),a("p",[t._v("考虑以下步骤：在画布中画一个同心圆。你会怎么操作？")]),t._v(" "),a("p",[t._v("通常，会把绘制操作分为两步：")]),t._v(" "),a("ul",[a("li",[t._v("先画一个大圆")]),t._v(" "),a("li",[t._v("再接着大圆内画一个小圆")])]),t._v(" "),a("p",[t._v("渲染引擎实现图层的绘制与之类似，会把一个图层的绘制拆分成很多小的绘制指令，然后再把这些指令按照顺序组成一个待绘制列表。")]),t._v(" "),a("h2",{attrs:{id:"栅格化操作"}},[t._v("栅格化操作")]),t._v(" "),a("p",[t._v("绘制列表只是用来记录绘制顺序和绘制指令的列表，而实际上绘制操作是由渲染引擎中的合成线程来完成的。可以结合下图来看下渲染主线程和合成线程之间的关系："),a("br"),t._v(" "),a("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f74f78196e9b4b~tplv-t2oaga2asx-image.image",width:"600"}}),a("br"),t._v("\n如上图所示，当图层的绘制列表准备好之后，主线程会把该绘制列表提交（commit）给合成线程。")]),t._v(" "),a("p",[a("strong",[t._v("视口")]),t._v("：代表当前可见的计算机图形区域。在Web浏览器术语中，通常与浏览器窗口相同，但不包括浏览器的 UI，菜单栏等——即指你正在浏览的文档的那一部分。")]),t._v(" "),a("p",[t._v("在有些情况下，有的图层可以很大，比如有的页面使用滚动条要滚动好久才能滚动到底部，但是通过视口，用户只能看到页面的很小一部分，所以在这种情况下，要绘制出所有图层内容的话，就会产生太大的开销，而且也没有必要。")]),t._v(" "),a("p",[t._v("基于这个原因，合成线程会将图层划分为图块（tile），这些图块的大小通常是 256x256 或者 512x512。")]),t._v(" "),a("p",[t._v("然后合成线程会按照视口附近的图块来优先生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图。而图块是栅格化执行的最小单位。渲染进程维护了一个栅格化的线程池，所有的图块栅格化都是在线程池内执行的，运行方式如下图所示："),a("br"),t._v(" "),a("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f74fc249d575de~tplv-t2oaga2asx-image.image",width:"600"}}),a("br"),t._v("\n通常，栅格化过程都会使用GPU来加速生成，使用GPU生成位图的过程叫快速栅格化，或者GPU栅格化，生成的位图被保存在GPU内存中。")]),t._v(" "),a("p",[t._v("GPU操作是运行在GPU进程中，如果栅格化操作使用了GPU，那么最终生成位图的操作是在GPU中完成的，这就涉及到了跨进程操作。"),a("br"),t._v(" "),a("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f74fdafcce51c8~tplv-t2oaga2asx-image.image",width:"600"}})]),t._v(" "),a("h2",{attrs:{id:"合成和显示"}},[t._v("合成和显示")]),t._v(" "),a("p",[t._v("一旦所有图块都被光栅化，合成线程就会生成一个绘制图块的命令——‘DrawQuad’，然后将该命令提交给浏览器进程。")]),t._v(" "),a("p",[t._v("浏览器进程接收合成线程发过来的DrawQuad命令，然后根据DrawQuad命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上。")]),t._v(" "),a("p",[t._v("到这，经过这一系列的阶段，就能显示出页面了。整个渲染流程，从HTML到DOM、样式计算、布局、图层、绘制、光栅化、合成和显示。"),a("br"),t._v(" "),a("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/5/16f75020156d216a~tplv-t2oaga2asx-image.image",width:"600"}})]),t._v(" "),a("h2",{attrs:{id:"总结"}},[t._v("总结")]),t._v(" "),a("p",[t._v("一个完整的渲染流程大致可总结为如下：")]),t._v(" "),a("ul",[a("li",[t._v("渲染进程将HTML转换为DOM树。")]),t._v(" "),a("li",[t._v("渲染引擎将CSS样式表转化为styleSheets，计算出DOM节点的样式。")]),t._v(" "),a("li",[t._v("创建布局树，并计算元素的布局信息。")]),t._v(" "),a("li",[t._v("对布局树进行分层，并生成分层树。")]),t._v(" "),a("li",[t._v("为每个图层生成绘制列表，并将其提交到合成线程。")]),t._v(" "),a("li",[t._v("合成线程将图层分成图块，并在光栅化线程池中将图块转换成位图。")]),t._v(" "),a("li",[t._v("合成线程发送绘制图块命令 DrawQuad 给浏览器进程。")]),t._v(" "),a("li",[t._v("浏览器进程根据 DrawQuad 消息生成页面，并显示到显示器上。")])])])}),[],!1,null,null,null);s.default=e.exports}}]);