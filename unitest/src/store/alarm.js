export const Alarm = {
  namespaced: true,
  state: {
    currentCheckAlarmIdList: [],
  },
  mutations: {
    changeCurrentCheckAlarmIdList (state, data) {
      if (data.show) {
          state.currentCheckAlarmIdList.unshift(data.id);
      } else {
          state.currentCheckAlarmIdList = state.currentCheckAlarmIdList.filter(item => item !== data.id);
      }
  }
  }
}