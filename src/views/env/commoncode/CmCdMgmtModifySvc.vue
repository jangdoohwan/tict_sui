<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('langSet') }}</span>
        <input v-model="langTxt" type="text" class="form-control" disabled />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('parentCdId') }}</span>
        <div class="input-horizontal">
          <input
            :value="dataObject.parentCdId"
            type="text"
            class="form-control"
            disabled
          />
          <div class="mt-1">{{ dataObject.parentCdNm }}</div>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('cdVal') }}</span>
        <input
          v-model="dataObject.cdId"
          type="text"
          class="form-control"
          disabled
        />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('cdNm') }}</span>
        <div class="input-group">
          <input
            v-model="dataObject.cdNm"
            type="text"
            class="form-control"
            @input="fnIdInput()"
            maxlength="16"
          />
          <button type="button" class="btn btn-gray" @click="fnIdDuplChk()">
            {{ $t('duplication-check') }}
          </button>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('description') }}</span>
        <div class="form-box width-100">
          <textarea
            v-model="dataObject.cdDesc"
            cols="34"
            rows="5"
            maxlength="85"
          ></textarea>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{ $t('useYn') }}</span>
        <select class="form-control" v-model="dataObject.useYn">
          <option
            v-for="item in useOptList"
            v-bind:key="item.optVal"
            :value="item.optVal"
            >{{ item.optKrVal }}</option
          >
        </select>
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{
          $t('commuication-format') + $t('key')
        }}</span>
        <input
          v-model="dataObject.paramKey"
          type="text"
          class="form-control"
          maxlength="85"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-32">{{
          $t('commuication-format') + $t('value')
        }}</span>
        <input
          v-model="dataObject.paramVal"
          type="text"
          class="form-control"
          maxlength="85"
        />
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('modify') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'

export default {
  name: 'CmCdMgmtModifySvc',
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
      xMid: 'P10003',
      dataObject: {},
      useOptList: [
        { optKrVal: this.$t('use'), optEnVal: 'Y', optVal: 'Y' },
        { optKrVal: this.$t('use-no'), optEnVal: 'N', optVal: 'N' },
        { optKrVal: this.$t('test'), optEnVal: 'TEST', optVal: 'T' }
      ],
      cdIdDuplChkFlag: true,
      cdNmDuplChkFlag: true,
      originCdId: null,
      originCdNm: null,
      langSetCd: 'GN00000021',
      langSetArr: [],
      langTxt: ''
    }
  },
  created() {
    this.langTxt = this.$t(Cookies.get('LOCALE'))
    this.dataObject.langSet = Cookies.get('LOCALE')
    this.fnGetData()
  },
  mounted() {},
  methods: {
    fnIdDuplChk() {
      // ????????? ???????????? ????????? ??????
      // ????????? ???????????? ?????? ??????
      if (!this.fnBlankCheck(this.dataObject.cdNm)) {
        this.alert(this.$t('cmnm-input-msg'), 'warning')
        // ????????? ???????????? ????????? ??????
      } else if (!this.fnSpcChrChk(this.dataObject.cdNm)) {
        this.alert(this.$t('cdNm-spc-char-chk'), 'warning')
        // ????????? 1 ~ 16??? ????????? ???????????? ?????? ??????
      } else if (
        !/[???-???|???-???|???-???|a-zA-Z|0-9_-]{1,16}/.test(this.dataObject.cdNm)
      ) {
        this.alert(this.$t('cdNm-leng-chk'), 'warning')
      } else {
        var reqData = {}
        reqData.cdNm = this.dataObject.cdNm
        reqData.langSet = this.dataObject.langSet
        reqData.parentCdId = this.dataObject.parentCdId
        reqData.cdSeq = this.data.idx
        requestApi({
          url: '/online/iotcmcd/retrieveDuplicatedCdNm',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: reqData,
          callback: res => {
            // ???????????? ????????? ?????? ????????? ??????
            if (res.result.status === '200' || res.result.status === '204') {
              this.alert(this.$t('useAble'), 'success')
              this.cdNmDuplChkFlag = true
            } else {
              this.cdNmDuplChkFlag = false
            }
          }
        })
      }
    },
    fnGetData() {
      var tmpObj = {}
      tmpObj.cdSeq = this.data.idx
      this.fnCallApi(tmpObj, '/online/iotcmcd/retrieveIotCmCdById', true)
    },
    fnGetlangSetList() {
      var paramObj = {}
      paramObj.parentCdId = this.langSetCd
      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCd',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          this.langSetArr = res.data
        }
      })
    },
    fnIdInput() {
      if (this.originCdNm !== this.dataObject.cdNm) {
        this.cdNmDuplChkFlag = false
      } else {
        this.cdNmDuplChkFlag = true
      }
    },
    confirmCallback() {
      if (
        this.dataObject.paramKey === '' ||
        this.dataObject.paramKey === null
      ) {
        delete this.dataObject.paramKey
      }
      if (
        this.dataObject.paramVal === '' ||
        this.dataObject.paramVal === null
      ) {
        delete this.dataObject.paramVal
      }
      if (this.dataObject.cdDesc === '' || this.dataObject.cdDesc === null) {
        delete this.dataObject.cdDesc
      }
      if (this.dataObject.cdType === '' || this.dataObject.cdType === null) {
        delete this.dataObject.cdType
      }
      delete this.dataObject.charSet
      this.fnCallApi(this.dataObject, '/online/iotcmcd/updateIotCmCd', false)
    },
    // data, url, ???????????? ?????????????????? status: ??????(true), ????????????(false)
    fnCallApi(reqData, url, status) {
      if (!this.dataObject.paramVal) {
        delete this.dataObject.paramVal
      }
      if (!this.dataObject.paramKey) {
        delete this.dataObject.paramKey
      }
      requestApi({
        url: url,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (status) {
            this.dataObject = res.data
            this.dataObject.topCdId = 'C000000001'
            this.originCdId = res.data.cdId
            this.originCdNm = res.data.cdNm
            // this.fnGetlangSetList()
          } else {
            // ????????? ?????????
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnBlankCheck(content) {
      var blankPattern = /^\s+|\s+$/g
      if (content === undefined) {
        return false
      } else {
        if (content.replace(blankPattern, '') === '') {
          return false
        } else {
          return true
        }
      }
    },
    fnSpcChrChk(char) {
      return /^[???-??????-???a-zA-Z0-9_-]*$/.test(char)
    },
    submit() {
      // ?????? ?????? ?????? ??? ????????? ??????
      // ????????? ???????????? ?????? ??????
      if (!this.fnBlankCheck(this.dataObject.cdNm)) {
        this.alert(this.$t('cmnm-input-msg'), 'warning')
        // ????????? ?????????????????? ??????
      } else if (this.cdNmDuplChkFlag === false) {
        this.alert(this.$t('cmcd-duplchk-msg'), 'warning')
        // ????????? ???????????? ????????? ??????
      } else if (!this.fnSpcChrChk(this.dataObject.cdNm)) {
        this.alert(this.$t('cdNm-spc-char-chk'), 'warning')
        // ????????? 1 ~ 16??? ????????? ???????????? ?????? ??????
      } else if (
        !/[???-???|???-???|???-???|a-zA-Z|0-9_-]{1,16}/.test(this.dataObject.cdNm)
      ) {
        this.alert(this.$t('cdNm-leng-chk'), 'warning')
        // ?????? ??? 85??? ????????? ??????
      } else if (this.dataObject.cdDesc && this.dataObject.cdDesc.length > 85) {
        this.alert(this.$t('cdDesc-leng-chk'), 'warning')
        // ????????? ???????????? ????????? ??????
      } else if (!this.fnSpcChrChk(this.dataObject.paramKey)) {
        this.alert(this.$t('paramKey-spc-char-chk'), 'warning')
      } else {
        this.confirm(this.$t('saveYn'), this.confirmCallback)
      }
    }
  }
}
</script>

<style lang="less"></style>
