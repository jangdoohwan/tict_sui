<template>
  <div>
    <div class="search-box form-inline">
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('customer') }}</span>
        <select
          v-model="formData.custSeq"
          class="form-control"
          @change="fnGetOpenSvcList"
        >
          <option value="">{{ $t('all') }}</option>
          <option
            v-for="(item, index) in view.custList"
            :key="`formData.custSeq-${index}`"
            :value="item.custSeq"
          >
            {{ item.custNm }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('open-svc') }}</span>
        <select
          v-model="formData.openSvcNm"
          class="form-control"
        >
          <option value="">{{ $t('all') }}</option>
          <option
            v-for="(item, index) in view.openSvcNmList"
            :key="`formData.openSvcNm-${index}`"
            :value="item.openSvcNm"
          >
            {{ item.openSvcNm }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('api-name') }}</span>
        <input
          v-model="formData.apiNm"
          type="text"
          class="form-control"
          @keyup.enter="fnGetList"
        />
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('status') }}</span>
        <select
         v-model="formData.statusCd"
         class="form-control"
         >
          <option value="">{{ $t('all') }}</option>
          <option
            v-for="(item) in view.statusList"
            v-bind:key="item.optVal"
            :value="item.optVal"
          >
            {{ item.optName }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('duration') }}</span>
        <datetime-picker
          :isPair="true"
          :startDate.sync="formData.startDt"
          :endDate.sync="formData.endDt"
          :duration="{ days: 7 }"
          :maxDate="'now'"
        ></datetime-picker>
      </div>
      <div class="form-group">
        <button class="btn btn-info" type="button" @click="fnGetList">
          {{ $t('search') }}
        </button>
        <button class="btn btn-info" type="button" @click="fnInitializeSeach">
          {{ $t('initializing') }}
        </button>
      </div>
    </div>

    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="fnExcelDownload">
        {{ $t('excel-download') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="histOpenApi"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnShowDetailPopup"
      @getDataList="fnGetList"
      :multiselect="false"
    >
    </jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import moment from 'moment'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'

export default {
  name: 'HistOpenApiReportSvc',
  components: { DatetimePicker, Jqgrid },
  data() {
    return {
      xMid: 'P05109',
      formData: {
        custSeq: '',
        openSvcNm: '',
        apiNm: '',
        statusCd: '',
        startDt: '',
        endDt: ''
        },
        openApiHistSeq: '',
        currentPage: 1,
        displayRowCount: 15,
        totPage: 0,
        dataList: [],
        colNameData: [
          this.$t('customer'),
          this.$t('request-open-svc-nm'),
          this.$t('api-nm'),
          this.$t('url'),
          this.$t('method'),
          this.$t('reqDate'),
          this.$t('status')
        ],
        colModelData: [
          { name: 'custNm', index: 'custNm', align: 'center', width: '100' },
          { name: 'openSvcNm', index: 'openSvcNm', align: 'center', width: '100' },
          { name: 'apiNm', index: 'apiNm', align: 'left', width: '100' },
          { name: 'apiUrl', index: 'apiUrl', align: 'left', width: '100' },
          { name: 'apiMethod', index: 'apiMethod', align: 'center', width: '100' },
          { name: 'reqDate', index: 'reqDate', align: 'center', width: '100' },
          { name: 'statusCd', index: 'statusCd', align: 'center', width: '100' }
        ],
      view: {
        openSvcNmList: [],
        statusList: [
          { optName: this.$t('success'), optVal: 'success' },
          { optName: this.$t('fail'), optVal: 'fail' }
        ],
        dateList: [],
        custList: []
      }
    }
  },
  mounted() {
    this.fnInitDate()
    this.fnGetCustList()
    this.fnGetList()
  },
  methods: {
    // ?????????
    fnInitDate() {
      this.formData.startDt = moment().subtract(6, 'days').toDate()
      this.formData.endDt = moment().toDate()
    },
    // ????????? ?????? ??????
    fnGetCustList() {
      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        callback: res => {
          this.view.custList = res.data.cmnctSttsCustNmList
        }
      })
    },
    // ????????? ?????? ??????
    fnGetOpenSvcList() {
      // ???????????? ???????????? ????????? ?????? ?????? ??????
      if (this.formData.custSeq === '' || this.formData.custSeq === null) {
        this.view.openSvcNmList = []
        this.formData.openSvcNm = ''
        return
      }

      requestApi({
        url: '/online/iotStatOpenApi/retrieveIotOpenSvcNm',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {
          'custSeq': this.formData.custSeq
        },
        callback: res => {
          this.view.openSvcNmList = res.data
          this.formData.openSvcNm = ''
        }
      })
    },
    // ???????????? ?????? ??????
    fnGetList() {
      let reqData = {
        custSeq: this.formData.custSeq,
        openSvcNm: this.formData.openSvcNm,
        apiNm: this.formData.apiNm,
        statusCd: this.formData.statusCd,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount,
        startDt: moment(this.formData.startDt).format('YYYYMMDD'),
        endDt: moment(this.formData.endDt).format('YYYYMMDD')
      }

      requestApi({
        url: '/online/iotHistOpenApi/retrieveOpenApiHistList',
        headers: {
          'X-MID': this.xMid
        },
        methods: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataList = res.data.dataList
            this.totPage = res.data.page.totPage
          }
        }
      })
    },
    // ?????? ?????????
    fnInitializeSeach() {
      this.formData.custSeq = ''
      this.formData.openSvcNm = ''
      this.formData.apiNm = ''
      this.formData.statusCd = ''
      this.fnInitDate()
    },
    // ?????? ????????????
    fnExcelDownload() {
      const reqData = JSON.parse(JSON.stringify(this.formData))

      // ?????? ????????? ??????
      reqData.startDt = moment(reqData.startDt).format('YYYYMMDD')
      reqData.endDt = moment(reqData.endDt).format('YYYYMMDD')

      requestDownloadApi({
        url: '/online/iotHistOpenApi/excelDownloadHistOpenApi',
        headers: {
          'X-MID': this.xMid
        },
        methods: 'post',
        data: reqData,
        callback: () => {}
      })
    },
    fnShowDetailPopup(id) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/report/HistOpenApiReportDetail'),
        title: this.$t('histOpenApiReport-detail'),
        width: '800',
        heigth: '740',
        data: {
          idx: data.openApiHistSeq
        },
        callback: obj => {
          this.fnGetList()
        }

      })
    }
  }
}
</script>
