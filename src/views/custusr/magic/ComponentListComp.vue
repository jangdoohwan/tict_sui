<template>
  <div>
    <h4 class="titH4 mb-3">컴포넌트 목록</h4>
    <jqgrid
      ref="grid"
      name="component"
      :colModels="colModel"
      :colNames="colNames"
      :dataList="componentList"
      :totalPage.sync="totPage"
      :currentPage.sync="currentPage"
      :rowNum.sync="displayRowCount"
      :rowList="[5, 10, 15]"
      :multiselect="false"
      @onCellSelect="fnGetComponentData"
      @getDataList="fnGetComponentList"
    >
    </jqgrid>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import Jqgrid from '@/components/Jqgrid'

export default {
  name: 'ComponentListComp',
  components: { Jqgrid },
  data() {
    return {
      xMid: 'P09101',
      componentList: [],
      colNames: [
        '컴포넌트 번호',
        '컴포넌트 제목',
        '서비스',
        this.$t('dev-cls-nm'),
        '템플릿 구분',
        'API/TOPIC',
        this.$t('description'),
        this.$t('regDttm')
      ],
      colModel: [
        {
          name: 'usrDashTmplSeq',
          index: 'usrDashTmplSeq',
          align: 'center',
          width: 40
        },
        {
          name: 'dashTmplTitle',
          index: 'dashTmplTitle',
          align: 'left'
        },
        { name: 'svcCdNm', index: 'svcCdNm', align: 'center', width: 40 },
        { name: 'devClsCdNm', index: 'devClsCdNm', align: 'center', width: 70 },
        { name: 'tmplGubunNm', index: 'apiUrl', align: 'center', width: 40 },
        { name: 'apiTopic', index: 'apiUrl', align: 'left', width: 70 },
        { name: 'dashTmplDesc', index: 'dashTmplDesc', align: 'left' },
        { name: 'regDttm', index: 'regDttm', align: 'center', width: 70 }
      ],
      currentPage: 1,
      displayRowCount: 5,
      totPage: 0
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fnGetComponentList()
  },
  mounted() {},
  methods: {
    fnGetComponentList() {
      let params = {
        currentPage: this.currentPage,
        displayRowCount: this.displayRowCount
      }
      requestApi({
        url: '/online/com/usrDash/retreiveDashCompList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: params,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data && res.data.dataList) {
              let componentList = res.data.dataList

              componentList.forEach((component) => {
                /* eslint-disable indent */
                component.tmplGubunNm =
                  component.tmplGubun === 'T'
                    ? 'TOPIC'
                    : component.tmplGubun === 'A'
                    ? 'API'
                    : component.tmplGubun === 'Q'
                    ? 'QUERY'
                    : ''
                /* eslint-enable indent */
                component.apiTopic =
                  component.tmplGubun === 'T'
                    ? component.topicId
                    : component.apiUrl
              })

              this.totPage = res.data.page.totPage
              this.currentPage = res.data.page.page
              this.componentList = componentList
            }
          }
        }
      })
    },
    fnGetComponentData(id, index, contents, event) {
      let data = this.$refs.grid.getRowData(id)
      this.$emit('select', data.usrDashTmplSeq)
    }
  }
}
</script>

<style></style>
