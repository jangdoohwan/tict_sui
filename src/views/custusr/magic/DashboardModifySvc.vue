<template>
  <div class="pt-3">
    <div ref="dashboardWrap" class="drawer-box">
      <DashboardComponentListComp :x-mid="xMid"></DashboardComponentListComp>
      <div class="drawer-right-wrap pl-2">
        <div class="drawer-header py-1 form-inline">
          <div class="form-group">
            <span class="form-control-static">{{ $t('department') }}</span>
            <select
              v-model="orgSeq"
              class="form-control"
              @change="fnGetDashboardItemListByOrg"
            >
              <option
                v-for="list in orgList"
                :key="list.orgSeq"
                :value="list.orgSeq"
              >
                {{ list.orgPath }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <button type="button" class="btn btn-pink" @click="fnSaveConfirm">
              {{ $t('save') }}
            </button>
            <button type="button" class="btn btn-gray" @click="fnRemoveItem">
              {{ $t('delete') }}
            </button>
          </div>
        </div>
        <div class="drawer-content p-0">
          <grid-layout
            ref="gridLayout"
            :layout.sync="layout"
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
              v-for="item in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i"
              :id="`item${item.i}`"
            >
              <dashboard-chart-image
                :id="dashboardItems[`item${item.i}`].id"
                :title="dashboardItems[`item${item.i}`].title"
                :view="dashboardItems[`item${item.i}`].view"
                :chartImagePath="dashboardItems[`item${item.i}`].tmplRuleImg"
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
import DashboardChartImage from '@/components/dashboard/DashboardChartImage'
import DashboardComponentListComp from './DashboardComponentListComp'
import requestApi from '@/api/ccp/requestApi'

const LAYOUT_DEFAULT_SIZE = {
  COL: 4,
  ROW: 5
}

export default {
  name: 'DashboardModifySvc',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    DashboardChartImage,
    DashboardComponentListComp
  },
  data() {
    return {
      xMid: 'P09001',
      componentList: [],
      orgList: [],
      orgSeq: '',
      layout: [],
      dashboardItems: {},
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
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnGetOrgList()
    this.fnInitLayout()
    this.$nextTick(() => {
      this.fnSetDragDrop()
    })
  },
  methods: {
    // 조직 목록 조회
    fnGetOrgList() {
      requestApi({
        url: '/online/iotorg/retrieveIotCustOrg',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        method: 'post',
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.orgList = res.data.orgList
            this.orgSeq = this.orgList[0].orgSeq
            // 첫번째 조직 대시보드 템플릿 조회
            this.fnGetDashboardItemListByOrg()
          }
        }
      })
    },
    // 조직별 대시보드 템플릿 조회
    fnGetDashboardItemListByOrg() {
      if (this.orgSeq === '') {
        this.alert(this.$t('request-org-select'))
        return
      }

      // 초기화
      this.fnRefreshLayout()
      this.fnRefreshDashboardImage()

      let reqData = {
        orgSeq: this.orgSeq
      }
      requestApi({
        url: '/online/com/usrDash/retrieveOrgDashboard',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            res.data.forEach((item) => {
              // 차트 좌표 값 설정
              let breakPoint = this.$refs.gridLayout.lastBreakpoint
              let idx = this.layout.findIndex(
                (layout) => layout.i === item.dashLocNo.toString()
              )
              if (
                breakPoint === 'lg' ||
                breakPoint === 'md' ||
                breakPoint === 'sm'
              ) {
                this.layout[idx].x = item.coordXNo
                this.layout[idx].y = item.coordYNo
                this.layout[idx].w = item.width
              }
              this.layout[idx].h = item.height

              // 템플릿 선택 목록에서 삭제
              if (item.usrDashTmplSeq) {
                // 차트 이미지정보 세팅
                this.dashboardItems['item' + item.dashLocNo].view = true
                this.dashboardItems['item' + item.dashLocNo].id = item.tmplCdId
                this.dashboardItems['item' + item.dashLocNo].title =
                  item.dashTmplTitle
                this.dashboardItems['item' + item.dashLocNo].tmplRuleImg =
                  item.tmplRuleImg
                this.dashboardItems['item' + item.dashLocNo].data = item
              } else {
                this.dashboardItems['item' + item.dashLocNo].view = false
                this.dashboardItems['item' + item.dashLocNo].id = ''
                this.dashboardItems['item' + item.dashLocNo].title = ''
                this.dashboardItems['item' + item.dashLocNo].tmplRuleImg = ''
                this.dashboardItems['item' + item.dashLocNo].usrDashTmplSeq = ''
                this.dashboardItems['item' + item.dashLocNo].data = {}
              }
            })
            this.fnSetDragDrop()
            this.$refs.gridLayout.layoutUpdate()
          }
        }
      })
    },
    // 그리드 레이아웃 초기화
    fnInitLayout() {
      let layout = []
      let layoutMobile = []
      let dashboardItems = {}
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
      this.layout = JSON.parse(JSON.stringify(layout))
      this.layoutInit = JSON.parse(JSON.stringify(layout))
      this.layoutInitMobile = layoutMobile
      this.dashboardItems = dashboardItems

      this.cols = LAYOUT_DEFAULT_SIZE.COL
      this.rows = LAYOUT_DEFAULT_SIZE.COL * LAYOUT_DEFAULT_SIZE.ROW // max row로 모바일인 경우 1줄에 하나

      this.grid.breakPointsCols.lg = LAYOUT_DEFAULT_SIZE.COL
      this.$refs.gridLayout.layoutUpdate()
    },
    fnRefreshLayout() {
      let breakPoint = this.$refs.gridLayout.lastBreakpoint
      if (breakPoint === 'xs' || breakPoint === 'xxs') {
        this.layoutInitMobile.forEach((item, index) => {
          this.layout[index].x = item.x
          this.layout[index].y = item.y
          this.layout[index].w = item.w
          this.layout[index].h = item.h
        })
      } else {
        this.layoutInit.forEach((item, index) => {
          this.layout[index].x = item.x
          this.layout[index].y = item.y
          this.layout[index].w = item.w
          this.layout[index].h = item.h
        })
      }
    },
    fnRefreshDashboardImage() {
      this.layoutInit.forEach((item) => {
        this.dashboardItems['item' + item.i].view = false
        this.dashboardItems['item' + item.i].id = ''
        this.dashboardItems['item' + item.i].title = ''
        this.dashboardItems['item' + item.i].tmplRuleImg = ''
        this.dashboardItems['item' + item.i].usrDashTmplSeq = ''
        this.dashboardItems['item' + item.i].data = {}
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
          this.dashboardItems[id] = {
            id: component.tmplCdId,
            title: component.dashTmplTitle,
            tmplRuleImg: component.tmplRuleImg,
            view: true,
            data: component
          }
        }
      })
    },
    // 저장 확인
    fnSaveConfirm() {
      if (this.orgSeq === '') {
        this.alert(this.$t('request-org-select'))
        return
      }
      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    // 저장
    fnSave() {
      let paramObj = {}
      paramObj.orgSeq = this.orgSeq
      paramObj.curOrgDashLocList = []

      this.layout.forEach((item) => {
        var obj = {}
        obj.coordXNo = item.x
        obj.coordYNo = item.y
        obj.width = item.w
        obj.height = item.h
        obj.dashLocNo = item.i
        obj.orgSeq = this.orgSeq

        if (this.dashboardItems['item' + item.i].view === true) {
          let key = 'item' + item.i
          obj.usrDashTmplSeq = this.dashboardItems[key].data.usrDashTmplSeq
        } else {
          obj.usrDashTmplSeq = null
        }
        paramObj.curOrgDashLocList.push(obj)
      })

      requestApi({
        url: '/online/com/usrDash/saveOrgDashboard',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
          } else {
            this.alert(this.$t('save-fail'))
          }
        }
      })
    },
    fnRemoveItem() {
      const context = this
      $('.form-check-input:checked').each(function (i, v) {
        let val = $(this).val()

        // 차트가 있을 경우 원복 처리
        if (context.dashboardItems['item' + val].view === true) {
          context.dashboardItems['item' + val].id = ''
          context.dashboardItems['item' + val].title = ''
          context.dashboardItems['item' + val].view = false
          context.dashboardItems['item' + val].data = {}
        }
        $(this).prop('checked', false)
      })
    },
    fnHandleLayoutUpdated() {}
  }
}
</script>

<style lang="less"></style>
