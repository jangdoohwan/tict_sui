<template>
  <div class="login-wrap">
    <div class="login-box-wrap">
      <div class="login-box">
        <h1 class="logo flex justify-center" style="height: auto">
          <a href=""><img src="@/assets/images/logo.png" /></a>
        </h1>
        <div class="inner">
          <div class="form-group">
            <input v-model="formData.custLoginId" type="text" class="form-control" :placeholder="$t('cust-login-id')"
              :title="$t('cust-login-id')" maxlength="20" @keyup.enter="fnLogin" />
          </div>
          <div class="form-group">
            <input v-model="formData.usrLoginId" type="text" class="form-control" :placeholder="$t('id')"
              :title="$t('id')" maxlength="20" @keyup.enter="fnLogin" />
          </div>
          <div class="form-group">
            <input v-model="formData.usrPwd" type="password" class="form-control" :placeholder="$t('pw')"
              :title="$t('pw')" maxlength="20" @keyup.enter="fnLogin" />
          </div>
          <span class="form-check">
            <label class="form-check-label" for="checkboxSaveId">
              <input v-model="view.saveId" type="checkbox" class="form-check-input" id="checkboxSaveId" />{{
                  $t('save-id')
              }}
              <span class="form-check-sign"></span>
            </label>
          </span>
          <button type="button" class="btn btn-pink wide" @click="fnLogin">
            {{ $t('login') }}
          </button>
        </div>
        <!-- SMS 발송 기능 지원하지 않아 id, pw 초기화 기능 주석 -->
        <!-- <div class="login-util">
          <span
            ><a @click="findUsrIdPopup()">{{ $t('find-id') }}</a
            ><a @click="findUsrPwdPopup()">{{ $t('init-pw') }}</a></span
          >
        </div> -->
      </div>
    </div>
    <!-- footerWrap : S -->
    <div class="login-footer" style="padding-left: 15px; padding-right: 15px">
      <div class="footer">
        <span class="f-logo"><img src="@/assets/images/footer_logo.png" alt="LG U+" /></span>
        <span class="f-name">{{ $t('footer-first') }}</span>
        <div class="f-info">
          <span class="pc-only inline">{{ $t('footer-second') }}</span>&nbsp;
          <span class="">{{ $t('footer-third') }}</span>
          <span class="">{{ $t('footer-forth') }}</span>
          <span class="">{{ $t('footer-fifth') }}</span>
          <span class="">
            <a href="http://www.ftc.go.kr/www/bizCommView.do?key=232&apv_perm_no=2015302015030200474&pageUnit=10&searchCnd=bup_nm&searchKrwd=%EC%97%98%EC%A7%80%EC%9C%A0%ED%94%8C%EB%9F%AC%EC%8A%A4&pageIndex=1"
              target="_blank" title="새창열림"><u>{{ $t('footer-sixth') }}</u></a>
          </span>
          &nbsp;
          <span class="">
            <a href="javascript:;"><u>{{ $t('footer-seventh') }}</u></a>
          </span>
          <span class="line-break">{{ $t('footer-eighth')
          }}<span class="pc-only inline">{{ $t('footer-ninth') }}</span></span>
        </div>
      </div>
    </div>
    <!-- footerWrap : E -->
  </div>
</template>

<script>
import envs from '@/envs'
import store from '@/store'
import router from '@/router'
import requestApi from '@/api/ccp/requestApi'
import {
  getCookie,
  setCookie,
  setToken,
  setCustId,
  setUserId,
  setUserName,
  setUserSeq,
  setCustSeq
} from '@/utils/cookie'
import { setLanguage } from '@/i18n'
import { isEmpty } from '@/utils/comUtils'

const SAVED_CUSTID_KEY = 'SAVED_CUSTID_KEY_' + envs.framework.env
const SAVED_USRID_KEY = 'SAVED_USRID_KEY_' + envs.framework.env

export default {
  name: 'Login',
  data() {
    return {
      xMid: 'P01001',
      formData: {
        custLoginId: '',
        usrLoginId: '',
        usrPwd: '',
        authCdId: 'GN00000058',
        secLogin: false // 비밀번호 변경, 약관 동의 등의 이유로 2번째 로그인인지 여부
      },
      view: {
        saveId: false
      }
    }
  },
  created() {
    store.dispatch('SetClearMenus')
  },
  mounted() {
    // 언어 한국어로 설정
    setLanguage('ko')
    this.fnSetSavedId()
  },
  methods: {
    // 쿠키에 저장된 아이디 조회하여 세팅
    fnSetSavedId() {
      const savedCustId = getCookie(SAVED_CUSTID_KEY)
      const savedUsrId = getCookie(SAVED_USRID_KEY)
      if (savedCustId && savedUsrId) {
        this.formData.custLoginId = savedCustId
        this.formData.usrLoginId = savedUsrId
        this.view.saveId = true
      }
    },
    fnLogin() {
      if (!this.fnValidate()) {
        return
      }

      const data = JSON.parse(JSON.stringify(this.formData))
      data.usrPwd = btoa(unescape(encodeURIComponent(data.usrPwd)))

      requestApi({
        url: '/online/iotlogin/processIotLogin',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: data,
        callback: (res) => {
          if (res.result.status !== '200') {
            return
          }
          // 비밀번호 초기화, 비밀번호 만료
          if (res.data.changePwd) {
            this.fnShowChangePwdPopup(res.data)
            return
          }

          // 약관동의
          if (res.data.termsAgree === false) {
            this.fnShowTermsAgreePopup(res.data)
            return
          }
          // 2차 인증
          if (res.data.authUsr) {
            this.fnShowSMSAuthPopup(res.data)
            return
          }

          // 정상 로그인
          this.fnSetLoginUserInfo(res.data)
        }
      })
    },
    // 로그인 사용자 정보 세팅
    fnSetLoginUserInfo(responseData) {
      // 아래 쿠키는 화면에서 사용
      setToken(responseData.auth)
      setCustId(this.formData.custLoginId)
      setUserId(this.formData.usrLoginId)
      setUserName(responseData.usrNm)
      setUserSeq(responseData.usrSeq)
      setCustSeq(responseData.custSeq)

      // 아이디 저장 쿠키 설정
      setCookie(SAVED_CUSTID_KEY, this.formData.custLoginId)
      setCookie(SAVED_USRID_KEY, this.formData.usrLoginId)

      store.dispatch('SetUserName', responseData.usrNm)
      store.dispatch('ProcessLogin', responseData.auth)
      router.replace('/').catch(() => { })
    },
    // 비밀번호 변경 팝업
    fnShowChangePwdPopup(responseData) {
      const data = {
        reason: responseData.changePwd,
        auth: responseData.auth
      }
      this.popup({
        component: () => import('@/Layout/components/ChangePwd'),
        title: this.$t('init-pw'),
        width: '500',
        data: data,
        callback: (flag) => {
          if (flag) {
            // 로그인 재요청
            this.formData.secLogin = true
            this.fnLogin()
          } else {
            this.formData.usrPwd = ''
          }
        }
      })
    },
    // 약관 동의 팝업
    fnShowTermsAgreePopup(responseData) {
      const data = {
        auth: responseData.auth
      }
      this.popup({
        component: () => import('@/Layout/components/TermsAgr'),
        title: this.$t('usr-terms'),
        width: '900',
        data: data,
        callback: (flag) => {
          if (flag) {
            // 로그인 재요청
            this.formData.secLogin = true
            this.fnLogin()
          } else {
            this.formData.usrPwd = ''
          }
        }
      })
    },
    // 2차 인증 팝업
    fnShowSMSAuthPopup(responseData) {
      const data = {
        auth: responseData.auth
      }
      this.popup({
        component: () => import('@/Layout/components/SmsAuth'),
        title: this.$t('sms-auth'),
        width: '500',
        data: data,
        callback: (flag, responseData) => {
          if (flag) {
            // 정상 로그인
            this.fnSetLoginUserInfo(responseData)
          } else {
            // 약관 동의
            this.fnShowTermsAgreePopup(responseData)
          }
        }
      })
    },
    // 입력 검증
    fnValidate() {
      if (isEmpty(this.formData.custLoginId)) {
        this.alert(this.$t('cust-login-id') + this.$t('request-input'))
        return false
      }

      if (isEmpty(this.formData.usrLoginId)) {
        this.alert(this.$t('id') + this.$t('request-input'))
        return false
      }

      if (isEmpty(this.formData.usrPwd)) {
        this.alert(this.$t('pw') + this.$t('request-input'))
        return false
      }
      return true
    }
  }
}
</script>
