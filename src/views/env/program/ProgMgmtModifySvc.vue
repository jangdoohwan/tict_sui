<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('prog-id') }}</span>
        <input
          v-model="dataObj.progId"
          type="text"
          class="form-control"
          disabled
        />
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('prog-name') }}</span>
        <input
          v-model="dataObj.progNm"
          type="text"
          class="form-control"
          maxlength="32"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-40 ">{{ $t('router-path') }}</span>
        <div class="input-group">
          <input
            v-model="dataObj.uiPath"
            type="text"
            class="form-control"
            @input="fnInputChkUi"
            maxlength="150"
            style="width:400px;"
          />
          <button
            type="button"
            class="btn btn-gray input-group-addon"
            @click="fnDuplChkUi"
          >
            {{ $t('duplication-check') }}
          </button>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40 lb-txt">{{ $t('prog-path') }}</span>
        <div class="input-group">
          <input
            v-model="dataObj.progUri"
            type="text"
            class="form-control"
            @input="fnInputChkProg"
            maxlength="256"
            style="width:400px;"
          />
          <button
            type="button"
            class="btn btn-gray input-group-addon"
            @click="fnDuplChkProg"
          >
            {{ $t('duplication-check') }}
          </button>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-5">
          <span class="form-label w-40 lb-txt">{{ $t('progGubun') }}</span>
          <select class="form-control" v-model="dataObj.progGubun">
            <option
              v-for="item in progGubunList"
              :key="item.optVal"
              :value="item.optVal"
              >{{ item.optKrVal }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-5">
          <span class="form-label w-40 lb-txt">{{ $t('useYn') }}</span>
          <select class="form-control" v-model="dataObj.useYn">
            <option
              v-for="item in useOptList"
              v-bind:key="item.optVal"
              :value="item.optVal"
              >{{ item.optKrVal }}</option
            >
          </select>
        </div>
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
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'ProgMgmtModifySvc',
  components: {},
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
      xMid: 'P10203',
      dataObj: { progId: '', progNm: '', uiPath: '', progUri: '', useYn: '', progGubun: '' },
      useOptList: [
        { optKrVal: this.$t('use'), optEnVal: 'Y', optVal: 'Y' },
        { optKrVal: this.$t('use-no'), optEnVal: 'N', optVal: 'N' }
      ],
      progGubunList: [
        { optKrVal: this.$t('in'), optEnVal: 'I', optVal: 'I' },
        { optKrVal: this.$t('out'), optEnVal: 'O', optVal: 'O' }
      ],
      progUriDuplChkFlag: true,
      uiPathDuplChkFlag: true,
      progIdDuplChkFlag: true,
      orgUiPath: '',
      orgProgUri: ''
    }
  },
  created() {
    this.fnSearchModifyData()
  },
  mounted() {},
  computed: {},
  methods: {
    fnInputChkUi(event) {
      this.uiPathDuplChkFlag = false
      // ??????,??????,????????????(_/) ??????
      this.dataObj.uiPath = event.target.value = event.target.value.replace(
        /[^a-zA-Z0-9_/]/g,
          ''
      )
    },
    // ?????? ??????
    fnDuplChkUi() {
      // ???????????? ?????? ??????
      if (
         (!this.dataObj.uiPath) ||
          (this.dataObj.uiPath &&
          this.dataObj.uiPath.trim() === '')
      ) {
        this.alert(
          this.$t('router-path-alert') + this.$t('prog-inputReqValue'),
          'warning'
        )
        return
      }

      // '/'??? ???????????? ?????? ?????? ?????????
      if (!this.dataObj.uiPath.startsWith('/')) {
          this.dataObj.uiPath = '/' + this.dataObj.uiPath
      }
      const reqData = {
        uiPath: this.dataObj.uiPath,
        progSeq: this.data.idx
      }

      requestApi({
        url: '/online/com/prog/duplicationCheckIotProgUiPath',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg, 'success')
            this.uiPathDuplChkFlag = true
          }
        }
      })
    },
    // URL ?????? ??????
    fnInputChkProg(event) {
      this.progUriDuplChkFlag = false
      // ??????,??????,????????????(_/) ??????
      this.dataObj.progUri = event.target.value = event.target.value.replace(
        /[^a-zA-Z0-9_/.:?=]/g,
        ''
      )
    },
    // URL ?????? ??????
    fnDuplChkProg() {
      if (
         (!this.dataObj.progUri) ||
          (this.dataObj.progUri &&
          this.dataObj.progUri.trim() === '')
      ) {
        this.alert(
          this.$t('prog-path-alert') + this.$t('prog-inputReqValue'),
          'warning'
        )
        return
      }
      // http??? ???????????? ?????? URL ?????? '/'??? ???????????? ?????? ?????? ?????????
      if (
        !this.dataObj.progUri.startsWith('http') &&
          !this.dataObj.progUri.startsWith('/')
      ) {
        this.dataObj.progUri = '/' + this.dataObj.progUri
      }

      const reqData = {
        progUri: this.dataObj.progUri,
        progSeq: this.data.idx
      }

      requestApi({
        url: '/online/com/prog/duplicationCheckIotProgPath',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg, 'success')
              this.progUriDuplChkFlag = true
              }
            }
        })
    },
    fnSearchModifyData() {
      var paramObj = {}
      paramObj.progSeq = this.data.idx

      requestApi({
        url: '/online/com/prog/getIotProgDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data
            this.orgUiPath = this.dataObj.uiPath
            this.orgProgUri = this.dataObj.progUri
          }
        }
      })
    },
    submit() {
      // ??????????????? ??????
      if (this.dataObj.progNm.trim() === '') {
        this.alert(
          this.$t('prog-name-alert') + this.$t('prog-inputReqValue'),
          'warning'
        )
        return
      }
      // URL ?????? ??????
      if (this.dataObj.progUri.trim() === '') {
        this.alert(
          this.$t('prog-path-alert') + this.$t('prog-inputReqValue'),
          'warning'
        )
        return
      }
      // URL ?????? ?????? ??????
      if (!this.progUriDuplChkFlag) {
        this.alert(this.$t('prog-path-duplchk-msg'), 'warning')
        return
      }
      // ?????? ????????? ?????? ??? ?????? ??????
      if (
        this.dataObj.uiPath.trim() !== '' &&
         !this.uiPathDuplChkFlag
      ) {
        this.alert(this.$t('router-duplchk-msg'), 'warning')
        return
      }
      // ?????? ?????? ??????
      this.confirm(this.$t('saveYn'), this.fnCallModifyApi)
    },
    fnCallModifyApi() {
      var reqData = {
        progSeq: this.data.idx,
        progNm: this.dataObj.progNm,
        useYn: this.dataObj.useYn,
        progUri: this.dataObj.progUri,
        uiPath: this.dataObj.uiPath,
        progGubun: this.dataObj.progGubun
      }
      requestApi({
        url: '/online/com/prog/updateIotProg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
