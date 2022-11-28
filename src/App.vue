<template>
  <layout-index />
</template>

<script>
import LayoutIndex from '@/Layout/Index'
import { setI18n, getLanguage, setLanguage } from '@/i18n'
import EventBus from '@/utils/eventBus'

export default {
  name: 'App',
  components: {
    LayoutIndex
  },
  data() {
    return {}
  },
  mounted() {
    EventBus.$on('dialog', ({ msg, level, callback, clickToClose }) => {
      this.alert(msg, level, undefined, undefined, undefined, clickToClose).then(() => {
        if (callback) {
          callback()
        }
      })
    })
  },
  created() {
    // 다국어설정
    setI18n().then(() => {
      setLanguage(getLanguage())
    })
  }
}
</script>

<style lang="less">
@import './assets/style/main.less';
</style>
