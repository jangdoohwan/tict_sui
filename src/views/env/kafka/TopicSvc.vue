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
      name="topicSvc"
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
  name: 'TopicSvc',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P10503',
      dataList: [],
      colNameData: ['토픽명', '상태', 'Partitions', 'Replication'],
      colModelData: [
        { name: 'name', index: 'name', align: 'center', width: '200' },
        { name: 'state', index: 'state', align: 'center', width: '200' },
        {
          name: 'partitionCnt',
          index: 'partitionCnt',
          align: 'center',
          width: '200'
        },
        {
          name: 'replicationCnt',
          index: 'replicationCnt',
          align: 'center',
          width: '200'
        }
      ]
    }
  },
  mounted() {
    this.fnGetList()
  },
  methods: {
    fnGetList() {
      requestApi({
        url: '/online/kafka/retrieveTopicList',
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
        component: () => import('@/views/env/kafka/TopicDetailSvc.vue'),
        title: '토픽 상세',
        width: '700',
        height: '700',
        data: {
          topic: data.name
        },
        callback: () => {}
      })
    }
  }
}
</script>
