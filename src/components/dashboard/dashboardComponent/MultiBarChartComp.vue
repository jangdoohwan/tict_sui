<template>
  <div :id="id + locNo" style="width: 100%; height: calc(100% - 5px)"></div>
</template>

<script>
// initMsgData
// [{ "TITLE": "ATTB_VL13", "X_AXIS": "colDate", "Y_AXIS": "ATTB_VL13", "COLOR": "#003f5c" },
// { "TITLE": "ATTB_VL14", "X_AXIS": "colDate", "Y_AXIS": "ATTB_VL14", "COLOR": "#58508d" }]
import echarts from 'echarts'
import envs from '@/envs'
import moment from 'moment'

export default {
  name: 'MultiBarChartComp',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    componentData: {
      type: [Array, Object]
    },
    optionData: {
      type: Object
    }
  },
  data() {
    return {
      chart: {},
      initialData: {
        name: '',
        type: 'bar',
        data: []
      },
      id: 'MultiBarChartComp',
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
          left: '13%',
          right: '10%',
          bottom: '12%'
        },
        xAxis: {
          type: 'category',
          axisTick: { show: false },
          data: []
        },
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
      this.fnClearData()
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
      console.log(this.optionData)
      let legendData = []
      for (let index = 0; index < this.initMsgData.length; index++) {
        // legendData
        legendData.push(this.initMsgData[index]['TITLE'])
        // series
        let color = this.chartColorSet[index % this.chartColorSet.length]
        if (
          this.initMsgData[index]['COLOR'] &&
          this.initMsgData[index]['COLOR'].length === 7
        ) {
          color = this.initMsgData[index]['COLOR']
        }
        this.options.series.push({
          ...this.initialData,
          ...{ data: [] },
          ...{
            name: this.initMsgData[index]['TITLE'],
            itemStyle: {
              color: color
            }
          }
        })
      }
      this.options.legend = {
        data: legendData
      }
    },
    fnCreateChart() {
      this.myChart = echarts.init(document.getElementById(this.id + this.locNo))
      this.myChart.setOption(this.options)
      window.addEventListener('resize', this.fnHandleWindowResize)

      if (this.componentData && Object.keys(this.componentData).length > 0) {
        this.fnSetChartData()
      }
    },
    fnClearData() {
      this.options.series.forEach((item) => {
        item.data = []
      })
    },
    fnSetChartData() {
      const xAxisData = []
      // 데이터 조회 시 colDate 역순으로 조회 되므로 reverse 해줌
      const componentData = JSON.parse(
        JSON.stringify(this.componentData)
      ).reverse()
      componentData.forEach((item) => {
        this.initMsgData.forEach((data, index) => {
          // y축 데이터 세팅
          let yAxis = data['TAG_VALUE'] || data['Y_AXIS']
          let value = 0
          if (item[yAxis]) {
            value = item[yAxis]
          } else if (parseFloat(yAxis)) {
            value = yAxis
          }
          if (this.optionData.NUM_FORMAT && this.optionData.NUM_FORMAT === 'INT') {
            value = parseInt(value)
          } else {
            value = parseFloat(value).toFixed(3)
          }

          this.options.series[index].data.push(value)
        })

        // x축 데이터 세팅
        const xAxis = item[this.initMsgData[0]['X_AXIS']]
        xAxisData.push(
          moment(xAxis)._isValid
            ? moment(xAxis).format(this.optionData['FORMAT'] || 'HH:mm')
            : xAxis
        )
      })
      this.options.xAxis.data = xAxisData
      this.myChart.setOption(this.options, true)
    },
    fnHandleWindowResize() {
      this.myChart.resize()
    }
  }
}
</script>
