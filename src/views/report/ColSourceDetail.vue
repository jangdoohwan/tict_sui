<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-12">
          <span class="form-label w-28 lb-txt">{{ $t('headerInfo') }}</span>
          <textarea
            class="form-control"
            v-model="headerInfo"
            disabled
            cols="30"
            rows="8"
          >
          </textarea>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-12 col-lg-12">
          <span class="form-label w-28 lb-txt">{{ $t('bodyInfo') }}</span>
          <textarea
            class="form-control"
            v-model="bodyInfo"
            disabled
            cols="30"
            rows="20"
          >
          </textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="close()" type="button" class="btn btn-pink">
          {{ $t('confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'ColsourceDetail',
  components: {},
  props: {
    data: Object,
    callback: {
      type: Function,
      required: true
    },
    close: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      searchValue: '',
      devMdlList: [],
      devMdlCd: null,
      devMdlNm: null,
      con: null,
      colSeq: null,
      parsedData: null,
      colSourceDetail: null,
      headerInfo: null,
      bodyInfo: null,
      ackProcDesc: null,
      xMid: 'P05012'
    }
  },
  created() {
    this.colSeq = this.data.colSeq
  },
  mounted() {
    this.getModels()
  },
  computed: {},
  methods: {
    pretty(ex) {
      try {
        var obj = JSON.parse(ex)
        var pretty = JSON.stringify(obj, undefined, 5)
      } catch (e) {
        console.error(e)
        return ex
      }
      return pretty
    },
    getModels() {
      let reqData = {}
      reqData.colSeq = this.colSeq
      requestApi({
        url: '/online/iotcolsource/retrieveIotColSourceDetail',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: result => {
          this.headerInfo = result.data.colSourceDetail.headerInfo
          if (result.data.colSourceDetail.bodyInfo != null) {
            this.bodyInfo = this.pretty(result.data.colSourceDetail.bodyInfo)
          }
          this.ackProcDesc = result.data.colSourceDetail.ackProcDesc
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
