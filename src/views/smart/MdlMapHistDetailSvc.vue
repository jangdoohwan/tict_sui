<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-4">
          <span class="form-label w-32">{{ $t('gubun') }}</span>
          <select v-model="dataObj.mdlTypeNm" class="form-control" disabled>
            <option
              v-for="(type, index) in typeList"
              :key="`type-${index}`"
              :value="type.key"
              >{{ type.key }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('mdlmMtMdlNm') }}</span>
          <input
            type="text"
            v-model="dataObj.learPreMdlNm"
            class="form-control"
            disabled
          />
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('mdlmMtDevMdlNm') }}</span>
          <input
            type="text"
            v-model="dataObj.devMdlNm"
            class="form-control"
            disabled
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-32">{{ $t('mdlmMtColMapList') }}</span>
        </div>
      </div>
      <div
        v-for="(map, idx) in mapInfoList"
        :key="idx"
        class="flex px-3"
        :class="{ 'pt-1': idx !== 0 }"
      >
        <div class="flex-1 pr-1">
          <input
            type="text"
            class="form-control"
            :value="map.mdlColNm"
            disabled
          />
        </div>
        <div class="flex-1 pl-1">
          <input
            type="text"
            class="form-control"
            :value="map.dvcTbColNm"
            disabled
          />
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'

export default {
  name: 'MdlMapHistDetailSvc',
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
      svcCd: '',
      typeList: [
        { key: '??????', value: '??????' },
        { key: '??????', value: '??????' }
      ],
      dataObj: {
        seq: this.data.obj.seq,
        devMdlSeq: this.data.obj.devMdlSeq,
        devMdlNm: this.data.obj.devMdlNm,
        learPreMdlSeq: this.data.obj.learPreMdlSeq,
        learPreMdlNm: this.data.obj.learPreMdlNm,
        mdlTypeNm: this.data.obj.mdlTypeNm,
        mdlType: this.data.obj.mdlType,
        rawMap: this.data.obj.rawMap,
        mlApiTableType: this.data.obj.mlApiTableType,
        mlDelayTypeCd: this.data.obj.mlDelayTypeCd,
        modelMapSeq: this.data.obj.modelMapSeq
      },
      learPreMdlNm: '',
      seleMdlColName: '',
      seleMdlColSeq: '', // ??????/?????? ?????? ?????? seq
      seleDevColName: '',
      seleDevColSeq: '', // ???????????? seq, ????????? ?????????
      seleDvcTbType: '', // DEV/EXT
      mdlColList: [
        // { mdlColNm: '????????????', seq: '' }, { mdlColNm: '????????????', seq: ''  }, { mdlColNm: '?????????', seq: '' }
      ],
      dvcColList: [
        // { seq: '', dvcColNm: '????????????-ATTB_VL01(??????????????????)' }, { seq: '', dvcColNm: 'ATTB_VL02(????????????)' } }
      ],
      outTbColList: [
        // { seq: '', tbColNm: '????????????-ATTB_VL01(??????????????????)' }, { seq: '', tbColNm: 'ATTB_VL02(????????????)' } }
      ],
      mapInfoList: [
        // { seq: '', mdlColNm: '????????????1', dvcTbColNm: '????????????-ATTB_VL01(??????????????????)' }, { seq: '', mdlColNm: '????????????', dvcTbColNm: 'ATTB_VL02(????????????)' }
        // { dataType: '??????/????????? ??????(DEV/EXT)', mdlAttbSeq: '????????????seq', devAttbSeq: '??????seq/????????? ?????????', mdlColNm: '????????????1', dvcTbColNm: '????????????-ATTB_VL01(??????????????????)' }
      ],
      disDiv: false,
      colRawMsgMap: '',
      rawMap: 'N',
      rawMapVisible: false,
      xMid: 'P11402'
    }
  },
  created() {
    this.fnReqMdlColMapListApi() // ??????????????????
  },
  mounted() {},
  methods: {
    fnReqMdlColMapListApi() {
      var local = this
      var reqData = {
        devMdlSeq: local.dataObj.devMdlSeq,
        mdlSeq: local.dataObj.learPreMdlSeq,
        modelMapSeq: local.dataObj.modelMapSeq
      }
      var uri = '/online/smart/mdlColMapList'
      uri = '/online/bscpmodelmap/getDevModelAttbMapHistList'

      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            var obj = {}
            var sortObj = res.data.dataList
            // ????????????
            sortObj.sort(function(a, b) {
              return Number(a.ord) - Number(b.ord)
            })
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              local.mapInfoList.push({
                seq: '',
                dataType: obj.attbType,
                mdlAttbSeq: obj.mlModelAttbSeq,
                devAttbSeq: obj.iotModelAttbSeq,
                mdlColNm: obj.mlModelAttbKey + '(' + obj.mlModelAttbNm + ')',
                dvcTbColNm: obj.iotColNmCd + '(' + obj.iotDevAttbNm + ')',
                ord: obj.ord
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// border-bottom1{border-bottom: 1px solid #d4dce4;}
</style>
