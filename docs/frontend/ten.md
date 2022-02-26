---
title: JavaScript与数据库的碰撞
---

## 前言
最近在做一个有点奇特的项目，是帮某个旅游镇开发一个管理系统，比如管理摄像头、酒店等信息。奇特在于这个镇没有他们自己的信息系统，也就说每次信息更新都得是镇上的工作人员去收集一遍，然后发给我们去导入。

这就表示我们做的管理系统差不多是一周更新一次信息，而且数据格式比较乱。由于这两个原因，后端开发希望前端这边对数据做解析，比如做一个酒店报表，将所有订单数据做一个图表展示。特别是现在疫情的原因，要展示旅客们都来自哪里。所以后端给我原始的数据，前端进行格式化和归类展示。

另外我也觉得把原始数据给到前端这边，前端处理起来比较灵活，想怎么展示就怎么展示；而且数据更新频率低，不用每次刷新就重新请求接口；后期客户那边有什么改动的地方也不用新增接口。

但是新的问题来了，如果数据放在前端管理，那么如果高效地存储和使用这些数据？最起码不会导致页面卡顿。

## 如何存储与管理数据
### cookie与localStorage
首先想到的是`cookie`与`localStorage`，因为这两个比较常用。

`cookie`的数据量比较小，浏览器普遍限制最大的只能是4k。不合适，pass。

而`localStorage`和`sessionStorage`适合与小数据量的存储，`Firefox`与`Chorme`限制最大的存储为`5MB`。另外`localStorage`是以字符串的方式存储的，存之前要先用`JSON.stringify`将原始数据变成字符串，用的时候需要用`JSON.parse`将其恢复成相应的格式。

综上：`localStorage`只适合与比较简单的数据存储与管理。

而后端给出的数据一般都比较多，有成百上千的。而且需要复杂的查询。如果管理`JSON`数据就会比较麻烦。所以`localStorage`也不合适，pass。

### WebSQL
只能将目光转向自己没有用过，只有在看面试题中看到过的概念：`WebSQL`。

`WebSQL`是前端的数据库，它的`API`并不是`HTML5`规范的一部分，但它是一个独立的规范。它是基于`SQLite`实现的。`SQLite`是一个轻量级的数据库，它占用的空间小。它支持表的创建、插入、修改和删除，但是不支持修改表结构。同一个域可以创建多个`DB`，每个`DB`有若干张表。

`WebSql`有三个核心的方法：
* `openDatabase`: 使用现有的数据库或者新建一个数据库对象。
* `transaction`： 能够控制一个事务，以及基于这种情况执行提交或者回滚。
* `executeSql`：用于执行实际的`SQL`查询。

1、创建数据库  
使用`openDatabase()`方法来新建一个数据库。  
```
var db = window.openDatabase(
    'test-db', // 数据库名称
    '1.0', // 版本号
    'Test DB', // 描述文本
    '5 * 1024 * 1024' // 设定数据库大小
)
```

2、创建表  
使用`transaction()`方法。
* 首先传一个回调函数给`transaction`方法，它会传一个`SQLTransaction`实例作为参数，表示一个事务。
* 然后调用`executeSql()`方法，该方法接收四个参数  
（1）：要执行的`SQL`语句。  
（2）：选项。  
（3）：执行成功后的回调函数。  
（4）：执行失败后的回调函数。

```
db.transaction(function (tx) {
    tx.executeSql(
        "create table if not exists testTable(test_id integer primary key, text_hotel, lat, lng, price, checkin_time)", [], function (tx) {
            console.log('success to create a table')
        }
    )
})
```
执行的`SQL`语句为：
```
create table if not exists test_data(test_id integer primary key, test_hotel, lat, lng, price, checkin_time, comeFrom)
```
意思是创建一张`test_data`表，字段有7个，其中：
* `primary key`的意思主键。主键用于标志这一行，并且不能有重复的值。
* `integer`的意思是可以自动生成数值。

3、插入数据  
```
var order = {
    test_hotel: 'XXX酒店',
    lat: 23.7345343,
    lng: 123.9843455,
    price: 235,
    checkin_time: 2020-04-25,
    comeFrom: '广州'
}

// 插入
tx.executeSql(`insert into testTable (test_hotel, lat, lng, price, checkin_time, comeFrom) values(${order.test_hotel}, ${order.lat}, ${order.lng}, ${order.price}, ${order.checkin_time}, ${order.comeFrom})`);
```

在控制台中可以看到  
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728de8a8490d927~tplv-t2oaga2asx-image.image)  


4、查询  
* 城市的游客量  
```
select comeFrom as city, count(test_id) as count from testTable group by comeFrom order by coutn
```
结果如图所示：  
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728df1cf2c299d8~tplv-t2oaga2asx-image.image)

`WebSQL`是关系型数据库，关系型数据库的优缺点我就不去介绍了。只说一下`WebSQL`的兼容性。

在[can i use](https://www.caniuse.com/#search=websql)中展示的兼容性来看，并不怎么理想，`Firefox`、`IE`与`Safari`都不支持。  
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728df9c37371e53~tplv-t2oaga2asx-image.image)

### IndexedDB。
`IndexedDB`是一个基于`JavaScript`的面向对象数据库。

`IndexedDB`有以下特点：
* 键值对储存。
* 异步。
* 支持事务。
* 同源限制。
* 储存空间大。
* 支持二进制储存。

`IndexedDB`的`API`比`WebSQL`要复杂的多。

流程如下：   
1、打开数据库  
使用`indexedDB.open()`方法
```
var instance_db = window.indexedDB.open('test_db', 1);
// 注册失败函数
instance_db.onerror = e => { console.log(e) }；
// 注册成功函数
var db = null
// 通过instance_db对象的result属性拿到数据库对象
instance_db.onsuccess = e => { db = instance_db.result; }
```
该方法接收两个参数，第一个参数是字符串，表示数据库的名字。第二个参数是整数，表示数据库的版本。

2、新建数据库  
新建数据库与打开数据库是用一个方法。如果指定的数据库不存在，就会新建。不同在于，后续的操作主要在`upgradeneeded`事件的监听函数里面完成的。
```
instance_db.onupgradeneened = (e) => {
    db = e.target.result;
    // 新增一个名为test的表，主键是test_id
    var testTable = db.createObjectStore('test', { keyPath: 'test_id' });
    // 新建索引。IDBObject.createIndex()的三个参数分别为索引名称、索引所在的属性、配置对象（说明该属性是否包含重复的值）。
    testTable.createIndex('hotel', 'hotel', { unique: true });
    testTable.createIndex('date', 'date', { unique: true });
}
```

3、新增数据  
通过事务来完成
```
var request = db.transaction(['test'], 'readwrite').objectStore('test')
                .add({test_id: 1, hotel: '四季酒店', date: '2020-04-25'});
request.onsuccess = (e) => {};
request.onerror = (e) => {};
```
写入数据需要新建一个事务。新建时必须指定表格名称和操作模式（"只读"或"读写"）。新建事务以后，通过`IDBTransaction.objectStore(name)`方法，拿到`IDBObjectStore`对象，再通过表格对象的`add()`方法，向表格写入一条记录。

写入操作是一个异步操作，通过监听连接对象的`success`事件和`error`事件，了解是否写入成功。

4、读取数据  
`objectStore.get()`方法用于读取数据，参数是主键的值。
```
var transaction = db.transaction(['test']);
var objectStore = transaction.objectStore('test');
var request = objectStore.get(1);

request.onerror = (e) => {};

request.onsuccess = (e) => {
  if (request.result) {
    console.log('hotel: ' + request.result.hotel);
  } else {
    console.log('未获得数据记录');
  }
};
```

5、更新数据  
更新数据要使用`IDBObject.put()`方法。
```
var request = db.transaction(['test'], 'readwrite')
                .objectStore('test')
                .put({ test_id: 1, hotel: xxx酒店});

request.onsuccess = (e) => {
    console.log('数据更新成功');
};

request.onerror = (e) => {
    console.log('数据更新失败');
}
```

6、删除数据  
`IDBObjectStore.delete()`方法用于删除记录。
```
var request = db.transaction(['test'], 'readwrite')
                .objectStore('test')
                .delete(1);

request.onsuccess = (e) => {
    console.log('数据删除成功');
};
```

最后来看一下`IndexedDB`的兼容性。
![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/6/7/1728e19c79bd5146~tplv-t2oaga2asx-image.image)

不用多说，就它了！