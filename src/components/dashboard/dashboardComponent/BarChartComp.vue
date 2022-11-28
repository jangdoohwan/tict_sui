<template>
  <div :id="id + locNo" style="width: 100%; height: 100%"></div>
</template>
<script>
// initMsg
// [{"TITLE":"HEADER","COLUMN_VALUE":"devClsCdNm"},{"TITLE":"CATEGORY","COLUMN_VALUE":"devAttbCdNm"},
// {"TITLE":"정상","COLUMN_VALUE":"ds00000007"},{"TITLE":"경미","COLUMN_VALUE":"ds00000006"},
// {"TITLE":"주의","COLUMN_VALUE":"ds00000005"}]
import echarts from 'echarts'
import envs from '@/envs'

export default {
  name: 'BarChartComp',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    componentData: {
      type: [Array, Object]
    }
  },
  data() {
    return {
      myChart: {},
      id: 'BarChartComp',
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} : {c}'
        },
        title: {
          text: ''
        },
        legend: {
          x: 'right',
          data: []
        },
        calculable: true,
        grid: {
          top: '14%',
          left: '10%',
          right: '10%',
          bottom: '12%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['category']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      }
    }
  },
  computed: {
    chartColorSet() {
      return envs.framework.chartColorSet
    }
  },
  watch: {
    componentData(componentData) {
      if (!componentData) {
        return
      }
      this.fnSetChartData()
    }
  },
  mounted() {
    this.fnInit()

    this.$nextTick(() => {
      this.fnCreateChart()
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fnHandleWindowResize)
  },
  methods: {
    fnInit() {
      let legend = []
      for (let index = 0; index < this.initMsgData.length; index++) {
        legend.push(this.initMsgData[index]['TITLE'])
      }
      this.options.legend.data = legend
    },
    fnCreateChart() {
      this.myChart = echarts.init(document.getElementById(this.id + this.locNo))
      this.myChart.setOption(this.options)
      window.addEventListener('resize', this.fnHandleWindowResize)

      if (this.componentData && Object.keys(this.componentData).length > 0) {
        this.fnSetChartData()
      }
    },
    fnSetChartData() {
      let series = []
      for (let index = 0; index < this.initMsgData.length; index++) {
        let color = this.chartColorSet[index % this.chartColorSet.length]
        if (
          this.initMsgData[index]['COLOR'] &&
          this.initMsgData[index]['COLOR'].length === 7
        ) {
          color = this.initMsgData[index]['COLOR']
        }

        let obj = {
          name: this.initMsgData[index]['TITLE'],
          type: 'bar',
          data: [
            parseInt(
              this.componentData[this.initMsgData[index]['COLUMN_VALUE']]
            )
          ],
          itemStyle: {
            color: color
          }
        }
        series.push(obj)
      }
      this.options.series = series

      if (this.myChart.setOption) {
        this.myChart.setOption(this.options, true)
        this.myChart.resize()
      }
    },
    fnHandleWindowResize() {
      this.myChart.resize()
    }
  }
}
</script>

<style lang="less" scoped></style>
