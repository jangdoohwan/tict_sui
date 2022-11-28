import axios from 'axios'
import envs from '@/envs'
import { alertLogout, logoutProcess } from '@/api/ccp/logout'
import { getToken } from '@/utils/cookie'
import EventBus from '@/utils/eventBus'

let baseUrl = envs.buildUrl

// axios를 셋팅
if (process.env.NODE_ENV === 'development') {
  // 개발 환경일 경우 API위치를 셋팅한 곳으로 정의한다.
  baseUrl = envs.devUrl
}

const service = axios.create({
  baseURL: baseUrl,
  timeout: 60000 // timeout은 5초로 설정
})

// axios의 reqeust 인터셉터 진행 부
service.interceptors.request.use(
  config => {
    config.headers['X-LOGKEY'] = getLogKey()
    if (getToken()) {
      config.headers['X-AUTH'] = getToken()
    }
    return config
  },
  error => {
    // 에러가 날경우 진행 부분
    console.error(error) // for debug
    Promise.reject(error)
  }
)

// axios의 response 인터셉터
service.interceptors.response.use(
  response => {
    // return res
    console.info(
      '[UI Response] ' + response.config.url + '\n%cresponse:',
      'background-color:#58FA58; color:black',
      response.data
    )
    return response
  },
  error => {
    let msg = error.message

    // error.response가 없을 경우도 존재 - Network 문제
    if (error.response) {
      console.info(
        '[UI Framework api res] ' + error.config.url + '\n%c(error)response:',
        'background-color:#FA5858; color:black',
        error.response.data
      )

      // 로그아웃 시 오류 발생했다면 그냥 로그아웃 시켜버림
      let urlSplit = error.config.url.split('/')
      let lastResource = urlSplit[urlSplit.length - 1]
      if (lastResource === 'processIotLogout') {
        logoutProcess()
        return
      }

      if (
        error.response.status === 401 ||
        error.response.status === 402 ||
        (error.response.status === 500 &&
          error.response.data.message === 'Access denied')
      ) {
        // 401 에러
        msg = '세션이 만료되었거나, 로그인이 실패되었습니다.'
        alertLogout(msg)
        return
      } else if (error.response.status === 503) {
        msg = 'Service Unavailable'
      } else {
        msg = error.response.data.result.desc
      }
      // Network 관련 문제 발생 시 error.response가 없음.
    } else {
      console.info(
        '[UI Framework api res] ' + error.config.url + '\n%c(error)response:',
        'background-color:#FA5858; color:black',
        JSON.parse(JSON.stringify(error))
      )
      // console.warn(error.config.url + ' (error)response:', error) // for debug
      error.response = {
        status: 408,
        data: {
          result: {
            status: error.code === 'ECONNABORTED' ? '408' : error.code,
            desc: error.message
          }
        }
      }
    }
    // 에러 출력
    let level =
      error.response.status === 408 ||
      error.response.status === 500 ||
      error.response.status === 503 ||
      error.response.status === 510
        ? 'error'
        : 'warning'
    EventBus.$emit('dialog', { msg, level })
    return Promise.reject(error)
  }
)
function getLogKey() {
  let dateObj = new Date()
  let logKey =
    '' +
    dateObj.getFullYear() +
    (dateObj.getMonth().length === 2
      ? dateObj.getMonth() + 1
      : '0' + (dateObj.getMonth() + 1)) +
    (dateObj.getDate().length === 2
      ? dateObj.getDate()
      : '0' + dateObj.getDate()) +
    dateObj.getHours() +
    dateObj.getMinutes() +
    dateObj.getSeconds() +
    dateObj.getMilliseconds() +
    getRandomValue() +
    getRandomValue()

  return logKey
}

function getRandomValue() {
  let text = ''
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 4; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export default service
