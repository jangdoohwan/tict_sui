L<template>
  <div>
    <div class="search-box form-inline">
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('customer') }}</span>
        <select
          v-model="formData.custSeq"
          class="form-control"
          @change="fnGetOpenSvcList"
        >
          <option v-if="roleCdId === 'GN00000033' || roleCdId === 'GN00000034' || roleCdId === 'GN00000038'" value="">{{ $t('all') }}</option>
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
        />
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

    <div class="grid-container">
      <div class="table-wrap">
        <table class="table table-col" style="table-layout: auto">
          <caption></caption>
          <colgroup>
            <col style="width: 200px" />
            <col style="width: 200px" />
            <col style="width: 200px" />
            <col
              v-for="index in view.dateList.length"
              :key="`col-${index}`"
              style="width: 150px"
            />
          </colgroup>
          <thead>
            <tr>
              <th>{{ $t('customer') }}</th>
              <th>{{ $t('request-open-svc-nm') }}</th>
              <th>{{ $t('api-nm') }}</th>
              <th v-for="(date, index) in view.dateList" :key="`date-${index}`">
                {{ fnPrettyDate(date) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in openApiStatsList" :key="`row-${index}`">
              <td>
                {{ row.CUST_NM }}
              </td>
              <td>
                {{ row.OPEN_SVC_NM }}
              </td>
              <td>
                {{ row.API_NM }}
              </td>
              <td v-for="(date, index) in view.dateList" :key="`date-${index}`">
                {{ row[date] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getCustSeq } from '@/utils/cookie'

export default {
  name: 'StatOpenApiReportSvc',
  components: { DatetimePicker },
  data() {
    return {
      xMid: 'P05014',
      formData: {
        custSeq: '',
        openSvcNm: '',
        apiNm: '',
        startDt: '',
        endDt: ''
      },
      openApiStatsList: [],
      view: {
        openSvcNmList: [],
        dateList: [],
        custList: []
      },
      roleCdId: ''
    }
  },
  mounted() {
    this.fnInitDate()
    this.fnGetCustList()
    this.fnGetList()
  },
  methods: {
    // 초기화
    fnInitDate() {
      this.formData.startDt = moment().subtract(6, 'days').toDate()
      this.formData.endDt = moment().toDate()
    },
    // 고객사 목록 조회
    fnGetCustList() {
      requestApi({
        url: '/online/iotcust/retrieveIotCustSelect',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        callback: res => {
          this.view.custList = res.data
        }
      })
    },
    // 외부 서비스 목록 조회
    fnGetOpenSvcList() {
      // 고객사를 선택하지 않으면 조회 하지 않게
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
    // 통계 목록 조회
    fnGetList() {
      const reqData = JSON.parse(JSON.stringify(this.formData))

      // 날짜 포맷을 변경
      reqData.startDt = moment(reqData.startDt).format('YYYYMMDD')
      reqData.endDt = moment(reqData.endDt).format('YYYYMMDD')

      // 목록에 출력하기 위해 날짜 리스트 설정
      this.fnSetDateList()

      requestApi({
        url: '/online/iotStatOpenApi/retrieveStatOpenApi',
        headers: {
          'X-MID': this.xMid
        },
        methods: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            this.openApiStatsList = res.data.list
            this.roleCdId = res.data.roleCdId
            if (!(this.roleCdId === 'GN00000033' || this.roleCdId === 'GN00000034' || this.roleCdId === 'GN00000038')) {
              this.formData.custSeq = getCustSeq()
              this.view.custList = this.view.custList.filter(data => data.custSeq === this.formData.custSeq)
              this.fnGetOpenSvcList()
            }
          }
        }
      })
    },
    // 날짜 리스트 설정
    fnSetDateList() {
      const dateList = []
      const startTime = moment(this.formData.startDt).toDate().getTime()
      const endTime = moment(this.formData.endDt).toDate().getTime()
      let current = startTime
      while (current <= endTime) {
        dateList.push(moment(current).format('YYYYMMDD'))
        current = moment(current).add(1, 'days').toDate().getTime()
      }
      this.view.dateList = dateList
    },
    // 검색 초기화
    fnInitializeSeach() {
      this.formData.custSeq = ''
      this.formData.openSvcNm = ''
      this.formData.apiNm = ''
      this.fnInitDate()
    },
    // 날짜 포맷 변경
    fnPrettyDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    // 엑셀 다운로드
    fnExcelDownload() {
      const reqData = JSON.parse(JSON.stringify(this.formData))

      // 날짜 포맷을 변경
      reqData.startDt = moment(reqData.startDt).format('YYYYMMDD')
      reqData.endDt = moment(reqData.endDt).format('YYYYMMDD')

      requestDownloadApi({
        url: '/online/iotStatOpenApi/excelDownloadStatOpenApi',
        headers: {
          'X-MID': this.xMid
        },
        methods: 'post',
        data: reqData,
        callback: () => {}
      })
    }
  }
}
</script>
