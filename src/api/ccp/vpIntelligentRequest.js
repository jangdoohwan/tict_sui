import { intelligent } from '@/envs'
import requestApi from '@/api/ccp/requestApi'
import { getCookie, setCookie, removeCookie } from '@/utils/cookie'
import EventBus from '@/utils/eventBus'

export function getToken() {
  return new Promise((resolve, reject) => {
    let token = getCookie(intelligent.accessTokenKey)
    if (token) {
      resolve(token)
      return
    }

    requestApi({
      url: '/online/vpcom/intelligent/login',
      headers: { 'X-MID': 'P02001' },
      method: 'post',
      data: {},
      callback: res => {
        if (res.result.status === '200' && res.data.status !== 800) {
          setCookie(intelligent.accessTokenKey, res.data.Response.AccessToken)
          setCookie(intelligent.refreshTokenKey, res.data.Response.RefreshToken)
          resolve()
        } else {
          // eslint-disable-next-line
          reject('fail-to-get-token')
        }
      }
    })
  })
}

export function vpIntelligentRequest(requestObj, options) {
  return new Promise((resolve, reject) => {
    getToken()
      .then(() => {
        requestApi({
          url: requestObj.url,
          headers: Object.assign({}, requestObj.headers, {
            'X-VP-INTELLIGENT-TOKEN': getCookie(intelligent.accessTokenKey)
          }),
          method: requestObj.method,
          data: requestObj.data,
          callback: res => {
            if (res.result.status === '200' && res.data.status !== 800) {
              resolve(res)
            } else {
              refreshTokenRetry(requestObj, options)
                .then(res => {
                  resolve(res)
                })
                .catch(e => {
                  throw e
                })
            }
          }
        })
      })
      .catch(e => {
        if (e === 'fail-to-get-token') {
          EventBus.$emit('dialog', {
            msg: '지능형 영상 플랫폼 토큰 발급 시 오류가 발생했습니다.',
            level: 'error'
          })
        }
        reject(e)
      })
  })
}

function refreshTokenRetry(requestObj, options) {
  return new Promise((resolve, reject) => {
    removeCookie(intelligent.accessTokenKey)
    getToken()
      .then(() => {
        requestApi(
          {
            url: requestObj.url,
            headers: Object.assign({}, requestObj.headers, {
              'X-VP-INTELLIGENT-TOKEN': getCookie(intelligent.accessTokenKey)
            }),
            method: requestObj.method,
            data: requestObj.data,
            callback: res => {
              if (res.result.status === '200') {
                resolve(res)
              } else {
                reject(res)
              }
            }
          },
          options
        )
      })
      .catch(e => {
        reject(e)
      })
  })
}
