---
title: 什么是依赖注入
---

## 前言
几乎每一个大型的应用程序都是组件聚合的结果，随着应用的增长，连接组件的方法也逐渐成为了决定性因素之一。这不仅涉及可扩展性问题，应用的复杂性也随之增加。在这种情况下，修改或者扩展功能代码都需要付出一定的代价。

依赖注入`（Dependency injection）`听起来好像很复杂，其实它是一个很简单易懂的概念。它主要是解决**解耦过于依赖状态实例的模块**。它的主要思想:通过外部实体提供作为输出组件的依赖性，这样的实体可以是组件或者全局容器，它接收来自系统所有模块的连接。这意味着模块可以被配置为使用任何依赖关系，在不同的上下文中重用。

## 依赖注入
### 高内聚和低耦合
高内聚和低耦合是判断软件设计好坏的标准。通常来说判断一个程序设计是否为好，主要看类的内聚性是否高，耦合度是否低。高内聚和低耦合使的程序模块的可重用性、移植性大大增强。
* 内聚：这是从功能角度来度量模块内的联系，一个好的内聚模块应当恰好做一件事，其他所有的部分都是帮助实现这个单一任务。
* 耦合：这是软件结构中各模块之间相互连接的一种度量，耦合强弱取决于模块间接口的复杂程度。例如，当模块直接读取或修改另一个模块的数据时，该模块紧耦合到另一个模块，此外两个模块仅仅通过传递参数进行通信就是低耦合。
一个模块理想的情况是具有高内聚和低耦合，这意味着模块更容易理解、更容易重用和更容易扩展。

### 硬编码依赖
在`JavaScript`中，可以使用`import`显式地加载一个模块，这就是硬编码的依赖关系。这也是两个模块间最常见的关系，使用这个方式建立的模块依赖是最简单有效的。

#### 使用硬编码依赖构建一个HTTP请求组件
在这个例子中使用`Axios`来作为`HTTP`请求库。

**HTTP请求模块**  
在`utils/http.js`中：
```js
import Axios from 'Axios'
export default Axios.create({
  baseURL: 'https://some-domain.com/api/'
});
```
该模块创建了一个`Axios`实例，并设置了`baseURL`。所以模块导出的对象是一个有状态的实例，同时也是一个单例，这是因为在第一次调用`import`后会缓存模块，确保在任何后续调用时不再执行它，而是返回缓存的实例。

**构建API模块**  
在`/api/auth.js`中：
```js
import http from '@utils/http.js';
const gateway = '/auth-api'
export const login = async (params) => {
    const res = await http.post(`${gateway}/login`, params);
    return res;
}
export const logout = async () => {
    const res = await http.post(`${gateway}/logout`, params);
    return res;
}
```
该模块实现了两个`API`：一个用于执行登陆请求，另一个执行登出请求。`gateway`表示后端接口在网关上注册的模块名称。

可以看到，`API`模块并不是需要`HTTP`模块的一个特定实例，任何实例都可运行。而上述代码将硬编码到一个特定的`Axios`实例，这意味着在该实例与另外一个`Axios`实例结合时，如果不修改代码将无法重用。

**调用API模块**  
在`/views/login.js`文件中：
```js 
import * as API from '@api/auth.js';

function login () {
    const params = {...}
    API.login(params).then(res => {
        ...
    })
}
function logout () {
    const params = {...}
    API.logout(params).then(res => {
        ...
    })
}
```

上面的示例显示了`JavaScript`中连接模块的常见方法，利用模块系统的功能来管理应用程序的各个组件间的依赖关系。从模块中导出状态实例，然后直接从其他组件加载它们。这样的模块组织直观，易于理解和调试，其中每个模块初始化和连接都无须任何外部干扰。

然后在另一方面，硬编码对有状态实例的依赖限制了模块与其他实例连接的可能性，这使得它不可重用并且难以进行单元测试。

### 使用依赖注入重构
使用依赖注入重构模块有一个很简单的方法：创建一个包含一组依赖作为参数的工厂，而不是将依赖硬编码到有状态的实例中。这句话怎么理解，看看代码就清楚了。

接下来用依赖注入的方式重构上面的例子：

**HTTP请求模块**  
在`utils/http.js`中：
```js
import Axios from 'Axios'

export default (option) => {
    return Axios.create(option);
}
```
重构第一步就是将`http`模块转换为工厂，这样就可以使用它来创建尽可能多的`axios`实例，这意味着整个模块现在是可重用和无状态的了。

**构建API模块**  
在/api/auth.js中：
```js
export default (gateway, http) => {
    const login = async (params) => {
        const res = await http.post(`${gateway}/login`, params);
        return res;
    }
    const logout = async () => {
        const res = await http.post(`${gateway}/logout`, params);
        return res;
    }
    return {
        login,
        logout
    }
}
```
此时，`API`模块也是无状态的。它不再导出任何特定的实例，只是一个简单的工厂函数。然而最重要的是将`http`依赖注入作为工厂函数的参数，删除之前的硬编码的依赖。这个简单的修改能够通过它连接到任何`Axios`实例来创建一个新的`auth`模块。

最后在`/views/login.js`模块中创建和连接以上模块，它表示这个应用的顶层。
```js
import axiosFactory from '@utils/http.js';
import authFactor from '@api/auth.js';

const axios = axiosFactory({
    baseURL: 'https://some-domain.com/api/'
});
const authApi = authFactor('/auth-api', axios);

function login () {
    const params = {...}
    authApi.login(params).then(res => {
        ...
    })
}
function logout () {
    const params = {...}
    authApi.logout(params).then(res => {
        ...
    })
}
```
在这个例子中，依赖注入能够将模块与特定依赖实例解耦，从而可以轻易地不改变它们的代码的前提下就能重用每个模块。而且对每个模块进行单元测试的可行性也大大提高，可以轻松地提供模拟的依赖，以独立于系统的其他组件状态的方式来测试模块。

虽然好处多多，但缺点还是有的。使用依赖注入将依赖责任从底层移动到架构的顶层，也就是说顶层组件在耦合方面需要付出较高的代价。而且在顶层组件里必须按顺序实例化所有依赖，实际上就不得不手动构建整个应用程序的依赖图。当连接的模块数量变多了，依赖图就越难管理。

这个缺点的一个解决方案是拆分多个组件之间的依赖所有权，而不是将它们集中在一个地方。这可以降低依赖管理上的复杂度，因为每个组件只对特定的依赖子图负责。

而另一个解决方案就是下面所要讲的：使用依赖注入容器。

### 依赖注入容器
依赖注入容器的核心是一个中央注册表。它用于管理系统的组件，并在每一个模块需要加载依赖时充当调节器，而且需要在实例化之前标识模块的依赖需求。

#### 构建依赖注入容器
在`/utils/DIContainer.js`中
```js
import fnArgs from 'parse-fn-args';
class DIContainer {
    constructor () {
        this.dependencies = {};
        this.factories = {};
        this.diContainer = {};
    }
    factory (name, factory) {
        this.factories[name] = factory;
    }
    register (name, dep) {
        this.dependencies[name] = dep;
    }
    get (name) {
        if (!this.dependecies[name]) {
            const factory = this.factories[name];
            this.dependecies[name] = factory && this.inject(factory);
            if (!this.dependecies[name]) {
                throw new Error('Cannot find module: ' + name);
            }
        }
        return this.dependencies[name];
    }
    inject (factory) {
        const args = fnArgs(factory).map(dependency => this.get(dependency));
        return factory.apply(null, args);
    }
}
export default () => {
    return new DIContainer();
}
```
`DIContainer`模块是一个工厂，有四个方法：
* `factory（）`用于将组件名称于工厂关联
* `register（）`用于将组件名称直接与实例相关联
* `get（）`按名称检索组件。如一个实例已经可用，则返回它本身，否则该方法将尝试调用`inject`方法，它将解析模块的依赖关系，并使用它们来调用工厂。
* `inject（）`首先使用`parse-fn-args`库，从工厂函数中提取参数列表作为输入。然后将每个参数名称映射到使用`get（）`方法获取的对应依赖关系实例。最后通过提供刚刚生成的依赖关系列表来调用工厂。

接下来看看`DIContainer`是怎么工作的：  
**HTTP请求模块**  
在`utils/http.js`中：
```js
import Axios from 'Axios'

export default (diContainer) => {
    const axiosOption = diContianer.get('axiosOption');
    return Axios.create(axiosOption);
}
```
**构建API模块**  
在`/api/auth.js`中：
```js
export default (diContainer) => {
    const gateway = diContainer.get('gateway');
    const http = diContainer.get('http');
    const login = async (params) => {
        const res = await http.post(`${gateway}/login`, params);
        return res;
    }
    const logout = async () => {
        const res = await http.post(`${gateway}/logout`, params);
        return res;
    }
    return {
        login,
        logout
    }
}
```
**调用API模块**  
在`/views/login.js`文件中：
```js 
import DIContainer from '@utils/diContainer.js
import axiosFactory from '@utils/http.js';
import authFactory from '@api/auth.js';

const diContainer = DIContainer();

diContainer.register('axiosOption', {
    baseURL: 'https://some-domain.com/api/'
});
diContainer.register('gateway', '/auth-api');
diContainer.factory('http', axiosFactory);
diContainer.factory('authApi', authFactory)

const authApi = diContainer.get('authApi');

function login () {
    const params = {...}
    authApi.login(params).then(res => {
        ...
    })
}
function logout () {
    const params = {...}
    authApi.logout(params).then(res => {
        ...
    })
}
```
值得注意的是，`diContainer`具有“惰性”，这意味着每个实例只在需要时被创建。另外每个依赖都会被自动连接，而不需要提前手动处理。这样的话，就不必提前知道实例化和连接模块的正确顺序，这一切都会自动按需发生。

