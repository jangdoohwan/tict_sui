<template>
  <div class="relative">
    <iframe :src="src" style="width: 100%; height: calc(100vh - 185px)" @load="fnStopLoading"></iframe>
  </div>
</template>

<script>
import { getUserId } from '@/utils/cookie'
export default {
  name: 'IframePage',
  data() {
    return {
      src: ''
    }
  },
  created() {
    // url 없는 경우 홈으로 이동
    if (!this.$route.params.url) {
      this.$router.push('/')
    }
  },
  mounted() {
    this.src = `${this.$route.params.url}?userId=${getUserId()}`
    this.$store.dispatch('SetVisibleLoading', true)
  },
  methods: {
    fnStopLoading(event) {
      this.$store.dispatch('SetVisibleLoading', false)
    }
  }
}
</script>
