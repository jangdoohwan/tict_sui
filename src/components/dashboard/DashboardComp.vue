<template>
  <div class="_dash-comp">
    <div class="_dash-comp-header flex">
      <div class="_dash-comp-title">{{ title }}</div>
      <div class="flex items-center flex-none">
        <div class="px-1">{{ view.lastUpdateTime }}</div>
        <select v-if="compConfigRefresh.dispYn === 'Y'" v-model="item.dayTime" class="form-control" @change="fnSearch">
          <option v-for="list in reloadList" :value="list.cdId * 1000" :key="list.cdId">
            {{ list.cdNm }}
          </option>
        </select>
      </div>
    </div>
    <!-- 검색 -->
    <dashboard-comp-search ref="search" class="_dash-comp-search" :xMid="xMid" :orgList="orgList"
      :comp-config-search="compConfigSearch" :savedSearchValue="savedSearchValue" :item="item" @search="fnSearch">
    </dashboard-comp-search>
    <!-- 내용 -->
    <div class="_dash-comp-content">
      <component :is="item.tmplGubun" :initMsgData="compConfigData" :optionData="compOptionData"
        :componentData="componentData" :locNo="locNo" :items="item"></component>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import moment from 'moment'
import localStore from '@/utils/localStore'
import { getUserId } from '@/utils/cookie'
import { executeApi, executeQuery } from '@/api/common/api'
import PollingClient from '@/api/ccp/pollingClient'

import DashboardCompSearch from '@/components/dashboard/DashboardCompSearch'
import DashboardComponent from '@/components/dashboard/dashboardComponent'

const SEARCHDATA_STORAGE_KEY = 'TICT_DASH_SEARCH'
const DEFAULT_DAY_TIME = 20 * 1000 // 기존 갱신 주기 20초

export default {
  name: 'DashboardComp',
  components: Object.assign({ DashboardCompSearch }, DashboardComponent),
  props: {
    xMid: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    locNo: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    reloadList: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    item: {
      type: Object,
      required: false,
      default: () => ({})
    },
    orgList: [],
    savedSearchValue: {
      type: [Object]
    }
  },
  data() {
    return {
      view: {
        lastUpdateTime: ''
      },
      componentData: null
    }
  },
  computed: {
    // 컴포넌트 구성 검색
    compConfigSearch() {
      if (!this.item.compConfigMsg || this.item.compConfigMsg.length === 0) {
        return []
      }
      const compConfigMsg = JSON.parse(this.item.compConfigMsg)
      return compConfigMsg.SEARCH ? compConfigMsg.SEARCH : []
    },
    // 컴포넌트 구성 데이터
    compConfigData() {
      if (!this.item.compConfigMsg || this.item.compConfigMsg.length === 0) {
        return []
      }
      const compConfigMsg = JSON.parse(this.item.compConfigMsg)
      return compConfigMsg.DATA ? compConfigMsg.DATA : []
    },
    // 컴포넌트 구성 갱신
    compConfigRefresh() {
      if (!this.item.compConfigMsg || this.item.compConfigMsg.length === 0) {
        return {}
      }
      const compConfigMsg = JSON.parse(this.item.compConfigMsg)
      return compConfigMsg.REFRESH
        ? compConfigMsg.REFRESH
        : { useYn: 'Y', dispYn: 'Y' }
    },
    // 컴포넌트 옵션
    compOptionData() {
      if (!this.item.extraMsg || this.item.extraMsg.length === 0) {
        return {}
      }
      const extraMsg = JSON.parse(this.item.extraMsg)
      return extraMsg || {}
    },
    // 컴포넌트 요청 (ex. API Request)
    compReqMsg() {
      if (!this.item.reqMsg || this.item.reqMsg.length === 0) {
        return {}
      }
      return JSON.parse(this.item.reqMsg)
    }
  },
  watch: {
    savedSearchValue: {
      immediate: true,
      handler() {
        if (this.savedSearchValue && this.savedSearchValue['_interval_']) {
          this.item.dayTime = this.savedSearchValue['_interval_']
        }
      }
    }
  },
  mounted() { },
  beforeDestroy() {
    if (this.client) {
      this.client.deletePolling(this.item.usrDashTmplSeq)
    }
  },
  methods: {
    fnSearch() {
      // 검색 항목 없는 경우 ref가 없으므로 초기화
      let searchData = this.$refs.search
        ? this.$refs.search.fnGetSearchParams()
        : {}

      // 검색 항목에 빈 값이 있는 경우 조회 하지 않음
      if (
        Object.keys(searchData).length > 0 &&
        Object.values(searchData).findIndex((v) => !v || v === '') > -1
      ) {
        return
      }

      // 검색 항목에 서비스, 장비유형 정보를 기본으로 추가한다.
      searchData.usrDashTmplSeq = this.item.usrDashTmplSeq
      searchData.svcCd = this.item.svcCd
      searchData.devClsCd = this.item.devClsCd

      // 갱신 주기 사용 설정 도니 경우에만 interval을 파라미터로 추가한다.
      if (this.compConfigRefresh.useYn === 'Y') {
        // 갱신 주기를 사용하나 주기를 노출하지 않는 경우 default 주기를 설정한다.
        if (this.compConfigRefresh.dispYn === 'N') {
          this.item.dayTime = DEFAULT_DAY_TIME
        }
        searchData['_interval_'] = this.item.dayTime
      }

      this.fnSaveSearchData(searchData)

      // 컴포넌트 데이터 구분에 따른 데이터 실행
      if (this.item.compDataGubun === 'A') {
        this.fnExecuteAPI(searchData)
      } else if (this.item.compDataGubun === 'T') {
        this.fnExecuteTopic(searchData)
      } else if (this.item.compDataGubun === 'Q') {
        searchData.usrDashTmplSeq = this.item.usrDashTmplSeq
        this.fnExecuteQuery(searchData)
      }
    },
    // ==================== 데이터 실행 ====================
    // -------------------- API
    fnExecuteAPI(searchData) {
      if (!this.item.apiUrl || this.item.apiUrl.length === 0) {
        return
      }
      let param = {
        header: { 'X-MID': this.xMid },
        body: Object.assign({}, this.compReqMsg.body || {}, searchData),
        url: this.items.apiUrl
      }

      executeApi(param).then((resData) => {
        if (param.body.responseKey && param.body.responseKey.length > 0) {
          this.componentData = _.get(resData, param.body.responseKey)
        } else {
          this.componentData = resData
        }
        this.view.lastUpdateTime = moment().format('HH:mm:ss').toString()
      })
    },
    // -------------------- Topic
    fnExecuteTopic(searchData) {
      if (!this.item.topicId || this.item.topicId.length === 0) {
        return
      }
      // 파라미터 세팅
      let svcParam = []
      for (let [key, value] of Object.entries(searchData)) {
        svcParam.push({ tmplGubun: key, tmplCondVlu: value })
      }

      let params = {
        headers: {
          'X-SVCCD': searchData || searchData.svcCd ? searchData.svcCd : ''
        },
        body: {
          topicId: this.item.topicId,
          svcParam: svcParam
        }
      }

      this.client = new PollingClient()
      this.client.addPolling(
        this.item.usrDashTmplSeq,
        this.item.compDataGubun,
        params,
        (res) => {
          this.componentData = res
          this.view.lastUpdateTime = moment().format('HH:mm:ss').toString()
        },
        this.compConfigRefresh.useYn,
        this.item.dayTime
      )
    },
    // -------------------- Query
    fnExecuteQuery(searchData) {
      executeQuery(searchData).then((resData) => {
        this.componentData = resData
        this.view.lastUpdateTime = moment().format('HH:mm:ss').toString()
      })
    },
    // ==================== 기타 ====================
    // 검색 저장
    fnSaveSearchData(searchData) {
      localStore.setObject(
        SEARCHDATA_STORAGE_KEY + '_' + getUserId(),
        this.item.usrDashTmplSeq,
        searchData
      )
    }
  }
}
</script>

<style class="less">
._dash-comp {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

._dash-comp-header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 5px;
}

._dash-comp-title {
  font-weight: bold;
}

._dash-comp-search {
  flex: none;
  padding-bottom: 5px;
}

._dash-comp-content {
  flex: 1;
}
</style>
