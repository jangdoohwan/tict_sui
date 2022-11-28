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
          maxlength="50"
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
        <span class="form-label w-40">{{ $t('router-path') }}</span>
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
            @click="duplChkUi"
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
              v-bind:key="item.optVal"
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
  name: 'ProgMgmtAddSvc',
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
      xMid: 'P10202',
      dataObj: { progId: '', progNm: '', uiPath: '', progUri: '', useYn: 'Y', progGubun: 'I' },
      useOptList: [
        { optKrVal: this.$t('use'), optEnVal: 'Y', optVal: 'Y' },
        { optKrVal: this.$t('use-no'), optEnVal: 'N', optVal: 'N' }
      ],
      progGubunList: [
        { optKrVal: this.$t('in'), optEnVal: 'I', optVal: 'I' },
        { optKrVal: this.$t('out'), optEnVal: 'O', optVal: 'O' }
      ],
      progIdDuplChkFlag: true,
      uiPathDuplChkFlag: false,
      progUriDuplChkFlag: false
    }
  },
  created() {},
  mounted() {
    this.autoIotProgId()
  },
  computed: {},
  methods: {
    autoIotProgId() {
      // 입력값 체크
      requestApi({
        url: '/online/com/prog/autoIotProgId',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {},
        callback: res => {
          this.dataObj.progId = res.data.progId
        }
      })
    },
    fnInputChkUi(event) {
      this.uiPathDuplChkFlag = false
      // 숫자,영문,특수문자(_/) 허용
      this.dataObj.uiPath = event.target.value = event.target.value.replace(
        /[^a-zA-Z0-9_/]/g,
          ''
      )
    },

    // 중복 확인
    duplChkUi() {
      // 소스경로 입력 확인
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
      // '/'로 시작하지 않는 경우 붙여줌
      if (!this.dataObj.uiPath.startsWith('/')) {
        this.dataObj.uiPath = '/' + this.dataObj.uiPath
      }
        const reqData = {
          uiPath: this.dataObj.uiPath
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
    // URL 입력 확인
    fnInputChkProg(event) {
      this.progUriDuplChkFlag = false
      // 숫자,영문,특수문자(_/.:) 허용
      this.dataObj.progUri = event.target.value = event.target.value.replace(
        /[^a-zA-Z0-9_/.:?=]/g,
        ''
      )
    },
    // URL 중복 확인
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

      // http로 시작하는 외부 URL 외에 '/'로 시작하지 않는 경우 붙여줌
      if (
        !this.dataObj.progUri.startsWith('http') &&
          !this.dataObj.progUri.startsWith('/')
      ) {
        this.dataObj.progUri = '/' + this.dataObj.progUri
      }

      const reqData = {
        progUri: this.dataObj.progUri
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
    submit() {
      // 프로그램명 확인
      if (this.dataObj.progNm.trim() === '') {
        this.alert(
          this.$t('prog-name-alert') + this.$t('prog-inputReqValue'), 'warning')
        return
      }
      // URL 경로 확인
      if (this.dataObj.progUri.trim() === '') {
        this.alert(
          this.$t('prog-path-alert') + this.$t('prog-inputReqValue'), 'warning')
      }
      // URL 경로 중복 확인
      if (!this.progUriDuplChkFlag) {
        this.alert(this.$t('prog-path-duplchk-msg'), 'warning')
        return
      }
      // 소스 경로가 있을 시 중복 확인
      if (
        this.dataObj.uiPath.trim() !== '' &&
         !this.uiPathDuplChkFlag
      ) {
        this.alert(this.$t('router-duplchk-msg'), 'warning')
        return
      }
      // 등록 확인 팝업
        this.confirm(this.$t('saveYn'), this.fnCallInsertApi)
    },
    fnCallInsertApi() {
      var reqData = {
        progId: this.dataObj.progId,
        progNm: this.dataObj.progNm,
        uiPath: this.dataObj.uiPath,
        progUri: this.dataObj.progUri,
        progGubun: this.dataObj.progGubun,
        useYn: this.dataObj.useYn
      }

      requestApi({
        url: '/online/com/prog/insertIotProg',
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
