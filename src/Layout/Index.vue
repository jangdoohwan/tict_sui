<template>
  <div>
    <layout-skip />
    <div id="bodyWrap" class="main" :class="theme">
      <!-- not Login : S -->
      <router-view v-if="!isLogin"></router-view>
      <!-- not Login : E -->

      <div v-else>
        <layout-header />
        <layout-contents />
      </div>
    </div>
    <div v-show="storeLoadingState" class="loader fixed">
      <div class="loader-inner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import LayoutSkip from '@/Layout/components/Skip'
import LayoutHeader from '@/Layout/Header'
import LayoutContents from '@/Layout/Contents'

import store from '@/store'
import '@/auth' // FIXME 로그인 작업자가 사용(수정예정)

import eventBus from '@/utils/eventBus'
import { getTheme, setTheme } from '@/utils/theme'
import { getCustId, getUserId, getToken } from '@/utils/cookie'

export default {
  name: 'LayoutIndex',
  components: {
    LayoutSkip,
    LayoutHeader,
    LayoutContents
  },
  data() {
    return {
      theme: null,
      isLogin: false
    }
  },
  computed: {
    storeLoadingState() {
      return store.state.loading.isVisible
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler() {
        this.isLogin = getToken() && this.$route.meta.layout !== 'init'
      }
    }
  },
  created() {
    // 테마값이 null 로 들어오는경우 기존에 저장되어있는 테마를 불러온다.
    /* eslint-disable indent */
    eventBus.$on('setThemeEventBus', theme => {
      this.theme =
        theme === 'red'
          ? ''
          : theme === 'blue'
          ? 'type-blue'
          : theme === 'green'
          ? 'type-green'
          : getTheme(getCustId(), getUserId())
      setTheme(getCustId(), getUserId(), this.theme)
      store.dispatch('SetTheme', this.theme)
    })
    if (!this.theme) {
      // 페이지 새로고침 시 저장된 테마를 가져와 셋팅한다.
      this.theme = getTheme(getCustId(), getUserId())
    }
    // 테마를 store에 저장 해놓고 화면마다 사용 시에는 store를 본다.
  }
}
</script>

<style lang="less">
</style>
