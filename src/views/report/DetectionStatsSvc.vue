<template>
  <div>
    <div class="search-box form-inline">
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('service') }}</span>
        <select
          v-model="formData.svcCd"
          class="form-control"
          @change="fnGetDevClsList"
        >
          <option
            v-for="(svcCd, index) in view.svcCdList"
            :key="`svcCd-${index}`"
            :value="svcCd.svcCd"
          >
            {{ svcCd.svcCdNm }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('dev-cls') }}</span>
        <select
          v-model="formData.devClsCd"
          class="form-control"
          @change="fnGetDevMdlList"
        >
          <option
            v-for="(devCls, index) in view.devClsList"
            :key="`devCls-${index}`"
            :value="devCls.devClsCd"
          >
            {{ devCls.devClsNm }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('dev-mdl-nm') }}</span>
        <select v-model="formData.devMdlCd" class="form-control">
          <option value="">{{ $t('all') }}</option>
          <option
            v-for="(devMdl, index) in view.devMdlList"
            :key="`devMdl-${index}`"
            :value="devMdl.devMdlCd"
          >
            {{ devMdl.devMdlNm }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <select v-model="formData.searchKey" class="form-control mx-1">
          <option value="">조회구분</option>
          <option value="ctn">식별번호(CTN)</option>
          <option value="devUname">식별명</option>
        </select>
        <input
          v-model="formData.searchValue"
          type="text"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('duration') }}</span>
        <!-- 기간검색 -->
        <datetime-picker
          :isPair="true"
          :startDate.sync="formData.startDt"
          :endDate.sync="formData.endDt"
          :duration="{ days: 7 }"
          :maxDate="'now'"
        ></datetime-picker>
      </div>
      <div class="form-group">
        <span class="form-label mx-1">{{ $t('symptom-grade') }}</span>
        <select v-model="formData.detStatusCdId" class="form-control">
          <option value="">{{ $t('all') }}</option>
          <option
            v-for="(cd, index) in view.detStatusList"
            :key="`detStatus-${index}`"
            :value="cd.cdId"
          >
            {{ cd.cdNm }}
          </option>
        </select>
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
            <col style="width: 100px" />
            <col
              v-for="index in view.dateList.length"
              :key="`col-${index}`"
              style="width: 150px"
            />
          </colgroup>
          <thead>
            <tr>
              <th>{{ $t('service') }}</th>
              <th>{{ $t('device-type') }}</th>
              <th>{{ $t('equipment') }}</th>
              <th>{{ $t('symptom-grade') }}</th>
              <th v-for="(date, index) in view.dateList" :key="`date-${index}`">
                {{ fnPrettyDate(date) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in detStatsList" :key="`row-${index}`">
              <td v-if="fnGetRowSpan(index)" :rowspan="fnGetRowSpan(index)">
                {{ row.svcNm }}
              </td>
              <td v-if="fnGetRowSpan(index)" :rowspan="fnGetRowSpan(index)">
                {{ row.devClsNm }}
              </td>
              <td
                v-if="fnGetRowSpan(index)"
                :rowspan="fnGetRowSpan(index)"
                class="border-right"
              >
                {{ row.devUname }}
              </td>
              <td>{{ row.detStatusCdNm }}</td>
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
import { findLastIndex } from 'lodash'
import DatetimePicker from '@/components/DatetimePicker'
import { requestApi, requestDownloadApi } from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'DetectionStatsSvc',
  components: { DatetimePicker },
  data() {
    return {
      xMid: 'P05013',
      formData: {
        svcCd: '',
        devClsCd: '',
        devMdlCd: '',
        searchKey: '',
        searchValue: '',
        startDt: '',
        endDt: '',
        detStatusCdId: ''
      },
      detStatsList: [],
      view: {
        detStatusList: [],
        svcCdList: [],
        devClsList: [],
        devMdlList: [],
        dateList: []
      }
    }
  },
  async mounted() {
    this.fnInitDate()
    this.fnGetDetStatusCdList()
    await this.fnGetSvcCdList()
    await this.fnGetDevClsList()
    this.fnGetList()
  },
  methods: {
    // 초기화
    fnInitDate() {
      this.formData.startDt = moment()
        .subtract(6, 'days')
        .toDate()

      this.formData.endDt = moment()
        .toDate()
    },
    // 이상등급 조회
    async fnGetDetStatusCdList() {
      try {
        const data = await getCommonCodeByParentCdId({
          xMid: this.xMid,
          parentCdId: 'DS00000001'
        })
        this.view.detStatusList = data
      } catch (e) {
        console.error(e)
      }
    },
    // 서비스 목록 조회
    async fnGetSvcCdList() {
      try {
        const data = await getSvcList({ xMid: this.xMid })
        this.view.svcCdList = data
        if (this.view.svcCdList.length > 0) {
          this.formData.svcCd = this.view.svcCdList[0].svcCd
        }
        return Promise.resolve()
      } catch (e) {
        console.error(e)
      }
    },
    // 장비유형 목록 조회
    async fnGetDevClsList() {
      if (this.formData.svcCd === '') {
        this.formData.devClsCd = ''
        this.view.devClsList = []
        return
      }
      try {
        const data = await getDevClsCdListBySvcCd({
          xMid: this.xMid,
          svcCd: this.formData.svcCd
        })
        this.view.devClsList = data.devClsList
        if (this.view.devClsList.length > 0) {
          this.formData.devClsCd = this.view.devClsList[0].devClsCd
        }
        this.fnGetDevMdlList()
        return Promise.resolve()
      } catch (e) {
        console.error(e)
      }
    },
    // 장비모델 목록 조회
    fnGetDevMdlList() {
      this.formData.devMdlCd = ''
      this.view.devMdlList = []
      if (this.formData.devClsCd === '') {
        return
      }
      let reqData = {
        svcCd: this.formData.svcCd,
        devClsCd: this.formData.devClsCd
      }

      requestApi({
        url: '/online/iotsdev/retrieveSvcDevMdlList',
        headers: {
          'X-MID': this.xMid
        },
        methods: 'post',
        data: reqData,
        callback: (res) => {
          this.view.devMdlList = res.data
          return Promise.resolve()
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
        url: '/online/iotStatDet/retrieveStatDet',
        headers: {
          'X-MID': this.xMid
        },
        methods: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200') {
            this.detStatsList = res.data.list
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
      this.formData.svcCd = this.view.svcCdList[0].svcCd
      this.formData.devMdlCd = ''
      this.formData.searchKey = ''
      this.formData.searchValue = ''
      this.formData.detStatusCdId = ''
      this.fnGetDevClsList()
      this.fnInitDate()
    },
    // 날짜 포맷 변경
    fnPrettyDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    fnGetRowSpan(index) {
      const currentRow = this.detStatsList[index]
      const startIndex = this.detStatsList.findIndex(
        (row) => row.entrDevSeq === currentRow.entrDevSeq
      )
      const endIndex = findLastIndex(
        this.detStatsList,
        (row) => row.entrDevSeq === currentRow.entrDevSeq
      )
      if (endIndex >= startIndex && index === startIndex) {
        return endIndex - startIndex + 1
      }
      return undefined
    },
    // 엑셀 다운로드
    fnExcelDownload() {
      const reqData = JSON.parse(JSON.stringify(this.formData))

      // 날짜 포맷을 변경
      reqData.startDt = moment(reqData.startDt).format('YYYYMMDD')
      reqData.endDt = moment(reqData.endDt).format('YYYYMMDD')

      requestDownloadApi({
        url: '/online/iotStatDet/excelDownloadStatDet',
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
