<template>
  <div ref="wrap" class="table-wrap">
    <div>
      <div v-if="item.ATTB_VL14" class="image-wrap">
        <div class="image-box">
          <img :src="item.ATTB_VL14" style="max-width: 100%;"/>
        </div>
      </div>
      <table class="table table-col rowTableChart">
        <tbody>
          <tr v-for="(row, index) in initMsgData" :key="`row-${index}`">
            <td v-for="(value, key) in row" :key="`row-${index}-col-${key}`">
              <template v-if="key === 'TITLE'">{{ value }}</template>
              <template v-else>{{ item[value]}}</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </template>

  <script>
  // 생산라인 이상감지 최신 수집 이벤트
  export default {
    name: 'ProductionLineColEvent',
    props: {
      locNo: {
        type: String
      },
      initMsgData: {
        type: Array
      },
      componentData: {
        type: Object
      }
    },
    data() {
    return {
      imageFilePath: ''
    }
  },
  computed: {
    item() {
      return this.componentData || {}
    }
  },
  mounted() {
    // 높이 지정
    this.$refs.wrap.parentElement.style.overflow = 'auto'
  },
  methods: {}
}
</script>

<style scoped>
  .rowTableChart tr td:first-child {
    background-color: #e9eef3;
    font-weight: bold;
  }
  .image-wrap {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .image-box {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
  }
</style>
