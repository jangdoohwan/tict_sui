<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select
            id="selectedValue"
            class="form-control"
            v-model="selectedValue"
            @change="fnSearchValChk()"
          >
            <option
              v-for="item in searchOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
              >{{ item.optName }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            v-model="retrieveValue"
            @keyup.enter="fnSearchList()"
            :disabled="selectedValue === ''"
          />
        </div>
        <div class="form-group pl-2">
          {{ $t('reqhMtReqTime') }}
          <!-- 기간검색 -->
          <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
            :duration="{ days: 7 }"
            :maxDate="'now'"
          ></datetime-picker>
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="fnSearchList()"
          >
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSeach()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <jqgrid
      ref="grid"
      name="statusEquip"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :multiselect="false"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'ReqHisMgmtSvc',
  components: {
    DatetimePicker,
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      colNameList: [
        this.$t('row-num'),
        this.$t('reqhMtLrnPrdMdlNm'),
        this.$t('reqhMtLrnPrdServNm'),
        this.$t('reqhMtDevMdlNm'),
        this.$t('reqhMtDevUUID'),
        this.$t('reqhMtReqRes'),
        this.$t('reqhMtReqTime'),
        this.$t('reqhMtResTime')
      ],
      colModelList: [
        { name: 'seq', index: 'seq', align: 'center', hidden: true },
        { name: 'modelNm', index: 'modelNm', align: 'left', width: '200px' },
        { name: 'serverNm', index: 'serverNm', align: 'left' },
        { name: 'devMdlNm', index: 'devMdlNm', align: 'left' },
        { name: 'devUuid', index: 'devUuid', align: 'left' },
        { name: 'reqRslt', index: 'reqRslt', align: 'center', width: '90px' },
        { name: 'reqTime', index: 'reqTime', align: 'center', width: '110px' },
        { name: 'resTime', index: 'resTime', align: 'center', width: '110px' }
      ],
      searchOpt: [
        { optName: '조회 구분', optVal: '' },
        { optName: '학습/예측 모델명', optVal: 'mdlNm' },
        { optName: '학습/예측 서버명', optVal: 'servNm' },
        { optName: '장비UUID', optVal: 'devUuid' }
      ],
      selectedValue: '',
      retrieveValue: '',
      startDate: null,
      endDate: null,
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      langSet: '',
      xMid: 'P11301'
    }
  },
  created() {},
  mounted() {
    this.langSet = Cookies.get('LOCALE')
    this.fnInitDate() // 초기화면에 날짜노출 문제로 적용
    this.fnSearchList()
  },
  computed: {},
  methods: {
    fnInitDate() {
      // 초기 날짜 설정
      this.startDate = moment()
        .subtract(6, 'days')
        .toDate()
      this.endDate = new Date()
    },
    fnSearchValChk() {
      if (this.selectedValue === '') {
        this.retrieveValue = ''
      }
    },
    fnInitializeSeach() {
      this.currentPage = 1
      this.selectedValue = ''
      this.retrieveValue = ''
      this.fnInitDate()
    },
    fnSearchList() {
      // 검색시에 현재 페이지 설정
      this.currentPage = 1
      this.fnGetList()
    },
    fnGetList() {
      var reqData = {}

      // 조회시에
      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.searchCon = this.selectedValue
      reqData.searchVal = this.retrieveValue
      reqData.startDate = moment(this.startDate).format('YYYYMMDD')
      reqData.endDate = moment(this.endDate).format('YYYYMMDD')
      reqData.langSet = this.langSet

      requestApi({
        url: '/online/bscphis/getBocpHisList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.totPage = res.data.page.totPage
          this.dataList = res.data.dataList
        }
      })
    },
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        this.popup({
          component: () => import('@/views/smart/ReqHisMgmtDetail'),
          title: this.$t('reqHistDetail'),
          width: '1200',
          height: '570',
          data: {
            obj: { seq: object.seq }
          },
          callback: data => {
            if (data !== 'dismiss') {
              this.fnGetList()
            }
          }
        })
      },
      1000,
      { trailing: false }
    )
  }
}
</script>

<style lang="less" scoped></style>
