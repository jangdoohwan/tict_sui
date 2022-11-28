<template>
  <div>
    <ul class="tab">
      <li
        v-for="(dash, index) in dashboard.dashboardList"
        :key="`dash-${index}`"
        :class="{ active: dashboard.activeIndex === index }"
        @click="fnChangeActiveDashboard(index)"
      >
        {{ dash.dashNm }}
      </li>
    </ul>
    <dashboard-grid-comp
      :xMid="xMid"
      :itemList="dashboardData.curUsrDashLocList"
    ></dashboard-grid-comp>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import requestApi from '@/api/ccp/requestApi'
import DashboardGridComp from './DashboardGridComp'

export default {
  name: 'UserDashboardSvc',
  components: { DashboardGridComp },
  data() {
    return {
      xMid: 'P02002',
      dashboard: {
        dashboardList: [],
        activeIndex: 0
      },
      dashboardData: {
        curUsrDashLocList: []
      }
    }
  },
  mounted() {
    eventBus.$emit('usePageInfo', false)
    this.fnGetDashboardList()
  },
  beforeDestroy() {
    eventBus.$emit('usePageInfo', true)
  },
  methods: {
    // 대시보드 리스트 조회
    fnGetDashboardList() {
      requestApi({
        url: '/online/com/usrDash/retrieveUserDashboardList',
        headers: {
          'X-MID': this.xMid
        },
        mehtod: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200') {
            this.dashboard.dashboardList = res.data
            if (this.dashboard.dashboardList.length === 0) {
              // TODO: no-data
            } else {
              this.fnChangeActiveDashboard(0)
            }
          }
        }
      })
    },
    // 대시보드 컴포넌트 위치 조회
    fnGetDashboardComponentList() {
      let dash = this.dashboard.dashboardList[this.dashboard.activeIndex]
      if (!dash.dashSeq) {
        return
      }
      requestApi({
        url: '/online/com/usrDash/retrieveUserDashboard',
        headers: {
          'X-MID': this.xMid
        },
        mehtod: 'post',
        data: {
          dashSeq: dash.dashSeq
        },
        callback: (res) => {
          if (res.result.status === '200') {
            this.dashboardData = res.data
          }
        }
      })
    },
    // 활성 대시보드 변경
    fnChangeActiveDashboard(index) {
      this.dashboard.activeIndex = index
      this.dashboardData = Object.assign(this.dashboard.dashboardList[index], {
        curUsrDashLocList: []
      })
      this.fnGetDashboardComponentList()
    }
  }
}
</script>
