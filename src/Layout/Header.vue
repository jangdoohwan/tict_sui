<template>
  <div id="headerWrap">
    <span class="pc-none top-allmenu"><a href="javascript:void(0)" @click="openMobileGnb">전체<span
          class="line"></span><span class="line"></span><span class="line"></span></a></span>
    <h1 class="logo">
      <a @click="goFirstMenu" id="changeImage">
        <img :src="logo" />
      </a>
    </h1>
    <div class="mobile-allmenu" id="gnb" data-module="gnb" :class="{ active: visibleGnb }">
      <div class="top-util">
        <ul class="utils">
          <li class="admin">
            <a @click="modifyUserInfo">{{ userName }}</a>
          </li>
          <li class="thema-setting pc-only inline">
            <a @click="setTheme('red')" class="red" title="테마변경-red">red</a>
            <a @click="setTheme('blue')" class="blue" title="테마변경-blue">blue</a>
            <a @click="setTheme('green')" class="green" title="테마변경-green">green</a>
          </li>
          <li class="logout">
            <a @click="logoutConfirm()" title="로그아웃"><span class="haze">LOGOUT</span></a>
          </li>
          <li class="gnb-close">
            <a href="javascript:void(0)" @click="closeMobileGnb" title="전체메뉴 닫기"><span class="haze">닫기</span></a>
          </li>
        </ul>
      </div>
      <layout-menu @close="closeMobileGnb" />
    </div>
    <div class="pc-none">
      <div class="thema-setting">
        <a @click="setTheme('red')" class="red" title="테마변경-red">red</a>
        <a @click="setTheme('blue')" class="blue" title="테마변경-blue">blue</a>
        <a @click="setTheme('green')" class="green" title="테마변경-green">green</a>
      </div>
    </div>
    <!-- common.js 에서 dim 사용 -->
    <div id="dim" :class="{ active: visibleGnb }" @click="closeMobileGnb"></div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import LayoutMenu from '@/Layout/components/Menu'
import requestApi from '@/api/ccp/requestApi'
import { isMobile } from '@/utils/check'
import logout from '@/api/ccp/logout'
import envs from '@/envs'
import ws from '@/utils/websocket'
import { getUserName, getUserId, getUserSeq } from '@/utils/cookie'

export default {
  name: 'LayoutHeader',
  data() {
    return {
      xMid: 'P00007',
      userId: null,
      userName: null,
      userSeq: null,
      logo: null,
      visibleGnb: false,
      ws: {
        instance: null,
        topic: '/topic/tict-send-symp-uisvc'
      },
      document: {
        visibilityChang: null,
        hidden: null,
        isActive: true
      }
    }
  },
  components: {
    LayoutMenu
  },
  created() {
    this.userSeq = getUserSeq()
    this.userName = getUserName()
    this.userId = getUserId()
    this.logo = ''
    this.retrieveLogo()

    // 이상징후 토픽명 지정
    this.ws.topic += `/${this.userSeq}`

    // 브라우저 활성화 여부 설정
    if (typeof document.hidden !== 'undefined') {
      this.document.visibilityChange = 'visibilitychange'
      this.document.hidden = 'hidden'
    } else if (typeof document.msHidden !== 'undefined') {
      this.document.visibilityChange = 'msvisibilitychange'
      this.document.hidden = 'msHidden'
    } else if (typeof document.webkitHidden !== 'undefined') {
      this.document.visibilityChange = 'webkitvisibilitychange'
      this.document.hidden = 'webkitHidden'
    }

    if (this.document.visibilityChange) {
      document.addEventListener(
        this.document.visibilityChange,
        this.handleVisibilityChange,
        false
      )
    }
  },
  mounted() {
    this.connectWs()
  },
  beforeDestroy() {
    if (!this.ws.instance) {
      this.disconnectWs()
    }

    if (this.document.visibilityChange) {
      document.removeEventListener(
        this.document.visibilityChange,
        this.handleVisibilityChange
      )
    }
  },
  methods: {
    handleVisibilityChange() {
      this.document.isActive = !document[this.document.hidden]
    },
    goFirstMenu() {
      this.$router.push('/home').catch(() => { })
    },
    setTheme(theme) {
      eventBus.$emit('setThemeEventBus', theme)
    },
    retrieveLogo() {
      var reqData = {
        userPlatform: isMobile() ? 'M' : 'W'
      }
      requestApi({
        url: '/online/iotcust/retrieveIotLogo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data.hasLogo === true) {
            var logo = res.data.logo
            this.logo = logo.filePath + '/' + logo.fileName
          } else {
            this.logo = 'assets/default.png'
          }
        }
      })
    },
    logoutConfirm() {
      this.confirm(this.$t('lead-logout'), logout)
    },
    modifyUserInfo: _.throttle(
      function () {
        this.popup({
          component: () => import('@/components/PasswordAuth'),
          title: this.$t('check-pw'),
          width: '300',
          height: '180',
          data: {},
          callback: function (data) {
            if (data === true) {
              this.popup({
                component: () => import('@/views/custusr/user/UserSvc'),
                title: this.$t('user-modify'),
                width: '700',
                height: '570',
                data: {
                  isPopup: true
                },
                callback: function (data) { }
              })
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    openMobileGnb() {
      this.visibleGnb = true
    },
    closeMobileGnb() {
      this.visibleGnb = false
    },
    // -------------------- 웹소켓으로 이상징후 알림 --------------------
    connectWs() {
      // eslint-disable-next-line
      this.ws.instance = new ws()
      this.ws.instance.connect(envs.websocket.url, {
        onconnect: this.onConnectWs,
        ondisconnect: this.onDisconnectWs,
        onmessage: this.onMessageWs
      })
    },
    disconnectWs() {
      this.ws.instance.disconnect()
    },
    subscribe() {
      this.ws.instance.subscribe(this.ws.topic)
    },
    unsubscribe() {
      this.ws.instance.unsubscribe(this.ws.topic)
    },
    onConnectWs() {
      console.log('[Websocket] connected Websocket')
      this.subscribe()
    },
    onMessageWs(frame) {
      console.log('[Websocket] received message', frame)
      if (frame.body) {
        try {
          let data = JSON.parse(frame.body)
          // 페이지 활성화 안되었을때는 알림 출력 하지 않음
          if (this.document.isActive) {
            this.openMessage(data)
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
    onDisconnectWs() {
      console.log('[Websocket] disconnected websocket')
    },
    openMessage(data) {
      if (data.EMRG_POP_YN_FLAG === 'Y') {
        this.openEmrgMessagePopup(data)
      } else {
        this.showMessageToast(data)
      }
    },
    showMessageToast(data) {
      // 일반 알림인 경우 Toast 노출
      this.$toasted.error(data.DET_MSG, {
        action: {
          text: '확인',
          onClick: (e, toastObject) => {
            // this.confirmDetMessage(data)
            toastObject.goAway(0)
          }
        }
      })
    },
    openEmrgMessagePopup(data) {
      // 긴급 알람인 경우 Popup 노출
      this.alert(data.DET_MSG, 'warning', undefined, undefined, undefined, false).then(() => {
      })
    }
  }
}
</script>

<style lang="less">
</style>
