---
title: 聊一聊Axios与登录机制
---

## 前言
因为HTTP是一个stateless的协议，服务器并不会保存任何关于状态数据。

所以需要登录功能让服务器在以后请求的过程中能够识别到你的身份，而不是每次发请求都要输入用户名和密码。

下面介绍一下，我比较常用的登录方案：请求头携带`Token`的方式。

具体步骤：
* 首次登录，将用户名密码传给后端，返回`token`。
* 将`token`存储在`localStroage`和`Vuex`中。
* 用`Axios`将`token`写入请求头中。
* 前端每次请求接口都将携带`token`信息。
* 后端判断`token`是否过期，过期或者没有，则返回401。
* 前端根据401状态码，将页面重定向到登录页面中。

## 封装LocalStorage
```
// storage.js
const Token = 'TOKEN'
const TokenType = 'TOKEN_TYPE'

export function getToken () {
  return localStorage.getItem(TokenType) + ' ' + localStorage.getItem(Token)
}

export function setToken (data) {
  localStorage.setItem(Token, data.token)
  localStorage.setItem(TokenType, data.tokenType)
}

export function removeToken () {
  localStorage.removeItem(Token)
  localStorage.removeItem(TokenType)
}
```
将上述方法写到公共方法里面，统一赋值到`Vue.prototype.$util`中（详情请看我上篇文章[vue开发中的"骚操作"](https://juejin.im/post/6844904132193566728)）

封装非常简单，封装三个方法`getToken`、`setToken`、`removeToken`。
* 登录时，调用setToken将token值存储到localStorage中
* 请求接口时，调用getToken将token值放在请求头中。
* token过期时，调用removeToken将localStorage中的token移除。


## 封装Axios
首先用`axios`创建一个实例，传入一些公共的配置。
```
// require.js
import axios from 'axios';
import qs from 'qs';

const server = axios.create({
    withCredentials: true,
    transformRequest: [function (data) {
        return qs.stringify(data)
    }]
})
```
这里不统一配置`BaseURL`，是因为登录接口与业务接口可能是不在同一个域名下的，而且很可能是跨域的，所以需要配置`proxy`。

我使用的是`vue-cli3`搭建脚手架，创建一个`proxy`文件，设置代理。

然后在`vue.config.js`中引入，并配置在`devServer`的`proxy`属性中。
```
// vue.proxy.config.js
export default {
    '/login': { // 登录接口
        target: 'http://XXX.XXX.XXX.XXX:8080',
        changeOrigin: false,
        ws: false,
        pathRewrite: {
            '^/login': '/login'
        }
    },
    '/api': { // 业务接口
        target: 'http://XXX.XXX.XXX.XXX:8899',
        changeOrigin: false,
        ws: false,
        pathRewrite: {
            '^/api': '/api'
        }
    }
}

// vue.config.js
const proxy = require('./vue.proxy.config.js');
...
module.exports = {
    deServer = {
        proxy: proxy
    }
}
```

然后配置请求拦截器，目的是为了将每个请求都写入一个`Authorization`的`header`。
```
// require.js
...
server.interceptors.request.use(request => {
  request.headers['Authorization'] = getToken()
  return request
}, error => {
  return Promise.reject(error)
})
```

接着配置响应拦截器，目的是拦截`401`状态码。

如果出现`401`状态码，就调用`removeToken`删除`localStorage`中的`token`并刷新页面。

```
// require.js
...
server.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    // 如果是在登录页报错的话直接显示报错信息，否则清除token
    if (location.href.indexOf('login') > 0) {
      Vue.prototype.$notify.error({
        title: '错误',
        message: error.response.data.message
      })
      return
    }
    removeToken()
    location.reload()
  }
  return Promise.reject(error)
})
```

## 路由处理
访问登录之外的页面，都需要登录权限。比如首页，判断是否存在token，有就访问成功，没有则跳转到登录页面。

页面路由跳转过程中，会使用全局钩子`router.beforeEach`中拦截路由，检测到没有`token`就重定向至登录页面。
```
// router.js
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'

Vue.use(Router)
export default async function () {
    const router = new Router({
        routes
    })
    router.beforeEach((to, from, next) => {
        if (localStorage.getItem('TOKEN') === null && to.path !== '/login') {
            next({ path: '/login' })
        }
        next()
    })
    return router
}
```

大致上，登录功能就已经完成了。

## 权限
有登录必有权限，有些页面只有管理员才能访问，有些页面所有人都能访问。那怎么处理比较好呢？

路由级别的权限，我建议前端自己来配置，要不然，在开发阶段，每增加一个路由就要后端去配置，简直是噩梦。

具体实现：
* 在挂载router时，先将一些公用页面挂载，比如说登录页面。
* 当用户登录后，获取到用户角色的权限，再将其权限与路由表中每个页面所需的权限作一次比较，生成用户最终的路由表。
* 调用router.addRouter()方法将其路由表添加到vue-router中。

```
// router.js
export const normalRoutes = [
    {
        path: '/login',
        name: 'login'
        component: Login
    },
    {
        path: '/',
        name: '首页'
        component: Index
    }
]

export const permissionRoutes = [
    {
        path: '/edit',
        name: '编辑页面',
        component: Edit,
        role: {
            role: ['admin, 'editor']
        }
    },
    ...
    {
        path: '*',
        redirect: '/404'
    }
]
```
注意：`404`页面一定要最后加载，如果放在`normalRoutes`中，后面的路由访问都将会被拦截到`404`。

接下来在router.beforeEach中
```
router.beforeEach((to, from, next) => {
    if (localStorage.getItem('TOKEN') === null && to.path !== '/login') {
        next({ path: '/login' })
    } else {
        // 判断是否有用户权限信息
        if (store.state.loginState.roles.length === 0) {
            // 请求用户权限信息
            store.dispath('loginState/getUserInfo').then(res => {
                // 生成可访问的路由表
                store.dispath('loginState/generateRoutes', { res.data.roles }).then(() => {
                    // 动态添加路由表
                    router.addRoutes(store.state.loginState.asyncRoutes)
                    next({...to, replace: true})
                }
                }
            })
        } else {
            next()
        }
    }
})
```

接下来瞧一瞧generateRoutes的逻辑
```
// store/modules/loginState.js
import {normalRoutes, permissionRoutes} from './routes.js';
function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
        return true
    }
}
export const loginState = {
    namespaced: true,
    state: {
        roles: [],
        routes: normalRoutes,
        asyncRoutes: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.asyncRoutes = routes;
            state.routes = [...normalRoutes, ...routes]
        }
    },
    actions: {
        generateRoutes({commit}, data) {
            return new Promise(resolve => {
                const { roles } = data;
                const asyncRoutes = permissionRoutes.filter(routes => {
                    if (roles.indexOf('admin') >= 0) return true;
                    if (hasPermission(roles, routes)) {
                        if (!!routes.children) {
                            routes.children = routes.children.filter(child => {
                                if (hasPermission(roles, child)) return child;
                                return false;
                            })
                            return routes;
                        } else {
                            return routes;
                        }
                    }
                    return false
                });
                commit('SET_ROUTES', asyncRoutes);
                resolve();
            })
        }
    }
}
```

完！
