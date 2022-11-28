<template>
  <div ref="wrap" class="table-wrap">
    <div class="flex justify-center h-28">
      <div v-for="(item, index) in initSummaryData" :key="`summary-${index}`" class="sp-summary-unit">
        <div class="sp-summary-unit--label">{{ item.TITLE }}</div>
        <div class="sp-summary-unit--cont">
          <div v-if="componentData">{{ componentData[0][item.COLUMN_VALUE] }}건</div>
        </div>
      </div>
    </div>
    <table class="table table-col mt-3" style="min-width: auto;">
      <colgroup>
        <col v-for="(item, idx) in initMsgData" :key="idx" :style="{ width: item.WIDTH + 'px' }">
      </colgroup>
      <thead>
        <tr>
          <th scope="col" v-for="(item, idx) in initMsgData" :key="idx">{{ item.TITLE }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in componentData" :key="idx">
          <td class="text-center" v-for="(object, index) in initMsgData" :key="index">{{ row[object.COLUMN_VALUE] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// 스마트항만 안전현황
export default {
  name: 'SmartPortSummary',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    componentData: {
      type: Array
    }
  },
  data() {
    return {
      initSummaryData: [{ 'TITLE': '어제', 'COLUMN_VALUE': 'yesterdayCount', 'WIDTH': '150' },
      { 'TITLE': '금일 위험 알림', 'COLUMN_VALUE': 'todayCount', 'WIDTH': '150' },
      { 'TITLE': '이번 달', 'COLUMN_VALUE': 'monthCount', 'WIDTH': '150' }]
    }
  },
  mounted() {
    // 높이 지정
    this.$refs.wrap.parentElement.style.overflow = 'auto'
  },
  methods: {
  }
}
</script>

<style scoped>
.sp-summary-unit {
  min-width: 100px;
  border: 1px solid #d4dce4;
  border-right: 0;
}

.sp-summary-unit:last-child {
  border-right: 1px solid #d4dce4;
}

.sp-summary-unit--label {
  text-align: center;
  background: #e9eef3;
  padding: 5px 0;
  border-bottom: 1px solid #d4dce4;
  font-weight: bold;
}

.sp-summary-unit--cont {
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
