<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select
            id="selectedValue"
            class="form-control"
            v-model="selectedValue"
            @change="fnSearchValChk()"
          >
            <option
              v-for="item in searchOpt"
              v-bind:Key="item.optVal"
              :value="item.optVal"
              >{{ item.optName }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            v-model="retrieveValue"
            :disabled="selectedValue === ''"
            @keyup.enter="search()"
          />
        </div>
        <div class="form-group">
          <button
            class="btn btn-info input-group-addon"
            type="button"
            @click="search()"
          >
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitSchBoxList()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>
    <div class="text-left float-left pt-3 pl-2"></div>
    <div class="mb-2 text-right">
      <button
        type="button"
        class="btn btn-pink"
        data-toggle="modal"
        data-target="#modal-write"
        @click="addPopup()"
      >
        {{ $t('registration') }}
      </button>
      <button
        type="button"
        class="btn btn-gray"
        data-toggle="modal"
        data-target="#modal-write"
        @click="delPopup()"
      >
        {{ $t('delete') }}
      </button>
    </div>
    <jqgrid
      ref="grid"
      name="mdlMapMgmtSvc"
      :colModels="colModelList"
      :colNames="colNameList"
      :dataList="dataList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      @onCellSelect="modifyPopup"
      @getDataList="fnGetList"
    ></jqgrid>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import Cookies from 'js-cookie'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'MdlMapMgmtSvc',
  components: {
    Jqgrid
  },
  props: {},
  data() {
    return {
      dataList: [],
      colNameList: [
        this.$t('row-num'),
        this.$t('mdlmMtDevMdlNm'),
        this.$t('mdlMapMtMdl'),
        this.$t('mdlMapMtMdlType')
      ],
      colModelList: [
        { name: 'seq', index: 'seq', align: 'center', hidden: true },
        {
          name: 'devMdlNm',
          index: 'devMdlNm',
          align: 'center',
          width: '100px'
        },
        { name: 'mdlNm', index: 'mdlNm', align: 'left' },
        { name: 'mdlTypeNm', index: 'mdlTypeNm', align: 'left' }
      ],
      selectObj: {
        seq: '',
        devMdlSeq: '',
        devMdlNm: '',
        learPreMdlSeq: '',
        learPreMdlNm: '',
        mdlTypeNm: '',
        mdlType: ''
      },
      retrieveValue: '',
      selectedValue: '',
      searchOpt: [
        { optName: '?????? ??????', optVal: '' },
        { optName: '?????? ?????????', optVal: 'devMdlNm' },
        { optName: '??????/?????? ?????????', optVal: 'learPreMdlNm' }
      ],
      modifyFlag: false,
      currentPage: 1,
      displayRowCount: 15,
      totPage: null,
      pageNum: null,
      langSetArr: [],
      langSet: '',
      pageInfo: [],
      xMid: 'P11201'
    }
  },
  created() {
    this.selectedValue = ''
    this.devValue = ''
    this.retrieveValue = ''
    this.langSet = Cookies.get('LOCALE')
    this.search()
  },
  mounted() {},
  computed: {},
  methods: {
    fnOnlyOneChk(rowid) {
      this.fnInitChkValue()
      if ($('#ch' + rowid).prop('checked') === true) {
        $('#ch' + rowid).prop('checked', false)
      } else {
        // ??????????????? ???????????? ??????
        $('input[name="ch"]').prop('checked', false)
        $('#ch' + rowid).prop('checked', true)
      }
    },
    fnChkYN() {
      var res = 'N'
      var rowid = $('input[name="ch"]:checked').val()
      if (rowid !== undefined) {
        res = 'Y'
      }
      return res
    },
    fnInitChkValue() {
      this.selectObj = {
        seq: '',
        devMdlSeq: '',
        devMdlNm: '',
        learPreMdlSeq: '',
        learPreMdlNm: '',
        mdlTypeNm: '',
        mdlType: ''
      }
    },
    fnGetChkValue() {
      var rowid = $('input[name="ch"]:checked').val()
      var dataObj = this.dataList[rowid - 1]

      this.selectObj.seq = dataObj.seq
      this.selectObj.devMdlSeq = dataObj.devMdlSeq
      this.selectObj.devMdlNm = dataObj.devMdlNm
      this.selectObj.learPreMdlSeq = dataObj.learPreMdlSeq
      this.selectObj.learPreMdlNm = dataObj.learPreMdlNm
      this.selectObj.mdlTypeNm = dataObj.mdlTypeNm
      this.selectObj.mdlType = dataObj.mdlType
    },
    fnSearchValChk() {
      if (this.selectedValue === '') {
        this.retrieveValue = ''
      }
    },
    fnInitSchBoxList() {
      this.currentPage = 1
      this.usingStatus = ''
      this.selectedValue = ''
      this.retrieveValue = ''
    },
    search() {
      this.currentPage = 1
      this.fnGetList()
    },
    fnGetList() {
      var reqData = {}

      reqData.currentPage = this.currentPage
      reqData.displayRowCount = this.displayRowCount
      reqData.searchCon = this.selectedValue
      reqData.searchVal = this.retrieveValue
      reqData.langSet = this.langSet

      requestApi({
        url: '/online/bscpmodelmap/getModelMapInfoList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.pageNum = res.data.page.page
          this.totPage = res.data.page.totPage
          this.pageInfo = res.data.page
          this.dataList = res.data.dataList
        }
      })
    },
    addPopup: _.throttle(
      function() {
        this.fnInitChkValue()
        this.confirmAddPopup()
      },
      1000,
      { trailing: false }
    ),
    modifyPopup: _.throttle(
      function(id, index, contents, event) {
        let object = this.dataList[id]
        if (object.mlTypeCd === 'LRN') {
          this.selectObj.mdlType = 'learn'
        }
        if (object.mlTypeCd === 'PRD') {
          this.selectObj.mdlType = 'pred'
        }
        this.selectObj.mdlTypeNm = object.mdlTypeNm
        this.selectObj.devMdlSeq = object.devMdlSeq
        this.selectObj.devMdlNm = object.devMdlNm
        this.selectObj.learPreMdlSeq = object.mdlSeq
        this.selectObj.learPreMdlNm = object.mdlNm
        this.selectObj.seq = '1' // ??????/??????(''/1) ?????????
        this.selectObj.rawMap = object.rawMap
        this.selectObj.mlApiTableType = object.mlApiTableType
        this.selectObj.mlDelayTypeCd = object.mlDelayTypeCd
        this.confirmAddPopup()
      },
      1000,
      { trailing: false }
    ),
    delPopup: _.throttle(
      function() {
        let rowIds = this.$refs.grid.getSelectionIndexs()
        if (rowIds.length === 0) {
          this.alert(this.$t('lead-check-role'), 'warning')
          return false
        }
        this.confirm(this.$t('delYn'), this.confirmDeleteAPI)
      },
      1000,
      { trailing: false }
    ),
    confirmDeleteAPI() {
      var reqData = {}
      reqData.seqList = []

      let rowIds = this.$refs.grid.getSelectionIndexs()
      rowIds.forEach(row => {
        reqData.seqList.push({
          devMdlSeq: this.dataList[row].devMdlSeq,
          mdlSeq: this.dataList[row].mdlSeq
        })
      })

      requestApi({
        url: '/online/bscpmodelmap/deleteDevModelAttbMapInfo',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          // ??????????????? ????????????
          this.alert(this.$t('del-success'), 'success')
          this.fnGetList()
        }
      })
    },
    confirmAddPopup() {
      this.popup({
        component: () => import('@/views/smart/MdlColMapMgmtAddSvc'),
        title: this.$t('mdlColMapAddSrv'),
        width: '1200',
        height: '870',
        data: {
          obj: this.selectObj
        },
        callback: data => {
          if (data !== 'dismiss') {
            this.fnGetList()
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
