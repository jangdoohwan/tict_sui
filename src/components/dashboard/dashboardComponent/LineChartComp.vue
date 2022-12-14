<template>
  <div
    :id="dynamicLineChart + locNo"
    style="width: 100%; height: calc(100% - 5px)"
  ></div>
</template>
<script>
// initMsg example
// [{\"TITLE\":\"배터리잔량_수집항목\",\"X_AXIS\":\"colDate\",\"TAG_VALUE\":\"ATTB_VL06\"}]
import echarts from 'echarts'
import moment from 'moment'
import _ from 'lodash'
import envs from '@/envs'

export default {
  name: 'LineChartComp',
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
      dynamicLineChart: 'dynamicLineChart',
      initialData: {
        name: '',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        markPoint: {
          data: [
            { type: 'max', name: 'max' },
            { type: 'min', name: 'min' }
          ]
        },
        data: []
      },
      options: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let text = ''
            params.forEach((param) => {
              text += param.seriesName + ': ' + param.value[1] + '<br/>'
            })
            return text
          },
          axisPointer: {
            animation: false
          }
        },
        grid: {
          top: '14%',
          left: '10%',
          right: '10%',
          bottom: '12%'
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: function (value, index) {
              var date = new Date(value)

              return moment(date).format('HH:mm').toString()
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '20%'],
          splitLine: {
            show: true
          }
        },
        series: []
      },
      chartData: [],
      now: null,
      oneDay: null,
      value: null,
      myChart: null
    }
  },
  computed: {
    chartColorSet() {
      return envs.framework.chartColorSet
    }
  },
  watch: {
    componentData() {
      this.fnClearData()
      this.fnSetChart()
    }
  },
  created() {},
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
      // initial data
      const legendData = []

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
      this.myChart = echarts.init(
        document.getElementById(this.dynamicLineChart + this.locNo)
      )
      this.myChart.setOption(this.options)
      window.addEventListener('resize', this.fnHandleWindowResize)

      if (this.componentData && this.componentData.length > 0) {
        this.fnSetChart()
      }
    },
    fnClearData() {
      this.options.series.forEach((item) => {
        item.data = []
      })
    },
    fnSetChart() {
      this.componentData.forEach((item) => {
        // series 배열에 모두 삽입해야 한다.
        this.initMsgData.forEach((data, index) => {
          let yAxis = data['TAG_VALUE'] || data['Y_AXIS']
          let value = 0
          if (item[yAxis]) {
            value = item[yAxis]
          } else if (parseFloat(yAxis)) {
            value = yAxis
          }
          const obj = {
            name: '',
            value: [item[data['X_AXIS']], parseFloat(value).toFixed(3)]
          }

          this.options.series[index].data.push(obj)
        })
      })

      // 현재 시간 기준으로 한시간 이전 데이터는 삭제한다.
      this.options.series.forEach((item) => {
        const newData = item.data.filter(
          (obj) => moment(obj.value[0]) > moment().subtract(1, 'hour')
        )
        // 중복 데이터 제거, 날짜 순으로 소팅
        item.data = _.uniqBy(newData, (data) => data.value[0]).sort((a, b) => {
          if (a.value[0] > b.value[0]) {
            return 1
          } else if (a.value[0] < b.value[0]) {
            return -1
          } else {
            return 0
          }
        })
      })

      this.myChart.setOption(this.options, true)
    },
    fnHandleWindowResize() {
      this.myChart.resize()
    }
  }
}
</script>

<style lang="less" scoped></style>
