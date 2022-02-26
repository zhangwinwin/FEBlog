---
title: 熟悉而陌生API：Promise
---

## 前言
ECMAScript6发布到现在差不多有5年时间了。在这5年时间里ES6摧枯拉朽般的将现代前端“改朝换代”，Promise是其中“大将”般的存在，影响着无数的前端库和API。可以这么说，Promise已经是现代前端的“血液”。

尽管经过5年的日日夜夜，尽管书写过数不尽的Promise。面对着这个时而让我们感到真棒，用的舒服、时而坑得我们踉踉跄跄的API，我们真的了解它吗？

## 陌生情景一：怎么和循环结合
相信许多开发者最开始对Promise感到陌生的情景就是：不知道怎么跟循环结合使用。
例如：
```
// 我想将数组下的每个元素都执行一个函数
fetchSomeData().then((res) => {
    res.data.forEach((item) => {
        doSomethingFunction(item);
    })
}).then(res => {
    // 做其他事
})
```
这个例子有什么问题呢？

问题在于：第一个then回调函数返回的是undefined，就是说第二个then函数并没有等doSomethingFunction(item);执行完。事实上，它并不需要等待任何事情，并且可以在doSomethingFunction(item);执行了几个后执行。

这是一个非常隐蔽的错误，因为如果res.data足够小或者doSomethingFunction()执行的足够快，可能就不会发现任何问题。

如何解决？需要用到Promise.all()。

### Promise.all()
```
fetchSomeData().then(res) => {
    return Promise.all(res.data.map(item) => {
        return doSomethingFunction(item);
    })
}).then(res => {
    // 做其他事
})
```
Promise.all接收一个Promise对象组成的数组作为参数，当这个数组所有的Promise对象状态都变成resolved或者rejected的时候，它才会去调用then方法。

## 陌生情景二：没有return
```
fetchSomeData().then((res) => {
    doSomethingFunction(res);
}).then(res => {
    // 做其他事
})
```
这个例子的问题在于第二个then函数获取的是undefined。使用了side effect去改变而不是返回。

每一个Promise都有一个then方法，我们能在then方法中做三件事情：
* return 另一个Promise
* return 一个值
* throw 一个错误

### 返回一个Promise
```
fetchSomeData().then((res) => {
    return getId(res);
}).then(res => {
    // 我能得到id
})
```
使用return 返回第二个Promise，在第二个then方法中就能得到id。如果没有return，那么getId()只是一个side effect，那么第二个then方法只能得到undefined。

### 返回一个值
比如说要对id做一个缓存处理，以降低运行时间。
```
fetchSomeData().then((res) => {
    if (idCache[id]) {
        return idCache[id];
    }
    return getId(res);
}).then(res => {
    // 我能得到id
})
```
不管id是缓存中的，还是异步去获取的，都能返回正确的。

### throw error
throw error能让Promise变得更严谨。如果要在用户登出的时候做错误处理：
```
fetchSomeData().then((res) => {
    if (logout) {
        throw new Error('用户已登出')；
    }
    if (idCache[id]) {
        return idCache[id];
    }
    return getId(res);
}).then(res => {
    // 我能得到id
}).catch(err=> {
    // 做错误处理
})
```
catch方法能获取得到错误。

## 陌生情景三：不知道Promise.resolve()与Promise.reject()
如果经常写出下面内容：
```
new Promise((resolve, reject) => {
    resolve(doSomething())
}).then(...)
```
其实就是对Promise不熟悉，可以用更简短的语句去表达

### Promise.resolve
```
Promise.resolve(doSomething()).then(...)
```
同样Promise.reject()可以返回立即被拒绝的Promise

### Promise.reject
```
Promise.reject(new Error('some error'))
```

## 陌生情景四：then().catch()与then(resolveHandler, rejectHandler)傻傻分不清楚
其实catch方法是then(null, function(err) {})的语法糖

下面这两段代码是相等的
```
promise().catch(err => {
    // 处理错误
})

promise().then(null, err => {
    // 处理错误
})
```
但并不意味着下面这两段代码是相等的
```
promise().then((res) => {
    return otherPromise(res);
}).cathc(err => {
    // 能捕获得到错误
})

promise().then(res => {
    return otherPromise(res);
}, err => {
    // 不能捕获得到错误
})
```
所以，当使用then(resolveHandler, rejectHandler)时，如果它本身发生错误，rejectHandler是不会捕获得到的。

出于这个原因，捕获错误尽量使用catch方法。

## 陌生情景五：如何依次执行一系列的promise
如果要执行一系列的promise，类似Promise.all()方法，但不会并行执行。可能会写出下面的代码
```
function execute(promises) {
    var result = Promise.resolve();
    promise.forEach(promise => {
        result = result.then(promise);
    });
    return result;
}
```
不幸的是，这无法按照预期去执行，仍然是并行执行的。

发生这种情况的原因是：预期是不希望对一系列的promise进行操作。但是根据promise规范，一旦创建了promise，它就会开始执行。

因此要用到promise工厂函数
```
function execute(promiseFactories) {
    var result = Promise.reslove();
    promiseFactories.forEach(promiseFactory => {
        result = result.then(promiseFactory);
    });
    return result;
}
```
promise工厂函数非常简单，只是一个返回promise的函数
```
function promiseFactory() {
    return promiseCreated();
}
```
这种方法之所以会有效，是因为promise工厂函数直到被调用时才创建promise。它与then函数的工作方式相同

## 陌生情景六：then方法的使用
你认为下面代码的输出是什么？
```
Promise.resolve('foo').then(Promise.resolve('bar')).then((res) => {
    console.log(res);
})
```
如果你认为输出bar，那就错了。实际上输出的是foo！

因为当传递给then()方法并非是一个函数时，它实际上执行then(null)，这样先前的promise结果就无法传给第二个then方法。
```
Promise.resolve('foo').then(null).then(res => {
    console.log(res) // foo
})
```

简而言之，可以将promise直接传给then方法，但它并不会按照你的预期去执行。所以你要这样做
```
Promise.resolve('foo').then(() => {
    return Promise.resolve('bar')
}).then(res => {
    console.log(res); // bar
})
```
因此，请提醒自己：始终要将函数传递给then方法

## 总结
有人说：一回生二回熟。

经历了上述这六回，相信对promise就像亲人一般的熟悉。

上述文章是翻译、加工自[We have a problem with promises](https://pouchdb.com/2015/05/18/we-have-a-problem-with-promises.html)

