<template>
  <div>
    <div class="modal-body">
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('openApi-name') }}</span>
        <input
          v-model="dataObj.apiNm"
          type="text"
          class="form-control"
          maxlength="32"
        />
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('url') }}</span>
        <div class="input-group">
        <input
          v-model="dataObj.apiUrl"
          type="text"
          class="form-control"
          @input="fnInputChkUrl"
          maxlength="80"
          style="width:400px;"
        />
        <button
          type="button"
          class="btn btn-gray input-group-addon"
          @click="fnDuplChkUrl"
        >
        {{ $t('duplication-check') }}
        </button>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32 lb-txt">{{ $t('method') }}</span>
          <select class="form-control" v-model="dataObj.apiMethod">
            <option
              v-for="item in methodOptList"
              v-bind:key="item.optVal"
              :value="item.optVal"
              >{{ item.optName }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32 lb-txt">{{ $t('useYn') }}</span>
          <select class="form-control" v-model="dataObj.useYn">
            <option
              v-for="item in useOptList"
              v-bind:key="item.optVal"
              :value="item.optVal"
              >{{ item.optName }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-32 lb-txt">{{ $t('description') }}</span>
        <input
          v-model="dataObj.description"
          type="text"
          class="form-control"
          maxlength="80"
        />
      </div>
      <div class="mt-3 flex justify-between items-center">
        <h4 class="titH4">{{ $t('parameters') }}</h4>
        <div>
          <button
            type="button"
            class="btn btn-gray"
            @click="fnAddParam"
          >
            {{ $t('add') }}
          </button>
        </div>
      </div>
      <div class="grid-container grid-scroll mt-1">
        <div class="table-wrap y-scroll" style="min-height: 160px">
          <table class="table table-col" style="min-width: 400px">
            <caption></caption>
            <colgroup>
              <col style="width: 150px" />
              <col sytle="width: 50px" />
              <col style="width: 110px" />
              <col style="width: 100px" />
              <col style="width: 220px" />
              <col style="width: 70px" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('cd-nm') }}</th>
                <th>{{ $t('data-type') }}</th>
                <th>{{ $t('default-yn') }}</th>
                <th>{{ $t('type') }}</th>
                <th>{{ $t('description-en') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(param, index) in paramList"
                :key="`param-${index}`"
              >
                <td>
                  <input
                    v-model="param.name"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <select v-model="param.datatype" class="form-control">
                    <option
                      v-for="item in dataTypeList"
                      v-bind:key="item.optVal"
                      :value="item.optVal"
                      >{{ item.optName }}</option
                    >
                  </select>
                </td>
                <td>
                  <select v-model="param.requiredYn" class="form-control">
                    <option
                      v-for="item in requiredYnList"
                      v-bind:key="item.optVal"
                      :value="item.optVal"
                      >{{ item.optName }}</option
                    >
                  </select>
                </td>
                <td>
                  <select v-model="param.type" class="form-control">
                    <option
                      v-for="item in paramTypeList"
                      v-bind:key="item.optVal"
                      :value="item.optVal"
                      >{{ item.optName }}</option
                    >
                  </select>
                </td>
                <td>
                  <input
                    v-model="param.description"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <button class="btn" @click="fnRemoveParam(index)">
                    {{ $t('delete') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-3 flex justify-between items-center">
        <h4 class="titH4">{{ $t('responses') }}</h4>
        <div>
          <button
            type="button"
            class="btn btn-gray"
            @click="fnAddRes"
          >
            {{ $t('add') }}
          </button>
        </div>
      </div>
      <div class="grid-container grid-scroll mt-1">
        <div class="table-wrap y-scroll" style="min-height: 160px">
          <table class="table table-col" style="min-width: 400px">
            <caption></caption>
            <colgroup>
              <col style="width: 120px" />
              <col sytle="width: 200px" />
              <col style="width: 180px" />
              <col style="width: 70px" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('reqhMtResCode') }}</th>
                <th>{{ $t('description-en') }}</th>
                <th>{{ $t('exam-res') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(res, index) in resList"
                :key="`param-${index}`"
              >
                <td>
                  <input
                    v-model="res.resCode"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <input
                    v-model="res.description"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <input
                    v-model="res.examRes"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <button class="btn" @click="fnRemoveRes(index)">
                    {{ $t('delete') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <div class="text-center">
          <button @click="fnSaveOpenApiConfirm" type="button" class="btn btn-pink">
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
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import { isEmpty } from '@/utils/comUtils'

export default {
  name: 'OpenApiAddSvc',
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
      xMid: 'P15009',
      dataObj: { openApiSeq: '', apiNm: '', apiUrl: '', apiMethod: '', useYn: 'Y', description: '' },
      useOptList: [
        { optName: this.$t('use'), optVal: 'Y' },
        { optName: this.$t('use-no'), optVal: 'N' }
      ],
      methodOptList: [
        { optName: this.$t('select'), optVal: '' },
        { optName: this.$t('method-get'), optVal: 'GET' },
        { optName: this.$t('method-post'), optVal: 'POST' },
        { optName: this.$t('method-put'), optVal: 'PUT' },
        { optName: this.$t('method-delete'), optVal: 'DELETE' }
      ],
      dataTypeList: [
        { optName: this.$t('select'), optVal: '' },
        { optName: this.$t('string'), optVal: 'String' },
        { optName: this.$t('integer'), optVal: 'Integer' },
        { optName: this.$t('array'), optVal: 'Array' },
        { optName: this.$t('object'), optVal: 'Object' }
      ],
      requiredYnList: [
        { optName: this.$t('select'), optVal: '' },
        { optName: this.$t('required'), optVal: 'Required' },
        { optName: this.$t('optional'), optVal: 'Optional' }
      ],
      paramTypeList: [
        { optName: this.$t('select'), optVal: '' },
        { optName: this.$t('param-query'), optVal: 'Query' },
        { optName: this.$t('path'), optVal: 'Path' },
        { optName: this.$t('body'), optVal: 'Body' },
        { optName: this.$t('header'), optVal: 'Header' }
      ],
      apiUrlDuplChkFlag: true,
      paramList: [],
      resList: []
    }
  },
  created() {},
  mounted() {
    this.fnAddParam()
    this.fnAddRes()
  },
  computed: {},
  methods: {
    fnInputChkUrl(event) {
      this.apiUrlDuplChkFlag = false
      // 숫자, 영문, 특수문자 (_/.:?=) 허용
      this.dataObj.apiUrl = event.target.value = event.target.value.replace(
         /[^a-zA-Z0-9_/.:?=]/g,
         ''
      )
    },
    // URL 중복 확인
    fnDuplChkUrl() {
      if (
         (!this.dataObj.apiUrl) ||
          (this.dataObj.apiUrl &&
          this.dataObj.apiUrl.trim() === '')
      ) {
        this.alert(
          this.$t('prog-path-alert') + this.$t('prog-inputReqValue'),
          'warning'
        )
        return
      }

      const reqData = {
        apiUrl: this.dataObj.apiUrl
      }

      requestApi({
        url: '/online/openApi/duplicationCheckOpenApiUrl',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg, 'success')
            this.apiUrlDuplChkFlag = true
          }
        }
      })
    },
    // Parameters 추가
    fnAddParam() {
      const param = {
        name: '',
        datatype: '',
        requiredYn: '',
        type: '',
        description: '',
        paramOrder: this.paramList.length + 1
      }
      this.paramList.push(param)
    },
    // Responses 추가
    fnAddRes() {
      const res = {
        resCode: '',
        description: '',
        examRes: '',
        resOrder: this.resList.length + 1
      }
      this.resList.push(res)
    },
    // Parameters index 삭제
    fnRemoveParam(index) {
      this.paramList.splice(index, 1)
      if (this.paramList.length === 0) {
        this.fnAddParam()
      }
    },
    // Responses index 삭제
    fnRemoveRes(index) {
      this.resList.splice(index, 1)
      if (this.resList.length === 0) {
        this.fnAddRes()
      }
    },
    fnSaveOpenApiConfirm() {
      if (!this.fnValidateData()) {
        return false
      }
      this.confirm(this.$t('saveYn'), this.fnSaveOpenApi)
    },
    // 숫자만 허용
    fnNumChk(num) {
      if (num !== null && num !== '') {
        return /^[0-9]*$/.test(num)
      } else {
        return true
      }
    },
    // 저장
    fnSaveOpenApi() {
      const data = {
        apiNm: this.dataObj.apiNm,
        apiUrl: this.dataObj.apiUrl,
        useYn: this.dataObj.useYn,
        apiMethod: this.dataObj.apiMethod,
        apiDesc: this.dataObj.description
      }
        data.reqParamObj = JSON.stringify(this.paramList)
        data.resDataObj = JSON.stringify(this.resList)

      requestApi({
        url: 'online/openApi/createOpenApi',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: data,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.close()
            this.callback()
          }
        }
      })
    },
    // 입력검증
    fnValidateData() {
      // 외부 API 명을 입력하지 않은 경우
      if (isEmpty(this.dataObj.apiNm)) {
        this.alert(this.$t('openApiNm-input'), 'warning')
        return false
      }
      // URL을 입력하지 않은 경우
      if (isEmpty(this.dataObj.apiUrl)) {
        this.alert(this.$t('url-blank-chk'), 'warning')
        return false
      }
      // URL 경로 중복 확인하지 않은경우
      if (!this.apiUrlDuplChkFlag) {
        this.alert(this.$t('openApiUrl-duplchk-msg'), 'warning')
        return false
      }
      // METHOD를 선택하지 않은 경우
      if (isEmpty(this.dataObj.apiMethod)) {
        this.alert(this.$t('method-blank-chk'), 'warning')
        return false
      }
      // 사용여부를 선택하지 않은 경우
      if (isEmpty(this.dataObj.useYn)) {
        this.alert(this.$t('useYnValid'), 'warning')
        return false
      }
      // 설명을 입력하지 않은 경우
      if (isEmpty(this.dataObj.description)) {
        this.alert(this.$t('description-input'), 'warning')
        return false
      }
      // Parameters 그리드가 없는 경우
      if (isEmpty(this.paramList)) {
        return false
      }

      const notInputParamNmCount = this.paramList.filter((param) =>
      isEmpty(param.name)
      ).length
      if (notInputParamNmCount > 0) {
        this.alert(this.$t('paramName-chk'), 'warning')
        return false
      }

      const notInputDataTypeCount = this.paramList.filter((param) =>
      isEmpty(param.datatype)
      ).length
      if (notInputDataTypeCount > 0) {
        this.alert(this.$t('dataType-chk'), 'warning')
        return false
      }

      const notInputRequiredYnCount = this.paramList.filter((param) =>
      isEmpty(param.requiredYn)
      ).length
      if (notInputRequiredYnCount > 0) {
        this.alert(this.$t('required-chk'), 'warning')
        return false
      }

      const notInputTypeCount = this.paramList.filter((param) =>
      isEmpty(param.type)
      ).length
      if (notInputTypeCount > 0) {
        this.alert(this.$t('type-chk'), 'warning')
        return false
      }

      // Responses 그리드가 없는 경우

      const notInputResCodeCount = this.resList.filter((res) =>
      isEmpty(res.resCode)
      ).length
      if (notInputResCodeCount > 0) {
        this.alert(this.$t('resCode-chk'), 'warning')
        return false
      }

      const notInputResDescriptionCount = this.resList.filter((res) =>
      isEmpty(res.description)
      ).length
      if (notInputResDescriptionCount > 0) {
        this.alert(this.$t('description-chk'), 'warning')
        return false
      }

      for (let i = 0; i < this.resList.length; i++) {
        if (!this.fnNumChk(this.resList[i].resCode)) {
        this.alert(this.$t('validation-resCode-num'), 'warning')
          return false
        }
      }
      return true
    }
  }
}
</script>
