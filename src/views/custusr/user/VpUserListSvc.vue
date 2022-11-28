<template>
  <div>
    <div class="modal-body">
      <div class="form-inline">
        <div class="inline">
          <span class="form-control-static">{{$t('usrLoginId')}}</span>
          <input type="text" class="form-control" placeholder="" title="검색어 입력" v-model="usrLoginId" @keyup.enter="fnGetList()">
          <span class="form-control-static">{{$t('usrNm')}}</span>
          <input type="text" class="form-control" placeholder="" title="검색어 입력" v-model="usrNm" @keyup.enter="fnGetList()">
          <button class="btn btn-info" type="button" @click="fnSearch">{{$t('search')}}</button>
          <button class="btn btn-info" type="button" @click="fnInitializing()">{{$t('initializing')}}</button>
        </div>
      </div>
      <div class="grid-container wide grid-scroll full-size">
        <div class="table-wrap y-scroll">
          <table class="table table-col">
            <caption>{{$t('cmCdSearchSrv')}}</caption>
            <colgroup>
              <col style="width:auto">
              <col style="width:auto">
              <col style="width:auto">
              <col style="width:80px">
            </colgroup>
            <thead>
              <tr>
                <th v-for=" text in colNameData " v-bind:key="text" scope="col">{{text}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for=" item in dataList" v-bind:key="item.cdId">
                <td class="text-left">{{item.serverNm}}</td>
                <td class="text-left">{{item.usrLoginId}}</td>
                <td class="text-left">{{item.usrNm}}</td>
                <td><button @click="submit(item)" type="button" class="btn btn-info rounded btn-xs">{{$t('setting')}}</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <pagination
          :currentPage.sync="pageInfo.currentPage"
          :rowCount.sync="pageInfo.rowCount"
          :totalPage="pageInfo.totalPage"
          :onPaging="pageInfo.callback"
          :rowCountArray="pageInfo.rowCountArray"
          ref="page"
        ></pagination>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="close()" type="button" class="btn btn-gray" data-dismiss="modal">{{$t('close')}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Pagination from '@/components/Pagination'

export default {
  name: 'progSearchSrv',
  components: {
    Pagination
  },
  props: {
    data: Object,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      colNameData: [this.$t('servMtServNm'), this.$t('id'), this.$t('name'), ''],
      dataList: [],
      usrLoginId: '',
      usrNm: '',
      pageInfo: {
        currentPage: 1,
        totalPage: 1,
        rowCount: 5,
        rowCountArray: [5, 10, 15],
        callback: this.fnGetList
      },
      serverCd: null,
      xMid: 'P08104'
    }
  },
  created () {
    this.serverCd = this.data.serverCd
    this.xMid = this.data.xMid
    this.fnGetList()
  },
  mounted () {},
  methods: {
    fnGetList() {
      var paramObj = {
        usrLoginId: this.usrLoginId,
        usrNm: this.usrNm,
        serverCd: this.serverCd,
        currentPage: this.pageInfo.currentPage,
        displayRowCount: this.pageInfo.rowCount,
        useYn: 'Y'
      }
      requestApi({
        url: '/online/vpuser/getIotVpUserList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.dataList = res.data.dataList
            this.pageInfo.totalPage = res.data.page.totPage
          }
        }
      })
    },
    fnInitializing() {
      this.usrLoginId = ''
      this.usrNm = ''
    },
    fnSearch() {
      this.pageInfo.currentPage = 1
      this.fnGetList()
    },
    submit (obj) {
      if (!obj.usrNm) {
        obj.usrNm = 'Noname'
      }
      obj.showName = obj.usrNm + '(' + obj.usrLoginId + ')'
      this.callback(obj)
      this.close()
    }
  }
}
</script>

<style lang="less">

</style>
