import Vue from 'vue';
import alarmRealtime from './alarm.vue';
import Store from '@store/index';

const AlarmRealtimeConstructore = Vue.extend(alarmRealtime);
AlarmRealtimeConstructore.prototype.$store = Store;

function showAlarmRealtime (alarmItem) {
    console.log('store', Store);
    Store.commit('Alarm/changeCurrentCheckAlarmIdList', {
        id: alarmItem.id,
        show: true
    });
    const dialogDom = new AlarmRealtimeConstructore({
        el: document.createElement('div'),
        data () {
            return {
                alarmItem
            };
        }
    });
    document.body.appendChild(dialogDom.$el);
}

function registryAlarmRealtime () {
    Vue.prototype.$alarm = showAlarmRealtime;
}

export default registryAlarmRealtime;
