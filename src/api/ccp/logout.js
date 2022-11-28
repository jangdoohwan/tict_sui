import requestApi from '@/api/ccp/requestApi'
import {
  removeCustId,
  removeToken,
  removeUserId,
  removeUserName,
  removeCookie,
  removeUserSeq
} from '@/utils/cookie'
import store from '@/store'
import moment from 'moment'
import { getParsedJwtBody } from '@/utils/jwt'
import { realtime, intelligent } from '@/envs'
import EventBus from '@/utils/eventBus'

let showAlertLogoutMsg = false

export function logout() {
  if (isTokenExpired()) {
    logoutProcess()
  } else {
    var reqData = {}
    requestApi({
      url: '/online/iotlogout/processIotLogout',
      headers: {
        'X-MID': 'P00001'
      },
      method: 'post',
      data: reqData,
      callback: (res) => {
        if (
          !res.result.status || // Status Code가 없는경우 (크로스도메인 이슈)
          res.result.status === '200' || // 정상
          res.result.status === '503' || // Service Unavailable
          res.result.status === '401' ||
          res.result.status === '402'
        ) {
          // 권한없음 (토큰 만료된경우 - 브라우저 다른탭에서 로그아웃함)
          logoutProcess()
        }
      }
    })
  }
}

export function logoutProcess() {
  removeToken()
  removeCustId()
  removeUserId()
  removeUserName()
  removeUserSeq()
  removeCookie(realtime.accessTokenKey)
  removeCookie(realtime.refreshTokenKey)
  removeCookie(intelligent.accessTokenKey)
  removeCookie(intelligent.refreshTokenKey)
  location.href = ''
}

function isTokenExpired() {
  let tokenBody = getParsedJwtBody(store.state.user.token)
  if (tokenBody.exp) {
    return moment().isAfter(moment(tokenBody.exp * 1000))
  } else {
    return false
  }
}

export function alertLogout(msg) {
  // 로그아웃 메시지 한번만 띄움
  if (showAlertLogoutMsg) {
    return
  }

  EventBus.$emit('dialog', {
    msg,
    level: 'error',
    callback: () => {
      logout()
    },
    clickToClose: false
  })

  // 알람 후 30초 뒤에 닫음
  setTimeout(() => {
    logout()
  }, 30 * 1000) // 30 sec

  showAlertLogoutMsg = true
}

export default logout
