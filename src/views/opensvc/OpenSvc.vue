<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('customer') }}</span>
          <select class="form-control" v-model="custSeq">
            <option value="">{{ $t('all') }}</option>
            <option
              v-for="item in custList"
              v-bind:Key="item.custSeq"
              :value="item.custSeq"
            >
              {{ item.custNm }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('open-svc-nm') }}</span>
          <input
            v-model="openSvcNm"
            type="text"
            class="form-control"
            @keyup.enter="fnGetList"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('useYn') }}</span>
          <select id="useYn" class="form-control" v-model="useYn">
            <option
              v-for="item in useOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
            >
              {{ item.otpName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <button class="btn btn-info" type="button" @click="fnSearch">
            {{ $t('search') }}
          </button>
          <button class="btn btn-info" type="button" @click="fnInitialize">
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="fnShowAddPopup">
        {{ $t('registration') }}
      </button>
      <button type="button" class="btn btn-gray" @click="fnDeleteconfirm">
        {{ $t('delete') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="OpenSvc"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="openSvcList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="fnShowModifyPopup"
      @getDataList="fnGetList"
    >
    </jqgrid>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'OpenSvc.vue',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P15002',
      openSvcNm: '',
      useYn: '',
      custSeq: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      openSvcList: [],
      colNameData: [
        this.$t('customer-name'),
        this.$t('open-svc-nm'),
        this.$t('en-ip'),
        this.$t('en-port'),
        this.$t('useYn'),
        this.$t('regUser'),
        this.$t('regDttm')
      ],
      colModelData: [
        { name: 'custNm', index: 'custNm', align: 'center' },
        { name: 'openSvcNm', index: 'openSvcNm', align: 'center' },
        { name: 'ip', index: 'ip', align: 'center' },
        { name: 'port', index: 'port', align: 'center' },
        { name: 'useYn', index: 'useYn', align: 'center' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center' },
        { name: 'regDttm', index: 'regDttm', align: 'center' }
      ],
      dataObject: {},
      useOpt: [
        { otpName: this.$t('all'), optVal: '' },
        { otpName: this.$t('use'), optVal: 'Y' },
        { otpName: this.$t('use-no'), optVal: 'N' }
      ],
      modifyFlag: false,
      deleteFlag: false,
      deleteAPI: '/online/iotusr/deleteIotUsr',
      retrieveAPI: '',
      updateUsrInfoAPI: '',
      custList: []
    }
  },
  created() {},
  mounted() {
    this.fnGetCustList()
    this.fnGetList()
  },
  methods: {
    // 고객사 목록 조회
    fnGetCustList() {
      requestApi({
        url: '/online/iotcust/retrieveIotCustSelect',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        callback: res => {
          this.custList = res.data
        }
      })
    },
    fnGetList() {
      let reqData = {
        custSeq: this.custSeq,
        openSvcNm: this.openSvcNm,
        useYn: this.useYn,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }

      requestApi({
        url: '/online/iotOpenSvc/retrieveOpenSvcList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          this.openSvcList = res.data.openSvcList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.custSeq = ''
      this.openSvcNm = ''
      this.useYn = ''
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/opensvc/AddOpenSvc'),
        title: this.$t('open-svc-add'),
        width: '750',
        callback: (data) => {
          this.fnGetList()
        }
      })
    },
    fnValidateSelectRow() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return false
      }
      return true
    },
    fnShowModifyPopup(index) {
      this.popup({
        component: () => import('@/views/opensvc/ModifyOpenSvc'),
        title: this.$t('open-svc-modify'),
        width: '750',
        data: {
          idx: this.openSvcList[index].openSvcSeq
        },
        callback: (data) => {
          this.fnGetList()
        }
      })
    },
    fnDeleteconfirm() {
      if (this.$refs.grid.getSelectionIndexs().length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return
      }
      this.confirm(this.$t('selected-delete'), this.fnDeleteOpenSvc)
    },
    fnDeleteOpenSvc() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      let openSvcSeqList = []

      rowIds.forEach(id => {
        openSvcSeqList.push(this.openSvcList[id])
      })

      let dataObj = {
        openSvcSeqList: openSvcSeqList
      }

      requestApi({
        url: '/online/iotOpenSvc/deleteOpenSvc',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: dataObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.fnGetList()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
