<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <!-- 프로그램명 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('prog-name') }}</span>
          <div class="input-group">
            <input
              v-model="view.progNm"
              type="text"
              class="form-control"
              disabled
            />
            <button
              type="button"
              class="btn btn-gray"
              @click="fnShowProgramPopup()"
            >
              {{ $t('search2') }}
            </button>
          </div>
        </div>
        <!-- 템플릿 구분 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('tmpl-gubun') }}</span>
          <select class="form-control" v-model="formData.tmplGubun">
            <option
              v-for="(tmplGubun, index) in view.tmplGubunOptionList"
              :key="`tmplGubun-${index}`"
              :value="tmplGubun.cdId"
            >
              {{ tmplGubun.cdNm }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <!-- 템플릿 명 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('template-name') }}</span>
          <input
            v-model="formData.tmplCdNm"
            type="text"
            class="form-control"
            maxlength="16"
          />
        </div>
        <!-- 장비유형 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('dev-cls') }}</span>
          <select class="form-control" v-model="formData.devClsCd">
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="(devCls, index) in view.devClsOptionsList"
              :key="`devCls-${index}`"
              :value="devCls.DEV_CLS_CD"
            >
              {{ devCls.DEV_CLS_NM }}
            </option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <!-- 언어설정 -->
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('charSet') }}</span>
          <select class="form-control" v-model="formData.langSet">
            <option
              v-for="(langSet, index) in view.langSetOptionList"
              :key="`langSet-${index}`"
              :value="langSet.cdId"
            >
              {{ langSet.cdNm }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-3 text-right">
        <button class="btn btn-gray" @click="fnAddGridColumn">
          {{ $t('add') }}
        </button>
      </div>
      <div class="grid-container grid-scroll mt-1">
        <div class="table-wrap y-scroll" style="min-height: 390px">
          <table class="table table-col" style="min-width: 840px">
            <caption></caption>
            <colgroup>
              <col style="width: 140px" />
              <col style="width: 140px" />
              <col style="width: 100px" />
              <col style="width: 90px" />
              <col style="width: 90px" />
              <col style="width: 70px" />
              <col style="width: 70px" />
            </colgroup>
            <thead>
              <tr>
                <th>{{ $t('title-name') }}</th>
                <th>{{ $t('field-name') }}</th>
                <th>{{ $t('width') }}</th>
                <th>{{ $t('data-type') }}</th>
                <th>{{ $t('align') }}</th>
                <th>{{ $t('num') }}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(col, index) in gridColumnList"
                :key="`gridColumn-${index}`"
              >
                <td>
                  <input
                    v-model="col.title"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <input
                    v-model="col.name"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <input
                    v-model="col.width"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <select v-model="col.type" class="form-control">
                    <option value="string">String</option>
                    <option value="image">Image</option>
                    <option value="map">Map</option>
                  </select>
                </td>
                <td>
                  <select v-model="col.align" class="form-control">
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </td>
                <td>
                  <input
                    v-model="col.colOrder"
                    type="text"
                    class="form-control"
                    style="width: 100%"
                  />
                </td>
                <td>
                  <button class="btn" @click="fnRemoveGridColumn(index)">
                    {{ $t('delete') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button class="btn btn-pink" @click="fnSaveTmplConfirm">
          {{ $t('registration') }}
        </button>
        <button class="btn btn-gray" @click="close">{{ $t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import { getCommonCodeByParentCdId, getCommonCode } from '@/api/common/code'
import { isEmpty, checkOnlyNum } from '@/utils/comUtils'

export default {
  name: 'JqgridTemplateMgmtAddSvc',
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
      xMid: 'P08602',
      formData: {
        colCnt: 0,
        progSeq: '',
        tmplCdId: '',
        tmplCdNm: '',
        tmplGubun: 'GN00000138', // 수집 / 제어 Header
        devClsCd: ''
      },
      gridColumnList: [],
      view: {
        progNm: '',
        tmplGubunOptionList: [],
        langSetOptionList: [],
        devClsOptionsList: []
      }
    }
  },
  computed: {
    devClsCdNm() {
      const devCls = this.view.devClsOptionsList.find(
        (devCls) => devCls.DEV_CLS_CD === this.formData.devClsCd
      )
      return devCls ? devCls.DEV_CLS_NM : ''
    }
  },
  mounted() {
    this.fnGetTmplGubunCode()
    this.fnGetLangSetCode()
    this.fnGetDevClsList()

    this.fnAddGridColumn()
  },
  methods: {
    // 템플릿 구분 코드 조회
    async fnGetTmplGubunCode() {
      const param = {
        xMid: this.xMid,
        parentCdId: 'GN00000019'
      }
      const data = await getCommonCodeByParentCdId(param)
      this.view.tmplGubunOptionList = data.filter(
        (item) => item.cdId === 'GN00000138'
      )
    },
    // 언어 설정 코드 조회
    async fnGetLangSetCode() {
      const param = {
        xMid: this.xMid,
        parentCdId: 'GN00000021'
      }
      const data = await getCommonCode(param)
      this.view.langSetOptionList = data
      this.formData.langSet = 'ko'
    },
    // 장비유형 목록 조회
    async fnGetDevClsList() {
      requestApi({
        url: '/online/iotsvc/retrieveIotCmCdForDevDlsCd',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200') {
            this.view.devClsOptionsList = res.data
          }
        }
      })
    },
    // 프로그램 팝업 오픈
    fnShowProgramPopup() {
      this.popup({
        component: () => import('@/views/env/program/SearchProg'),
        title: this.$t('prog-search'),
        width: '500',
        data: {},
        callback: (data) => {
          this.formData.progSeq = data.progSeq
          this.view.progNm = data.progNm
        }
      })
    },
    // 그리드 리스트 추가
    fnAddGridColumn() {
      const col = {
        title: '',
        name: '',
        width: '',
        type: 'string',
        align: 'center',
        colOrder: this.gridColumnList.length + 1
      }
      this.gridColumnList.push(col)
    },
    // 그리드 리스트 삭제
    fnRemoveGridColumn(index) {
      this.gridColumnList.splice(index, 1)
      if (this.gridColumnList.length === 0) {
        // 그리드 컬럼 없는 경우 기본으로 추가
        this.fnAddGridColumn()
      } else {
        // 삭제로 인한 order 재설정
        this.gridColumnList.forEach((col, index) => {
          col.colOrder = index + 1
        })
      }
    },
    // 저장 확인
    fnSaveTmplConfirm() {
      if (!this.fnValidateData()) {
        return false
      }
      this.confirm(this.$t('saveYn'), this.fnSaveTmpl)
    },
    // 저장
    fnSaveTmpl() {
      const data = {
        progSeq: this.formData.progSeq,
        colCnt: this.gridColumnList.length,
        tmplCdNm: this.formData.tmplCdNm,
        tmplGubun: this.formData.tmplGubun,
        tmplCdId: ''
      }
      // 저장되는 데이터를 맞추기 위하여 타이틀 리스트 목록
      var sortColNamelist = []
      this.gridColumnList.forEach((col) => {
        const obj = {
          title: col.title,
          colOrder: col.colOrder
        }
        sortColNamelist.push(obj)
      })

      sortColNamelist.sort(function(a, b) {
        return a.colOrder - b.colOrder
      })

      const colNameData = sortColNamelist.map((col) => col.title).join(', ')
      const tbIotTmplHdrJqgridList = []
      this.gridColumnList.forEach((col) => {
        const colModelData = {
          name: col.name,
          index: col.name,
          align: col.align,
          width: col.width,
          type: col.type
        }

        const obj = {
          devClsCdNm: this.devClsCdNm,
          devClsCd: this.formData.devClsCd,
          langSet: this.formData.langSet,
          colNameData: colNameData,
          colModelData: JSON.stringify(colModelData),
          colOrder: col.colOrder
        }
        tbIotTmplHdrJqgridList.push(obj)
      })
      data.tbIotTmplHdrJqgridList = tbIotTmplHdrJqgridList

      requestApi({
        url: '/online/com/tmpl/insertIotJqGridTmpl',
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
      // 프로그램 선택하지 않은 경우
      if (isEmpty(this.formData.progSeq)) {
        this.alert(this.$t('prog-select'), 'warning')
        return false
      }
      // 템플릿 구분 선택하지 않은 경우
      if (isEmpty(this.formData.tmplGubun)) {
        this.alert(this.$t('request-tmpl-gubun-select'), 'warning')
        return false
      }
      // 템플릿 명 선택하지 않은 경우
      if (isEmpty(this.formData.tmplCdNm)) {
        this.alert(this.$t('template-input'), 'warning')
        return false
      }
      // 장비유형 선택하지 않은 경우
      if (isEmpty(this.formData.devClsCd)) {
        this.alert(this.$t('request-device-select'), 'warning')
        return false
      }
      // 언어설정 선택하지 않은 경우
      if (isEmpty(this.formData.langSet)) {
        this.alert(this.$t('charset-select'), 'warning')
        return false
      }

      // 그리드 없는 경우
      if (isEmpty(this.gridColumnList)) {
        return false
      }

      const notInputTitleCount = this.gridColumnList.filter((col) =>
        isEmpty(col.title)
      ).length
      if (notInputTitleCount > 0) {
        this.alert(this.$t('jqgrid-titleName-chk'), 'warning')
        return false
      }

      const notInputNameCount = this.gridColumnList.filter((col) =>
        isEmpty(col.name)
      ).length
      if (notInputNameCount > 0) {
        this.alert(this.$t('jqgrid-filedName-chk'), 'warning')
        return false
      }

      const notInputWidthCount = this.gridColumnList.filter(
        (col) => isEmpty(col.width) || !checkOnlyNum(col.width)
      ).length
      if (notInputWidthCount > 0) {
        this.alert(this.$t('jqgrid-width-chk'), 'warning')
        return false
      }

      const notInputTypeCount = this.gridColumnList.filter((col) =>
        isEmpty(col.type)
      ).length
      if (notInputTypeCount > 0) {
        this.alert(this.$t('jqgrid-type-chk'), 'warning')
        return false
      }

      const notInputAlignCount = this.gridColumnList.filter((col) =>
        isEmpty(col.align)
      ).length
      if (notInputAlignCount > 0) {
        this.alert(this.$t('jqgrid-algin-chk'), 'warning')
        return false
      }

      const notInputOrderCount = this.gridColumnList.filter(
        (col) => isEmpty(col.colOrder) || !checkOnlyNum(col.colOrder)
      ).length
      if (notInputOrderCount > 0) {
        this.alert(this.$t('jqgrid-order-chk'), 'warning')
        return false
      }

      return true
    }
  }
}
</script>
