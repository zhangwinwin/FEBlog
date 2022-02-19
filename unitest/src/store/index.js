import Vue from 'vue'
import Vuex from 'vuex'
import { Alarm } from './alarm'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Alarm
  }
})
