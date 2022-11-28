<template>
  <div>
    <div class="modal-body">
      <div class="text-center">
        <p class="mb-3">
          {{ $t('notice-send-sms') }}<br />{{ $t('lead-auth-check') }}
        </p>
        <div class="form-row" style="justify-content: center">
          <div class="form-item col-sm-8">
            <span class="lb-txt mr-3">{{ $t('auth-no') }}</span>
            <div class="input-group">
              <input
                v-model="authNo"
                type="text"
                class="form-control"
                :title="$t('auth-no')"
                maxlength="6"
              />
              <button
                class="btn btn-info input-group-addon btn-sm"
                @click="fnRetryAuthNo"
              >
                {{ $t('request') }}
              </button>
            </div>
          </div>
        </div>
        <p class="bold my-2">{{ $t('eff-time') }} {{ visibleExpiredTime }}</p>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button class="btn btn-pink" @click="fnCheckAuthNo">
          {{ $t('confirm') }}
        </button>
        <button class="btn btn-gray" @click="close">{{ $t('close') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'SmsAuth',
  props: {
    data: Object,
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
      xMid: 'P01006',
      authNo: '',
      view: {
        expiredTime: '',
        timerInterval: null
      }
    }
  },
  computed: {
    visibleExpiredTime() {
      return moment(this.view.expiredTime).format('mm:ss')
    }
  },
  mounted() {
    this.fnRequestAuthNo()
  },
  beforeDestroy() {
    this.fnClearTimer()
  },
  methods: {
    // 인증번호 요청
    fnRequestAuthNo() {
      requestApi({
        url: '/online/iotlogin/processIotReqAuthNo',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: {
          authCdId: 'GN00000058'
        },
        callback: (res) => {
          if (res.result.status === '200') {
            this.fnSetTimer()
          } else {
            this.close()
          }
        }
      })
    },
    // 인증번호 재요청
    fnRetryAuthNo() {
      this.fnClearTimer()
      requestApi({
        url: '/online/iotlogin/processIotReqAuthNo',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: {
          authCdId: 'GN00000058'
        },
        callback: (res) => {
          if (res.result.status === '200') {
            this.alert(this.$t('retry-sms-auth-no'), 'success')
            this.fnSetTimer()
          } else {
            this.close()
          }
        }
      })
    },
    // 인증번호 확인
    fnCheckAuthNo() {
      requestApi({
        url: '/online/iotlogin/processIotCheckUsrAuthNo',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: {
          authNo: this.authNo
        },
        callback: (res) => {
          if (res.result.status === '200') {
            if (res.data.authAccess === true && res.data.terms === false) {
              // 로그인 정보 설정
              this.callback(true, res.data)
            } else {
              // 약관 동의 팝업 오픈
              this.callback(false, res.data)
            }
            this.close()
          }
        }
      })
    },
    // 타이머 세팅
    fnSetTimer() {
      if (this.view.timerInterval) {
        this.fnClearTimer()
      }
      this.view.expiredTime = 3 * 60 * 1000 // 3min
      this.view.timerInterval = setInterval(() => {
        this.view.expiredTime = this.view.expiredTime - 1000
        if (this.view.expiredTime <= 0) {
          this.fnClearTimer()
        }
      }, 1000)
    },
    // 타이머 초기화
    fnClearTimer() {
      clearInterval(this.view.timerInterval)
      this.view.timerInterval = null
      this.view.expiredTime = 0
    }
  }
}
</script>
