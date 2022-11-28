<template>
  <div>
    <div class="modal-body">
      <p class="mb-2 mx-2">{{ desc }}</p>
      <div class="form-row row">
        <div class="form-item col-sm-12">
          <span class="form-label w-40 lb-txt">{{ $t('new-pw') }}</span>
          <input
            v-model="formData.usrPwd"
            type="password"
            class="form-control"
            :title="$t('new-pw')"
            @keyup.enter="fnChangePwdConfirm"
          />
        </div>
        <div class="form-item col-sm-12">
          <span class="form-label w-40 lb-txt">{{ $t('check-pw') }}</span>
          <input
            v-model="formData.checkUsrPwd"
            type="password"
            class="form-control"
            :title="$t('check-pw')"
            @keyup.enter="fnChangePwdConfirm"
          />
        </div>
      </div>
      {{ formData.reason }}
      <!-- 안내 문구 -->
      <ul class="my-2 fs12">
        <li>{{ $t('pwd-valid-first') }}</li>
        <li>{{ $t('pwd-valid-second') }}</li>
        <li>{{ $t('pwd-valid-third') }}</li>
        <li>{{ $t('pwd-valid-forth') }}</li>
        <li>{{ $t('pwd-valid-fifth') }}</li>
        <li>{{ $t('pwd-valid-sixth') }}</li>
        <li>{{ $t('pwd-valid-seventh') }}</li>
      </ul>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button class="btn btn-pink" @click="fnChangePwdConfirm">
          {{ $t('change-pw') }}
        </button>
        <button v-if="!isNewPw" class="btn btn-gray" @click="fnChagnePwdNext">
          {{ $t('change-pw-next') }}
        </button>
        <button v-else class="btn btn-gray" @click="close">
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import { isEmpty } from '@/utils/comUtils'

export default {
  name: 'ChagnePwd',
  props: {
    data: Object, // 넘겨받을 데이터,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P01004',
      formData: {
        usrPwd: '',
        checkUsrPwd: '',
        pwdChange: null
      }
    }
  },
  computed: {
    desc() {
      if (this.data.reason === 'newPw') {
        return this.$t('lead-new-pw')
      } else if (this.data.reason === 'pwdModDt') {
        return this.$t('pwd-mod-dttm')
      } else if (this.data.reason === 'pwdNxtDt') {
        return this.$t('pwd-nxt-dttm')
      }
      return ''
    },
    isNewPw() {
      // 최초 로그인 시 비밀번호 초기화인지
      return this.data.reason === 'newPw'
    }
  },
  mounted() {},
  methods: {
    // 비밀번호 변경 확인
    fnChangePwdConfirm() {
      if (!this.fnValidateData()) {
        return false
      }
      this.confirm(this.$t('confirm-pwd-change'), this.fnChangePwd)
    },
    // 비밀번호 변경
    fnChangePwd() {
      const data = {
        usrPwd: btoa(unescape(encodeURIComponent(this.formData.usrPwd))),
        pwdChange: this.isNewPw ? 'firstChange' : null
      }

      requestApi({
        url: '/online/iotlogin/updateIotUsrPwd',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: data,
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.changePwdYn) {
              this.alert(this.$t('notice-change-pwd'), 'success').then(() => {
                this.close()
                this.callback(false) // 재 로그인 하지 않음
              })
            }
          }
        }
      })
    },
    // 다음에 변경하기
    fnChagnePwdNext() {
      requestApi({
        url: '/online/iotlogin/updateIotUsrPwdNxt',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.pwdChangeNxt) {
              this.close()
              this.callback(true) // 재 로그인 진행
            }
          }
        }
      })
    },
    // 입력 검증
    fnValidateData() {
      if (isEmpty(this.formData.usrPwd)) {
        this.alert(this.$t('notice-pwd-input'))
        return false
      }
      if (this.formData.usrPwd !== this.formData.checkUsrPwd) {
        this.alert(this.$t('notice-unpaired-pwd'))
        return false
      }
      return true
    }
  }
}
</script>
