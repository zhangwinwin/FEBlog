---
title: VUE的“动态”案例
---
---
# 主题使用方法：https://github.com/xitu/juejin-markdown-themes
theme: juejin
highlight: juejin
---

## 组件动态地插入与退出
### 需求
实时告警功能：通过`WebSocket`协议，从服务器端中接收实时告警信息，在页面中将其的向下移动的同时立即消失。
弹出，展示一分钟后自动退出。实时告警信息弹窗依次增加，先弹出的弹窗向下移动，最新的弹窗在最上方。而且页面只展示最新的3个实时告警信息，其余
### 使用独立组件方法
编写告警弹窗组件
```html
<!--alarm-dialog.vue -->
<template>
    <div class='alarm-realtime' :id="`rt${alarmItem.id}`" :style="{top: topCount}">
        <div class='alarmItem' :class="showDialog ? 'show' : 'disppear'">
        	...
      	</div>
    </div>
</template>
```
其中`topCount`是根据此数据在`alarmList`数组的`index`算出来的，根据在数组中的位置关系而达到向下或向上移动的效果。
```js
// alarm-dialog.vue
export default {
    data () {
        return {
            topCount: '72px'
        };
    },
    computed: {
        dialogIndex () {
            const index = this.$store.state.alarmIdList.findIndex(item => item === this.alarmItem.id);
            return index;
        },
        showDialog () {
            const id = this.$store.state.alarmIdList.find(item => item === this.alarmItem.id);
            return !!id;
        }
    },
    watch: {
    	// 根据dialogIndex的变化，调整topCount的大小
        dialogIndex () {
            const top = this.dialogIndex * 116;
            this.topCount = 72 + top + 'px';
        }
    },
    mounted () {
        const top = this.dialogIndex * 116;
        this.topCount = 72 + top + 'px';
    }
}
```
将此组件用`Vue.extend()`函数将其变成独立组件。
```js
// alarm-dialog.js
import Vue from 'vue'
import AlarmDialog from './alarm-dialog.vue'
import Store from '@store'

const AlarmConstructore = Vue.extend(AlarmDialog)
// 注入vuex
AlarmConstructore.prototype.$store = Store

function showAlarmDialog (alarmItem) {
	// 每打开一个弹窗，就将其id插进alarmIdList数组中，默认为显示
	Store.commit('changeAlarmIdList', {
        id: alarmItem.id,
        show: true
    });
    const dialogDom = new AlarmContructore({
        el: document.createElement('div'),
        data () {
            return {alarmItem}
        }
    })
    document.body.appendChild(dialogDom.$el);
}

function registryAlarm () {
    Vue.prototype.$alarm = showAlarmDialog;
}

export default registryAlarm;
```
`vuex`的方法
```
state: {
    alarmIdList: []
},
mutations: {
    changeAlarmIdList (state, data) {
        if (data.show) {
            // 每一个显示的元素都从数组头部插入
            state.alarmIdList.unshift(data.id);
        } else {
            // 不显示的元素都过滤掉
            state.alarmIdList = state.alarmIdList.filter(item => item !== data.id);
        }
    }
}
```

在`main.js`中注册
```js
import registryAlarm from '@views/alarm-dialog'
Vue.use(registryAlarm)
```

**使用**
```js
// index.js
linkSocketIo () {
    ...
    socketio.on('ALARM_EVENT', (data) => {
        const result = JSON.parse(data);
        // 弹出告警弹窗
        this.$alarm(result);
        // 如果alarmIdList超过三个元素，执行删除操作
        if (this.alarmIdList.length > 3) {
            this.removeAlarmDialog();
        }
        // 设置定时器
        this.controlTimer();
    });
},
removeAlarmDialog () {
    // 将最后一个弹窗删除掉
    const id = this.alarmIdList.pop();
    this.changeAlarmIdList({ show: false, id });
    const el = document.getElementById(`rt${id}`);
    // 给点时间显示消失动画
    setTimeout(() => {
        el.remove();
    }, 300);
},
controlTimer () {
    if (this.alarmIdList.length === 0) {
        return false;
    }
    // 展示一分钟后自动退出
    const timer = setTimeout(() => {
        this.removeAlarmDialog();
    }, 60000);
    this.timerList.unshift(timer);
    // 超过三个元素，定时器数组也要执行删除操作
    if (this.timerList.length > 3) {
        const timer = this.timerList.pop();
        clearTimeout(timer);
    }
}
``` 
效果如下：  
![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/087dd85bcd354992a618f47a6bc739c8~tplv-k3u1fbpfcp-watermark.image)


## 动态加载图片
### 需求
有两组不同类型的图片，一种是历史告警使用的，一种的实时告警使用的。每一组都有10张，根据类型不同展示不同的图片。

### 使用require.context
将图片放在同一个文件夹中，并命名，历史告警图片后缀`-history`，实时告警图片后缀`-realtime`。
```js
methods: {
    handleImages () {
    	// 将图片放到alarm文件夹下
        const routeImgs = require.context('@assets/images/alarm', false, /\.png$/);
        const nameList = routeImgs.keys();
        nameList = nameList.filter(item => {
            // 根据状态将其过滤，this.realtime为true，则为实时告警
            if (this.realtime) {
                return item.indexOf('-realtime') !== -1;
            } else {
                return item.indexOf('-history') !== -1;
            }
        });
        nameList.forEach(item => {
        	// item为./car-realtime.png
            const reg = /\.\/(.+)\.png/;
            const name = item.replace('.', '');
            // fileName为car
            const fileName = reg.exec(item)[1].split('-')[0];
            this.$set(this.routeImgs, fileName, routeImgs(item));
        });
    }
}
```

## 组件动态切换
### 需求
当在组件之间切换的时候，要保持这些组件的状态，以避免反复重渲染导致的性能问题。

### keep-alive与component
不同组件之间进行动态切换，可以通过`Vue`的`<component>`元素加一个特殊的`is`属性来实现。
```
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```
但每次切换新标签的时候，`Vue`都创建了一个新的`currentTabComponent`实例。更希望那些标签的组件实例能够被在它们第一次被创建的时候缓存下来。可以用一个`<keep-alive>`元素将其动态组件包裹起来。
```
<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```