import { fetchAlarmDetail } from '../api/alarmApi'
export const Alarm = {
  namespaced: true,
  state: {
    currentCheckAlarmIdList: [],
    alarmName: ''
  },
  mutations: {
    changeCurrentCheckAlarmIdList (state, data) {
      if (data.show) {
          state.currentCheckAlarmIdList.unshift(data.id);
      } else {
          state.currentCheckAlarmIdList = state.currentCheckAlarmIdList.filter(item => item !== data.id);
      }
    },
    changeAlarmName (state, data) {
      state.alarmName = data;
    },
  },
  actions: {
    fetchAlarmName ({commit}) {
      return fetchAlarmDetail().then(res => {
        commit('changeAlarmName', res)
      })
    }
  }
}