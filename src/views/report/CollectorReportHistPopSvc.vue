<template>
  <div>
    <div class="modal-body">
      <div class="search-box">
        <div class="form-inline">
          <div class="form-group">
            <span class="form-control-static">{{ $t('collPeriod') }}</span>
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
        name="collectorRealReportHist"
        :colModels="colModelData"
        :colNames="colNameList"
        :dataList="dataList"
        :totalPage.sync="totPage"
        :currentPage.sync="currentPage"
        :rowNum.sync="displayRowCount"
        :multiselect="false"
        @getDataList="fnGetList"
      >
      </jqgrid>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getDataObjOfList } from '@/utils/comUtils'

export default {
  name: 'CollectorReportHistPopSvc',
  components: { Jqgrid, DatetimePicker },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P05002',
      svcCd: '',
      devClsCd: '',
      ctn: '',
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      colNameList: [],
      colModelData: [],
      dataList: [],
      progId: '',
      tmpCdId: '',
      entrDevSeq: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.svcCd = this.data.svcCd
    this.devClsCd = this.data.devClsCd
    this.ctn = this.data.ctn
    this.entrDevSeq = this.data.entrDevSeq
  },
  mounted() {
    this.fnInitDate()
    this.fnGetIotProg()
  },
  methods: {
    // ------------------ ??????
    fnInitDate() {
      this.startDate = moment().subtract(1, 'hour').toDate()
      this.endDate = moment().toDate()
    },
    // --------------------- ????????? ?????? ??????
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
          if (!res.data || res.data.length === 0) {
            this.alert('???????????? ID??? ???????????? ????????????.', 'warning')
            return
          }

          this.progId = res.data.dataList[0].progId
          this.fnGetIotTmpId(res.data.dataList[0].progSeq)
        }
      })
    },
    fnGetIotTmpId(progSeq) {
      let reqData = {
        progSeq: progSeq
      }
      requestApi({
        url: '/online/com/tmpl/getIotTmplCdId',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.tmpCdId = res.data.tmplCdId
          this.fnGetTmplHeaderList()
        }
      })
    },
    fnGetTmplHeaderList() {
      let reqData = {
        custSeq: '',
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
          if (!res.data) {
            console.error('?????? ????????? ????????????.')
            return
          }
          this.colModelData = []
          this.colNameList = res.data[0].colNameList
          for (let i = 0; i < res.data.length; i++) {
            this.colModelData.push(JSON.parse(res.data[i].colModelData))
          }

          // ????????? ?????????
          this.$nextTick(() => {
            this.$refs.grid.init()
          })

          // ?????? ?????? ??????
          this.fnGetList()
        }
      })
    },
    // --------------------- ????????? ????????? ??????
    fnGetList() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCdId: this.devClsCd,
        entrDevSeq: this.entrDevSeq,
        searchStartDttm: moment(this.startDate).format('YYYYMMDDHHmmss'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDDHHmmss'),
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/iotentrdevhist/retrieveEntrDevHistList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // ????????? ??? dataObj json ???????????? ???????????? ??????
          if (res.data.entrDevHistList) {
            res.data.entrDevHistList = getDataObjOfList(
              res.data.entrDevHistList,
              'dataObj',
              'colData'
            )
          }

          this.dataList = res.data.entrDevHistList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page

          if (res.data.entrDevHistList.length === 0) {
            this.alert(this.$t('no-return'), 'warning')
          }
        }
      })
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    excelDownload() {
      let reqData = {
        svcCd: this.svcCd,
        devClsCd: this.devClsCd,
        entrDevSeq: this.entrDevSeq,
        searchStartDttm: moment(this.startDate).format('YYYYMMDDHHmmss'),
        searchEndDttm: moment(this.endDate).format('YYYYMMDD') + '235959',
        progId: this.progId,
        tmpCdId: this.tmpCdId
      }
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
</script>

<style></style>
