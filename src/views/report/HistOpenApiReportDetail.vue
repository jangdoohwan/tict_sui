<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-28  lb-txt">{{$t('customer')}}</span>
          <input type="text" class="form-control" v-model="formData.custNm" disabled/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-34 lb-txt">{{$t('open-svc-nm')}}</span>
          <div class="input-group">
            <input type="text" class="form-control" v-model="formData.openSvcNm" disabled/>
          </div>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-28 lb-txt">{{$t('api-name')}}</span>
        <input type="text" class="form-control" v-model="formData.apiNm" disabled/>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{$t('method/url')}}</span>
          <input type="text" class="form-control" v-model="formData.apiMethod" disabled/>
        </div>
        <div class="form-item col-sm-8">
          <input type="text" class="form-control" v-model="formData.apiUrl" disabled/>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-28 lb-txt">{{$t('status')}}</span>
          <input type="text" class="form-control" v-model="formData.statusCd" disabled/>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-30 lb-txt">{{$t('reqDate')}}</span>
          <input type="text" class="form-control" v-model="formData.reqDate" disabled/>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap mt-2">
      <div class="md-width-100 width-50 pl-1 pr-1">
        <div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="bold">{{$t('histReq')}}</span>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-32">{{$t('header')}}</span>
              <textarea class="form-control" cols="50" rows="5" v-model="formData.reqHead" disabled/>
            </div>
          </div>
          <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="form-label w-32">{{$t('body')}}</span>
              <textarea class="form-control" cols="50" rows="5" v-model="formData.reqBody" disabled/>
            </div>
          </div>
        </div>
      </div>
      <div class="md-width-100 width-50 pl-1 pr-1">
        <div class="form-row row">
            <div class="form-item col-sm-12">
              <span class="bold">{{$t('histRes')}}</span>
            </div>
          </div>
        <div class="form-row row">
          <div class="form-item col-sm-12">
            <span class="form-label w-28">{{$t('header')}}</span>
            <textarea class="form-control" cols="50" rows="5" v-model="formData.resHead" disabled/>
          </div>
        </div>
        <div class="form-row row">
          <div class="form-item col-sm-12">
            <span class="form-label w-28">{{$t('body')}}</span>
            <textarea class="form-control" cols="50" rows="5" v-model="formData.resBody" disabled/>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center btn-wrap">
        <button
            @click="close()"
            type="button"
            class="btn btn-gray"
            data-dismiss="modal"
          >{{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'HistOpenApiReportDetail',
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
      formData: {},
      xMid: 'P05110'
      }
  },
  created() {
    this.fnSearchDetailData()
  },
  mounted() {},
  computed: {},
  methods: {
    fnSearchDetailData() {
      const reqData = {}
      reqData.openApiHistSeq = this.data.idx
      requestApi({
        url: '/online/iotHistOpenApi/retrieveOpenApiHistDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.formData = res.data.openApiHistDetail
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
