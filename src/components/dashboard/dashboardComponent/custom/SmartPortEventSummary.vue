<template>
  <div ref="wrap" class="flex justify-center items-center" style="height: 100%">
    <div class="flex flex-wrap justify-center " style="width: 100%;">
      <div v-for="(item, index) in initMsgData" :key="`summary-${index}`" class="sp-event-summary-unit">
        <div class="sp-event-summary-unit--cont">
          {{ componentData && componentData[0] && componentData[0][item.COLUMN_VALUE] ?
              componentData[0][item.COLUMN_VALUE] : 0
          }} 건
        </div>
        <div class="sp-event-summary-unit--label">{{ item.TITLE }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// 스마트항만 이벤트 요약
export default {
  name: 'SmartPortEventSummary',
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
.sp-event-summary-unit {
  border: 1px solid #d4dce4;
  margin-left: -1px;
  width: 25%;
}

.sp-event-summary-unit:first-child {
  border-left-width: 1px;
}

.sp-event-summary-unit--label {
  text-align: center;
  background: #e9eef3;
  padding: 5px 0;
  border-top: 1px solid #d4dce4;
  font-weight: bold;
}

.sp-event-summary-unit--cont {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
