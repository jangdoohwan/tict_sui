<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('api-name') }}</span>
          <div class="input-group">
            <input
              v-model="dataObj.apiNm"
              type="text"
              class="form-control"
              @input="fnDuplChk('N')"
              maxlength="16"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="duplicationChk('N')"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('uri') }}</span>
          <div class="input-group">
            <input
              v-model="dataObj.apiUri"
              type="text"
              class="form-control"
              @input="fnDuplChk('U')"
              maxlength="256"
            />
            <button
              class="btn btn-gray input-group-addon"
              type="button"
              @click="duplicationChk('U')"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('server-gubun') }}</span>
          <select class="form-control" v-model="dataObj.serverGubun">
            <option
              v-for="item in serverList"
              v-bind:key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('tmpl-gubun') }}</span>
          <select class="form-control" v-model="dataObj.tmplGubun">
            <option
              v-for="item in tmplList"
              v-bind:key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40">{{ $t('description') }}</span>
        <input
          v-model="dataObj.apiDesc"
          type="text"
          class="form-control"
          placeholder
          title="??????"
          maxlength="33"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-40">{{ $t('header') }}</span>
        <div class="input-horizontal">
          <div class="flex flex-wrap">
            <div
              v-for="(headerList, idx) in requiredHeaderList"
              :key="headerList.headerValue"
              class="pt-1 pr-1"
            >
              <input
                v-model="requiredHeaderList[idx].headerName"
                type="text"
                disabled
                class="form-control"
              />
            </div>
          </div>
          <div
            v-for="(selectheaderList, idx) in selectHeaderList"
            :key="'selectHeader_' + idx"
            class="mt-1"
          >
            <div class="form-inline">
              <select
                v-model="selectHeaderList[idx].value"
                class="form-control"
                style="width: 180px"
              >
                <option
                  v-for="item in headerList"
                  v-bind:key="item.cdId"
                  :value="item.cdNm"
                  selected
                  >{{ item.cdNm }}</option
                >
              </select>
              <button
                v-if="selectHeaderList.length === idx + 1"
                class="btn"
                type="button"
                @click="addSelectheaderList(idx)"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                v-if="selectHeaderList.length > 1"
                class="btn"
                type="button"
                @click="delSelectheaderList(idx)"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
            </div>
          </div>
          <div
            v-for="(textheaderList, idx) in textHeaderList"
            :key="'textHeader_' + idx"
            class="mt-1"
          >
            <div class="form-inline">
              <input
                v-model="textHeaderList[idx].value"
                type="text"
                class="form-control"
                maxlength="33"
              />
              <button
                v-if="textHeaderList.length == idx + 1"
                class="btn"
                type="button"
                @click="addTextheaderList(idx)"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                v-if="textHeaderList.length > 1"
                class="btn"
                type="button"
                @click="delTextheaderList(idx)"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item">
          <span class="form-label w-40">{{ $t('body') }}</span>
          <div class="input-horizontal">
            <div
              v-for="(body, idx) in bodyList"
              :key="'body_' + idx"
              class="form-inline mt-1"
            >
              <input
                v-model="bodyList[idx].value"
                type="text"
                class="form-control"
                maxlength="33"
              />
              <button
                v-if="bodyList.length == idx + 1"
                class="btn"
                type="button"
                @click="addBodyList(idx)"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                v-if="bodyList.length > 1"
                class="btn"
                type="button"
                @click="delBodyList(idx)"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="submit()" type="button" class="btn btn-pink">
          {{ $t('registration') }}
        </button>
        <button
          @click="close()"
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

export default {
  name: 'ApiMgmtAddSvc',
  components: {},
  props: {
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
      xMid: 'P10402',
      dataObj: {
        apiNm: '',
        apiUri: '',
        serverGubun: '',
        tmplGubun: '',
        apiDesc: '',
        regUserId: '',
        modUserId: '',
        tbIotParamDTOList: []
      },
      paramObj: { paramGubun: '', paramKey: '', paramDesc: '' },
      requiredHeaderList: [
        { headerName: 'Content-Type', headerValue: 'Content-Type' },
        { headerName: 'X-APIVERSION', headerValue: 'X-APIVERSION' },
        { headerName: 'X-LOGKEY', headerValue: 'X-LOGKEY' },
        { headerName: 'X-CHANNEL', headerValue: 'X-CHANNEL' },
        { headerName: 'X-AUTH', headerValue: 'X-AUTH' },
        { headerName: 'X-VNAME', headerValue: 'X-VNAME' }
      ],
      headerList: [],
      serverList: [],
      tmplList: [],
      selectHeaderList: [{ value: this.$t('select'), useYn: 'Y' }],
      textHeaderList: [{ value: '', useYn: 'Y' }],
      bodyList: [{ value: '', useYn: 'Y' }],
      apiNmDuplChkFlag: false,
      apiUriDuplChkFlag: false,
      addHtml: ''
    }
  },
  created() {
    // ????????????????????? ??????
    this.fnSearchCommon(this.fnAddServerList, 'GN00000008')
  },
  mounted() {},
  computed: {},
  methods: {
    addSelectheaderList() {
      this.selectHeaderList.push({ value: this.$t('select'), useYn: 'Y' })
    },
    addTextheaderList() {
      this.textHeaderList.push({ value: '', useYn: 'Y' })
    },
    addBodyList() {
      this.bodyList.push({ value: '', useYn: 'Y' })
    },
    delSelectheaderList(index) {
      this.selectHeaderList.splice(index, 1)
    },
    delTextheaderList(index) {
      this.textHeaderList.splice(index, 1)
    },
    delBodyList(index) {
      this.bodyList.splice(index, 1)
    },
    fnSearchCommon(callback, parentCd) {
      var paramObj = {}
      paramObj.parentCdId = parentCd

      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCdOnly',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            callback(res)
          }
        }
      })
    },
    fnAddHeaderList(res) {
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.headerList = res.data
      this.headerList.unshift(defaultObj)
      // ??????????????? ????????? ??????
      this.fnSearchCommon(this.fnAddTmplList, 'GN00000019')
    },
    fnAddServerList(res) {
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.serverList = res.data
      this.serverList.unshift(defaultObj)
      // HEADER????????? ??????
      this.fnSearchCommon(this.fnAddHeaderList, 'GN00000007')
    },
    fnAddTmplList(res) {
      var defaultObj = { cdId: '', cdNm: this.$t('select') }
      this.tmplList = res.data
      this.tmplList.unshift(defaultObj)
    },
    fnDuplChk(gubun) {
      if (gubun === 'U') {
        this.apiUriDuplChkFlag = false
        var event = window.event
        // ??????,??????,????????????(_/) ??????
        this.dataObj.apiUri = event.target.value = event.target.value.replace(
          /[^a-zA-Z0-9_/]/g,
          ''
        )
      } else {
        this.apiNmDuplChkFlag = false
      }
    },
    duplicationChk(gubun) {
      var reqData = {}
      var requestApiUri = ''
      // ????????? ??????
      var valTitle = ''

      reqData = this.dataObj
      if (gubun === 'U') {
        if (
          !this.dataObj.apiUri ||
          (this.dataObj.apiUri && this.dataObj.apiUri.trim() === '')
        ) {
          valTitle = this.$t('uri-alert')
          this.alert(valTitle + this.$t('api-inputReqValue'), 'warning')
          return
        }
        if (!this.dataObj.apiUri.startsWith('/')) {
          this.dataObj.apiUri = '/' + this.dataObj.apiUri
        }
        requestApiUri = '/online/com/api/duplicationCheckIotApiUri'
      } else {
        requestApiUri = '/online/com/api/duplicationCheckIotApiNm'
        if (
          !this.dataObj.apiNm ||
          (this.dataObj.apiNm && this.dataObj.apiNm.trim() === '')
        ) {
          valTitle = this.$t('api-name-alert')
          this.alert(valTitle + this.$t('api-inputReqValue'), 'warning')
          return
        }
      }

      requestApi({
        url: requestApiUri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          var status = false
          if (res.result.status === '200' || res.result.status === '204') {
            status = true
          }
          if (gubun === 'U') {
            this.apiUriDuplChkFlag = false
          } else {
            this.apiNmDuplChkFlag = false
          }
          if (status) {
            this.alert(res.data.msg, 'success')
            if (gubun === 'U') {
              this.apiUriDuplChkFlag = true
            } else {
              this.apiNmDuplChkFlag = true
            }
          }
        }
      })
    },
    submit() {
      // API??? ??????
      if (
        !this.dataObj.apiNm ||
        (this.dataObj.apiNm && this.dataObj.apiNm.trim() === '')
      ) {
        this.alert(
          this.$t('api-name-alert') + this.$t('api-inputReqValue'),
          'warning'
        )
        // API??? ?????? ??????
      } else if (!this.apiNmDuplChkFlag) {
        this.alert(this.$t('apiNm-duplchk-msg'), 'warning')
        // URL ??????
      } else if (
        !this.dataObj.apiUri ||
        (this.dataObj.apiUri && this.dataObj.apiUri.trim() === '')
      ) {
        this.alert(
          this.$t('uri-alert') + this.$t('api-inputReqValue'),
          'warning'
        )
        // URL ?????? ??????
      } else if (!this.apiUriDuplChkFlag) {
        this.alert(this.$t('apiUri-duplchk-msg'), 'warning')
        // ???????????? ??????
      } else if (
        !this.dataObj.serverGubun ||
        (this.dataObj.serverGubun && this.dataObj.serverGubun.trim() === '')
      ) {
        this.alert(
          this.$t('server-gubun-alert') + this.$t('api-selectReqValue'),
          'warning'
        )
        // ????????? ?????? ??????
      } else if (
        !this.dataObj.tmplGubun ||
        (this.dataObj.tmplGubun && this.dataObj.tmplGubun.trim() === '')
      ) {
        this.alert(
          this.$t('tmpl-gubun-alert') + this.$t('api-selectReqValue'),
          'warning'
        )
        // Header ?????? ??????
      } else if (this.fnHeaderListChk('D')) {
        this.alert(this.$t('apiHeader-dupl-msg'), 'warning')
        // Body ?????? ??????
      } else if (this.fnBodyListChk('D')) {
        this.alert(this.$t('apiBody-dupl-msg'), 'warning')
      } else {
        this.confirm(this.$t('saveYn'), this.fnCallInsertApi) // API ??????
      }
    },
    fnHeaderListChk(gubun) {
      // select Header ????????? ??? ????????? ?????? ????????? ??????
      if (this.selectHeaderList) {
        this.selectHeaderList = this.selectHeaderList.filter(item => {
          return item.value.trim() !== '' && item.value !== this.$t('select')
        })
        if (this.selectHeaderList.length === 0) {
          this.selectHeaderList.push({ value: this.$t('select'), useYn: 'Y' })
        }
      }
      // text Header ????????? ??? ????????? ?????? ????????? ??????
      if (this.textHeaderList) {
        this.textHeaderList = this.textHeaderList.filter(item => {
          return item.value.trim() !== ''
        })
        if (this.textHeaderList.length === 0) {
          this.textHeaderList.push({ value: '', useYn: 'Y' })
        }
      }

      var duplicationChkFlagHeader = false
      var i = 0
      var j = 0
      // gubun === 'B' => ???????????? / else('D') => ?????? ??????
      if (gubun === 'D') {
        // selectHeader ?????? ??????
        for (i = 0; i < this.selectHeaderList.length; i++) {
          // selectHeader??? selectHeader ?????? ??????
          if (this.selectHeaderList[i].value !== '') {
            for (j = i + 1; j < this.selectHeaderList.length; j++) {
              if (
                this.selectHeaderList[i].value ===
                this.selectHeaderList[j].value
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
            // selectHeader??? requiredHeaderList ?????? ??????
            for (j = 0; j < this.requiredHeaderList.length; j++) {
              if (
                this.selectHeaderList[i].value ===
                this.requiredHeaderList[j].headerValue
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
          }
        }
        // textHeader ?????? ??????
        for (i = 0; i < this.textHeaderList.length; i++) {
          if (this.textHeaderList[i].value !== '') {
            // textHeader??? textHeader ?????? ??????
            for (j = i + 1; j < this.textHeaderList.length; j++) {
              if (
                this.textHeaderList[i].value === this.textHeaderList[j].value
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
            // textHeader??? selectHeaderList ?????? ??????
            for (j = 0; j < this.selectHeaderList.length; j++) {
              if (
                this.textHeaderList[i].value === this.selectHeaderList[j].value
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
            // textHeader??? requiredHeaderList ?????? ??????
            for (j = 0; j < this.requiredHeaderList.length; j++) {
              if (
                this.textHeaderList[i].value ===
                this.requiredHeaderList[j].headerValue
              ) {
                duplicationChkFlagHeader = true
                break
              }
            }
            if (duplicationChkFlagHeader) {
              break
            }
          }
        }
      }
      return duplicationChkFlagHeader
    },
    fnBodyListChk(gubun) {
      // Body ????????? ??? ????????? ?????? ????????? ??????
      if (this.bodyList) {
        this.bodyList = this.bodyList.filter(item => {
          return item.value.trim() !== ''
        })
        if (this.bodyList.length === 0) {
          this.bodyList.push({ value: '', useYn: 'Y' })
        }
      }

      var duplicationChkFlagBody = false
      var i = 0
      var j = 0
      if (gubun === 'B') {
        for (i = 0; i < this.bodyList.length; i++) {
          if (this.bodyList[i].value === '') {
            duplicationChkFlagBody = true
          }
        }
      } else {
        for (i = 0; i < this.bodyList.length; i++) {
          for (j = i + 1; j < this.bodyList.length; j++) {
            if (this.bodyList[i].value === this.bodyList[j].value) {
              duplicationChkFlagBody = true
              break
            }
          }
          if (duplicationChkFlagBody) {
            break
          }
        }
      }
      return duplicationChkFlagBody
    },
    fnCallInsertApi() {
      var reqData = {}
      var sendObj = []
      reqData.apiNm = this.dataObj.apiNm
      reqData.apiUri = this.dataObj.apiUri
      reqData.apiDesc = this.dataObj.apiDesc
      reqData.serverGubun = this.dataObj.serverGubun
      reqData.tmplGubun = this.dataObj.tmplGubun
      for (var n = 0; n < this.selectHeaderList.length; n++) {
        if (this.selectHeaderList[n].value !== '') {
          var addObjSelHeader = {}
          addObjSelHeader.paramGubun = 'HS'
          addObjSelHeader.paramKey = this.selectHeaderList[n].value
          addObjSelHeader.paramDesc = 'C'
          addObjSelHeader.requiredYn = 'N'
          sendObj.push(addObjSelHeader)
        }
      }
      for (var i = 0; i < this.textHeaderList.length; i++) {
        if (this.textHeaderList[i].value !== '') {
          var addObjTextHeader = {}
          addObjTextHeader.paramGubun = 'HT'
          addObjTextHeader.requiredYn = 'N'
          addObjTextHeader.paramDesc = ''
          addObjTextHeader.paramKey = this.textHeaderList[i].value
          sendObj.push(addObjTextHeader)
        }
      }
      for (var j = 0; j < this.bodyList.length; j++) {
        var addObj = {}
        addObj.paramGubun = 'B'
        addObj.requiredYn = 'N'
        addObj.paramDesc = ''
        addObj.paramKey = this.bodyList[j].value
        sendObj.push(addObj)
      }
      for (var k = 0; k < this.requiredHeaderList.length; k++) {
        var addObjHeader = {}
        addObjHeader.paramGubun = 'H'
        addObjHeader.requiredYn = 'Y'
        addObjHeader.paramDesc = ''
        addObjHeader.paramKey = this.requiredHeaderList[k].headerValue
        sendObj.push(addObjHeader)
      }
      reqData.tbIotParamDTOList = sendObj
      requestApi({
        url: '/online/com/api/insertIotApi',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
