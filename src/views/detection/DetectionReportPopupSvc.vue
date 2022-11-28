<template>
  <div>
    <div class="modal-body">
      <div class="search-box">
        <div class="form-inline">
          <div class="form-group">
            <span class="form-control-static">{{ $t('service') }}</span>
            <select v-model="svcCd" class="form-control" disabled>
              <option
                v-for="(svc, index) in svcCdList"
                :key="`svcCd-${index}`"
                :value="svc.svcCd"
                >{{ svc.svcCdNm }}</option
              >
            </select>
          </div>
          <div class="form-group">
            <span class="form-control-static">{{ $t('device-type') }}</span>
            <select v-model="devClsCd" class="form-control" disabled>
              <option
                v-for="devCls in devClsList"
                :key="'devCls' + devCls.devClsCd"
                :value="devCls.devClsCd"
                >{{ devCls.devClsNm }}</option
              >
            </select>
          </div>
          <div class="form-group">
            <span class="form-control-static">{{ $t('symptom-grade') }}</span>
            <select v-model="detStatusCd" class="form-control">
              <option value="">{{ $t('all') }}</option>
              <option
                v-for="status in detStatusList"
                :key="status.cdId"
                :value="status.detStatusCd"
                >{{ status.cdNm }}</option
              >
            </select>
          </div>
          <div class="form-group">
            <button class="btn btn-pink" type="button" @click="fnSearch">
              {{ $t('search') }}
            </button>
          </div>
        </div>
      </div>
      <div class="mb-2 text-right">
        <button class="btn btn-info" type="button" @click="fnExcelDownload">
          {{ $t('excel-download') }}
        </button>
      </div>
      <jqgrid
        ref="grid"
        name="detectionReport"
        :colModels="colModelData"
        :multiselect="false"
        :colNames="colNameList"
        :dataList="detList"
        :totalPage.sync="totPage"
        :currentPage.sync="currentPage"
        :rowNum.sync="displayRowCount"
        @getDataList="fnGetList"
      >
      </jqgrid>
    </div>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import { getCommonCodeByParentCdId } from '@/api/common/code'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import { getDataObjOfList } from '@/utils/comUtils'

export default {
  name: 'DetectionReportPopupSvc',
  components: { Jqgrid },
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
      xMid: 'P02001',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      detStatusCd: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      detList: [],
      colNameList: [],
      colModelData: [],
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      detStatusList: [],
      progId: '',
      tmpCdId: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.svcCd = this.data.svcCd
    this.devClsCd = this.data.devClsCd
    this.fnGetDetStatusList()
    this.fnGetSvcCdList()
    this.fnGetDevClsList()
    this.fnGetDevMdlList()
    this.fnGetIotProg()
  },
  methods: {
    // 옵션
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then(data => {
            this.svcCdList = data
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      return new Promise((resolve, reject) => {
        getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
          .then(data => {
            this.devClsList = data.devClsList
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevMdlList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd
      }
      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          this.devMdlList = data.data
        }
      })
    },
    fnGetDetStatusList() {
      getCommonCodeByParentCdId({ xMid: this.xMid, parentCdId: 'DS00000001' })
        .then(data => {
          this.detStatusList = data
        })
        .catch(e => {
          console.error(e)
        })
    },
    // -------------------- 리스트 관련
    fnGetIotProg() {
      let reqData = {
        progNm: '',
        uiPath: '/views/detection/DetectionReportSvc',
        currentPage: 1,
        displayRowCount: 1
      }
      requestApi({
        url: '/online/com/prog/getIotProg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data.length === 0) {
            this.alert('프로그램 ID가 존재하지 않습니다.', 'warning')
            return false
          }

          // 프로그램 ID 셋팅
          this.progId = res.data.dataList[0].progId
          this.fnGetIotTmpId(res.data.dataList[0].progSeq)
        }
      })
    },
    fnGetIotTmpId(progSeq) {
      // 템플릿 아이디 조회
      requestApi({
        url: '/online/com/tmpl/getIotTmplCdId',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { progSeq },
        callback: res => {
          // 템플릿ID 셋팅
          this.tmpCdId = res.data.tmplCdId
          this.fnGetTmplHeaderList()
        }
      })
    },
    fnGetTmplHeaderList() {
      let reqData = {
        progId: this.progId,
        tmpCdId: this.tmpCdId,
        devClsCdId: this.devClsCd
      }
      requestApi({
        url: '/online/com/tmpl/retrieveJqData',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data === undefined) {
            return
          }
          this.colModelData = []
          this.colNameList = res.data[0].colNameList
          for (let i = 0; i < res.data.length; i++) {
            this.colModelData.push(JSON.parse(res.data[i].colModelData))
          }
          // 그리드 초기화
          this.$nextTick(() => {
            this.$refs.grid.init()
          })

          // 이상징후 조회
          this.fnGetList()
        }
      })
    },
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        devStatusCd: this.statusCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        progId: this.progId
      }
      if (this.detStatusCd !== '') {
        reqData.detStatusCd = this.detStatusCd
      }
      requestApi({
        url: '/online/iotedev/retrieveIotEntrDevDetList',
        headers: {
          'X-MID': this.xMid,
          'X-VNAME': 'ONLINE'
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data.boardList) {
            res.data.boardList = getDataObjOfList(res.data.boardList, 'dataObj', 'colData')
          }
          this.detList = res.data.boardList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetIotProg()
    },
    fnExcelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        devStatusCd: this.statusCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        progId: this.progId
      }
      if (this.detStatusCd !== '') {
        reqData.detStatusCd = this.detStatusCd
      }
      requestDownloadApi({
        url: '/online/iotedev/downloadIotEntrDevDetList',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: () => {}
      })
    }
  }
}
</script>

<style></style>
