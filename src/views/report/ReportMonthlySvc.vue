<template>
  <div>
    <div class="search-box">
      <div class="form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('standard-dttm') }}</span>
          <datetime-picker
            :isPair="false"
            v-model="searchDate"
            :date.sync="searchDate"
            :month="true"
          ></datetime-picker>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="search">
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSearch"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div>
      <iframe :src="reportFilePath" style="height: calc(100vh); width: calc(100vw)" ></iframe>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import DatetimePicker from '@/components/DatetimePicker'
import { getCustSeq } from '@/utils/cookie'

export default {
  name: 'ReportMonthlySvc',
  components: { DatetimePicker },
  data() {
    return {
      xMid: 'P05015',
      searchDate: null,
      reportFilePath: '',
      custSeq: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnInitDate()
    this.fngetCustSeq()
    this.fnInitDirPath()
  },
  methods: {
    fnInitDate() {
      this.searchDate = moment()
        .subtract(1, 'months')
        .toDate()
    },
    fngetCustSeq() {
      this.custSeq = getCustSeq()
    },
    fnInitDirPath() {
      this.reportFilePath = '/reports/' + this.custSeq + '/base/' + moment().subtract(1, 'months').format('YYYY/MM') + '/monthly_report.html'
    },
    search() {
      this.reportFilePath = '/reports/' + this.custSeq + '/base/' + moment(this.searchDate).format('YYYY/MM') + '/monthly_report.html'
    },
    fnInitializeSearch() {
      this.fnInitDate()
    }
  }
}
</script>

<style lang="scss" scoped></style>
