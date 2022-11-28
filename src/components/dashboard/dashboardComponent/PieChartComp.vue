<template>
  <div :id="id + locNo" style="width: 100%; height: 100%"></div>
</template>
<script>
// initMsg Sample
//  [{"TITLE":"HEADER","COLUMN_VALUE":"devClsCdNm"},{"TITLE":"사용","COLUMN_VALUE":"act"},
//  "TITLE":"정지","COLUMN_VALUE":"sus"},{"TITLE":"해지","COLUMN_VALUE":"sus"}]
import echarts from 'echarts'
import envs from '@/envs'

export default {
  name: 'PieDatasetChart',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    componentData: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      myChart: {},
      id: 'pieDatasetChart',
      options: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left'
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '80%',
            center: ['55%', '60%'],
            data: []
          }
        ]
      },
      headerColumn: ''
    }
  },
  computed: {
    isListType() {
      return Array.isArray(this.componentData)
    },
    chartColorSet() {
      return envs.framework.chartColorSet
    }
  },
  watch: {
    componentData() {
      if (!this.componentData) {
        return
      }

      if (this.isListType) {
        this.fnSetChartListType()
      } else {
        this.fnSetChartObjectType()
      }
    }
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById(this.id + this.locNo))
    this.myChart.setOption(this.options)

    if (this.isListType) {
      if (this.componentData && this.componentData.length > 0) {
        this.fnSetChartListType()
      }
    } else {
      this.fnInitChartObjectType()
      if (this.componentData && Object.keys(this.componentData).length > 0) {
        this.fnSetChartObjectType()
      }
    }
    window.addEventListener('resize', this.fnHandleWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fnHandleWindowResize)
  },
  methods: {
    // -------------------- list type --------------------
    fnSetChartListType() {
      let data = []
      let legendData = []
      this.componentData.forEach((item, index) => {
        data.push({
          name: item[this.initMsgData[0].TITLE],
          value: item[this.initMsgData[0].COLUMN_VALUE]
        })
        legendData.push(item[this.initMsgData[0].TITLE])
      })
      this.options.series[0].data = data
      this.options.legend.data = legendData
      this.myChart.setOption(this.options, true)
    },
    // -------------------- object type --------------------
    fnInitChartObjectType() {
      let legendData = []
      for (let index = 0; index < this.initMsgData.length; ++index) {
        // TITLE 항목이 HEADER인 경우 속성으로 처리. 나머지는 레전드 구성
        if (this.initMsgData[index]['TITLE'] !== 'HEADER') {
          legendData.push(this.initMsgData[index]['TITLE'])
          const obj = { value: 1, name: this.initMsgData[index]['TITLE'] }
          this.options.series[0].data.push(obj)
        } else {
          this.headerColumn = this.initMsgData[index]['COLUMN_VALUE']
        }
      }
      this.options.legend.data = legendData
    },
    fnSetChartObjectType() {
      this.options.series[0].data = []

      this.initMsgData.forEach((data, index) => {
        if (data['COLUMN_VALUE'] !== this.headerColumn) {
          let color = this.chartColorSet[index % this.chartColorSet.length]
          if (data['COLOR'] && data['COLOR'].length === 7) {
            color = data['COLOR']
          }
          const obj = {
            name: data['TITLE'],
            value: parseInt(this.componentData[data['COLUMN_VALUE']]),
            itemStyle: {
              color: color
            }
          }
          this.options.series[0].data.push(obj)
        }
      })

      this.myChart.setOption(this.options, true)
      this.myChart.resize()
    },
    fnHandleWindowResize() {
      this.myChart.resize()
    }
  }
}
</script>

<style lang="less" scoped></style>
