<template>
  <div>
    <h4 class="titH4">{{ $t('template-select') }}</h4>
    <div class="scroll-wrap">
      <ul class="chart-list">
        <li
          v-for="(template, index) in templateList"
          :key="`template-${index}`"
        >
          <input
            type="radio"
            name="chart"
            v-model="checkedTemplate"
            :id="template.tmplCdId"
            :value="template.tmplCdId"
            @click="fnSelectTemplate(template)"
          />
          <label :for="template.tmplCdId" :class="template.tmplCdId">
            <span class="label-img">
              <img :src="template.tmplRuleImg" alt="" style="height: 125px" />
              <div>{{ template.tmplCdNm }}</div>
            </span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
export default {
  name: 'ComponentTmplListComp',
  components: {},
  data() {
    return {
      xMid: 'P09101',
      templateList: [],
      checkedTemplate: ''
    }
  },
  computed: {},
  watch: {},
  created() {
    this.fnGetTemplateProgSeq()
  },
  mounted() {},
  methods: {
    fnGetTemplateProgSeq() {
      let params = {
        currentPage: 1,
        displayRowCount: 1,
        progNm: '',
        uiPath: '/views/dashboard/DashboardSvc'
      }
      requestApi({
        url: '/online/com/prog/getIotProg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: params,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.dataList.length > 0) {
              this.fnGetTemplateList(res.data.dataList[0].progSeq)
            }
          }
        }
      })
    },
    fnGetTemplateList(progSeq) {
      requestApi({
        url: '/online/com/tmpl/getIotDashboardTmpl',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: { progSeq: progSeq },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.templateList = res.data
          }
        }
      })
    },
    fnSelectTemplate(template) {
      this.$emit('select', template)
    },
    // 템플릿 클릭 초기화
    fnClearCheckedTemplate() {
      this.checkedTemplate = ''
    }
  }
}
</script>

<style></style>
