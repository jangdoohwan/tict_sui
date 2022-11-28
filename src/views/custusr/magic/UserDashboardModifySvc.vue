<template>
  <div class="pt-3">
    <div class="drawer-box">
      <!-- 컴포넌트 목록 -->
      <DashboardComponentListComp :x-mid="xMid"></DashboardComponentListComp>

      <!-- 대시보드 설정 -->
      <div class="drawer-right-wrap pl-2">
        <div class="flex items-center" style="border-bottom: 1px solid #ddd">
          <div class="flex-1">
            <ul class="tab" style="margin-bottom: 0">
              <li
                v-for="(dash, index) in dashboard.dashboardList"
                :key="`dash-${index}`"
                :class="{ active: dashboard.activeIndex === index }"
                @click="fnChangeActiveDashboard(index)"
              >
                {{ dash.dashNm }}
              </li>
            </ul>
          </div>
          <div class="flex-none">
            <button class="btn btn-pink" @click="fnSaveDashboardConfirm">
              {{ $t('save') }}
            </button>
            <button class="btn btn-pink" @click="fnAddDashboard">
              {{ $t('add') }}
            </button>
            <button class="btn btn-gray" @click="fnDeleteDashboardConfirm">
              {{ $t('delete') }}
            </button>
          </div>
        </div>
        <div class="my-2 text-right">
          <button class="btn btn-pink" @click="fnOpenDashNmModifyPopup">
            대시보드명 변경
          </button>
          <button class="btn btn-gray" @click="fnRemoveDashboardComponent">
            {{ $t('select-delete') }}
          </button>
        </div>
        <div class="drawer-content p-0">
          <grid-layout
            ref="gridLayout"
            :layout.sync="grid.layout"
            :col-num="grid.cols"
            :max-rows="grid.rows"
            :row-height="250"
            :is-draggable="true"
            :is-resizable="true"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="false"
            :responsive="true"
            :breakpoints="grid.breakPoints"
            :cols="grid.breakPointsCols"
            @layout-updated="fnHandleLayoutUpdated"
          >
            <grid-item
              v-for="item in grid.layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              :id="`item${item.i}`"
            >
              <dashboard-chart-image
                :id="grid.dashboardItems[`item${item.i}`].id"
                :title="grid.dashboardItems[`item${item.i}`].title"
                :view="grid.dashboardItems[`item${item.i}`].view"
                :chartImagePath="
                  grid.dashboardItems[`item${item.i}`].tmplRuleImg
                "
                :value="item.i"
                :item="item"
              ></dashboard-chart-image>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import DashboardComponentListComp from './DashboardComponentListComp'
import DashboardChartImage from '@/components/dashboard/DashboardChartImage'
import requestApi from '@/api/ccp/requestApi'

const LAYOUT_DEFAULT_SIZE = {
  COL: 4,
  ROW: 5
}

export default {
  name: 'UserDashboardModifySvc',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    DashboardComponentListComp,
    DashboardChartImage
  },
  data() {
    return {
      xMid: 'P09002',
      dashboard: {
        dashboardList: [],
        activeIndex: 0
      },
      dashboardData: {
        dashNm: '',
        dashOrder: '',
        curUsrDashLocList: []
      },
      grid: {
        cols: 4,
        rows: 20,
        breakPoints: {
          lg: 810,
          md: 810,
          sm: 540,
          xs: 270,
          xxs: 0
        },
        breakPointsCols: {
          lg: 4,
          md: 4,
          sm: 2,
          xs: 1,
          xxs: 1
        },
        initLayout: [],
        initLayoutMobile: [],
        layout: [],
        dashboardItems: []
      }
    }
  },
  mounted() {
    this.fnGetDashboardList()
    this.fnInitGridLayout()
    this.$nextTick(() => {
      this.fnSetDragDrop()
    })
  },
  methods: {
    // 대시보드 카테고리 조회
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
              this.fnAddDashboard()
            } else {
              this.fnChangeActiveDashboard(this.dashboard.activeIndex)
            }
          }
        }
      })
    },
    // 대시보드 조회
    fnGetDashboardComponentList() {
      const dash = this.dashboard.dashboardList[this.dashboard.activeIndex]
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
            this.dashboardData.curUsrDashLocList.forEach((item) => {
              // 차트 좌표 값 설정
              const breakPoint = this.$refs.gridLayout.lastBreakpoint
              const idx = this.grid.layout.findIndex(
                (layout) => layout.i === item.dashLocNo.toString()
              )
              if (
                breakPoint === 'lg' ||
                breakPoint === 'md' ||
                breakPoint === 'sm'
              ) {
                this.grid.layout[idx].x = item.coordXNo
                this.grid.layout[idx].y = item.coordYNo
                this.grid.layout[idx].w = item.width
              }
              this.grid.layout[idx].h = item.height

              // 템플릿 선택 목록에서 삭제
              if (item.usrDashTmplSeq) {
                this.grid.dashboardItems['item' + item.dashLocNo].view = true
                this.grid.dashboardItems['item' + item.dashLocNo].id =
                  item.tmplCdId
                this.grid.dashboardItems['item' + item.dashLocNo].title =
                  item.dashTmplTitle
                this.grid.dashboardItems['item' + item.dashLocNo].tmplRuleImg =
                  item.tmplRuleImg
                this.grid.dashboardItems['item' + item.dashLocNo].data = item
              } else {
                this.grid.dashboardItems['item' + item.dashLocNo].view = false
                this.grid.dashboardItems['item' + item.dashLocNo].id = ''
                this.grid.dashboardItems['item' + item.dashLocNo].title = ''
                this.grid.dashboardItems['item' + item.dashLocNo].tmplRuleImg =
                  ''
                this.grid.dashboardItems['item' + item.dashLocNo].data = {}
                this.grid.dashboardItems[
                  'item' + item.dashLocNo
                ].usrDashTmplSeq = ''
              }
            })

            this.fnSetDragDrop()
            this.$refs.gridLayout.layoutUpdate()
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
      // 초기화
      this.fnRefreshLayout()
      this.fnRefreshDashboardImage()
      this.fnGetDashboardComponentList()
    },
    // 대시보드 추가
    fnAddDashboard() {
      if (this.dashboard.dashboardList.length === 3) {
        this.alert(this.$t('dashboard-max-3'))
        return
      }
      const dashNm = this.fnGetDashNm()
      this.dashboard.dashboardList.push({
        dashNm: dashNm,
        dashOrder: this.dashboard.dashboardList.length
      })
      this.fnChangeActiveDashboard(this.dashboard.dashboardList.length - 1)
    },
    fnGetDashNm() {
      const prefix = '새 대시보드'
      let i = 1
      while (
        this.dashboard.dashboardList.find((d) => d.dashNm === prefix + i)
      ) {
        i++
      }
      return prefix + i
    },
    // 대시보드명 수정 팝업
    fnOpenDashNmModifyPopup(event) {
      event.stopPropagation()
      event.preventDefault()

      this.popup({
        component: () => import('@/views/custusr/magic/UserDashboardNmSvc.vue'),
        title: this.$t('modify-dashboard-name'),
        width: '300',
        height: '190',
        data: {
          dashNm: this.dashboardData.dashNm
        },
        callback: (dashNm) => {
          this.dashboard.dashboardList[this.dashboard.activeIndex].dashNm =
            dashNm
          this.dashboardData.dashNm = dashNm
        }
      })
    },
    // 대시보드 저장
    fnSaveDashboardConfirm() {
      var dashboadName = this.dashboardData.dashNm
      if (dashboadName.length > 20) {
        dashboadName = dashboadName.substr(0, 18) + '...'
      }
      this.confirm(
        '[' + dashboadName + '] 대시보드를 ' + this.$t('saveYn')
      )
        .then(() => {
          this.fnSaveDashboard()
        })
        .catch(() => {})
    },
    fnSaveDashboard() {
      const data = JSON.parse(JSON.stringify(this.dashboardData))

      const curUsrDashLocList = []
      this.grid.layout.forEach((item) => {
        const dashLoc = {
          coordXNo: item.x,
          coordYNo: item.y,
          width: item.w,
          height: item.h,
          dashLocNo: item.i
        }
        const key = 'item' + item.i
        dashLoc.usrDashTmplSeq = this.grid.dashboardItems[key].view
          ? this.grid.dashboardItems[key].data.usrDashTmplSeq
          : null

        curUsrDashLocList.push(dashLoc)
      })
      data.curUsrDashLocList = curUsrDashLocList

      requestApi({
        url: '/online/com/usrDash/saveUserDashboard',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: data,
        callback: (res) => {
          if (res.result.status === '200') {
            this.alert('저장되었습니다.', 'success')
            this.fnGetDashboardList()
          }
        }
      })
    },
    // 대시보드 삭제
    fnDeleteDashboardConfirm() {
      var dashboadName = this.dashboardData.dashNm
      if (dashboadName.length > 20) {
        dashboadName = dashboadName.substr(0, 18) + '...'
      }
      this.confirm(
        '[' + dashboadName + '] 대시보드를 ' + this.$t('delYn')
      )
        .then(() => {
          this.fnDeleteDashboard()
        })
        .catch(() => {})
    },
    fnDeleteDashboard() {
      // 저장되지 않은 대시보드인 경우
      if (!this.dashboardData.dashSeq) {
        this.dashboard.dashboardList.splice(this.dashboard.activeIndex, 1)
        if (this.dashboard.dashboardList.length === 0) {
          this.fnAddDashboard()
        } else {
          this.fnChangeActiveDashboard(0)
        }
        return
      }

      // 저장된 대시보드인 경우
      requestApi({
        url: '/online/com/usrDash/deleteUserDashboard',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          dashSeq: this.dashboardData.dashSeq
        },
        callback: (res) => {
          if (res.result.status === '200') {
            this.alert('삭제되었습니다.', 'success')
            this.dashboard.activeIndex = this.dashboard.activeIndex - 1
            this.fnGetDashboardList()
          }
        }
      })
    },
    // 대시보드 컴포넌트 삭제
    fnRemoveDashboardComponent() {
      const _this = this
      if ($('.form-check-input:checked').length === 0) {
        this.alert(this.$t('unselected-delete'))
        return
      }
      $('.form-check-input:checked').each(function (i, v) {
        let val = $(this).val()

        // 차트가 있을 경우 원복 처리
        if (_this.grid.dashboardItems['item' + val].view === true) {
          _this.grid.dashboardItems['item' + val].id = ''
          _this.grid.dashboardItems['item' + val].title = ''
          _this.grid.dashboardItems['item' + val].view = false
          _this.grid.dashboardItems['item' + val].data = {}
        }
        $(this).prop('checked', false)
      })
      this.$nextTick(() => {
        this.$refs.gridLayout.layoutUpdate()
      })
    },
    // ==================== 그리드 ====================
    fnInitGridLayout() {
      const layout = []
      const layoutMobile = []
      const dashboardItems = []

      for (let col = 0; col < LAYOUT_DEFAULT_SIZE.COL; col++) {
        for (let row = 0; row < LAYOUT_DEFAULT_SIZE.ROW; row++) {
          layout.push({
            x: col,
            y: row,
            w: 1,
            h: 1,
            i: String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)
          })
          layoutMobile.push({
            x: 0,
            y: row * LAYOUT_DEFAULT_SIZE.ROW + col,
            w: 1,
            h: 1,
            i: String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)
          })
          let key = 'item' + String(col * LAYOUT_DEFAULT_SIZE.ROW + row + 1)
          dashboardItems[key] = {
            view: false,
            id: '',
            title: '',
            tmplRuleImg: '',
            data: {}
          }
        }
      }
      this.grid.layout = JSON.parse(JSON.stringify(layout))
      this.grid.initLayout = JSON.parse(JSON.stringify(layout))
      this.grid.initLayoutMobile = layoutMobile
      this.grid.dashboardItems = dashboardItems

      this.cols = LAYOUT_DEFAULT_SIZE.COL
      this.rows = LAYOUT_DEFAULT_SIZE.COL * LAYOUT_DEFAULT_SIZE.ROW // max row로 모바일인 경우 1줄에 하나

      this.grid.breakPointsCols.lg = LAYOUT_DEFAULT_SIZE.COL
      this.$refs.gridLayout.layoutUpdate()
    },
    fnRefreshLayout() {
      let breakPoint = this.$refs.gridLayout.lastBreakpoint
      if (breakPoint === 'xs' || breakPoint === 'xxs') {
        this.grid.initLayoutMobile.forEach((item, index) => {
          this.grid.layout[index].x = item.x
          this.grid.layout[index].y = item.y
          this.grid.layout[index].w = item.w
          this.grid.layout[index].h = item.h
        })
      } else {
        this.grid.initLayout.forEach((item, index) => {
          this.grid.layout[index].x = item.x
          this.grid.layout[index].y = item.y
          this.grid.layout[index].w = item.w
          this.grid.layout[index].h = item.h
        })
      }
    },
    fnRefreshDashboardImage() {
      this.grid.initLayout.forEach((item) => {
        this.grid.dashboardItems['item' + item.i].view = false
        this.grid.dashboardItems['item' + item.i].id = ''
        this.grid.dashboardItems['item' + item.i].title = ''
        this.grid.dashboardItems['item' + item.i].tmplRuleImg = ''
        this.grid.dashboardItems['item' + item.i].usrDashTmplSeq = ''
        this.grid.dashboardItems['item' + item.i].data = {}
      })
    },
    fnSetDragDrop() {
      $('.vue-grid-item').droppable({
        drop: (e, ui) => {
          if (!ui.draggable[0].dataset.component) {
            return
          }

          let component = JSON.parse(ui.draggable[0].dataset.component)
          let id = e.target.id
          this.grid.dashboardItems[id] = {
            id: component.tmplCdId,
            title: component.dashTmplTitle,
            tmplRuleImg: component.tmplRuleImg,
            view: true,
            data: component
          }

          this.$nextTick(() => {
            this.$refs.gridLayout.layoutUpdate()
          })
        }
      })
    },
    fnHandleLayoutUpdated() {}
  }
}
</script>

<style></style>
