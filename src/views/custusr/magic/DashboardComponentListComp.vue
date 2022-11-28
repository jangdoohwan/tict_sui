<template>
  <div class="drawer-left-wrap">
    <div class="drawer-header">
      <h4 class="titH4">{{ $t('component-choose') }}</h4>
    </div>
    <div class="drawer-search-box">
      <div class="form-item">
        <span class="form-label w-16">{{ $t('service') }}</span>
        <select
          v-model="form.svcCd"
          class="form-control"
          @change="fnGetDevClsList"
        >
          <option value="">{{ $t('all') }}</option>
          <option
            v-for="(svc, index) in view.svcCdList"
            :key="`svcCd-${index}`"
            :value="svc.svcCd"
          >
            {{ svc.svcCdNm }}
          </option>
        </select>
      </div>
      <div class="form-item">
        <span class="form-label w-16">{{ $t('dev-cls-nm') }}</span>
        <select
          v-model="form.devClsCd"
          class="form-control"
          @change="fnGetComponentList"
        >
          <option value="">{{ $t('all') }}</option>
          <option
            v-for="(devCls, index) in view.devClsList"
            :key="`devCls-${index}`"
            :value="devCls.devClsCd"
          >
            {{ devCls.devClsNm }}
          </option>
        </select>
      </div>
    </div>
    <div class="drawer-content">
      <div
        v-for="(comp, index) in componentList"
        :key="`comp-${index}`"
        class="dashbaord-drawer-item draggable-chart"
        :data-component="JSON.stringify(comp)"
      >
        <div class="dashbaord-drawer-item-box">
          <div class="text-center">
            <img :src="comp.tmplRuleImg" style="height: 125px" />
          </div>
          <div class="mt-2 width-100 text-center">
            {{ comp.dashTmplTitle }}
          </div>
        </div>
      </div>
      <div v-if="componentList.length === 0" class="dashbaord-drawer-item">
        <div class="dashbaord-drawer-item-box text-center">
          데이터가 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'DashboardComponentListComp',
  props: {
    xMid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        svcCd: '',
        devClsCd: ''
      },
      view: {
        svcCdList: [],
        devClsList: []
      },
      componentList: []
    }
  },
  mounted() {
    this.fnGetSvcCdList()
    this.fnGetComponentList()
  },
  methods: {
    // 서비스 조회
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then((data) => {
          this.view.svcCdList = data
        })
        .catch((e) => {
          console.error(e)
        })
    },
    // 장비유형 조회
    fnGetDevClsList() {
      this.view.devClsList = []
      this.form.devClsCd = ''
      this.fnGetComponentList()

      if (this.form.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({
        xMid: this.xMid,
        svcCd: this.form.svcCd
      })
        .then((data) => {
          this.view.devClsList = data.devClsList
        })
        .catch((e) => {
          console.error(e)
        })
    },
    // 컴포넌트 목록 조회
    fnGetComponentList() {
      // 별도의 API 없어 페이징을 많이 잡음
      let params = {
        currentPage: 1,
        displayRowCount: 9999,
        svcCd: this.form.svcCd,
        devClsCd: this.form.devClsCd
      }
      requestApi({
        url: '/online/com/usrDash/retreiveDashCompList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: params,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.componentList = res.data.dataList
            this.$nextTick(() => {
              this.fnSetDrag()
            })
          }
        }
      })
    },
    // 드래그 이벤트 세팅
    fnSetDrag() {
      $('.draggable-chart').draggable({
        helper: function () {
          let html = $(this).html()
          return $('<div>').html(html).css('z-index', 999)
        },
        connectToSortable: '.vue-grid-item'
      })
    }
  }
}
</script>
