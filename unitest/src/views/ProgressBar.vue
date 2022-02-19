<template>
  <div class="Progress-Bar" :class="{hidden: hidden}">
  </div>
</template>

<script>
export default {
  name: 'ProgressBar',
  data () {
    return {
      hidden: true
    }
  },
  methods: {
    start () {
      this.hidden = false;
    },
    finally () {
      this.hidden = true;
    }
  },
}
</script>