import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import cloneDeep from 'lodash.clonedeep'
import flushPromises from 'flush-promises'
import { Alarm } from '@/store/alarm'
import * as alarmApi from '@/api/alarmApi'
import Home from '@/views/Home.vue';

// 模拟api
jest.mock('../../src/api/alarmApi.js')

// 创建localVue构造函数
const localVue = createLocalVue()
// 在localVue构造函数上安装Vuex
localVue.use(Vuex)

describe('storeConfig', () => {
  test('dispatching fetchAlarmName to update alarmName', async () => {
    expect.assertions(2);

    // 复制Alarm的store module
    const cloneAlarm = cloneDeep(Alarm)
    const store = new Vuex.Store({
      modules: {
        cloneAlarm
      }
    })

    expect(store.state.cloneAlarm.alarmName).toBe('')

    // 实现fetchAlarmDetail接口，并返回模拟数据
    alarmApi.fetchAlarmDetail.mockImplementationOnce(() => Promise.resolve('人机'));
    // dispatch actions
    store.dispatch('cloneAlarm/fetchAlarmName')
    await flushPromises()
    expect(store.state.cloneAlarm.alarmName).toBe('人机')
  })

  test('call handleAlarmName to update the this.alarmName', async () => {
    // 定义Alarm，将在每一个测试之前被重新分配
    const Alarm = {
      namespaced: true,
      actions: {
        // 设置一个mock fetchListData  actions
        fetchListData: jest.fn(() => Promise.resolve())
      }
    }
    const store = new Vuex.Store({
      modules: {
        Alarm
      }
    })
    expect.assertions(1);
    store.dispatch = jest.fn(() => Promise.resolve('人机'))
    // 挂载实例，并注入store与localVue
    const wrapper = shallowMount(Home, { localVue, store })
    wrapper.vm.handleAlarmName();
    await flushPromises()
    expect(wrapper.vm.alarmName).toBe('人机')
  })
})

