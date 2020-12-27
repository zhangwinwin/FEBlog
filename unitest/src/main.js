import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import registryAlarmRealtime from '@views/alarm/alarm'

Vue.config.productionTip = false
Vue.use(registryAlarmRealtime)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
