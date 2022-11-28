<template>
  <div>
    <div class="modal-body">
      <div class="form-row">
        <div class="form-item col-sm-4">
          <span class="form-label w-30">컨슈머 그룹 ID</span>
          <div class="">{{ data.groupId }}</div>
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-16">상태</span>
          <div class="">{{ state }}</div>
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-16">Lag</span>
          <div class="">{{ consumerData.lag }}</div>
        </div>
      </div>

      <!-- tab -->
      <ul class="tab mt-3">
        <li :class="{ active: tab.active === 0 }" @click="fnSetActive(0)">
          멤버
        </li>
        <li :class="{ active: tab.active === 1 }" @click="fnSetActive(1)">
          토픽
        </li>
      </ul>

      <!-- tab-content -->
      <!-- 멤버 -->
      <div v-if="tab.active === 0">
        <div
          v-for="(member, index) in consumerData.memberList"
          :key="`member-${index}`"
          class="boxs left mt-3"
        >
          <div class="form-row">
            <div class="form-item">
              <span class="form-label">Client ID</span>
              <div>{{ member.clientId }}</div>
            </div>
            <div class="form-item">
              <span class="form-label">Host</span>
              <div>{{ member.host }}</div>
            </div>
            <div class="form-item">
              <span class="form-label">Consumer ID</span>
              <div>{{ member.consumerId }}</div>
            </div>
          </div>
          <div class="form-item flex-col" style="items-align: start">
            <span class="form-label">파티션</span>
            <div class="table-wrap mt-3 overflow_x_auto" style="width: 100%">
              <table class="table table-col" style="min-width: 500px">
                <colgroup>
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">토픽</th>
                    <th scope="col">index</th>
                    <th scope="col">Lag</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="partition in member.partitionList"
                    :key="`member-${index}-${partition.index}`"
                  >
                    <td>{{ partition.topic }}</td>
                    <td>{{ partition.index }}</td>
                    <td>{{ partition.lag }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          v-if="consumerData.memberList.length === 0"
          class="boxs w-full"
          style="padding: 1rem"
        >
          멤버가 없습니다.
        </div>
      </div>

      <!-- 토픽 -->
      <div v-if="tab.active === 1">
        <div
          v-for="(topic, index) in consumerData.topicList"
          :key="`topic-${index}`"
          class="boxs left mt-3"
        >
          <div class="form-item">
            <span class="form-label">토픽</span>
            <div>{{ topic.name }}</div>
          </div>
          <div class="form-item flex-col" style="items-align: start">
            <span class="form-label">파티션</span>
            <div class="table-wrap mt-3 overflow_x_auto" style="width: 100%">
              <table class="table table-col" style="min-width: 800px">
                <colgroup>
                  <col width="60" />
                  <col width="90" />
                  <col width="90" />
                  <col width="90" />
                  <col width="105" />
                  <col width="105" />
                  <col width="*" />
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Index</th>
                    <th scope="col">Producer<br />offset</th>
                    <th scope="col">Consumer<br />offset</th>
                    <th scope="col">Lag</th>
                    <th scope="col">Client ID</th>
                    <th scope="col">Host</th>
                    <th scope="col">Consumer ID</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="partition in topic.partitionList"
                    :key="`topic-${index}-${partition.index}`"
                  >
                    <td>{{ partition.index }}</td>
                    <td>{{ partition.producerOffset }}</td>
                    <td>{{ partition.consumerOffset }}</td>
                    <td>{{ partition.lag }}</td>
                    <td>{{ partition.member.clientId }}</td>
                    <td>{{ partition.member.host }}</td>
                    <td>{{ partition.member.consumerId }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div
          v-if="consumerData.topicList.length === 0"
          class="boxs w-full"
          style="padding: 1rem"
        >
          토픽이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: '',
  props: {
    data: Object
  },
  data() {
    return {
      xMid: 'P10502',
      tab: {
        active: 0
      },
      consumerData: {
        memberList: [],
        topicList: []
      }
    }
  },
  computed: {
    state() {
      return this.consumerData.state === 'Stable' ? '활성' : '비활성'
    }
  },
  mounted() {
    this.fnGetConsumerDetail()
  },
  methods: {
    fnGetConsumerDetail() {
      requestApi({
        url: '/online/kafka/retrieveConsumerDetail',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {
          groupId: this.data.groupId
        },
        callback: (res) => {
          if (res.result.status === '200') {
            this.consumerData = res.data
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

<style></style>
