<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <!-- 서비스 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('service') }}</span>
          <select
            v-model="svcCd"
            ref="svcCd"
            class="form-control"
            title="서비스"
            @change="fnGetDevClsList"
          >
            <option
              v-for="(svc, index) in svcCdList"
              :key="`svcCd-${index}`"
              :value="svc.svcCd"
              >{{ svc.svcCdNm }}</option
            >
          </select>
        </div>
        <!-- 장비유형 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
          <select
            v-model="devClsCd"
            class="form-control"
            @change="fnChangeDevClsCd"
            title="장비유형"
          >
            <option
              v-for="(devCls, index) in devClsList"
              :key="`devCls-${index}`"
              :value="devCls.devClsCd"
              >{{ devCls.devClsNm }}</option
            >
          </select>
        </div>
        <!-- 장비모델 -->
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('dev-mdl') }}</span>
          <select v-model="devMdlCd" class="form-control" title="장비모델">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="(devMdl, index) in devMdlList"
              :key="`devMdlCd-${index}`"
              :value="devMdl.devMdlCd"
              >{{ devMdl.devMdlNm }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <select v-model="searchType" class="form-control" title="검색 분류">
            <option
              v-for="(item, index) in searchTypeList"
              :key="'item' + index"
              :value="item.value"
              >{{ item.name }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="searchKey"
            class="form-control"
            title="검색어"
            :disabled="searchType === ''"
            @keyup.enter="search"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('collPeriod') }}</span>
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
            :duration="{ hours: 1 }"
            :maxDate="'now'"
            :hour="true"
            :minute="true"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">
            {{ $t('search') }}
          </button>
          <button class="btn btn-info" type="button" @click="fnInitializeSeach">
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="excelDownload">
        {{ $t('excel-download') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="collectorRealReport"
      :colModels="colModelData"
      :colNames="colNameList"
      :dataList="collList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import { getDataObjOfList } from '@/utils/comUtils'

export default {
  name: 'CollectorRealReportSvc',
  components: { Jqgrid, DatetimePicker },
  data() {
    return {
      xMid: 'P05004',
      svcCd: '',
      devClsCd: '',
      devMdlCd: '',
      searchType: '',
      searchKey: '',
      startDate: '',
      endDate: '',
      statusCd: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      svcCdList: [],
      devClsList: [],
      devMdlList: [],
      statusList: [],
      collList: [],
      colNameList: [],
      colModelData: [],
      progId: '',
      tmpCdId: '',
      searchTypeList: [
        { value: '', name: this.$t('search-type') },
        { value: 'entityId', name: this.$t('entity-id') },
        { value: 'ctn', name: this.$t('pin') + '(' + this.$t('ctn') + ')' },
        { value: 'usingNo', name: this.$t('using-no') },
        { value: 'devUname', name: this.$t('pin-nm') }
      ]
    }
  },
  computed: {},
  watch: {
    searchType() {
      if (this.searchType === '') {
        this.searchKey = ''
      }
    }
  },
  async created() {
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetIotProg()
  },
  mounted() {
    this.fnInitDate()
  },
  methods: {
    fnInitDate() {
      this.startDate = moment().subtract(1, 'hour').toDate()
      this.endDate = moment().toDate()
    },
    // 옵션
    fnGetSvcCdList() {
      return new Promise((resolve, reject) => {
        getSvcList({ xMid: this.xMid })
          .then(data => {
            this.svcCdList = data
            if (this.svcCdList.length > 0) {
              this.svcCd = this.svcCdList[0].svcCd
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnGetDevClsList() {
      return new Promise((resolve, reject) => {
        if (this.svcCd === '') {
          this.devClsCd = ''
          this.devClsList = []
          return false
        }
        getDevClsCdListBySvcCd({ xMid: this.xMid, svcCd: this.svcCd })
          .then(data => {
            this.devClsList = data.devClsList
            if (this.devClsList.length > 0) {
              this.devClsCd = this.devClsList[0].devClsCd
              this.fnGetDevMdlList({ devClsCd: this.devClsCd })
            }
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    fnChangeDevClsCd() {
      this.fnGetDevMdlList()
    },
    fnGetDevMdlList() {
      this.devMdlCd = ''
      this.devMdlList = []

      if (this.devClsCd === '') {
        return false
      }

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
    // --------------------- 리스트 헤더 조회
    fnGetIotProg() {
      let reqData = {
        progNm: '',
        uiPath: '/views/report/CollectorRealReportSvc',
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
          // 전체 수집 내역 목록 조회
          this.fnGetList()
        }
      })
    },
    // --------------------- 리스트 데이터 조회
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchType: this.searchType,
        searchKey: this.searchKey,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        statusCd: this.statusCd
      }

      if (this.startDate) {
        reqData.searchStartDttm = moment(this.startDate).format('YYYYMMDDHHmmss')
      }
      if (this.endDate) {
        reqData.searchEndDttm = moment(this.endDate).format('YYYYMMDDHHmmss')
      }

      requestApi({
        url: '/online/iotentrdevhist/retrieveEntrDevHistList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // 리스트 내 dataObj json 파싱하여 목록으로 세팅
          if (res.data.entrDevHistList) {
            res.data.entrDevHistList = getDataObjOfList(
              res.data.entrDevHistList,
              'dataObj',
              'colData'
            )
          }

          this.collList = res.data.entrDevHistList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
          this.totCnt = res.data.page.totRow // 전제 조회 결과 수
        }
      })
    },
    search() {
      // 검색 날짜 없는 경우
      if (this.startDate === null || this.endDate === null) {
        this.alert(this.$t('mdlMtReqPerValNulChk'), 'warning')
        return
      }
      this.currentPage = 1
      this.fnGetIotProg()
    },
    fnInitializeSeach() {
      this.svcCd = this.svcCdList[0].svcCd
      this.devMdlCd = ''
      this.searchType = '' // 선택 조건
      this.searchKey = ''
      this.detStatusCd = ''
      this.statusCd = ''
      this.specDv99 = false
      this.fnInitDate()
      this.fnGetDevClsList()
    },
    excelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        devMdlCd: this.devMdlCd,
        searchType: this.searchType,
        searchKey: this.searchKey,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        statusCd: this.statusCd,
        progId: this.progId,
        tmpCdId: this.tmpCdId
      }

      if (this.startDate) {
        reqData.searchStartDttm = moment(this.startDate).format('YYYYMMDDHHmmss')
      }
      if (this.endDate) {
        reqData.searchEndDttm = moment(this.endDate).format('YYYYMMDDHHmmss')
      }

      if (this.totCnt > 250000) {
        this.alert(this.$t('excel-limit-count'), 'warning')
      } else {
        requestDownloadApi({
          url: '/online/iotentrdevhist/downloadEntrDevHistList',
          headers: {
            'X-MID': this.xMid
          },
          data: reqData,
          callback: data => {}
        })
      }
    }
  }
}
</script>

<style></style>
