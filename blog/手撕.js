// 数据类型判断
function typeOf (obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

// 数组去重
function unique (arr) {
    return arr.filter((item, idx, array) => {
        return array.indexOf(item) === idx;
    })
}

// 数组扁平化
function flatten (arr) {
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr)) {
            acc.push(...flatten(curr))
        } else {
            acc.push(curr);
        }
        return acc;
    }, [])
}

const isObject = obj => (typeof obj === 'object' || typeof obj === 'function') && typeof obj !== null;

// 深拷贝
function deepClone (obj, map = new WeakMap()) {
    if (map.get(obj)) {
        return obj;
    }
    if (isObject(obj)) {
        let res = Array.isArray(obj) ? [] : {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                res[key] = deepClone(obj[key], map);
            }
        }
        return res;
    } else {
        return obj;
    }
}

// 发布订阅模式
class EventEmit {
    constructor () {
        this.cache = []
    }
    on (name, fn) {
        if (this.cache[name]) {
            this.cache[name].push(fn)
        } else {
            this.cache[name] = [fn]
        }
    }
    off (name, fn) {
        if (this.cache[name]) {
            if (fn) {
                this.cache[name] = this.cache[name].filter(f => f !== fn);
            } else {
                this.cache[name] = [];
            }
        }
    }
    emit (name, once = false, ...args) {
        if (this.cache[name]) {
            for (let f of this.cache[name]) {
                f(...args);
            }
            if (once) {
                this.cache[name] = [];
            }
        }
    }
}

// 图片懒加载
const imgLazyLoad = (function () {
    let count = 0;
    let deleteIndexList = []
    return function () {
        imgList.forEach((img, idx) => {
            const rect = img.getBoundingRect();
            if (rect.top < window.innerHeight) {
                const src = img.dataset.src;
                img.src = src;
                count++;
                deleteIndexList.push(idx)
            }
            if (count === length) {
                document.removeEventListener('scroll', imgLazyLoad)
            }
        })
        imgList = imgList.filter(img => !deleteIndexList.includes(img))
    }
})()

// 函数防抖
function dedounce (func, wait, immediate = false) {
    let timer = null;
    const debounced = function (...args) {
        let res = null;
        clearTimeout(timer)
        if (immediate) {
            var callNow = !timer;
            setTimeout(() => {
                timer = null;
            }, wait)
            if (callNow) res = func.apply(this, args)
        } else {
            setTimeout(() => {
                func.apply(this, args)
            }, wait)
        }
        return res;
    }
    debounced.cancel = () => {
        clearTimeout(timer)
        timer = null;
    }
    return debounced
}

// 函数截流
function throttle (func, wait) {
    var previous = 0;
    return function (...args) {
        var now = +new Date();
        if (now - previous > wait) {
            func.apply(this, args);
            previous = now;
        }
    }
}

// 函数科里化
function curry(fn) {
    let judge = function (...args) {
        if (args.length === fn.length) {
            fn(...args)
        } else {
            return function (...arg) {
                judge(...args, ...arg)
            }
        }
    }
    return judge
}
// 偏函数
function partial (fn, ...args) {
    return (...arg) => fn(...args, ...arg)
}

// Ajax
function getJson (url) {
    return new Promise((resolve, reject) => {
        const xhr = xmlHttpRequest ? new xmlHttpRequest() : new ActiveXObject();
        xhr.open('GET', url, false);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadyStateChange = () => {
            if (xhr.readyState !== 4) return;
            if (xhr.state === 200 || xhr.state === 304) {
                resolve(xhr.responseText)
            } else {
                reject(new Error(xhr.responseText))
            }
        }
        xhr.send();
    })
}

// forEach
Array.prototype.forEach2 = (fn, ctx) => {
    if (!ctx) {
        throw new Error()
    }
    if (typeof fn !== 'function') {
        throw new Error()
    }
    const obj = Object(ctx);
    const len = obj.length >>> 0;
    let k = 0;
    while (k < len) {
        if (k in Obj) {
            fn.call(ctx, obj[k], k, 0);
        }
        k++;
    }
}

// map
Array.prototype.map2 = (fn, ctx) {
    if (!ctx) {
        throw new Error()
    }
    if (typeof fn !== 'function') {
        throw new Error()
    }
    const obj = Object(ctx);
    const len = obj.length >>> 0;
    let k = 0, res = [];
    while (k < len) {
        if (k in Obj) {
            res[k] = fn.call(ctx, obj[k], k, 0);
        }
        k++;
    }
    return res;
}
// filter
Array.prototype.filter2 = (fn, ctx) {
    if (!ctx) {
        throw new Error()
    }
    if (typeof fn !== 'function') {
        throw new Error()
    }
    const obj = Object(ctx);
    const len = obj.length >>> 0;
    let k = 0, res = [];
    while (k < len) {
        if (k in Obj) {
            if(fn.call(ctx, obj[k], k, 0)) {
                res.push(obj[k])
            }
        }
        k++;
    }
    return res;
}

// bind
Function.prototype.bind2 = function (ctx) {
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fn = function () {}

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fn ? this : ctx, args.concat(bindArgs))
    }
    fn.prototype = this.prototype;
    fBound.prototype = new fn();
    return fBound;
}

// new
function objectFactory() {
    var obj = new Object();
    Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.apply(obj, arguments);

    return typeof ref === 'object' ? ret || obj : obj
}

// instanceof 
function instanceOf (left, right) {
    let proto = left.__proto__;
    while (proto) {
        if (proto === right.prototype) return true
        proto = proto.__proto__;
    }
    return false;
}

// Object.create
Object.create2 = function(proto, descriptor) {
    function F () {}
    F.prototype = proto;
    var obj = new F();
    return obj;
}

// promise.resolve
Promise.resolve2 = function(value) {
    if (value instanceof Promise) return value;
    return new Promise(resolve => resolve(value))
}
// promise.reject
Promise.reject2 = function(value) {
    return new Promise((resolve, reject) => reject(value))
}

// promise.all
Promise.all2 = function (arr) {
    let count = 0, res = [];
    return new Promise((resolve, reject) => {
        arr.forEach((p, i) => {
            Promise.resolve(p).then(val => {
                res[i] = val;
                count++;
                if (count === arr.length) {
                    resolve(res)
                }
            }, err => {
                reject(err)
            })
        })
    })
}

function myNew (fn, ...args) {
    let obj = Object.create(fn.prototype);
    let res = fn.call(obj, ...args);
    if (res && typeof res === 'object' || typeof res === 'function') {
        return res;
    }
    return obj;
}

Function.prototype.myCall = function (ctx, ...args) {
    if (!ctx || ctx === null) {
        ctx = window
    }
    // 创建唯一的key，作为构造的ctx内部方法名
    let fn = Symbol();
    ctx[fn] = this; // this指向调用call的函数
    // 执行函数并返回结果，相当于把自身作为传入的ctx的方法进行调用
    return ctx[fn](...args)
}

Function.prototype.apply2 = function (ctx, args) {
    if (!ctx || ctx === null) {
        ctx = window;
    }
    let fn = Symbol();
    ctx[fn] = this;
    return ctx[fn](...args)
}

Function.prototype.bind2 = function (ctx, ...args) {
    if (!ctx) {
        ctx = window;
    }
    let fn = Symbol();
    ctx[fn] = this;
    let self = this;
    const result = function (...innerArgs) {
        // 将bind绑定后的函数当作构造函数，通过new操作符使用，则不绑定传入的this，而是将this指向实例化的对象
        // 此时由于new操作符作用，this指向result实例对象，而result又继承自传入的this
        if (this instanceof self === true) {
            this[fn] = self;
            this[fn](...args, ...innerArgs)
        } else {
            ctx[fn](...args, ...innerArgs)
        }
    }
    result.prototype = Object.create(this.prototype)
    return result
}

// 版本号排序
function compare (a, b) {
    let i = 0;
    const arr1 = a.split('.');
    const arr2 = b.split('.');
    while (true) {
        const s1 = arr1[i]
        const s2 = arr2[i];
        i++
        if (s1 === undefined || s2 === undefined) {
            return arr2.length - arr2.length
        }
        if (s1 === s2) continue;
        return s2 - s1;
    }
}

class LRUCache {
    constructor (capacity) {
        this.secreKey = new Map ();
        this.capacity = capacity;
    }
    get (key) {
        if (this.secreKey.get(key)) {
            let temp = this.secreKey.get(key);
            this.secreKey.delete(key);
            this.secreKey.set(key, temp);
            return temp;
        } else return -1;
    }
    put (key, value) {
        if (this.secreKey.has(key)) {
            this.secreKey.delete(key)
            this.secreKey.set(key, value)
        } else if (this.secreKey.size <= this.capacity) {
            this.secreKey.set(key, value)
        } else {
            this.secreKey.set(key, value);
            this.secreKey.delete(this.secreKey.keys().next().value)
        }
    }
}

function add (a, b) {
    let maxLength = Math.max(a.length, b.length);
    a = a.padStart(maxLength, 0)
    b = b.padStart(maxLength, 0)
    
    let t = 0;
    let f = 0;
    let sum = '';
    for (let i = maxLength - 1; i >= 0; i--) {
        t = parseInt(a[i]) + parseInt(b[i]) + f;
        f = Math.floor(t / 10)
        sum = t % 10 + sum;
    }
    if (f !== 0) {
        sum = '' + f + sum;
    }
    return sum
}

class Scheduler {
    constructor (limit) {
        this.queue = [];
        this.maxCount = limit;
        this.runCounts = 0;
    }
    add (time, order) {
        const promiseCreator = () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(order);
                    resolve();
                }, time)
            })
        }
        this.queue.push(promiseCreator)
    }
    taskStart () {
        for (let i = 0; i < this.maxCount; i++) {
            this.request();
        }
    }
    request () {
        if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
            return;
        }
        this.runCounts++
        this.queue.shift().then(() => {
            this.runCounts--;
            this.request();
        })
    }
}
function myNew (fn, ...args) {
    let obj = Object.create(fn.prototype);
    let res = fn.call(obj, ...args);
    if (res && typeof res === 'object' || typeof res === 'function') {
        return res;
    }
    return obj
}

class MyPromise {
    constructor (executor) {
        this.state = 'pending';
        this.successFn = [];
        this.failFn = [];
        let resolve = (val) => {
            if (this.state !== 'pending') return;
            this.state = 'success';
            setTimeout(() => {
                this.successFn.forEach(item => item.call(this, val))
            })
        }
        let reject = (err) => {
            if (this.state !== 'pending') return;
            this.state = 'fail';
            setTimeout(() => {
                this.failFn.forEach(item => item.call(this, err))
            })
        }
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error)
        }
    }
    then (resolveFn, rejectFn) {
        resolveFn = typeof resolveFn === 'function' ? resolveFn : (v) => v;
        rejectFn = typeof rejectFn === 'function' ? rejectFn : err => {
            throw new Error(err)
        }
        return new MyPromise((resolve, reject) => {
            this.successFn.push((val) => {
                try {
                    let x = resolveFn(val)
                    x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
                } catch (error) {
                    reject(err)
                }
            })
            this.failFn.push(val => {
                try {
                    let x = rejectFn(val)
                    x instanceof MyPromise ? x.then((resolve, reject)) : reject(x);
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
}