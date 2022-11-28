<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-16">토픽명</span>
          <div class="">{{ data.topic }}</div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-16">상태</span>
          <div class="">
            {{ state }}
          </div>
        </div>
      </div>
      <!-- tab -->
      <ul class="tab mt-3">
        <li :class="{ active: tab.active === 0 }" @click="fnSetActive(0)">
          컨슈머
        </li>
        <li :class="{ active: tab.active === 1 }" @click="fnSetActive(1)">
          파티션
        </li>
        <li :class="{ active: tab.active === 2 }" @click="fnSetActive(2)">
          설정
        </li>
      </ul>
      <!-- tab-content -->
      <div v-if="tab.active === 0" class="table-wrap" style="margin-top: 10px">
        <!-- 컨슈머 -->
        <table class="table table-col">
          <caption>
            topic comsumerList
          </caption>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">컨슈머 그룹</th>
              <th scope="col">상태</th>
              <th scope="col">Lag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in topicData.consumerGroupList" :key="`consumer-${index}`">
              <td>{{ row.groupId }}</td>
              <td>{{ row.state }}</td>
              <td>{{ row.lag }}</td>
            </tr>
            <tr v-if="topicData.consumerGroupList.length === 0">
              <td colspan="3" class="text-center">컨슈머가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="tab.active === 1" class="table-wrap" style="margin-top: 10px">
        <table class="table table-col">
          <caption>
            topic partitions
          </caption>
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">파티션 ID</th>
              <th scope="col">Low offset</th>
              <th scope="col">Hight offset</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in topicData.partitionList" :key="`partition-${index}`">
              <td>{{ row.index }}</td>
              <td>{{ row.messageLowOffset }}</td>
              <td>{{ row.messageHighOffset }}</td>
            </tr>
            <tr v-if="topicData.partitionList.length === 0">
              <td colspan="3" class="text-center">파티션이 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="tab.active === 2" class="table-wrap" style="margin-top: 10px">
        <table class="table table-col">
          <caption>
            topic configuration
          </caption>
          <colgroup>
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">설정</th>
              <th scope="col">값</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="configKey in Object.keys(topicData.config)" :key="`config-${configKey}`">
              <td class="text-left">{{ configKey }}</td>
              <td class="text-left">{{ topicData.config[configKey] }}</td>
            </tr>
            <tr v-if="Object.keys(topicData.config).length === 0">
              <td colspan="2" class="text-center">데이터가 없습니다.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'TopicDetailSvc',
  components: {},
  props: {
    data: Object
  },
  data() {
    return {
      xMid: 'P10504',
      tab: {
        active: 0
      },
      topicData: {
        partitionList: [],
        config: {},
        consumerGroupList: []
      }
    }
  },
  computed: {
    state() {
      return this.topicData.state === 'Stable' ? '활성' : '비활성'
    }
  },
  mounted() {
    this.fnGetTopicDetail()
  },
  methods: {
    fnGetTopicDetail() {
      requestApi({
        url: '/online/kafka/retrieveTopicDetail',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {
          topicId: this.data.topic
        },
        callback: (res) => {
          if (res.result.status === '200') {
            this.topicData = res.data
            // 비활성인 경우 값이 없으므로 초기화
            if (!this.topicData.consumerGroupList) {
              this.topicData.consumerGroupList = []
            }
            if (!this.topicData.partitionList) {
              this.topicData.partitionList = []
            }
            if (!this.topicData.config) {
              this.topicData.config = {}
            }
          }
        }
      })
    },
    // tab
    fnSetActive(active) {
      this.tab.active = active
    }
  }
}
</script>

<style>
</style>
