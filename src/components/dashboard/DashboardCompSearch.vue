<template>
  <div class="flex" :class="{ 'p-0': !isUseSearch }">
    <!-- 검색 타입 TYPE -  사용안함: '', 조직: ORG, 식별명: CTN, 월: MONTH, 콤보: COMBO  -->
    <!-- 설정 저장 시 대문자로 저장하기 때문에 key 값이 대문자 -->
    <div v-for="(search, index) in searchData" :key="`search-${index}`" class="search-item"
      :class="{ 'width-100': search.TYPE !== 'MONTH' }">
      <!-- ========== 조직 ========== -->
      <div v-if="search.TYPE === 'ORG'" class="flex" style="align-items: center;">
        <div class="pr-2">조직</div>
        <select v-model="search.VALUE" class="form-control">
          <option v-for="list in orgList" :key="list.orgSeq" :value="list.orgSeq">
            {{ list.orgPath }}
          </option>
        </select>
      </div>
      <!-- ========== 장비 ========== -->
      <div v-if="search.TYPE === 'CTN'" class="flex">
        <div class="pr-1 flex-none" style="width: 85px">
          <select v-model="search.SEARCHTYPE" class="form-control">
            <option value="devUname">식별명</option>
            <option value="ctn">CTN</option>
          </select>
        </div>
        <div class="flex-1">
          <input v-model="search.VALUE" type="text" class="form-control" @keyup.enter="fnSearch" />
        </div>
      </div>
      <!-- ========== MONTH ========== -->
      <div v-if="search.TYPE === 'MONTH'" class="">
        <select v-model="search.VALUE" class="form-control" style="width: 95px">
          <option v-for="month in monthOptions" :key="`month-${month}`" :value="month">
            {{ month }}
          </option>
        </select>
      </div>
      <!-- ========== CALENDAR ========== -->
      <div v-if="search.TYPE === 'CALENDAR'" class="">
        <div type="text" class="form-control" style="cursor: pointer; user-select: none"
          @click="fnShowDatePickerPopup(search, index)">
          {{ search.VALUE }}
        </div>
      </div>
      <!-- ========== COMBO ========== -->
      <div v-if="search.TYPE === 'COMBO'" class="">
        <select v-model="search.VALUE" class="form-control">
          <option v-for="(item, index) in comboList" :key="`combo-${index}`" :value="item[search.OPTION.valueKey]">
            {{ item[search.OPTION.nameKey] }}
          </option>
        </select>
      </div>
    </div>
    <div v-if="isUseSearch" class="flex-none">
      <button type="button" class="btn btn-gray" @click="fnSearch">검색</button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getApiParamData, executeApi } from '@/api/common/api'

export default {
  name: 'DashboardCompSearch',
  components: {},
  props: {
    xMid: {
      type: [String],
      required: true
    },
    compConfigSearch: {
      type: [Array]
    },
    orgList: {
      type: Array
    },
    savedSearchValue: {
      type: Object
    },
    item: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      searchData: [],
      comboList: [],
      monthOptions: []
    }
  },
  computed: {
    isUseSearch() {
      return (
        this.compConfigSearch.length > 0 &&
        Object.keys(this.compConfigSearch[0]).length > 0 &&
        !this.compConfigSearch.find((i) => i.TYPE === '')
      )
    }
  },
  watch: {},
  created() { },
  mounted() {
    this.fnInit()
    this.fnSetMonthOption()
  },
  methods: {
    fnInit() {
      // 검색을 사용하지 않는 경우 스킵
      if (!this.isUseSearch) {
        this.fnSearch()
        return
      }
      this.searchData = JSON.parse(JSON.stringify(this.compConfigSearch))

      // COMBO 콤보는 콤보 목록 조회 후 첫번째 옵션으로 설정
      this.searchData.forEach((search, index) => {
        // 이전에 검색한 값
        let savedSearchValue = this.savedSearchValue[search.KEY]
        if (search.TYPE === 'ORG') {
          // 조직
          if (!savedSearchValue || savedSearchValue.length === 0 || !this.orgList.find(o => o.orgSeq === savedSearchValue)) {
            search.VALUE = this.orgList[0].orgSeq
          } else {
            search.VALUE = savedSearchValue
          }
        } else if (search.TYPE === 'CTN') {
          // CTN
          let key = Object.keys(this.savedSearchValue).find(
            (key) => key === 'devUname' || key === 'ctn'
          )
          search.SEARCHTYPE = key || 'devUname'
          search.VALUE = this.savedSearchValue[key] || ''
        } else if (search.TYPE === 'MONTH') {
          // 월
          search.VALUE = savedSearchValue || moment().format('YYYY-MM')
        } else if (search.TYPE === 'CALENDAR') {
          // 캘린더
          search.VALUE =
            savedSearchValue || moment().format(search.OPTION.format)
        } else if (search.TYPE === 'COMBO') {
          // COMBO
          search.list = []
          this.fnGetComboList(search)
          search.VALUE = savedSearchValue || ''
        }
      })

      // 콤보를 갖고 있는 경우 콤보 옵션 목록이 조회 된 후 검색 호출
      // 콤보 외에는 바로 호출
      if (!this.searchData.find((search) => search.TYPE === 'COMBO')) {
        this.$nextTick(() => {
          this.fnSearch()
        })
      }
    },
    fnSetMonthOption() {
      // 월 검색 옵션
      // 현재부터 12개월 이전까지 생성
      let monthOpitons = []
      for (let i = 0; i < 12; i++) {
        monthOpitons.push(moment().subtract(i, 'months').format('YYYY-MM'))
      }
      this.monthOptions = monthOpitons
    },
    fnGetSavedSearchValue(search) {
      let cond = this.savedSearchValue.find((con) => {
        if (search.TYPE === 'CTN') {
          return con.tmplGubun === 'ctn' || con.tmplGubun === 'devUname'
        }
        return con.tmplGubun === search.KEY
      })
      return cond
    },
    async fnGetComboList(search) {
      // 콤보 api 호출하기 전에 api 파라미터를 먼저 조회한다.
      search = await this.fnGetApiParamData(search)

      let data = {
        headers: {},
        body: {},
        url: search.OPTION.apiUri
      }

      // api 설정 시 입력한 파라미터 추가
      if (search.apiParamList && search.apiParamList.length > 0) {
        search.apiParamList.forEach((param) => {
          if (param.paramGubun === 'B') {
            data.body[param.paramKey] = search.OPTION[param.paramKey]
          } else {
            data.headers[param.paramKey] = search.OPTION[param.paramKey]
          }
        })
      }

      // 해당 컴포넌트의 기본정보도 파라미터 추가
      if (this.item.svcCd) {
        data.body.svcCd = this.item.svcCd
      }

      if (this.item.devClsCd) {
        data.body.devClsCd = this.item.devClsCd
      }

      executeApi(data).then((data) => {
        if (search.OPTION.responseKey && search.OPTION.responseKey.length > 0) {
          this.comboList = _.get(data, search.OPTION.responseKey)
        } else {
          this.comboList = data
        }
        if (!search.VALUE || search.VALUE.length === 0) {
          search.VALUE = this.comboList[0][search.OPTION.valueKey]
        }
        // 콤보가 있는 경우 콤보 목록 조회 및 기본값 세팅 후 검색 호출
        this.fnSearch()
      })
    },
    fnGetApiParamData(search) {
      return new Promise((resolve) => {
        getApiParamData({
          xMid: this.xMid,
          apiSeq: search.OPTION.apiSeq
        })
          .then((data) => {
            search.apiParamList = data.tbIotParamDTOList
            resolve(search)
          })
          .catch((e) => {
            console.error(e)
          })
      })
    },
    // 검색
    fnSearch() {
      this.$emit('search')
    },
    fnGetSearchParams() {
      // 검색 시 상위에서 호출한다.
      let searchData = {}
      if (this.isUseSearch) {
        this.searchData.forEach((search) => {
          let key = search.KEY
          // CTN인 경우 선택된 구분값(식별명/CTN)으로 키를 설정한다.
          if (search.TYPE === 'CTN') {
            key = search.SEARCHTYPE

            // CTN인 경우 검색 옵션을 추가로 설정한다.
            searchData.searchEqLike = search.OPTION
          }
          searchData[key] = search.VALUE
        })
      }
      return searchData
    },
    // datepicker 팝업
    fnShowDatePickerPopup(search, index) {
      this.popup({
        component: () => import('@/components/dashboard/DatePickerPopup'),
        title: '날짜 선택',
        width: '300',
        data: {
          date: search.VALUE,
          format: search.OPTION.format
        },
        callback: (date) => {
          search.VALUE = date
          // 바로 변경 되지 않아서 splice로 대치
          this.searchData.splice(index, 1, JSON.parse(JSON.stringify(search)))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
