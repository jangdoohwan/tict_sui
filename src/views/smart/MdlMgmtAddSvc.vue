<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{ $t('mdlMtMdlNm') }}</span>
          <div class="input-group">
            <input
              type="text"
              v-model="dataObj.mdlNm"
              class="form-control"
              placeholder=""
              :disabled="dataObj.seq !== ''"
            />
            <button
              @click="fnMdlNmDuplChk()"
              type="button"
              class="btn btn-pink"
              :disabled="dataObj.seq !== ''"
            >
              {{ $t('duplication-check') }}
            </button>
          </div>
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{ $t('mdlMtMdlId') }}</span>
          <input
            type="text"
            v-model="dataObj.mdlId"
            class="form-control"
            placeholder=""
          />
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{ $t('mdlMtConType') }}</span>
          <select class="form-control" v-model="dataObj.conType">
            <option
              v-for="obj in conTypeOpt"
              v-bind:key="obj.optVal"
              :value="obj.optVal"
              >{{ obj.optName }}</option
            >
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{ $t('mdlMtServNm') }}</span>
          <select class="form-control" v-model="dataObj.servSeq">
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="obj in serverOpt"
              v-bind:key="obj.optVal"
              :value="obj.optVal"
              >{{ obj.optName }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{ $t('mdlMtMdlType') }}</span>
          <select
            class="form-control"
            v-model="dataObj.mdlType"
            :disabled="dataObj.seq !== ''"
          >
            <option
              v-for="obj in mdlTypeOpt"
              v-bind:key="obj.optVal"
              :value="obj.optVal"
              >{{ obj.optName }}</option
            >
          </select>
        </div>
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{ $t('mdlMtConObj') }}</span>
          <input
            type="text"
            v-model="dataObj.conObj"
            class="form-control"
            placeholder=""
          />
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-4">
          <span class="form-label w-28 lb-txt">{{ $t('mdlMtCycle') }}</span>
          <div class="input-group">
            <select
              class="form-control"
              v-model="dataObj.cycType"
              @change="fnCyeTypeChan"
            >
              <option
                v-for="obj in cycTypeOpt"
                v-bind:key="obj.optVal"
                :value="obj.optVal"
                >{{ obj.optName }}</option
              >
            </select>
            <input
              type="text"
              v-model="dataObj.cycVal"
              class="form-control ml-2"
              placeholder=""
              :disabled="cycTypeDis"
            />
            <select
              class="form-control ml-2"
              v-model="dataObj.cycUnit"
              :disabled="cycTypeDis"
            >
              <option
                v-for="obj in cycUnitOpt"
                v-bind:key="obj.optVal"
                :value="obj.optVal"
                >{{ obj.optName }}</option
              >
            </select>
          </div>
        </div>
      </div>
      <div @scroll="fnScrlChk">
        <!--        <div class="disdiv" v-if="devMapTf" :style="devMapStyle"></div>-->
        <div class="disdiv" v-if="devMapTf"></div>
        <!-- ???????????? -->
        <div class="tit-wrap btn-in mt-2">
          <h4 class="titH4">{{ $t('mdlMtReqCol') }}</h4>
        </div>
        <draggable
          v-model="reqColList"
          group="attr-list"
          @start="drag = true"
          @end="drag = false"
          handle=".attr-list-handle"
        >
          <div
            class="form-row row mt-1"
            v-for="(obj, idx) in reqColList"
            v-bind:key="idx"
          >
            <div class="col-sm-5 pl-0 pr-0">
              <div class="col-sm-4 pl-3 pr-0">
                <input
                  :placeholder="$t('mdlMtReqColNmPh')"
                  class="form-control"
                  v-model="obj.reqColNm"
                  :disabled="devMapTf"
                />
              </div>
              <div class="col-sm-4 pl-3 pr-0">
                <input
                  :placeholder="$t('mdlMtReqColPh')"
                  class="form-control"
                  v-model="obj.reqColKey"
                  :disabled="devMapTf"
                />
              </div>
              <div class="col-sm-4 pl-3 pr-0">
                <select
                  class="form-control"
                  v-model="obj.reqColType"
                  :disabled="devMapTf"
                >
                  <option
                    v-for="obj in reqColTypeOpt"
                    v-bind:key="obj.optVal"
                    :value="obj.optVal"
                    >{{ obj.optName }}</option
                  >
                </select>
              </div>
            </div>
            <div class="col-sm-3 pl-0 pr-0">
              <div class="col-sm-1 pl-0 pr-0"></div>
              <div class="col-sm-2 pl-0 pr-0 pt-1">
                <span class="lb-txt">{{ $t('mdlMtPer') }}</span>
              </div>
              <div class="col-sm-2 pl-2 pr-0">
                <input
                  class="form-control"
                  v-model="obj.reqPerVal"
                  :disabled="devMapTf"
                />
              </div>
              <div class="col-sm-7 pl-2 pr-0">
                <select
                  class="form-control"
                  v-model="obj.reqPerUnit"
                  :disabled="devMapTf"
                >
                  <option
                    v-for="obj in reqPerUnitOpt"
                    v-bind:key="obj.optVal"
                    :value="obj.optVal"
                    >{{ obj.optName }}</option
                  >
                </select>
              </div>
            </div>
            <div class="col-md-2 pl-0 pr-0">
              <div class="col-md-2 pl-0 pr-0"></div>
              <div class="col-md-10 pl-0 pr-0 pt-1">
                <span class="lb-txt float-left mr-2">{{
                  $t('mdlMtTotDev')
                }}</span>
                <div class="form-check">
                  <label class="form-check-label" :for="'ch-' + idx">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :name="'ch-' + idx"
                      :id="'ch-' + idx"
                      :checked="obj.reqTotDevYn === 'Y'"
                      :disabled="devMapTf"
                    />
                    <span class="form-check-sign"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-sm-2 pl-0 pr-0" style="border:0px solid red;">
              <button
                class="btn"
                type="button"
                @click="fnReqColAdd(idx)"
                :disabled="devMapTf"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                class="btn"
                type="button"
                @click="fnReqColDel(idx)"
                :disabled="devMapTf"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
              <div class="btn attr-list-handle" :disabled="devMapTf">
                <span class="glyphicon glyphicon-align-justify"></span>
              </div>
            </div>
          </div>
        </draggable>

        <!-- ???????????? -->
        <div class="tit-wrap btn-in mt-3">
          <h4 class="titH4">{{ $t('mdlMtResCol') }}</h4>
        </div>
        <draggable
          v-model="rsltColList"
          group="res-list"
          @start="drag = true"
          @end="drag = false"
          handle=".res-list-handle"
        >
          <div
            class="form-row mt-1"
            v-for="(obj, idx) in rsltColList"
            :key="idx"
          >
            <div class="col-sm-5 pl-0 pr-0">
              <div class="col-sm-4 pl-3 pr-0">
                <input
                  :placeholder="$t('mdlMtResColNmPh')"
                  class="form-control"
                  v-model="obj.rsltColNm"
                  :disabled="devMapTf"
                />
              </div>
              <div class="col-sm-4 pl-3 pr-0">
                <input
                  :placeholder="$t('mdlMtResColPh')"
                  class="form-control"
                  v-model="obj.rsltColKey"
                  :disabled="devMapTf"
                />
              </div>
              <div class="col-sm-4 pl-3 pr-0">
                <select
                  class="form-control"
                  v-model="obj.rsltColType"
                  :disabled="devMapTf"
                >
                  <option
                    v-for="obj in rsltColTypeOpt"
                    v-bind:key="obj.optVal"
                    :value="obj.optVal"
                    >{{ obj.optName }}</option
                  >
                </select>
              </div>
            </div>
            <div class="col-sm-2 pl-2 pr-0">
              <input
                :placeholder="$t('mdlMtResAplyColNmPh')"
                class="form-control"
                v-model="obj.aplyColNm"
                :disabled="devMapTf"
              />
            </div>
            <!-- ?????????????????? ???????????? ?????? -->
            <div class="col-md-2 pl-0 pr-0">
              <div class="col-md-2 pl-0 pr-0"></div>
              <div class="col-md-10 pl-0 pr-0 pt-1">
                <span class="lb-txt float-left mr-2">{{
                  $t('dupTargetYn')
                }}</span>
                <div class="form-check">
                  <label class="form-check-label" :for="'dupCh-' + idx">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :name="'dupCh-' + idx"
                      :id="'dupCh-' + idx"
                      :checked="obj.dupTargetYn === 'Y'"
                      @change="fnChkOnly(idx)"
                      :disabled="devMapTf"
                    />
                    <span class="form-check-sign"></span>
                  </label>
                </div>
              </div>
            </div>
            <div class="col-sm-3 pl-2 pr-0" style="border:0px solid red;">
              <button
                class="btn"
                type="button"
                @click="fnRsltColAdd(idx)"
                :disabled="devMapTf"
              >
                <span class="glyphicon glyphicon-plus"></span>
              </button>
              <button
                class="btn"
                type="button"
                @click="fnRsltColDel(idx)"
                :disabled="devMapTf"
              >
                <span class="glyphicon glyphicon-minus"></span>
              </button>
              <div class="btn res-list-handle" :disabled="devMapTf">
                <span class="glyphicon glyphicon-align-justify"></span>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="modal-footer">
      <div class="text-center">
        <button
          @click="submit()"
          type="button"
          class="btn btn-pink"
          v-if="dataObj.seq === ''"
        >
          {{ $t('registration') }}
        </button>
        <button @click="submit()" type="button" class="btn btn-pink" v-else>
          {{ $t('modify') }}
        </button>
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
import 'ts-polyfill'
import { requestApi } from '@/api/ccp/requestApi'
import draggable from 'vuedraggable'

export default {
  name: 'MdlMgmtAddSvc',
  components: {
    draggable
  },
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
      dataObj: {
        seq: this.data.obj.seq,
        mdlNm: this.data.obj.mdlNm,
        mdlId: this.data.obj.mdlId,
        servSeq: this.data.obj.servSeq,
        mdlType: this.data.obj.mdlType,
        conType: this.data.obj.conType,
        conObj: this.data.obj.conObj,
        cycType: this.data.obj.cycType,
        cycUnit: this.data.obj.cycUnit,
        cycVal: this.data.obj.cycVal
      },
      cycTypeDis: false, // ??????/????????? ?????????????????? disabled ??????
      devMapTf: false,
      devMapStyle:
        'z-index:99; width:95%; height:95%; position:absolute; background-color:#999999; opacity:0.2;',
      oneScrolChk: '0',
      mdlNmDuplChkFlag: true,
      mdlNmPre: '',
      conTypeOpt: [
        { optName: '??????', optVal: '' },
        { optName: '?????????', optVal: 'TBL' },
        { optName: 'API', optVal: 'API' }
      ],
      cycTypeOpt: [
        { optName: '?????? ??????', optVal: '' },
        { optName: '??????', optVal: 'CYL' },
        { optName: '?????????', optVal: 'RTM' }
      ],
      cycUnitOpt: [
        { optName: '?????? ??????', optVal: '' },
        { optName: '???', optVal: 'D' },
        { optName: '??????', optVal: 'H' },
        { optName: '???', optVal: 'M' }
      ],
      serverOpt: [],
      mdlTypeOpt: [
        { optName: '??????', optVal: '' },
        { optName: '??????', optVal: 'LRN' },
        { optName: '??????', optVal: 'PRD' }
      ],
      // ??????, ?????? ?????? ??????
      reqColTypeOpt: [
        { optName: '?????? ?????? ??????', optVal: '' },
        { optName: 'STRING', optVal: 'STR' },
        { optName: 'NUMBER', optVal: 'NUM' },
        { optName: 'ARRAY OF STRING', optVal: 'AOS' },
        { optName: 'ARRAY OF NUMBER', optVal: 'AON' }
      ],
      reqPerUnitOpt: [
        { optName: '???/??????/???/?????????', optVal: '' },
        { optName: '???', optVal: 'M' },
        { optName: '??????', optVal: 'H' },
        { optName: '???', optVal: 'D' },
        { optName: '?????????', optVal: 'R' }
      ],
      rsltColTypeOpt: [
        { optName: '?????? ?????? ??????', optVal: '' },
        { optName: 'STRING', optVal: 'STR' },
        { optName: 'NUMBER', optVal: 'NUM' },
        { optName: 'ARRAY OF STRING', optVal: 'AOS' },
        { optName: 'ARRAY OF NUMBER', optVal: 'AON' }
      ],
      reqColList: [
        {
          seq: '',
          reqColNm: '',
          reqColKey: '',
          reqColType: '',
          reqPerVal: '',
          reqPerUnit: '',
          reqTotDevYn: ''
        }
      ],
      rsltColList: [
        {
          seq: '',
          rsltColNm: '',
          rsltColKey: '',
          rsltColType: '',
          aplyColNm: '',
          dupTargetYn: ''
        }
      ], // dupTargetYn ??????
      xMid: 'P11102'
    }
  },
  watch: {},
  created() {
    // ???????????? ??????
    this.fnServListApi()
    // ????????? ??????, ????????? ?????????
    if (this.data.obj.seq !== '') {
      this.fnCyeTypeChan()
      this.fnDevMapChk() // ???????????? ??????
      this.fnReqColListApi()
      this.fnRsltColListApi()
    }
  },
  mounted() {},
  methods: {
    fnScrlChk(e) {
      // ??????,?????? ????????? ??????
      // var local = this
      // ??? ??????????????? ??????
      if (this.oneScrolChk === '0') {
        this.oneScrolChk = '1'
        var scHt = $(e.target).prop('scrollHeight')
        scHt = scHt - 28 // 28??? ??????????????? ????????????
        this.devMapStyle =
          'z-index:99; width:95%; height:' +
          scHt +
          'px; position:absolute; background-color:#999999; opacity:0.2;'
      }
    },
    fnCyeTypeChan() {
      if (this.dataObj.cycType === 'RTM') {
        this.cycTypeDis = true
        this.dataObj.cycVal = null
        this.dataObj.cycUnit = null
      } else {
        this.cycTypeDis = false
      }
    },
    fnDevMapChk() {
      var reqData = { mdlSeq: this.data.obj.seq }
      var uri = '/online/smart/devMapChk'
      uri = '/online/bscpmodel/connectIotModelCheck'

      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.cdType === 'deny') {
              // ???????????????, ??????????????? ??????
              this.devMapTf = true
              this.alert(this.$t('connectdModelIot'), 'warning', '300', '220')
            } else {
              this.devMapTf = false
            }
          } else {
            this.devMapTf = false
          }
        }
      })
    },
    fnMdlNmDuplChk() {
      var reqData = {}
      // ????????? ???????????? ?????? ??????
      if (this.dataObj.seq === '' && this.dataObj.mdlNm === '') {
        this.alert(this.$t('mdlMtMdlNmNulChk'), 'warning')
        return
      }

      reqData.mdlNm = this.dataObj.mdlNm
      requestApi({
        url: '/online/bscpmodel/dupModelNm',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          // ???????????? ????????? ?????? ????????? ??????
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(res.data.msg, 'success')
            this.mdlNmDuplChkFlag = false
            // ??????????????? ???????????? ?????? ????????????
            this.mdlNmPre = this.dataObj.mdlNm
          } else {
            this.mdlNmDuplChkFlag = true // ????????????
          }
        }
      })
    },
    fnReqColAdd(idx) {
      idx = idx + 1 // +?????? ????????????
      this.reqColList.splice(idx, 0, {
        seq: '',
        reqColNm: '',
        reqColKey: '',
        reqColType: '',
        reqPerVal: '',
        reqPerUnit: '',
        reqTotDevYn: ''
      })
    },
    fnReqColDel(idx) {
      if (this.reqColList.length !== 1) {
        this.reqColList.splice(idx, 1)
      }
    },
    fnRsltColAdd(idx) {
      idx = idx + 1 // +?????? ????????????
      this.rsltColList.splice(idx, 0, {
        seq: '',
        rsltColNm: '',
        rsltColKey: '',
        rsltColType: '',
        aplyColNm: '',
        dupTargetYn: ''
      }) // dupTargetYn ??????
    },
    fnRsltColDel(idx) {
      if (this.rsltColList.length !== 1) {
        this.rsltColList.splice(idx, 1)
      }
    },
    fnCallApi(reqData, uri) {
      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.callback()
            this.close()
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    fnServListApi() {
      var reqData = {}
      var uri = '/online/bscpmodel/getModelServerInfoList'
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
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              this.serverOpt.push({ optName: obj.serverNm, optVal: obj.seq })
            }
          }
        }
      })
    },
    fnReqColListApi() {
      var reqData = { mdlSeq: this.data.obj.seq }
      var uri = '/online/smart/mdlMgmtReqColList'
      uri = '/online/bscpmodel/getModelAttbReqInfoList'
      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.reqColList.splice(0, 1) // ?????????
            var obj = {}
            var sortObj = res.data.dataList
            // ????????????
            sortObj.sort(function(a, b) {
              return Number(a.ord) - Number(b.ord)
            })
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              this.reqColList.push({
                seq: obj.seq,
                reqColNm: obj.reqColNm,
                reqColKey: obj.reqColKey,
                reqColType: obj.reqColType,
                reqPerVal: obj.reqPerVal,
                reqPerUnit: obj.reqPerUnit,
                reqTotDevYn: obj.reqTotDevYn
              })
            }
          }
        }
      })
    },
    fnRsltColListApi() {
      var reqData = { mdlSeq: this.data.obj.seq }
      var uri = '/online/smart/mdlMgmtRsltColList'
      uri = '/online/bscpmodel/getModelAttbRsltInfoList'
      requestApi({
        url: uri,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.rsltColList.splice(0, 1) // ?????????
            var obj = {}
            var sortObj = res.data.dataList
            // ????????????
            sortObj.sort(function(a, b) {
              return Number(a.ord) - Number(b.ord)
            })
            for (var i = 0; i < res.data.dataList.length; i++) {
              obj = res.data.dataList[i]
              this.rsltColList.push({
                seq: obj.seq,
                rsltColNm: obj.rsltColNm,
                rsltColKey: obj.rsltColKey,
                rsltColType: obj.rsltColType,
                aplyColNm: obj.aplyColNm,
                dupTargetYn: obj.dupTargetYn
              }) // dupTargetYn ??????
            }
          }
        }
      })
    },
    fnSpcChk() {
      var ret = true
      // ????????? ?????? ??? ??? ?????? ??????
      if (this.mdlNmPre !== this.dataObj.mdlNm) {
        this.mdlNmDuplChkFlag = true
      }
      // ????????? ???????????? ?????? ??????
      if (this.dataObj.seq === '' && this.dataObj.mdlNm === '') {
        this.alert(this.$t('mdlMtMdlNmNulChk'), 'warning')
        ret = false
        // ????????? ???????????? ?????? ?????? ??????
      } else if (
        this.dataObj.seq === '' &&
        this.dataObj.mdlNm !== '' &&
        this.mdlNmDuplChkFlag
      ) {
        this.alert(this.$t('mdlMtMdlNmDupChk'), 'warning')
        ret = false
        // ?????? ???????????? ?????? ??????
      } else if (this.dataObj.servSeq === '') {
        this.alert(this.$t('mdlMtServNulChk'), 'warning')
        ret = false
        // ??????ID ???????????? ?????? ??????
      } else if (this.dataObj.mdlId === '') {
        this.alert(this.$t('mdlMtMdlIdNulChk'), 'warning')
        ret = false
        // ???????????? ???????????? ?????? ??????
      } else if (this.dataObj.seq === '' && this.dataObj.mdlType === '') {
        this.alert(this.$t('mdlMtMdlTypeNulChk'), 'warning')
        ret = false
        // ???????????? ???????????? ?????? ??????
      } else if (this.dataObj.conType === '') {
        this.alert(this.$t('mdlMtConTypeNulChk'), 'warning')
        ret = false
        // ???????????? ???????????? ?????? ??????
      } else if (this.dataObj.conObj === '') {
        this.alert(this.$t('mdlMtConObjNulChk'), 'warning')
        ret = false
        // ?????? ???????????? ?????? ??????
      } else if (this.dataObj.cycType === '') {
        this.alert(this.$t('mdlMtCycTypeNulChk'), 'warning')
        ret = false
        // ???????????? ???????????? ?????? ??????
      } else if (this.dataObj.cycVal === '' && this.dataObj.cycType === 'CYL') {
        this.alert(this.$t('mdlMtCycValNulChk'), 'warning')
        ret = false
        // ???????????? ???????????? ?????? ??????
      } else if (
        this.dataObj.cycUnit === '' &&
        this.dataObj.cycType === 'CYL'
      ) {
        this.alert(this.$t('mdlMtCycUnitNulChk'), 'warning')
        ret = false
      } else {
        // ?????? ?????? ??????
        for (var i = 0; i < this.reqColList.length; i++) {
          var obj = this.reqColList[i]
          // ?????? ????????? ???????????? ?????? ??????
          if (obj.reqColNm === '') {
            this.alert(this.$t('mdlMtReqColNulChk'), 'warning')
            ret = false
            return
          }
          // ?????? ????????? ???????????? ?????? ??????
          if (obj.reqColKey === '') {
            this.alert(this.$t('mdlMtReqColKeyNulChk'), 'warning')
            ret = false
            return
          }
          // ?????? ?????? ?????? ???????????? ?????? ??????
          if (obj.reqColType === '') {
            this.alert(this.$t('mdlMtReqColTypeNulChk'), 'warning')
            ret = false
            return
          }
          // ?????? ???????????? ?????? ??????
          if (obj.reqPerVal === '') {
            this.alert(this.$t('mdlMtReqPerValNulChk'), 'warning')
            ret = false
            return
          }
          // ???????????? ???????????? ?????? ??????
          if (obj.reqPerUnit === '') {
            this.alert(this.$t('mdlMtReqPerUnitNulChk'), 'warning')
            ret = false
            return
          }
        }
        // ?????? ?????? ??????
        for (var i2 = 0; i2 < this.rsltColList.length; i2++) {
          var obj2 = this.rsltColList[i2]
          // ?????? ????????? ???????????? ?????? ??????
          if (obj2.rsltColNm === '') {
            this.alert(this.$t('mdlMtRsltColNmNulChk'), 'warning')
            ret = false
            return
          }
          // ?????? ????????? ???????????? ?????? ??????
          if (obj2.rsltColKey === '') {
            this.alert(this.$t('mdlMtRsltColKeyNulChk'), 'warning')
            ret = false
            return
          }
          // ?????? ?????? ?????? ???????????? ?????? ??????
          if (obj2.rsltColType === '') {
            this.alert(this.$t('mdlMtRsltColTypeNulChk'), 'warning')
            ret = false
            return
          }
        }
      }

      // ret = false
      return ret
    },
    fnChkOnly(idx) {
      var reqData = this.dataObj
      var dupSelected = $('#dupCh-' + idx).prop('checked')
      reqData.rsltColList = _.cloneDeep(this.rsltColList)

      for (var i = 0; i < reqData.rsltColList.length; i++) {
        var obj = reqData.rsltColList[i]
        obj.ord = i + 1 + ''

        // ??????????????? ?????? ??????
        $('#dupCh-' + i).prop('checked', false)
        obj.dupTargetYn = 'N'
      }
      $('#dupCh-' + idx).prop('checked', dupSelected)
      reqData.rsltColList[idx].dupTargetYn = 'Y'
    },
    submit() {
      var reqData = this.dataObj
      reqData.reqColList = _.cloneDeep(this.reqColList)
      reqData.rsltColList = _.cloneDeep(this.rsltColList)

      // ????????? ??????(ord)
      for (var i = 0; i < reqData.reqColList.length; i++) {
        var obj = reqData.reqColList[i]
        obj.ord = i + 1 + ''

        // ??????????????? (Y/N)??????
        var chked = $('#ch-' + i).prop('checked')
        if (chked === true) {
          obj.reqTotDevYn = 'Y'
        }
        if (chked === false) {
          obj.reqTotDevYn = 'N'
        }
      }

      for (var i2 = 0; i2 < reqData.rsltColList.length; i2++) {
        var obj2 = reqData.rsltColList[i2]
        obj2.ord = i2 + 1 + ''

        // ??????????????? (Y/N)??????
        var chked2 = $('#dupCh-' + i2).prop('checked')

        if (chked2 === true) {
          obj2.dupTargetYn = 'Y'
        }
        if (chked2 === false) {
          obj2.dupTargetYn = 'N'
        }
      }

      var uri = '/online/bscpmodel/saveModelInfoList'
      // ???????????????
      if (reqData.seq !== '') {
        uri = '/online/bscpmodel/updateModelInfoList'
        // ???????????????
        if (this.devMapTf === true) {
          uri = '/online/bscpmodel/updateModelJustInfo'
          // ?????? ???????????? ??????
          delete reqData.reqColList
          delete reqData.rsltColList
        }
      }
      if (this.fnSpcChk()) {
        this.fnCallApi(reqData, uri)
      }
    }
  }
}
</script>

<style lang="less">
.attr-list-handle,
.res-list-handle {
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #e6e6e6;
}
</style>
