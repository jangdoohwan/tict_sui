<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-8">
          <span class="form-label w-40 lb-txt">{{ $t('prog-name') }}</span>
          <div class="input-group">
            <input v-model="progNm" type="text" class="form-control" disabled />
            <button
              type="button"
              class="btn btn-gray"
              @click="addSearchPopup()"
            >
              {{ $t('search2') }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-8">
          <span class="form-label w-40 lb-txt">{{ $t('tmpl-gubun') }}</span>
          <select
            class="form-control"
            v-model="tmplGubun"
            @change="fnChgTmplGubun(tmplGubun)"
          >
            <option
              v-for="item in tmplGubunList"
              v-bind:key="item.cdId"
              :value="item.cdId"
              >{{ item.cdNm }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-8">
          <span class="form-label w-40 lb-txt">{{ $t('template-name') }}</span>
          <input
            v-model="dataObj.tmplCdNm"
            type="text"
            class="form-control"
            maxlength="50"
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-8">
          <span class="form-label w-40">{{ $t('tmpl-img') }}</span>
          <div class="fileClass">
            <div class="form-file">
              <input
                v-if="!iswFileExist"
                type="file"
                id="tmplRuleImg"
                name="tmplRuleImg"
                class="file-upload"
                ref="tmplRuleImg"
                accept=".jpg, .bmp, .ico, .gif, .png"
                @change="fnFileCheck($event)"
              />
              <span v-else>
                <span
                  >{{ tmplRuleImg.orgFileName }} [
                  {{ tmplRuleImg.fileSizeLabel }} ]
                </span>
                <span
                  class="form-data file-add"
                  @click="fnImgDownload(tmplRuleImg.fileListSeq)"
                  ><a href="#">{{ $t('attach-file') }}</a></span
                >
                <span v-on:click="fnFileDelete(tmplRuleImg.fileListSeq, 1)"
                  ><a href="#" class="btn ico-delete remove-field"></a
                ></span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="form-item">
        <span class="form-label w-40">init-data</span>
        <div class="form-box width-100">
          <textarea
            v-model="dataObj.initData"
            cols="30"
            rows="5"
            maxlength="3000"
          ></textarea>
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
import {
  requestMultipartJsonObject,
  requestApi,
  requestDownloadApi
} from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'

export default {
  name: 'TemplateMgmtModifySvc',
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
      xMid: 'P09203',
      dataObj: {
        progId: '',
        tmplCdId: '',
        tmplCdNm: '',
        colCnt: 0,
        devClsCd: '',
        charSet: '',
        colNameData: '',
        tmplRuleImg: null,
        initData: ''
      },
      charSetList: [],
      progNm: '',
      progSeq: '',
      RowNum: 0,
      devClsList: [],
      tmplGubun: '',
      tmplGubunList: [],
      defaultObj: { cdId: '', cdNm: this.$t('select') },
      colModelData: [],
      selectedFiles: null,
      tmplIdDuplChkFlag: false,
      iswFileExist: false,
      tmplRuleImg: {},
      filePlaceHolder: this.$t('noRecords'),
      delFileSeqList: [],
      charReadFlag: true,
      changeGubun: false
    }
  },
  created() {
    this.fnSearchCommon(
      this.fnAddTmplGubunList,
      '/online/iotcmcd/retrieveIotByParentCmCdOnly',
      'GN00000019'
    )
  },
  mounted() {},
  computed: {},
  methods: {
    // 파일 업로드 시 유효성 검사
    fnFileCheck(event) {
      // jpg, bmp, ico, gif, png 파일 확장자 체크
      if (!/\.(jpg|bmp|ico|gif|png)$/i.test(this.$refs.tmplRuleImg.value)) {
        if (this.$refs.tmplRuleImg.value !== '') {
          this.alert(this.$t('file-type-check'), 'warning')
          this.$refs.tmplRuleImg.value = null
          this.fileTypeFlag = false
        }
        // 5MB 파일 사이즈 체크
      } else if (event.target.files[0].size > 5 * 1024 * 1024) {
        this.alert(this.$t('board-max-size'), 'warning')
        this.$refs.tmplRuleImg.value = null
        this.fileTypeFlag = false
      } else {
        this.fileTypeFlag = true
      }
    },
    fnFileDelete(fileSeq) {
      this.iswFileExist = false
      if (this.delFileSeqList[fileSeq] === undefined) {
        this.delFileSeqList.push(fileSeq)
      }
    },
    fnChgDevCls() {
      if (this.dataObj.devClsCd === '') {
        this.dataObj.charSet = ''
        this.charReadFlag = true
      } else {
        this.charReadFlag = false
        if (this.dataObj.charSet !== '') {
          this.fnSearchJqgrid()
        }
      }
    },
    addSearchPopup() {
      this.popup({
        component: () => import('@/views/env/program/SearchProg'),
        title: this.$t('prog-search'),
        width: '500',
        height: '500',
        data: {},
        callback: data => {
          this.progSeq = data.progSeq
          this.progNm = data.progNm
        }
      })
    },
    fnImgDownload(fileSeq) {
      var reqData = {}
      reqData.fileListSeq = fileSeq
      requestDownloadApi({
        url: '/online/com/tmpl/downloadTmplImg',
        headers: {
          'X-MID': this.xMid
        },
        callback: data => {},
        data: reqData
      })
    },
    fnSearchCommon(callback, requesturl, parentCd) {
      var paramObj = {}
      paramObj.parentCdId = parentCd

      requestApi({
        url: requesturl,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            callback(res.data)
          }
        }
      })
    },
    fnAddTmplGubunList(data) {
      this.tmplGubunList.push(this.defaultObj)
      for (var ai = 0; ai < data.length; ai++) {
        if (data[ai].cdId !== 'GN00000138') {
          this.tmplGubunList.push(data[ai])
        }
        // if (data[ai].cdId !== 'GN00000139') {
        //   this.changeGubun = true
        // }
      }
      this.fnSearchModifyData()
    },
    fnSearchModifyData() {
      var local = this
      var paramObj = {}
      paramObj.tmplSeq = this.data.idx

      requestApi({
        url: '/online/com/tmpl/getIotTmplDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataObj = res.data.data
            this.progSeq = this.dataObj.progSeq
            this.progNm = this.dataObj.progNm
            this.tmplGubun = this.dataObj.tmplGubun
            this.dataObj.devClsCd = ''
            this.dataObj.charSet = ''
            this.tmplRuleImg = {}
            if (res.data.file != null) {
              $.each(res.data.file, function(idx, obj) {
                if (local.dataObj.tmplRuleImg.indexOf(obj.fileName) !== -1) {
                  local.tmplRuleImg = obj
                  local.iswFileExist = true
                }
              })
            } else {
              this.iswFileExist = false
            }
            if (res.data.data.tmplGubun !== 'GN00000139') {
              this.changeGubun = true
            }
            this.fnSetRowNum()
          }
        }
      })
    },
    fnSearchJqgrid() {
      this.dataObj.colNameData = ''
      this.colModelData = []
      var jqparamObj = {}
      jqparamObj.tmplSeq = this.data.idx
      jqparamObj.charSet = this.dataObj.charSet
      jqparamObj.devClsCd = this.dataObj.devClsCd
      requestApi({
        url: '/online/com/tmpl/getJqgridData',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: jqparamObj,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.length !== 0) {
              this.dataObj.colNameData = res.data[0].colNameData
              for (var resi = 0; resi < res.data.length; resi++) {
                this.colModelData.push(JSON.parse(res.data[resi].colModelData))
              }
            }
          }
        }
      })
    },
    fnSetRowNum() {
      this.RowNum = Number(this.dataObj.colCnt)
      this.colModelData = []
      for (var i = 0; i < this.RowNum; i++) {
        var addObj = { name: '', index: '', align: '', width: '' }
        this.colModelData.push(addObj)
      }
    },
    fnChgTmplGubun(selected) {
      this.dataObj.colCnt = 0
      this.RowNum = 0
      this.dataObj.charSet = ''
      this.dataObj.templateName = ''
      this.dataObj.headerNm = ''
      this.tmplRulImg = ''
      var flag = false
      if (
        selected !== 'GN00000139' &&
        selected !== '' &&
        selected !== null &&
        selected.length > 1
      ) {
        flag = true
      }
      this.changeGubun = flag
    },
    submit() {
      // 대시보드템플릿관리 상세 수정 시 유효성 검사
      // 선택된 프로그램명 없는 경우
      if (!this.progNm || (this.progNm && this.progNm.trim() === '')) {
        this.alert(this.$t('prog-select'), 'warning')
        // 선택된 템플릿 구분 없는 경우
      } else if (
        !this.tmplGubun ||
        (this.tmplGubun && this.tmplGubun.trim() === '')
      ) {
        this.alert(this.$t('request-tmpl-gubun-select'), 'warning')
        // 템플릿명 입력되지 않은 경우
      } else if (
        !this.dataObj.tmplCdNm ||
        (this.dataObj.tmplCdNm && this.dataObj.tmplCdNm.trim() === '')
      ) {
        this.alert(this.$t('template-input'), 'warning')
      } else if (!this.lengthChk() && this.tmplGubun === 'GN00000138') {
        this.alert(this.$t('jqgrid-length-chk'), 'warning')
      } else {
        this.confirm(this.$t('saveYn'), this.callServerupdateTmplAPI)
      }
    },
    lengthChk() {
      var lengthChkFlag = true
      if (this.tmplGubun === 'GN00000138') {
        var chkLength = this.dataObj.colNameData.split(',')
        if (chkLength.length !== this.colModelData.length) {
          lengthChkFlag = false
        }
      }
      return lengthChkFlag
    },
    callServerupdateTmplAPI() {
      var target = document.getElementById('dev_cls_selectBox')
      var reqData = {}
      var sendJqgridDto = []
      var tmpList = []
      reqData.deleteSeq = this.delFileSeqList
      reqData.tmplSeq = this.data.idx
      reqData.progSeq = this.progSeq
      reqData.colCnt = this.dataObj.colCnt
      reqData.tmplCdNm = this.dataObj.tmplCdNm
      reqData.tmplGubun = this.tmplGubun
      reqData.tmplCdId = this.dataObj.tmplCdId
      if (this.changeGubun === true) {
        reqData.initData = this.dataObj.initData
      }
      for (var i = 0; i < this.colModelData.length; i++) {
        var colAddObj = {}
        colAddObj.devClsCdNm = target.options[target.selectedIndex].text
        colAddObj.devClsCd = this.dataObj.devClsCd
        colAddObj.colModelData = JSON.stringify(this.colModelData[i])
        colAddObj.charSet = this.dataObj.charSet
        colAddObj.colNameData = this.dataObj.colNameData
        colAddObj.tmplSeq = this.data.idx
        sendJqgridDto.push(colAddObj)
      }
      reqData.tbIotTmplHdrJqgridList = sendJqgridDto
      if (!this.iswFileExist) {
        tmpList.push(this.$refs.tmplRuleImg)
      }
      requestMultipartJsonObject({
        url: '/online/com/tmpl/updateIotTmpl',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        files: getRequestFileArray(tmpList),
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
