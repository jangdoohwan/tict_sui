<template>
  <div>
    <div class="search-box">
      <div class="left form-inline">
        <div class="form-group">
          <select v-model="orgSeq" class="form-control">
            <option
              v-for="list in orgList"
              :key="list.orgSeq"
              :value="list.orgSeq"
              >{{ list.orgPath }}</option
            >
          </select>
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('building-type') }}</span>
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="buildingType"
            class="form-control"
            placeholder=""
            title="시설구분"
            @keyup.enter="searchStatusReport"
          />
        </div>
        <div class="form-group">
          <span class="form-label mx-1">{{ $t('date') }}</span>
        </div>
        <datetime-picker
          :isPair="false"
          id="startDate"
          v-model="startDate"
          :date.sync="startDate"
          :maxDate="'now'"
        >
        </datetime-picker>
        <!-- <datetime-picker
            :isPair="true"
            :startDate.sync="startDate"
            :endDate.sync="endDate"
            :duration="{days:7}"
          ></datetime-picker> -->
        <div class="form-group">
          <button
            class="btn btn-info"
            type="button"
            @click="searchStatusReport()"
          >
            {{ $t('search') }}
          </button>
          <button
            class="btn btn-info"
            type="button"
            @click="fnInitializeSeach()"
          >
            {{ $t('initializing') }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid-container">
      <div class="table-wrap y-scroll h500">
        <table
          id="statusReportTb"
          class="table table-col"
          style="table-layout: auto"
        >
          <caption>
            {{
              $t('comm-rate')
            }}
          </caption>
          <thead>
            <tr>
              <th
                v-for="(column, index) in columns"
                :key="'colunm' + index"
                scope="col"
                :rowspan="rowspan(index)"
                :colspan="colspan(index)"
              >
                {{ column }}
              </th>
            </tr>
            <tr>
              <th scope="col" class="bottom">90{{ $t('tem-or-greater') }}</th>
              <th scope="col" class="bottom">50{{ $t('tem-or-greater') }}</th>
              <th scope="col" class="bottom">35{{ $t('tem-or-greater') }}</th>
              <th scope="col" class="bottom">35{{ $t('tem-under') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(row, index) in mydata">
              <tr
                v-if="
                  (row.gid == 0 && row.orgPath !== '/' + row.orgNm) ||
                    row.gid == 1 ||
                    row.gid == 3
                "
                :key="'bodyrow' + index"
                :class="rowClass(index)"
              >
                <template v-if="row.gid == 0">
                  <td>{{ row.orgPath }}</td>
                  <td>{{ row.devBuildingType }}</td>
                </template>
                <template v-else-if="row.gid == 1">
                  <td>{{ row.orgPath }}</td>
                  <td>합계</td>
                </template>
                <template v-else-if="row.gid == 3">
                  <td>합계</td>
                  <td></td>
                </template>
                <!-- <td>{{ row.totalCnt }}</td> -->
                <td>
                  {{
                    row.geoLvl1Cnt +
                      row.geoLvl2Cnt +
                      row.geoLvl3Cnt +
                      row.geoLvl4Cnt
                  }}
                </td>
                <td>{{ row.geoLvl1Cnt }}</td>
                <td>{{ row.geoLvl2Cnt }}</td>
                <td>{{ row.geoLvl3Cnt }}</td>
                <td>{{ row.geoLvl4Cnt }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <!-- contentsWrap : E -->
</template>

<script>
import eventBus from '@/utils/eventBus'
import { requestApi } from '@/api/ccp/requestApi'
import DatetimePicker from '@/components/DatetimePicker'
import moment from 'moment'

export default {
  name: 'StatGeoReportSvc',
  components: {
    DatetimePicker
  },
  props: {},
  filters: {
    numberFormat(value) {
      return value
        .split('')
        .reverse()
        .reduce((acc, digit, i) => {
          if (i > 0 && i % 3 === 0) acc.push(',')
          return [...acc, digit]
        }, [])
        .reverse()
        .join('')
    },
    percentFormat(value) {
      if (value === null || typeof value === 'undefined') return ''
      return value + '%'
    }
  },
  data() {
    return {
      mydata: [],
      orgSeq: '',
      buildingType: '',
      startDate: null,
      // endDate: null,
      endDateTemp: null,
      startConvertDate: null,
      endConvertDate: null,
      searchDateList: [],
      orgList: [],
      columns: [
        this.$t('department'),
        this.$t('building-type'),
        this.$t('dev-cnt'),
        '지열온도'
      ]
    }
  },
  created() {
    eventBus.$emit('contentTitle', 'statGeoReport')
    eventBus.$emit('contentLocation', 'location-statGeoReport')
    this.fnGetOrgList()
  },
  mounted() {
    this.fnInitDate()
    $('.y-scroll').mCustomScrollbar({
      axis: 'yx',
      theme: '3d',
      scrollbarPosition: 'outside',
      autoHideScrollbar: true,
      advenced: { autoExpandHorizontalScroll: true },
      callbacks: {
        whileScrolling: function() {
          var fixedHeader = $(this).find('.fixed-header')
          if (fixedHeader.length) {
            fixedHeader.css({
              transform: 'translate(' + this.mcs.left + 'px, 0)'
            })
          }

          var fixedFooter = $(this).find('.fixed-footer')
          if (fixedFooter.length) {
            fixedFooter.css({
              transform: 'translate(' + this.mcs.left + 'px, 0)'
            })
          }
        },
        onUpdate: function() {
          $(this).TableFixedHeader('resizing')
          $(this).TableFixedFooter('resizing2')
        }
      }
    })
  },
  computed: {},
  methods: {
    fnGetOrgList() {
      requestApi({
        url: '/online/iotorg/retrieveIotCustOrg',
        headers: {
          'X-MID': 'P05012'
        },
        data: {},
        method: 'post',
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.orgList = res.data.orgList
            this.orgSeq = this.orgList[0].orgSeq
            this.searchStatusReport()
          }
        }
      })
    },
    colspan(index) {
      return index > 2 ? 4 : 1
    },
    rowspan(index) {
      return index > 2 ? 1 : 4
    },
    rowClass(index) {
      return this.mydata[index].gid === 3 ? 'sum' : ''
    },
    searchStatusReport() {
      // 검색 날짜 없는 경우
      if (this.startDate === null) {
        this.alert(this.$t('mdlMtReqPerValNulChk'), 'warning')
        return
      }
      this.footers = []
      let reqData = {}

      reqData.orgSeq = this.orgSeq
      reqData.devBuildingType = this.buildingType

      if (this.startDate !== null && this.startDate !== '') {
        this.startConvertDate =
          this.startDate.getFullYear() +
          ('00' + (this.startDate.getMonth() + 1)).slice(-2) +
          ('00' + this.startDate.getDate()).slice(-2)
        reqData.searchStartDttm = this.startConvertDate
      }
      // if (this.endDate !== null && this.endDate !== '') {
      //   this.endConvertDate = this.endDate.getFullYear() + ('00' + (this.endDate.getMonth() + 1)).slice(-2) + ('00' + this.endDate.getDate()).slice(-2)
      //   reqData.searchEndDttm = this.endConvertDate
      // }
      requestApi({
        url: '/online/iotstatgeoreport/retrieveIotStatGeoReportList',
        headers: {
          'X-MID': 'P00115'
        },
        callback: data => {
          this.mydata = data.data.statGeoReportList
          // this.searchDateList = data.data.searchDateList
          // this.searchDataList.push('지열온도')
          // 날짜별 데이터 칼럼
          // this.columns = this.columns.slice(0, 3)
          // for (let i = 0; i < this.searchDateList.length; i++) {
          //   this.columns[ i + 3 ] = this.searchDateList[i]
          // }
          // tfoot 칼럼
          for (let i = 0; i < this.mydata.length; i++) {
            if (this.mydata[i].gid === 4) {
              this.footers = this.mydata[i]
            }
          }
          this.$nextTick(function() {
            if (this.mydata.length > 0) this.rowMerge()
            $('.y-scroll').TableFixedHeader('distory')
            $('.y-scroll').TableFixedHeader('enable')
            $('.y-scroll').TableFixedFooter('distory2')
            $('.y-scroll').TableFixedFooter('enable2')
          })
        },
        method: 'post',
        data: reqData
      })
    },
    rowMerge() {
      $('#statusReportTb').each(function() {
        var table = this
        $.each([1, 2], function(c, v) {
          let tds = $('>tbody>tr>td:nth-child(' + v + ')', table).toArray()
          let i = 0
          let j = 0
          for (j = 1; j < tds.length; j++) {
            if (tds[i].innerHTML !== tds[j].innerHTML) {
              $(tds[i]).attr('rowspan', j - i)
              $(tds[i]).show()
              i = j
              continue
            }
            $(tds[j]).hide()
          }
          j--
          if (tds[i].innerHTML === tds[j].innerHTML) {
            $(tds[i]).attr('rowspan', j - i + 1)
            $(tds[i]).show()
          }
        })
      })
    },
    fnInitDate() {
      // 초기 날짜 설정
      let beforeWeek = new Date()
      beforeWeek.setDate(beforeWeek.getDate() - 1)
      this.startDate = moment(beforeWeek).toDate()
      // let afterWeek = new Date()
      // afterWeek.setDate(afterWeek.getDate() - 1)
      // this.endDate = moment(afterWeek).toDate()

      this.buildingType = ''
      // this.orgSeq = this.orgList[1].orgLvl
    },
    fnInitializeSeach() {
      this.orgSeq = this.orgList[0].orgSeq
      this.fnInitDate()
      this.searchStatusReport()
    }
  }
}
</script>

<style lang="less" scoped></style>
