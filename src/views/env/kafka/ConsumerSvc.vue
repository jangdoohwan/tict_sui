<template>
  <div>
    <!-- button -->
    <div class="mb-2 text-right">
      <button type="button" class="btn btn-pink" @click="fnGetList">
        {{ $t('re-search') }}
      </button>
    </div>
    <!-- grid -->
    <jqgrid
      ref="grid"
      name="consumerSvc"
      :colModels="colModelData"
      :colNames="colNameData"
      :dataList="dataList"
      :usePage="false"
      :multiselect="false"
      @onCellSelect="fnShowDetailPopup"
    ></jqgrid>
  </div>
</template>

<script>
import Jqgrid from '@/components/Jqgrid'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'ConsumerSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P10501',
      dataList: [],
      colNameData: ['컨슈머 그룹', '상태', 'Lag'],
      colModelData: [
        { name: 'groupId', index: 'groupId', align: 'center', width: '200' },
        { name: 'state', index: 'state', align: 'center', width: '200' },
        { name: 'lag', index: 'lag', align: 'center', width: '200' }
      ]
    }
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      requestApi({
        url: '/online/kafka/retrieveConsumerList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        callback: (res) => {
          if (res.result.status === '200') {
            res.data.forEach((row) => {
              row.state = row.state === 'Stable' ? '활성' : '비활성'
            })
            this.dataList = res.data
          }
        }
      })
    },
    fnShowDetailPopup(id) {
      let data = this.dataList[id]
      this.popup({
        component: () => import('@/views/env/kafka/ConsumerDetailSvc.vue'),
        title: '컨슈머 상세',
        width: '1000',
        height: '700',
        data: {
          groupId: data.groupId
        },
        callback: () => {}
      })
    }
  }
}
</script>

<style></style>
