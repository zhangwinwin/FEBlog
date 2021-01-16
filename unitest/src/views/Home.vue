<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App" @sayHello='hanldeSayHello'/>
    <p>{{greeting}} Welcome to Your Vue.js App</p>
    <button @click="handleCheck" class="check">查看弹窗</button>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import * as alarmApi from '@/api/alarmApi.js';
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  computed: {
    ...mapState('Alarm', {
        currentCheckAlarmIdList: state => state.currentCheckAlarmIdList
    })
},
  data () {
    return {
      primaryId: 1,
      tableList: [],
      timerList: [],
      idList: [],
      greeting: 'hi',
      alarmName: ''
    }
  },
  methods: {
    ...mapMutations('Alarm', ['changeCurrentCheckAlarmIdList']),
    hanldeSayHello (greeting) {
      this.greeting = greeting;
    },
    async handleAlarmName () {
      this.$store.dispatch('Alarm/fetchAlarmName').then(res => {
        this.alarmName = res;
      })
    },
    async handleCheck () {
      this.primaryId += 1

      // 2.4
      const name = await alarmApi.fetchAlarmDetail();

      const obj = {
        id: this.primaryId,
        name
      }
      this.$alarm(obj);
      this.idList.unshift(this.primaryId)
      this.tableList.push(obj);
      if(this.idList.length > 1) {
        this.removeAlarmRealtime();
      }
      // if (this.currentCheckAlarmIdList.length > 3) {
      //     this.removeAlarmRealtime();
      // }
      this.controlTimer();
    },
    controlTimer () {
      // if (this.currentCheckAlarmIdList.length <= 0) {
      //     return false;
      // }
      const timer = setTimeout(() => {
          this.removeAlarmRealtime();
      }, 3000);
      this.timerList.unshift(timer);
      if (this.timerList.length > 1) {
          const timer = this.timerList.pop();
          clearTimeout(timer);
      }
    },
    removeAlarmRealtime () {
      const id = this.idList.pop();
      // this.changeCurrentCheckAlarmIdList({ show: false, id });
      const el = document.getElementById(`rt${id}`);
      setTimeout(() => {
          el.remove();
      }, 300);
    },
  },
}
</script>
