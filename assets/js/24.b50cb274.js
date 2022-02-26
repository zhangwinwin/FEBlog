(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{424:function(e,s,t){"use strict";t.r(s);var a=t(57),n=Object(a.a)({},(function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h2",{attrs:{id:"前言"}},[e._v("前言")]),e._v(" "),t("p",[e._v("最近在做一个有点奇特的项目，是帮某个旅游镇开发一个管理系统，比如管理摄像头、酒店等信息。奇特在于这个镇没有他们自己的信息系统，也就说每次信息更新都得是镇上的工作人员去收集一遍，然后发给我们去导入。")]),e._v(" "),t("p",[e._v("这就表示我们做的管理系统差不多是一周更新一次信息，而且数据格式比较乱。由于这两个原因，后端开发希望前端这边对数据做解析，比如做一个酒店报表，将所有订单数据做一个图表展示。特别是现在疫情的原因，要展示旅客们都来自哪里。所以后端给我原始的数据，前端进行格式化和归类展示。")]),e._v(" "),t("p",[e._v("另外我也觉得把原始数据给到前端这边，前端处理起来比较灵活，想怎么展示就怎么展示；而且数据更新频率低，不用每次刷新就重新请求接口；后期客户那边有什么改动的地方也不用新增接口。")]),e._v(" "),t("p",[e._v("但是新的问题来了，如果数据放在前端管理，那么如果高效地存储和使用这些数据？最起码不会导致页面卡顿。")]),e._v(" "),t("h2",{attrs:{id:"如何存储与管理数据"}},[e._v("如何存储与管理数据")]),e._v(" "),t("h3",{attrs:{id:"cookie与localstorage"}},[e._v("cookie与localStorage")]),e._v(" "),t("p",[e._v("首先想到的是"),t("code",[e._v("cookie")]),e._v("与"),t("code",[e._v("localStorage")]),e._v("，因为这两个比较常用。")]),e._v(" "),t("p",[t("code",[e._v("cookie")]),e._v("的数据量比较小，浏览器普遍限制最大的只能是4k。不合适，pass。")]),e._v(" "),t("p",[e._v("而"),t("code",[e._v("localStorage")]),e._v("和"),t("code",[e._v("sessionStorage")]),e._v("适合与小数据量的存储，"),t("code",[e._v("Firefox")]),e._v("与"),t("code",[e._v("Chorme")]),e._v("限制最大的存储为"),t("code",[e._v("5MB")]),e._v("。另外"),t("code",[e._v("localStorage")]),e._v("是以字符串的方式存储的，存之前要先用"),t("code",[e._v("JSON.stringify")]),e._v("将原始数据变成字符串，用的时候需要用"),t("code",[e._v("JSON.parse")]),e._v("将其恢复成相应的格式。")]),e._v(" "),t("p",[e._v("综上："),t("code",[e._v("localStorage")]),e._v("只适合与比较简单的数据存储与管理。")]),e._v(" "),t("p",[e._v("而后端给出的数据一般都比较多，有成百上千的。而且需要复杂的查询。如果管理"),t("code",[e._v("JSON")]),e._v("数据就会比较麻烦。所以"),t("code",[e._v("localStorage")]),e._v("也不合适，pass。")]),e._v(" "),t("h3",{attrs:{id:"websql"}},[e._v("WebSQL")]),e._v(" "),t("p",[e._v("只能将目光转向自己没有用过，只有在看面试题中看到过的概念："),t("code",[e._v("WebSQL")]),e._v("。")]),e._v(" "),t("p",[t("code",[e._v("WebSQL")]),e._v("是前端的数据库，它的"),t("code",[e._v("API")]),e._v("并不是"),t("code",[e._v("HTML5")]),e._v("规范的一部分，但它是一个独立的规范。它是基于"),t("code",[e._v("SQLite")]),e._v("实现的。"),t("code",[e._v("SQLite")]),e._v("是一个轻量级的数据库，它占用的空间小。它支持表的创建、插入、修改和删除，但是不支持修改表结构。同一个域可以创建多个"),t("code",[e._v("DB")]),e._v("，每个"),t("code",[e._v("DB")]),e._v("有若干张表。")]),e._v(" "),t("p",[t("code",[e._v("WebSql")]),e._v("有三个核心的方法：")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("openDatabase")]),e._v(": 使用现有的数据库或者新建一个数据库对象。")]),e._v(" "),t("li",[t("code",[e._v("transaction")]),e._v("： 能够控制一个事务，以及基于这种情况执行提交或者回滚。")]),e._v(" "),t("li",[t("code",[e._v("executeSql")]),e._v("：用于执行实际的"),t("code",[e._v("SQL")]),e._v("查询。")])]),e._v(" "),t("p",[e._v("1、创建数据库"),t("br"),e._v("\n使用"),t("code",[e._v("openDatabase()")]),e._v("方法来新建一个数据库。")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("var db = window.openDatabase(\n    'test-db', // 数据库名称\n    '1.0', // 版本号\n    'Test DB', // 描述文本\n    '5 * 1024 * 1024' // 设定数据库大小\n)\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br")])]),t("p",[e._v("2、创建表"),t("br"),e._v("\n使用"),t("code",[e._v("transaction()")]),e._v("方法。")]),e._v(" "),t("ul",[t("li",[e._v("首先传一个回调函数给"),t("code",[e._v("transaction")]),e._v("方法，它会传一个"),t("code",[e._v("SQLTransaction")]),e._v("实例作为参数，表示一个事务。")]),e._v(" "),t("li",[e._v("然后调用"),t("code",[e._v("executeSql()")]),e._v("方法，该方法接收四个参数"),t("br"),e._v("\n（1）：要执行的"),t("code",[e._v("SQL")]),e._v("语句。"),t("br"),e._v("\n（2）：选项。"),t("br"),e._v("\n（3）：执行成功后的回调函数。"),t("br"),e._v("\n（4）：执行失败后的回调函数。")])]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("db.transaction(function (tx) {\n    tx.executeSql(\n        \"create table if not exists testTable(test_id integer primary key, text_hotel, lat, lng, price, checkin_time)\", [], function (tx) {\n            console.log('success to create a table')\n        }\n    )\n})\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br")])]),t("p",[e._v("执行的"),t("code",[e._v("SQL")]),e._v("语句为：")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("create table if not exists test_data(test_id integer primary key, test_hotel, lat, lng, price, checkin_time, comeFrom)\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br")])]),t("p",[e._v("意思是创建一张"),t("code",[e._v("test_data")]),e._v("表，字段有7个，其中：")]),e._v(" "),t("ul",[t("li",[t("code",[e._v("primary key")]),e._v("的意思主键。主键用于标志这一行，并且不能有重复的值。")]),e._v(" "),t("li",[t("code",[e._v("integer")]),e._v("的意思是可以自动生成数值。")])]),e._v(" "),t("p",[e._v("3、插入数据")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("var order = {\n    test_hotel: 'XXX酒店',\n    lat: 23.7345343,\n    lng: 123.9843455,\n    price: 235,\n    checkin_time: 2020-04-25,\n    comeFrom: '广州'\n}\n\n// 插入\ntx.executeSql(`insert into testTable (test_hotel, lat, lng, price, checkin_time, comeFrom) values(${order.test_hotel}, ${order.lat}, ${order.lng}, ${order.price}, ${order.checkin_time}, ${order.comeFrom})`);\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br"),t("span",{staticClass:"line-number"},[e._v("8")]),t("br"),t("span",{staticClass:"line-number"},[e._v("9")]),t("br"),t("span",{staticClass:"line-number"},[e._v("10")]),t("br"),t("span",{staticClass:"line-number"},[e._v("11")]),t("br")])]),t("p",[e._v("在控制台中可以看到"),t("br"),e._v(" "),t("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728de8a8490d927~tplv-t2oaga2asx-image.image",alt:""}})]),e._v(" "),t("p",[e._v("4、查询")]),e._v(" "),t("ul",[t("li",[e._v("城市的游客量")])]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("select comeFrom as city, count(test_id) as count from testTable group by comeFrom order by coutn\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br")])]),t("p",[e._v("结果如图所示："),t("br"),e._v(" "),t("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728df1cf2c299d8~tplv-t2oaga2asx-image.image",alt:""}})]),e._v(" "),t("p",[t("code",[e._v("WebSQL")]),e._v("是关系型数据库，关系型数据库的优缺点我就不去介绍了。只说一下"),t("code",[e._v("WebSQL")]),e._v("的兼容性。")]),e._v(" "),t("p",[e._v("在"),t("a",{attrs:{href:"https://www.caniuse.com/#search=websql",target:"_blank",rel:"noopener noreferrer"}},[e._v("can i use"),t("OutboundLink")],1),e._v("中展示的兼容性来看，并不怎么理想，"),t("code",[e._v("Firefox")]),e._v("、"),t("code",[e._v("IE")]),e._v("与"),t("code",[e._v("Safari")]),e._v("都不支持。"),t("br"),e._v(" "),t("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728df9c37371e53~tplv-t2oaga2asx-image.image",alt:""}})]),e._v(" "),t("h3",{attrs:{id:"indexeddb。"}},[e._v("IndexedDB。")]),e._v(" "),t("p",[t("code",[e._v("IndexedDB")]),e._v("是一个基于"),t("code",[e._v("JavaScript")]),e._v("的面向对象数据库。")]),e._v(" "),t("p",[t("code",[e._v("IndexedDB")]),e._v("有以下特点：")]),e._v(" "),t("ul",[t("li",[e._v("键值对储存。")]),e._v(" "),t("li",[e._v("异步。")]),e._v(" "),t("li",[e._v("支持事务。")]),e._v(" "),t("li",[e._v("同源限制。")]),e._v(" "),t("li",[e._v("储存空间大。")]),e._v(" "),t("li",[e._v("支持二进制储存。")])]),e._v(" "),t("p",[t("code",[e._v("IndexedDB")]),e._v("的"),t("code",[e._v("API")]),e._v("比"),t("code",[e._v("WebSQL")]),e._v("要复杂的多。")]),e._v(" "),t("p",[e._v("流程如下："),t("br"),e._v("\n1、打开数据库"),t("br"),e._v("\n使用"),t("code",[e._v("indexedDB.open()")]),e._v("方法")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("var instance_db = window.indexedDB.open('test_db', 1);\n// 注册失败函数\ninstance_db.onerror = e => { console.log(e) }；\n// 注册成功函数\nvar db = null\n// 通过instance_db对象的result属性拿到数据库对象\ninstance_db.onsuccess = e => { db = instance_db.result; }\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br")])]),t("p",[e._v("该方法接收两个参数，第一个参数是字符串，表示数据库的名字。第二个参数是整数，表示数据库的版本。")]),e._v(" "),t("p",[e._v("2、新建数据库"),t("br"),e._v("\n新建数据库与打开数据库是用一个方法。如果指定的数据库不存在，就会新建。不同在于，后续的操作主要在"),t("code",[e._v("upgradeneeded")]),e._v("事件的监听函数里面完成的。")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("instance_db.onupgradeneened = (e) => {\n    db = e.target.result;\n    // 新增一个名为test的表，主键是test_id\n    var testTable = db.createObjectStore('test', { keyPath: 'test_id' });\n    // 新建索引。IDBObject.createIndex()的三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）。\n    testTable.createIndex('hotel', 'hotel', { unique: true });\n    testTable.createIndex('date', 'date', { unique: true });\n}\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br"),t("span",{staticClass:"line-number"},[e._v("8")]),t("br")])]),t("p",[e._v("3、新增数据"),t("br"),e._v("\n通过事务来完成")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("var request = db.transaction(['test'], 'readwrite').objectStore('test')\n                .add({test_id: 1, hotel: '四季酒店', date: '2020-04-25'});\nrequest.onsuccess = (e) => {};\nrequest.onerror = (e) => {};\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br")])]),t("p",[e._v('写入数据需要新建一个事务。新建时必须指定表格名称和操作模式（"只读"或"读写"）。新建事务以后，通过'),t("code",[e._v("IDBTransaction.objectStore(name)")]),e._v("方法，拿到"),t("code",[e._v("IDBObjectStore")]),e._v("对象，再通过表格对象的"),t("code",[e._v("add()")]),e._v("方法，向表格写入一条记录。")]),e._v(" "),t("p",[e._v("写入操作是一个异步操作，通过监听连接对象的"),t("code",[e._v("success")]),e._v("事件和"),t("code",[e._v("error")]),e._v("事件，了解是否写入成功。")]),e._v(" "),t("p",[e._v("4、读取数据"),t("br"),e._v(" "),t("code",[e._v("objectStore.get()")]),e._v("方法用于读取数据，参数是主键的值。")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("var transaction = db.transaction(['test']);\nvar objectStore = transaction.objectStore('test');\nvar request = objectStore.get(1);\n\nrequest.onerror = (e) => {};\n\nrequest.onsuccess = (e) => {\n  if (request.result) {\n    console.log('hotel: ' + request.result.hotel);\n  } else {\n    console.log('未获得数据记录');\n  }\n};\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br"),t("span",{staticClass:"line-number"},[e._v("8")]),t("br"),t("span",{staticClass:"line-number"},[e._v("9")]),t("br"),t("span",{staticClass:"line-number"},[e._v("10")]),t("br"),t("span",{staticClass:"line-number"},[e._v("11")]),t("br"),t("span",{staticClass:"line-number"},[e._v("12")]),t("br"),t("span",{staticClass:"line-number"},[e._v("13")]),t("br")])]),t("p",[e._v("5、更新数据"),t("br"),e._v("\n更新数据要使用"),t("code",[e._v("IDBObject.put()")]),e._v("方法。")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("var request = db.transaction(['test'], 'readwrite')\n                .objectStore('test')\n                .put({ test_id: 1, hotel: xxx酒店});\n\nrequest.onsuccess = (e) => {\n    console.log('数据更新成功');\n};\n\nrequest.onerror = (e) => {\n    console.log('数据更新失败');\n}\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br"),t("span",{staticClass:"line-number"},[e._v("8")]),t("br"),t("span",{staticClass:"line-number"},[e._v("9")]),t("br"),t("span",{staticClass:"line-number"},[e._v("10")]),t("br"),t("span",{staticClass:"line-number"},[e._v("11")]),t("br")])]),t("p",[e._v("6、删除数据"),t("br"),e._v(" "),t("code",[e._v("IDBObjectStore.delete()")]),e._v("方法用于删除记录。")]),e._v(" "),t("div",{staticClass:"language- line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("var request = db.transaction(['test'], 'readwrite')\n                .objectStore('test')\n                .delete(1);\n\nrequest.onsuccess = (e) => {\n    console.log('数据删除成功');\n};\n")])]),e._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[e._v("1")]),t("br"),t("span",{staticClass:"line-number"},[e._v("2")]),t("br"),t("span",{staticClass:"line-number"},[e._v("3")]),t("br"),t("span",{staticClass:"line-number"},[e._v("4")]),t("br"),t("span",{staticClass:"line-number"},[e._v("5")]),t("br"),t("span",{staticClass:"line-number"},[e._v("6")]),t("br"),t("span",{staticClass:"line-number"},[e._v("7")]),t("br")])]),t("p",[e._v("最后来看一下"),t("code",[e._v("IndexedDB")]),e._v("的兼容性。\n"),t("img",{attrs:{src:"https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728e19c79bd5146~tplv-t2oaga2asx-image.image",alt:""}})]),e._v(" "),t("p",[e._v("不用多说，就它了！")])])}),[],!1,null,null,null);s.default=n.exports}}]);