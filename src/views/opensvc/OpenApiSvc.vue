<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('api-name')}}</span>
          <input
            v-model="apiNm"
            type="text"
            class="form-control"
            placeholder
            title="검색어 입력"
            @keyup.enter="fnSearch"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('url')}}</span>
          <input
            v-model="urlPath"
            type="text"
            class="form-control"
            placeholder
            title="검색어 입력"
            @keyup.enter="fnSearch"
          />
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
      <button type="button" class="btn btn-gray" @click="fnDeleteConfirm">
        {{ $t('delete') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="openApi"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="dataList"
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
import Jqgrid from '@/components/Jqgrid'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'OpenApiSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P15008',
      apiNm: '',
      urlPath: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      dataList: [],
      colNameData: [
        this.$t('api-name'),
        this.$t('url'),
        this.$t('method'),
        this.$t('useYn'),
        this.$t('regUser'),
        this.$t('regDttm')

      ],
      colModelData: [
        { name: 'apiNm', index: 'apiNm', align: 'center', width: '100' },
        { name: 'apiUrl', index: 'apiUrl', align: 'left', width: '200' },
        { name: 'apiMethod', index: 'apiMethod', align: 'center', width: '100' },
        { name: 'useYn', index: 'useYn', align: 'center', width: '100' },
        { name: 'regUsrId', index: 'regUsrId', align: 'center', width: '100' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: '200' }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      let reqData = {
        apiNm: this.apiNm,
        apiUrl: this.urlPath,
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/openApi/retrieveOpenApiList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataList = res.data.dataList
            this.totPage = res.data.page.totPage
          }
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnInitialize() {
      this.apiNm = ''
      this.urlPath = ''
    },
    fnShowAddPopup() {
      this.popup({
        component: () => import('@/views/opensvc/OpenApiAddSvc.vue'),
        title: this.$t('openApi-regi'),
        width: '800',
        height: '740',
        data: {},
        callback: obj => {
          this.fnGetList()
        }
      })
    },
    fnDeleteConfirm() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'))
        return
      }
       this.confirm(this.$t('openApi-delete-confirm'), this.fnDelete)
    },
    fnDelete() {
      let rowIdxs = this.$refs.grid.getSelectionIndexs()
      let openApiSeqList = []
      rowIdxs.forEach(idx => {
        let data = this.dataList[idx]
        openApiSeqList.push(data.openApiSeq)
      })
      let reqData = {
        openApiSeqList: openApiSeqList
      }
      requestApi({
        url: '/online/openApi/deleteOpenApiList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('del-success'), 'success')
            this.fnGetList()
          }
        }
      })
    },
    fnShowModifyPopup(id) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/opensvc/OpenApiModifySvc'),
        title: this.$t('openApi-mod'),
        width: '800',
        heigth: '740',
        data: {
          idx: data.openApiSeq
        },
        callback: obj => {
          this.fnGetList()
        }
      })
    }
  }
}
</script>

<style></style>
