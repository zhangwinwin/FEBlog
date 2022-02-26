(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{410:function(t,a,r){"use strict";r.r(a);var e=r(57),v=Object(e.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h2",{attrs:{id:"前言"}},[t._v("前言")]),t._v(" "),r("p",[t._v("在项目的交互评审中，前端同学常常会对一些交互效果质疑，提出这样做不好那样做不好。这是因为这些效果通常会产生一系列的浏览器重绘和重排，需要付出非常昂贵的性能代价。"),r("br"),t._v("\n本文期待可以部分解释以下两个问题。")]),t._v(" "),r("ul",[r("li",[t._v("什么是浏览器的重绘和重排呢？")]),t._v(" "),r("li",[t._v("二者发生时都引发哪些渲染流程？")])]),t._v(" "),r("h2",{attrs:{id:"reflow"}},[t._v("reflow")]),t._v(" "),r("p",[t._v("重排(也称回流)，指的是浏览器为了重新计算文档中元素的位置和几何结构而重新渲染部分或全部文档的过程。也就是说通过JavaScript或者CSS修改元素的几何位置属性，例如改变元素的宽度、高度等就会引发reflow。")]),t._v(" "),r("p",[t._v("以下行为会引发reflow：")]),t._v(" "),r("ul",[r("li",[t._v("页面渲染器初始化")]),t._v(" "),r("li",[t._v("添加或删除可见的DOM元素")]),t._v(" "),r("li",[t._v("盒模型相关的属性改变")]),t._v(" "),r("li",[t._v("定位属性及浮动相关的属性的改变")]),t._v(" "),r("li",[t._v("改变节点内部文字结构也会触发回流")]),t._v(" "),r("li",[t._v("浏览器窗口大小发生改变")])]),t._v(" "),r("h2",{attrs:{id:"repaint"}},[t._v("repaint")]),t._v(" "),r("p",[t._v("重绘，指的是当页面中元素样式的改变并不影响它在文档流中的位置时，例如通过JavaScript更改了字体颜色,浏览器会将新样式赋予给元素并重新绘制的过程。")]),t._v(" "),r("p",[t._v("以下行为会引发repaint：")]),t._v(" "),r("ul",[r("li",[t._v("页面中的元素更新样式风格相关的属性。")])]),t._v(" "),r("p",[t._v("如想知道还有哪些属性会引发reflow或者repaint"),r("a",{attrs:{href:"https://csstriggers.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("请查看"),r("OutboundLink")],1)]),t._v(" "),r("h2",{attrs:{id:"reflow和repaint的渲染过程"}},[t._v("reflow和repaint的渲染过程")]),t._v(" "),r("p",[t._v("先看看渲染流程线：\n"),r("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/11/16f943e6214b61cb~tplv-t2oaga2asx-image.image",alt:""}}),t._v("\n有了图中介绍的渲染流水线基础("),r("a",{attrs:{href:"https://juejin.im/post/6844904035670032397",target:"_blank",rel:"noopener noreferrer"}},[t._v("看不懂的可以看我之前的文章"),r("OutboundLink")],1),t._v(")，来看看reflow和repaint分别引发的渲染流程的哪些步骤。")]),t._v(" "),r("p",[t._v("1、 更新了元素的几何属性（reflow）"),r("br"),t._v("\n通过JavaScript或者CSS修改元素的几何位置属性，例如改变元素的宽度、高度等，那么浏览器会触发重新布局，解析之后的一系列子阶段。"),r("strong",[t._v("无疑，重排需要更新完整的渲染流水线，所以开销也是最大的")]),t._v("。如下图所示：\n"),r("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/11/16f949b54fa440e9~tplv-t2oaga2asx-image.image",alt:""}})]),t._v(" "),r("p",[t._v("2、 更新元素的绘制属性（repaint）"),r("br"),t._v("\n通过JavaScript或者CSS修改元素的背景颜色，那么布局阶段将不会被执行，因为并没有引起几何位置的变换，所以就直接进入了绘制阶段，然后执行之后的一系列子阶段，。相较于重排操作，"),r("strong",[t._v("重绘省去了布局和分层阶段，所以执行效率会比重排操作要高一些")]),t._v("。\n"),r("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/11/16f94a530a6e7f95~tplv-t2oaga2asx-image.image",alt:""}})]),t._v(" "),r("p",[t._v("3、直接合成阶段"),r("br"),t._v("\n可能都注意到了tiles后面的阶段不是在主线程上执行，也就是更改一个既不要布局也不要绘制的属性，这样的效率是最高的。比如使用CSS的transform来实现动画效果，这可以避开重排和重绘阶段，直接在非主线程上执行合成动画操作。这样的效率是最高的，因为是在非主线程上合成，并没有占用主线程的资源，另外也避开了布局和绘制两个子阶段，所以相对于重绘和重排，合成能大大提升绘制效率。\n"),r("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/1/11/16f94aa90929301b~tplv-t2oaga2asx-image.image",alt:""}})]),t._v(" "),r("h2",{attrs:{id:"总结"}},[t._v("总结")]),t._v(" "),r("p",[t._v("在开发过程中要尽量减少重排，适当使用重绘，尽量使用合成。")])])}),[],!1,null,null,null);a.default=v.exports}}]);