<template>
  <div>
    <div class="modal-body terms">
      <h5>{{ $t('terms-first') }}</h5>
      <p class="mb-3">{{ $t('terms-second') }}</p>
      <div
        v-for="(terms, index) in termsList"
        :key="`terms-${index}`"
        class="mb-3"
      >
        <h5 v-if="terms.iotTermsNm">{{ terms.iotTermsNm }}</h5>
        <textarea
          v-model="terms.iotTermsCntn"
          readonly
          rows="10"
          style="resize: none; width: 100%; margin-bottom: 5px"
          class="form-control"
        ></textarea>
        <div class="form-check">
          <label class="form-check-label" :for="`terms-${index}`">
            <input
              v-model="terms.checkYn"
              :id="`terms-${index}`"
              type="checkbox"
              class="form-check-input"
              true-value="Y"
              false-value="N"
            />
            <template v-if="terms.reqYn === 'Y'">
              {{ $t('terms-third') }}
            </template>
            <template v-else>
              {{ $t('terms-forth') }}
            </template>
            <span class="form-check-sign"></span>
          </label>
        </div>
      </div>
      <ul class="point-txt">
        <li>{{ $t('terms-fifth') }}</li>
        <li>{{ $t('terms-sixth') }}</li>
      </ul>
      <p class="info">
        {{ view.nowDate }}<span class="">{{ view.usrNm }}</span>
      </p>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button class="btn btn-pink" @click="fnAgreeTermsConfirm">
          {{ $t('agree') }}
        </button>
        <button class="btn btn-gray" @click="fnCloseConfirm">
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import moment from 'moment'

export default {
  name: 'TermsAgr',
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
      xMid: 'P01005',
      termsList: [],
      view: {
        nowDate: null,
        usrNm: ''
      }
    }
  },
  mounted() {
    this.view.nowDate = moment().format('YYYY월 MM월 DD일')
    this.fnGetTerms()
    this.fnGetUserInfo()
  },
  methods: {
    // 사용자 정보 조회
    fnGetUserInfo() {
      requestApi({
        url: '/online/iotlogin/retrieveIotUsrPersonalInfo',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200') {
            this.view.usrNm = res.data.usrNm
          }
        }
      })
    },
    // 약관 조회
    fnGetTerms() {
      requestApi({
        url: '/online/iotterms/retrieveIotTerms',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200') {
            this.termsList = res.data.termsList
          }
        }
      })
    },
    // 약관 동의 확인
    fnAgreeTermsConfirm() {
      // 필수 항목 체크 확인
      const notCheckTermsList = this.termsList.filter(
        (terms) => terms.reqYn === 'Y' && terms.checkYn !== 'Y'
      )
      if (notCheckTermsList.length > 0) {
        this.alert(this.$t('lead-check-terms'))
        return
      }
      this.confirm(this.$t('lead-termsAgree'), this.fnAgreeTerms)
    },
    // 약관 동의
    fnAgreeTerms() {
      const agreeTermsList = this.termsList.filter(
        (terms) => terms.checkYn === 'Y'
      )
      const termsNoList = agreeTermsList.map((terms) => terms.iotTermsNo)
      requestApi({
        url: '/online/iotterms/createIotTermsAgr',
        headers: {
          'X-MID': this.xMid,
          'X-AUTH': this.data.auth
        },
        method: 'post',
        data: {
          termsNoList: termsNoList
        },
        callback: (res) => {
          if (res.result.status === '200') {
            this.close()
            this.callback(true) // 재로그인 시도
          }
        }
      })
    },
    // 닫기
    fnCloseConfirm() {
      this.confirm(this.$t('closeYn'))
        .then(() => {
          this.callback(false)
          this.close()
        })
        .catch(() => {})
    }
  }
}
</script>
