<template>
  <div>
    <dashboard-grid-comp
      :xMid="xMid"
      :itemList="dashboardData"
    ></dashboard-grid-comp>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import requestApi from '@/api/ccp/requestApi'
import DashboardGridComp from './DashboardGridComp.vue'

export default {
  name: 'DashboardSvc',
  components: { DashboardGridComp },
  data() {
    return {
      xMid: 'P02001',
      dashboardData: []
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
        url: '/online/com/usrDash/retrieveOrgDashboard',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {},
        callback: (res) => {
          if (res.result.status === '200') {
            this.dashboardData = res.data
          }
        }
      })
    },
    fnUpdateLayout() {
      return new Promise((resolve, reject) => {
        this.$refs.gridLayout.layoutUpdate()
        resolve()
      })
    }
  }
}
</script>
