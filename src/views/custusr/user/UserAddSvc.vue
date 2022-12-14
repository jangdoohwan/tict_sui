<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('id') }}</span>
          <div class="form-inline">
            <div class="input-group">
              <input
                v-model="dataObj.usrLoginId"
                type="text"
                class="form-control"
                @input="fnInputChk()"
                maxlength="20"
              />
              <button
                class="btn btn-gray input-group-addon"
                type="button"
                @click="fnIdDuplChk()"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
        </div>
        <div class="form-item col-sm-6">※ {{ $t('user-id-regx') }}</div>
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('pw') }}</span>
        <div>{{ $t('pw-guide') }}</div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('usrNm') }}</span>
          <input
            v-model="dataObj.usrNm"
            type="text"
            class="form-control"
            maxlength="33"
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('contact-number') }}</span>
          <div class="input-group">
            <input
              v-model="dataObj.usrPhoneNo"
              type="text"
              class="form-control"
              maxlength="11"
              :placeholder="placeHolder"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="fnPhoneDuplChk()"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('roleNm') }}</span>
          <select class="form-control" v-model="dataObj.roleCdId">
            <option
              v-for="item in roleList"
              v-bind:key="item.cdId"
              :value="item.cdId"
            >
              {{ item.cdNm }}
            </option>
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40">{{ $t('email') }}</span>
          <div class="input-group">
            <input v-model="emailAddr" type="text" class="form-control" />
            <span class="input-group-text">@</span>
            <input v-model="emailCorps" type="text" class="form-control" />
          </div>
        </div>
      </div>

      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('department') }}</span>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              :value="selectedOrg.orgNm"
              disabled
            />
            <button
              type="button"
              class="btn btn-gray input-group-addon"
              @click="fnSearchOrg()"
            >
              {{ $t('search') }}
            </button>
          </div>
        </div>
      </div>
      <user-svc-comp
        ref="userSvcComp"
        mid="P00042"
        class="mt-3"
      ></user-svc-comp>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('registration') }}
        </button>
        <button
          @click="close"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import UserSvcComp from './UserSvcComp'

export default {
  name: 'UserAddSvc',
  components: { UserSvcComp },
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
      dataObj: {
        usrLoginId: '',
        usrNm: null,
        usrPhoneNo: null,
        roleCdNm: null,
        roleCdId: null,
        usrEmail: null,
        orgSeq: null
      },
      emailCorps: '',
      emailAddr: '',
      placeHolder: this.$t('hypen-place-hd'),
      orgList: [],
      roleList: [],
      retrieveIotUsrRoleListAPI: '/online/iotusr/retrieveIotUsrRoleList',
      idDuplChkApi: '/online/iotusr/retrieveDuplicationLgnId',
      phoneDuplChkApi: '/online/iotusr/retrieveUsrPhoneDuplChk',
      createApi: '/online/iotusr/createIotUsr',
      idDuplFlag: false,
      phoneDuplFlag: false,
      selectedOrg: {},
      xMid: 'P08102'
    }
  },
  watch: {},
  created() {
    this.fnMakeRoleData()
  },
  mounted() {},
  computed: {
    emailAddress() {
      let emailAdd = this.emailAddr + '@' + this.emailCorps
      return emailAdd === '@' ? '' : emailAdd
    },
    useVideoPlatform() {
      return service.useVideoPlatform
    }
  },
  methods: {
    fnPhoneDuplChk() {
      // 연락처 빈 값 체크
      if (!this.fnBlankCheck(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-input'), 'warning')
        // 연락처 번호 형식 체크
      } else if (!this.fnPhoneNumChk(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-chk'), 'warning')
      } else {
        var paramObj = {}
        paramObj.usrPhoneNo = this.dataObj.usrPhoneNo
        paramObj.usrSeq = null
        var headerObj = {}
        headerObj.mid = 'USER'
        this.fnCallAPI(paramObj, this.phoneDuplChkApi, 2, headerObj)
      }
    },
    fnSearchOrg: _.throttle(
      function () {
        this.popup({
          component: () => import('@/views/custusr/user/UsersOrganizationSvc'),
          title: this.$t('user-org'),
          width: '500',
          height: '450',
          data: {},
          callback: (data) => {
            if (data !== 'dismiss') {
              this.selectedOrg = data
              this.fnGetOrgSvc()
            }
          }
        })
      },
      1000,
      { trailing: false }
    ),
    fnGetOrgSvc() {
      requestApi({
        url: '/online/iotorg/retrieveSvcCdByOrg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { orgSeq: this.selectedOrg.orgSeq },
        callback: (res) => {
          if (res.data.svcCd) {
            this.$refs.userSvcComp.fnAddSvcOrgSeq({
              svcCd: res.data.svcCd,
              svcCdNm: res.data.svcCdNm
            })
          }
        }
      })
    },
    fnInputChk() {
      this.idDuplFlag = false
    },
    fnIdDuplChk() {
      this.idDuplFlag = false
      if (!this.fnBlankCheck(this.dataObj.usrLoginId)) {
        this.alert(this.$t('user-id-input'), 'warning')
      } else if (!this.fnRegExpChk()) {
        this.alert(this.$t('user-id-regx-fail'), 'warning')
      } else {
        var paramObj = {}
        paramObj.usrLoginId = this.dataObj.usrLoginId
        var headerObj = {}
        headerObj.mid = 'USER'
        this.fnCallAPI(paramObj, this.idDuplChkApi, 1, headerObj)
      }
    },
    fnRegExpChk() {
      var valueChk = false
      var id = this.dataObj.usrLoginId
      if (id.length > 20 || id.length < 2) {
        valueChk = false
      } else if (/^[0-9]*$/.test(id)) {
        valueChk = false
      } else if (/[~!@\\#$%^&*()\-=+_'/|\\[\];:<,.>?//"]/gi.test(id)) {
        valueChk = false
      } else if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(id)) {
        valueChk = false
      } else {
        valueChk = true
      }
      return valueChk
    },
    // paramObj: 전달할 데이터, url: URL
    // division: 1=아이디 중복확인, 2=사용자등급조회, 3=조직조회, 4= 등록
    // headerObj: 헤더속성
    fnCallAPI(paramObj, url, division, headerObj) {
      requestApi({
        url: url,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (division === 1) {
              this.alert(res.data.msg, 'success')
              this.idDuplFlag = true
            } else if (division === 2) {
              this.alert(res.data.msg, 'success')
              this.phoneDuplFlag = true
            } else if (division === 3) {
            } else if (division === 4) {
              this.callback()
              this.close()
              this.alert(this.$t('user-add-success'), 'success')
            }
          }
        }
      })
    },
    fnMakeRoleData() {
      requestApi({
        url: this.retrieveIotUsrRoleListAPI,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.roleList = res.data

            // GN00000037: 사용자
            let userRole = this.roleList.find((r) => r.cdId === 'GN00000037')
            if (userRole) {
              this.dataObj.roleCdId = userRole.cdId
            }
          }
        }
      })
    },
    fnMakeUsrInfo() {
      var local = this
      this.dataObj.usrEmail = this.emailAddress
      this.dataObj.roleCdId = this.dataObj.roleCdId
      $.each(this.roleList, function (idx, obj) {
        if (obj.cdId === local.dataObj.roleCdId) {
          local.dataObj.roleCdNm = obj.cdNm
        }
      })
    },
    confirmCallback() {
      this.fnMakeUsrInfo()
      var headerObj = {}
      headerObj.mid = 'USER'
      this.dataObj.orgSeq = this.selectedOrg.orgSeq
      this.dataObj.usrSvcArr = this.$refs.userSvcComp.fnGetUserSvcList()
      this.fnCallAPI(this.dataObj, this.createApi, 4, headerObj)
    },

    fnEmailchk(value) {
      var regExp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i
      if (value === null || value === '') {
        return true
      } else {
        if (value.match(regExp) != null) {
          return true
        } else {
          return false
        }
      }
    },
    fnPhoneNumChk(num) {
      return /^[0-9]{10,11}$/.test(num)
    },
    fnBlankCheck(content) {
      var blankPattern = /^\s+|\s+$/g
      if (content === undefined || content === null) {
        return false
      } else {
        if (content.replace(blankPattern, '') === '') {
          return false
        } else {
          return true
        }
      }
    },
    fnLangChk(char) {
      return /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-zA-Z_-]{2,33}/.test(char)
    },
    fnSpecialCharChk(char) {
      return /^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(char)
    },
    fnTelNumChk(num) {
      var passRule = /^[0-9]{9,11}$/
      return passRule.test(num)
    },
    // -------------------- 저장
    submit() {
      // 사용자관리 상세 등록 시 유효성 검사
      // 아이디 입력하지 않은 경우
      if (
        this.dataObj.usrLoginId === '' ||
        !this.fnBlankCheck(this.dataObj.usrLoginId)
      ) {
        this.alert(this.$t('user-id-input'), 'warning')
        return
      }
      // 아이디 중복 확인 하지않은 경우
      if (!this.idDuplFlag) {
        this.alert(this.$t('user-id-dupl-chk'), 'warning')
        return
      }
      // 사용자명 입력하지 않은 경우
      if (!this.fnBlankCheck(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-input'), 'warning')
        return
      }
      // 사용자명에 특수문자 입력된 경우
      if (!/^[ㄱ-ㅎ가-힣a-zA-Z0-9_-]*$/.test(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-spc-char'), 'warning')
        return
      }
      // 사용자명 2 ~ 33자 사이로 입력되지 않은 경우
      if (!this.fnLangChk(this.dataObj.usrNm)) {
        this.alert(this.$t('userNm-length-chk'), 'warning')
        return
      }
      // 연락처 입력하지 않은 경우
      if (!this.fnBlankCheck(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-input'), 'warning')
        return
      }
      // 잘못된 연락처 입력한 경우
      if (!this.fnPhoneNumChk(this.dataObj.usrPhoneNo)) {
        this.alert(this.$t('contactNum-chk'), 'warning')
        return
      }
      // 연락처 중복 확인 하지않은 경우
      if (!this.phoneDuplFlag) {
        this.alert(this.$t('user-phone-dupl-chk'), 'warning')
        return
      }
      // 잘못된 형식의 이메일 입력한 경우
      if (!this.fnEmailchk(this.emailAddress)) {
        this.alert(this.$t('email-chk'), 'warning')
        return
      }
      // 이메일 도메인 포함 50자 이상 입력한 경우
      if (this.emailAddress.length > 50) {
        this.alert(this.$t('email-leng-chk'), 'warning')
        return
      }
      // 조직 선택하지 않은 경우
      if (!this.fnBlankCheck(this.selectedOrg.orgSeq)) {
        this.alert(this.$t('request-org-select'), 'warning')
        return
      }

      this.confirm(this.$t('saveYn'), this.confirmCallback)
    }
  }
}
</script>

<style lang="less"></style>
