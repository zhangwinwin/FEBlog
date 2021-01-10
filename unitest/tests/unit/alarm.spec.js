import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import * as alarmApi from '@/api/alarmApi';
import flushPromises from 'flush-promises';

jest.mock('../../src/api/alarmApi.js')

describe('test alarm', () => {
  const $alarm = jest.fn()
  const mocks ={
    $alarm
  }
  // 2.1
  it('when handleCheck is clicked, show the alarm', async () => {
    expect.assertions(1);
    const wrapper = shallowMount(Home, {
      mocks
    });
    const count = wrapper.vm.primaryId;
    alarmApi.fetchAlarmDetail.mockImplementationOnce(() => Promise.resolve('人机'));
    wrapper.vm.handleCheck();
    await flushPromises();
    const newCount = wrapper.vm.primaryId;
    expect(newCount).toBe(count + 1)
  })

  // 2.2
  it('when handleCheck is clicked, 3second later alarm would be disappeared', async () => {
    expect.assertions(2);
    // 测试之前，替换全局定时函数
    jest.useFakeTimers();
    const wrapper = shallowMount(Home, {
      mocks
    });
    alarmApi.fetchAlarmDetail.mockImplementationOnce(() => Promise.resolve('人机'));
    wrapper.vm.handleCheck();
    await flushPromises();
    expect(wrapper.vm.idList.length).toBe(1);
    // 将时间推进3000毫秒
    jest.runTimersToTime(3000);
    expect(wrapper.vm.idList.length).toBe(0);
  })

  // 2.3
  it('when handleCheck is clicked and the number of alarm exceeds 1 , The previous alarm disappears immediately', async () => {
    expect.assertions(1);
    // 监听clearTimeout
    jest.spyOn(window, 'clearTimeout')
    const wrapper = shallowMount(Home, {
      mocks
    });
    alarmApi.fetchAlarmDetail.mockImplementationOnce(() => Promise.resolve('人机'));
    // 设置setTimeout返回值为123
    setTimeout.mockReturnValue(123)
    wrapper.vm.handleCheck();
    await flushPromises();
    // 设置setTimeout返回值为456
    setTimeout.mockReturnValue(456)
    wrapper.vm.handleCheck();
    await flushPromises();
    expect(window.clearTimeout).toHaveBeenCalledWith(123)
  })

  // 2.4
  it('fetch the alarm detail by http', async () => {
    // 设置断言数量，如果一个promise被拒绝，测试会失败
    expect.assertions(1);
    const name = await alarmApi.fetchAlarmDetail();
    expect(name).toBe('人机')
  })

  // 2.5
  it('click the button then the $alarm will be called', () => {
    const wrapper = shallowMount(Home, {
      mocks
    });
    wrapper.find('button.check').trigger('click');
    expect($alarm).toHaveBeenCalled();
  })
})