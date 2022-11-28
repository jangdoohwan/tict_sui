<template>
  <div>
    <grid-layout
      :layout.sync="grid.layout"
      :col-num="grid.cols"
      :row-height="grid.rowHeight"
      :is-draggable="false"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[2, 2]"
      :use-css-transforms="true"
      :responsive="true"
      :autoSize="true"
      :breakpoints="grid.breakPoints"
      :cols="grid.breakPointsCols"
      ref="gridLayout"
    >
      <grid-item
        v-for="item in grid.layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        ref="gridItem"
      >
        <dashboard-comp
          :xMid="xMid"
          :id="item.data.tmplCdId"
          :locNo="item.i"
          :title="item.data.dashTmplTitle"
          :tmplGubun="item.data.tmplGubun"
          :item="item.data"
          :orgList="search.orgList"
          :reloadList="search.reloadList"
          :savedSearchValue="
            search.savedSearchValueList[item.data.usrDashTmplSeq] || {}
          "
          ref="dashboardChart"
        ></dashboard-comp>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import DashboardComp from '@/components/dashboard/DashboardComp'
import requestApi from '@/api/ccp/requestApi'
import localStore from '@/utils/localStore'
import { getUserId } from '@/utils/cookie'

const SEARCHDATA_STORAGE_KEY = 'TICT_DASH_SEARCH'

export default {
  name: 'DashboardGridComp',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    DashboardComp
  },
  props: {
    xMid: {
      type: String,
      required: true
    },
    itemList: {
      type: Array,
      required: false,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      grid: {
        layout: [],
        cols: 4,
        rowHeight: 300,
        breakPoint: {
          lg: 1080,
          md: 810,
          sm: 540,
          xs: 270,
          xxs: 0
        },
        breakPointsCols: {
          lg: 4,
          md: 3,
          sm: 2,
          xs: 1,
          xxs: 1
        }
      },
      search: {
        orgList: [],
        reloadList: [],
        savedSearchValueList: []
      }
    }
  },
  watch: {
    itemList() {
      this.fnSetLayout()
    }
  },
  mounted() {
    this.fnInitData()
  },
  methods: {
    // ========== 초기 데이터 ==========
    fnInitData() {
      this.fnGetOrgList() // 조직 목록 조회
      this.fnGetCommonCodeList() // 새로고침 시간 조회
      this.fnGetSavedSearchValue() // 검색 조건 조회
    },
    // 조직 목록 조회
    fnGetOrgList() {
      requestApi({
        url: '/online/iotorg/retrieveIotCustOrg',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': this.xMid
        },
        data: {},
        method: 'post',
        callback: (res) => {
          if (res.result.status === '200') {
            this.search.orgList = res.data.orgList
          }
        }
      })
    },
    // 공통코드(새로고침 시간) 조회
    fnGetCommonCodeList() {
      requestApi({
        url: '/online/iotcmcd/retrieveIotByParentCmCdRuntime',
        headers: {
          'X-VNAME': 'ONLINE',
          'X-MID': this.xMid
        },
        method: 'post',
        data: { parentCdId: 'GN00000017' },
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.search.reloadList = res.data
          }
        }
      })
    },
    // 로컬에 저장된 검색 조건 세팅
    fnGetSavedSearchValue() {
      let jsonString = localStore.get(
        SEARCHDATA_STORAGE_KEY + '_' + getUserId()
      )
      if (jsonString) {
        this.search.savedSearchValueList = JSON.parse(jsonString)
      }
      return Promise.resolve()
    },
    // ========== 그리드 ==========
    fnSetLayout() {
      let layout = []
      this.itemList.forEach((item) => {
        if (item.usrDashTmplSeq) {
          layout.push({
            x: item.coordXNo,
            y: item.coordYNo,
            w: item.width,
            h: item.height,
            i: String(item.dashLocNo),
            data: item
          })
        }
      })
      this.grid.layout = layout
    },
    fnRefresh() {}
  }
}
</script>
