<template>
  <div>
    <div class="modal-body">
      <div class="search-box">
        <div class="left form-inline">
          <div class="form-group">
            <span class="form-label mx-1">{{ $t('api-nm') }}</span>
            <input v-model="apiNm" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <span class="form-label mx-1">{{ $t('url') }}</span>
            <input v-model="url" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <button class="btn btn-info" type="button" @click="fnSearch">
              {{ $t('search') }}
            </button>
          </div>
        </div>
      </div>
      <div>
        <jqgrid
          ref="grid"
          name="OpenSvcApi"
          :colModels="colModelData"
          :colNames="colNameData"
          :dataList="openApiList"
          :width="500"
          :totalPage.sync="totPage"
          :currentPage.sync="currentPage"
          :rowNum.sync="displayRowCount"
          @getDataList="fnGetList">
        </jqgrid>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button class="btn btn-pink" @click="fnApiSelect">
          {{ $t('select') }}
        </button>
        <button class="btn btn-gray" @click="close">{{ $t('cancel') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'AddOpenSvcApi.vue',
  components: { Jqgrid },
  props: {
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P15011',
      apiNm: '',
      useYn: 'Y',
      url: '',
      currentPage: 1,
      displayRowCount: 15,
      totPage: 0,
      openApiList: [],
      colNameData: [
        this.$t('api-nm'),
        this.$t('url'),
        this.$t('methodKo'),
        this.$t('useYn')
      ],
      colModelData: [
        { name: 'apiNm', index: 'apiNm', align: 'center', width: '30' },
        { name: 'apiUrl', index: 'apiUrl', align: 'center', width: '30' },
        { name: 'apiMethod', index: 'apiMethod', align: 'center', width: '30' },
        { name: 'useYn', index: 'useYn', align: 'center', width: '30' }
      ]
    }
  },
  created() {},
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      let reqData = {
        apiNm: this.apiNm,
        apiUrl: this.url,
        useYn: this.useYn,
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
        callback: (res) => {
          this.openApiList = res.data.dataList
          this.totPage = res.data.page.totPage
          this.currentPage = res.data.page.page
        }
      })
    },
    fnSearch() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnApiSelect() {
      let rowIds = this.$refs.grid.getSelectionIndexs()
      if (rowIds.length === 0) {
        this.alert(this.$t('no-selected-row'), 'warning')
        return
      }
      let selectApiList = []
      rowIds.forEach((id) => {
        selectApiList.push(this.openApiList[id])
      })
      this.callback(selectApiList)
      this.close()
    }
  }
}
</script>

<style lang="less" scoped></style>
