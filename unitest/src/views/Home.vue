<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <p>Welcome to Your Vue.js App</p>
    <button @click="handleCheck">查看弹窗</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
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
      alarmId: '',
      timerList: []
    }
  },
  methods: {
    ...mapMutations('Alarm', ['changeCurrentCheckAlarmIdList']),
    handleCheck () {
      this.primaryId += 1
      const obj = {
        id: this.primaryId
      }
      this.$alarm(obj);
      this.tableList.push(obj);
      this.alarmId = obj.id;
      if (this.currentCheckAlarmIdList.length > 3) {
          this.removeAlarmRealtime();
      }
      this.controlTimer();
    },
    controlTimer () {
      if (this.currentCheckAlarmIdList.length <= 0) {
          return false;
      }
      const timer = setTimeout(() => {
          this.removeAlarmRealtime();
      }, 60000);
      this.timerList.unshift(timer);
      if (this.timerList.length > 3) {
          const timer = this.timerList.pop();
          clearTimeout(timer);
      }
    },
    removeAlarmRealtime () {
      const id = this.currentCheckAlarmIdList.pop();
      this.changeCurrentCheckAlarmIdList({ show: false, id });
      const el = document.getElementById(`rt${id}`);
      setTimeout(() => {
          el.remove();
      }, 300);
    },
  },
}
</script>
