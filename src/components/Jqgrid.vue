<template>
  <div class="grid-container grid-scroll">
    <table :id="`${name}Grid`"></table>
    <div :id="`${name}GridFooter`" class="grid-paging"></div>
  </div>
</template>

<script>
export default {
  name: 'Jqgrid',
  props: {
    name: {
      type: String,
      required: true
    },
    colNames: {
      type: Array,
      required: true
    },
    colModels: {
      type: Array,
      required: true
    },
    dataList: {
      type: Array,
      required: true
    },
    rowList: {
      type: Array,
      required: false,
      default() {
        return [15, 30, 45, 100]
      }
    },
    rowNum: {
      type: [String, Number],
      required: false,
      default: 15
    },
    usePage: {
      type: Boolean,
      required: false,
      default: true
    },
    totalPage: {
      type: [String, Number],
      required: false,
      default: 1
    },
    currentPage: {
      type: [String, Number],
      required: false,
      default: 1
    },
    multiselect: {
      type: Boolean,
      required: false,
      default: true
    },
    sortable: {
      type: Boolean,
      required: false,
      default: true
    },
    autowidth: {
      type: Boolean,
      required: false,
      default: true
    },
    width: {
      type: Number,
      required: false
    },
    useSelectAll: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return {
      gridElId: null,
      footerElId: null,
      options: {},
      emptyText: '검색 결과가 없습니다.'
    }
  },
  computed: {
    isReady() {
      return this.colNames.length > 0 && this.colModels.length > 0
    },
    colModelWidth() {
      let width = 0
      if (this.colModels) {
        width = this.colModels.map(c => parseInt(c.width)).reduce((p, c) => p + c)
      }
      return width
    }
  },
  watch: {
    dataList: {
      deep: true,
      handler() {
        if (this.totalPage < this.currentPage && this.totalPage > 0) {
          // 마지막 페이지에서 삭제 시 현재 페이지 보다 작아지므로
          // 마지막 페이지로 세팅 후 재조회
          this.$emit('update:currentPage', this.totalPage)
          this.getDataList()
          return
        }
        if (this.isReady) {
          this.setDataList()
        }
      }
    }
  },
  created() {},
  mounted() {
    this.gridElId = '#' + this.name + 'Grid'
    this.footerElId = this.name + 'GridFooter'
    if (this.isReady) {
      this.init()
    }
    if (!this.useSelectAll) {
      this.hideSelectAll()
    }

    window.addEventListener('resize', this.resizeGrid)
  },
  beforeDestory() {
    window.removeEventListener('resize', this.resizeGrid)
    if ($(this.gridElId).jqGrid) {
      $(this.gridElId).jqGrid('GridUnload')
    }
  },
  methods: {
    init() {
      $(this.gridElId).jqGrid('GridUnload')

      // 옵션
      let options = {
        datatype: 'local',
        data: [],
        colNames: this.colNames,
        colModel: this.colModels,
        multiselect: this.multiselect,
        multiselectWidth: 30,
        sortable: this.sortable,
        sortorder: 'desc',
        height: '100%',
        width: '100%',
        autoencode: true,
        autowidth: this.autowidth,
        beforeSelectRow: function(rowid, e) {
          var $myGrid = $(this)
          if ($(e.target).closest('td')[0]) {
            var i = $.jgrid.getCellIndex($(e.target).closest('td')[0])
            var cm = $myGrid.jqGrid('getGridParam', 'colModel')
            // 헤더 클릭이벤트 적용을 위한 이벤트 버블링 방지코드
            e.preventDefault()
            return cm[i].name === 'cb'
          }
        },
        loadComplete: data => {
          this.updatePager()
          this.displayEmptyText()
        },
        onSelectAll: (aRowids, status) => {
          this.$emit('onSelectAll', aRowids, status)
        },
        onCellSelect: (id, index, contents, event) => {
          // id: rowIndex, index: colIndex, contents, event
          if (this.multiselect && index === 0) {
            return
          }
          this.$emit('onCellSelect', id, index, contents, event)
        },
        ondblClickRow: id => {
          this.$emit('ondblClickRow', id)
        }
      }

      // 페이지 사용 설정
      if (this.usePage) {
        Object.assign(options, {
          rowNum: this.rowNum,
          rowList: this.rowList,
          pager: '#' + this.footerElId,
          onPaging: pgButton => {
            let input = $('#' + this.footerElId + ' .ui-pg-input')
            let page = input.val()
            let lastpage = $(this.gridElId).getGridParam('lastpage')

            if (page > lastpage || page <= 0) {
              this.alert(this.$t('notExitPage'))
              input.val($(this.gridElId).getGridParam('page'))
              return 'stop'
            }
            /* eslint-disable indent */
            let currentPage =
              pgButton === 'next_' + this.footerElId
                ? parseInt(this.currentPage) + 1
                : pgButton === 'prev_' + this.footerElId
                ? parseInt(this.currentPage) - 1
                : pgButton === 'first_' + this.footerElId
                ? 1
                : pgButton === 'last_' + this.footerElId
                ? $(this.gridElId).getGridParam('lastpage')
                : pgButton === 'user'
                ? page
                : 1
            /* eslint-enable indent */
            this.$emit('update:currentPage', currentPage)
            this.$emit(
              'update:rowNum',
              $('#' + this.footerElId + ' .ui-pg-selbox option:selected').val()
            )
            this.getDataList()
          }
        })
      }
      this.setType()
      $(this.gridElId)
        .jqGrid('clearGridData')
        .jqGrid(options)
      this.resizeGrid()
    },
    // 데이터 세팅
    setDataList() {
      let dataIndex = 0
      $(this.gridElId)
        .jqGrid('clearGridData')
        .trigger('reloadGrid')
      this.dataList.forEach(row => {
        row = Object.assign(row, { viewImage: '이미지보기' })
        row = Object.assign(row, { viewMap: '지도보기' })
        $(this.gridElId).addRowData(dataIndex++, row)
      })
      this.$nextTick(() => {
        this.$emit('afterDataSetup')
      })
    },
    // 데이터 타입 확인
    setType () {
      this.colModels.forEach(row => {
        if (row.type === 'image') {
          row.name = 'viewImage'
        } else if (row.type === 'map') {
          row.name = 'viewMap'
        }
      })
    },
    // 페이지 업데이트
    updatePager() {
      let grid = $(this.gridElId)
      grid
        .jqGrid('setGridParam', {
          page: this.totalPage ? this.currentPage : 0,
          lastpage: this.totalPage
        })
        .trigger('reloadGrid')
    },
    resizeGrid() {
      let width = this.width || 1280
      let parentWidth = $('#gbox_' + this.gridElId.substr(1))
        .parent()
        .width()
      if (parentWidth > width + 1) {
        width = parentWidth
      }
      // width = parentWidth
      // colModel에 설정된 너비가 더 크면 적용
      if (this.colModelWidth > width) {
        width = this.colModelWidth
      }
      $(this.gridElId).jqGrid('setGridWidth', width)
    },
    // 데이터 갱신 요청
    getDataList() {
      this.$emit('getDataList')
      this.updatePager()
    },
    // 체크된 Row의 index를 리턴
    getSelectionIndexs() {
      return $(this.gridElId).jqGrid('getGridParam', 'selarrrow')
    },
    // 선택 해제
    resetSelection() {
      $(this.gridElId).jqGrid('resetSelection')
    },
    // id 조회
    getDataIds() {
      return $(this.gridElId).jqGrid('getDataIDs')
    },
    // 체크박스 한 Row만제거
    removeChcekbox(id) {
      $('#jqg_' + this.name + 'Grid_' + id).remove()
    },
    // 전체선택 비활성화
    hideSelectAll() {
      $('#jqgh_' + this.name + 'Grid_cb').hide()
    },
    // row data 조회
    getRowData(id) {
      return $(this.gridElId).getRowData(id)
    },
    getGridReccount() {
      return $(this.gridElId).jqGrid('getGridParam', 'reccount')
    },
    displayEmptyText() {
      let container = $(this.gridElId).parents('.ui-jqgrid-view')
      container.find('.emptyText').remove()
      if (this.dataList.length === 0) {
        container.find('.ui-jqgrid-bdiv').append(`<div id="emtyText_${this.name}" class="emptyText">검색 결과가 없습니다.</div>`)
      }
    }
  }
}
</script>

<style lang="less">
// 2개 가로스크롤 방지
// 가로스크롤
.ui-jqgrid .ui-jqgrid-bdiv {
  overflow-x: auto !important;
}
// 컬럼 한줄 표시(줄바꿈 막음)
.ui-jqgrid tr.jqgrow td {
  padding: 5px;
  border-color: #d4dce4;
  white-space: nowrap;
}
.ui-jqgrid .emptyText {
  width: 100%;
  text-align: center;
  padding: 1.5rem;
}
</style>
