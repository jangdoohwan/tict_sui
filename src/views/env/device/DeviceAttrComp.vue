<template>
  <div class="col-md-12">
    <div class="tit-wrap btn-in">
      <h4 class="titH4">{{$t('device-attr')}}</h4>
      <div class="pull-right">
        <button @click="fnUploadExcelPopup('devAttr')" :disabled="isNew" type="button" class="btn btn-pink rounded">{{$t('addAll')}}</button>
        <button @click="fnAddDeviceAttr" :disabled="isNew" class="btn btn-info" type="button">{{$t('add')}}</button>
      </div>
    </div>
    <div class="table-wrap y-scroll table-height">
      <table class="table table-col">
        <caption>{{$t('device-attr')}} {{$t('registration')}}</caption>
        <colgroup>
          <col style="width:50px">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:auto">
          <col style="width:150px">
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <label class="checkbox">
                <input ref="allCheckDeviceAttr" v-model="checkAll" @change="fnCheckAll" role="checkbox" class="cbox" type="checkbox"><i></i>
              </label>
            </th>
            <th scope="col">{{$t('attb-code')}}</th>
            <th scope="col">{{$t('attribute-name')}}</th>
            <th scope="col">{{$t('unit')}}</th>
            <th scope="col"><span class="lb-txt">{{$t('order')}}</span></th>
            <th scope="col"><span class="lb-txt">{{$t('input-type')}}</span></th>
            <th scope="col">{{$t('collect-target')}} {{$t('column-name')}}</th>
            <th scope="col">{{$t('control-target')}} {{$t('column-name')}}</th>
            <th scope="col">{{$t('stat-avg-target')}}</th>
            <th scope="col">{{$t('symptom-target')}} {{$t('column-name')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deviceAttr, index) in deviceAttrs" :key="index" @dblclick="fnGetAttrSets(deviceAttr)" :class="selectedDeviceAttr === deviceAttr ? 'selected-attr' : ''">
            <td>
              <label class="checkbox"><input v-model="deviceAttr.selected" role="checkbox" class="cbox" type="checkbox" :value="deviceAttr"><i></i></label>
            </td>
            <td>{{deviceAttr.devAttbCdId}}</td>
            <td>{{deviceAttr.devAttbCdNm}}</td>
            <td>
              <select v-model="deviceAttr.unit" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in unitTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
            <td><input v-model="deviceAttr.orderNo" @input="fnSetObjUpdateMode(deviceAttr)" type="text" maxlength="3" class="form-control" style="width:100% !important"></td>
            <td>
              <select v-model="deviceAttr.inputType" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option value="INPUT">INPUT</option>
                <option value="SELECT">SELECT</option>
                <option value="CHECKBOX">CHECKBOX</option>
              </select>
            </td>
            <td>
              <select v-model="deviceAttr.colNmCd" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in collectTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
            <td>
              <input v-model="deviceAttr.conNmCd" @input="fnSetObjUpdateMode(deviceAttr)" type="text" maxlength="16" class="form-control" style="width:100% !important">
            </td>
            <td>
              <select v-model="deviceAttr.staAvgNmCd" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in statAvgTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
            <td>
              <select v-model="deviceAttr.detNmCd" @change="fnSetObjUpdateMode(deviceAttr)" class="form-control">
                <option :value="null">{{$t('un-selected')}}</option>
                <option v-for="(value, index) in symptomTypes" :key="index" :value="value">{{value}}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="btn-wrap">
      <button @click="fnSaveDeviceAttr" :disabled="isNew" type="button" class="btn btn-pink">{{$t('save')}}</button>
      <button @click="fnDeleteDeivceAttr" :disabled="isNew" type="button" class="btn btn-gray ">{{$t('delete')}}</button>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import TbIotDevAttrDTO from '@/api/ccp/dto/TbIotDevAttrDTO'
import { getCommonCode, getCommonCodeSubString } from '@/api/common/code'
import { isNumber } from '@/utils/check'

export default {
  name: 'DeviceAttrComp',
  components: {},
  props: {
    sdevSeq: {
      type: String,
      required: true
    },
    xMid: {
      type: String,
      required: true
    },
    deviceModelData: {
      type: Object
    },
    svcCd: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      deviceAttrs: [],
      selectedDeviceAttr: {},
      checkAll: false,
      deviceAttrCodes: [
        { key: 'collectTypes', value: 'DY00000001' }, // ????????????
        { key: 'controlTypes', value: 'DY00000002' }, // ????????????
        { key: 'statAvgTypes', value: 'DY00000003' }, // ?????? AVG??????
        { key: 'statSumTypes', value: 'DY00000004' }, // ?????? SUM??????
        { key: 'symptomTypes', value: 'DY00000005' } // ????????????
      ],
      unitTypes: null, // ?????? ?????? (SelectBox)
      collectTypes: null, // ???????????? ????????? ?????? (SelectBox)
      controlTypes: null, // ???????????? ????????? ?????? (SelectBox)
      statAvgTypes: null, // ?????? AVG?????? ????????? ?????? (SelectBox)
      statSumTypes: null, // ?????? SUM?????? ????????? ??????
      symptomTypes: null, // ???????????? ????????? ?????? (SelectBox)
      bundleExcelDeviceAttr: { // ???????????? ???????????? ????????????
        download: {
          url: '/online/iotdev/createIotPasteDevAttrTemp',
          data: {},
          headers: {
            'X-MID': this.xMid
          }
        },
        upload: {
          url: '/online/iotdev/createIotDevAttrAll',
          data: {},
          headers: {
            'X-MID': this.xMid
          }
        }
      }
    }
  },
  computed: {
    isNew() {
      return !this.sdevSeq || this.sdevSeq === ''
    }
  },
  watch: {
    sdevSeq() {
      if (!this.isNew) {
        this.fnGetDeviceAttr()
      }
    }
  },
  created() {
    if (!this.isNew) {
      this.fnGetDeviceAttr()
    }
    this.fnGetCommonCodes()
  },
  mounted() {},
  methods: {
    fnGetCommonCodes() {
      // ?????? ???????????? ??????
      this.deviceAttrCodes.forEach((deviceAttrType) => {
        getCommonCodeSubString({ xMid: this.xMid, parentCdId: deviceAttrType.value })
          .then((data) => {
            this[deviceAttrType.key] = data
          }).catch((e) => {
            console.error(e)
          })
      })

      // ?????? ?????? ??????
      getCommonCode({ xMid: this.xMid, parentCdId: 'GN00000012' })
        .then((data) => {
          this.unitTypes = data.map((unit) => {
            return unit.cdNm
          })
        }).catch((e) => {
          console.error(e)
        })
    },
    fnGetDeviceAttr() {
      requestApi({
        url: '/online/iotdev/retrieveIotDevAttr',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          svcDevSeq: this.sdevSeq
        },
        callback: (data) => {
          this.deviceAttrs = data.data.map((deviceAttr) => {
            return new TbIotDevAttrDTO(deviceAttr)
          })
        }
      })
    },
    fnSaveDeviceAttr() {
      this.confirm(this.$t('confirm-reload'), this.fnSaveDeviceAttrAPI)
    },
    fnSaveDeviceAttrAPI() {
      let selectedDeviceAttrList = this.deviceAttrs.filter(deviceAttr => deviceAttr.selected && deviceAttr.mode)
      if (selectedDeviceAttrList.length === 0) {
        this.alert(this.$t('no-selected-attb-or-modifyed-item'), 'warning')
        return
      }
      // ?????? ??? ??????
      let validation = true
      let validOrderNo = true
      selectedDeviceAttrList.forEach(deviceAttr => {
        if (!deviceAttr.orderNo || !deviceAttr.inputType) {
          validation = false
        }
        if (!isNumber(deviceAttr.orderNo)) {
          validOrderNo = false
        }
      })
      if (!validOrderNo) {
        this.alert(this.$t('alert-input-number').replace('$0', this.$t('order')), 'warning')
        return
      }

      // ?????????????????? (????????????:DEV, ????????????:ENTR)
      selectedDeviceAttrList.forEach(deviceAttr => {
        deviceAttr.devAttbType = 'DEV'
        deviceAttr.svcCd = this.svcCd
      })

      // ?????? ??????(row)?????? ????????? ?????? ????????? ??????
      let colNmCdList = []
      let conNmCdList = []
      let staAvgNmCdList = []
      let staSumNmCdList = []
      let detNmCdList = []
      let duplColumn = null
      this.deviceAttrs.forEach(deviceAttr => {
        if (deviceAttr.colNmCd) {
          if (colNmCdList.includes(deviceAttr.colNmCd)) {
            duplColumn = this.$t('collect-target') + ' ' + this.$t('column-name')
          } else {
            colNmCdList.push(deviceAttr.colNmCd)
          }
        }
        if (deviceAttr.conNmCd) {
          if (conNmCdList.includes(deviceAttr.conNmCd)) {
            duplColumn = this.$t('control-target') + ' ' + this.$t('column-name')
          } else {
            conNmCdList.push(deviceAttr.conNmCd)
          }
        }
        if (deviceAttr.staAvgNmCd) {
          if (staAvgNmCdList.includes(deviceAttr.staAvgNmCd)) {
            duplColumn = this.$t('stat-avg-target') + ' ' + this.$t('attribute-name')
          } else {
            staAvgNmCdList.push(deviceAttr.staAvgNmCd)
          }
        }
        if (deviceAttr.staSumNmCd) {
          if (staSumNmCdList.includes(deviceAttr.staSumNmCd)) {
            duplColumn = this.$t('stat-sum-target') + ' ' + this.$t('attribute-name')
          } else {
            staSumNmCdList.push(deviceAttr.staSumNmCd)
          }
        }
        if (deviceAttr.detNmCd) {
          if (detNmCdList.includes(deviceAttr.detNmCd)) {
            duplColumn = this.$t('symptom-target') + ' ' + this.$t('column-name')
          } else {
            detNmCdList.push(deviceAttr.detNmCd)
          }
        }
      })

      if (!validation || duplColumn) {
        let msg = validation === false ? this.$t('alert-no-inputed-attb-requered-order-type') : this.$t('duplicate-data').replace('$0', duplColumn)
        this.alert(msg, 'warning')
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevAttrParam',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tbIotDevAttrDTOList: selectedDeviceAttrList
        },
        callback: (data) => {
          if (data.result.status === '200') {
            this.fnGetDeviceAttr()
            this.alert(this.$t('save-success'), 'success')
            this.fnClearDeviceAttr()
          }
        }
      })
    },
    fnClearDeviceAttr() {
      this.selectedDeviceAttr = null // ????????? ???????????? ????????????
      this.$refs.allCheckDeviceAttr.checked = false // ???????????? ?????? ??????
      this.$emit('selected', this.selectedDeviceAttr)
      this.$emit('clearSets')
    },
    fnDeleteDeivceAttr() {
      // ???????????? ????????? ??????
      let selectedDeviceAttrList = this.deviceAttrs.filter(deviceAttr => deviceAttr.selected)
      if (selectedDeviceAttrList.length === 0) {
        this.alert(this.$t('alert-not-selected-attb'), 'warning')
        return
      }
      // ?????? ????????? ?????? ????????? seq?????? ?????? DB??? ?????? ???????????? ??????
      selectedDeviceAttrList = selectedDeviceAttrList.filter(deviceAttr => deviceAttr.sdevAttbSeq)

      selectedDeviceAttrList.forEach(deviceAttr => { // mode??? D??? ??????
        deviceAttr.mode = 'D'
      })

      // ?????? ????????? ????????? ???????????? ???????????? ????????? ??????.
      if (!selectedDeviceAttrList.length) {
        this.fnResetDeviceAttrs()
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevAttrParam',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tbIotDevAttrDTOList: selectedDeviceAttrList
        },
        callback: (data) => {
          if (data.result.status === '200') {
            this.selectedDeviceAttr = null // ????????? ???????????? ????????????
            this.deviceAttrSets = [] // ????????? ????????????SET ?????????
            this.deviceDetSets = [] // ????????? ??????????????????SET ?????????
            this.fnResetDeviceAttrs()
            this.alert(this.$t('del-success'), 'success')
          }
        }
      })
    },
    fnResetDeviceAttrs() {
      this.deviceAttrs = this.deviceAttrs.filter(deviceAttr => !deviceAttr.selected) // ????????? ?????? ??????????????? ??????
      this.$refs.allCheckDeviceAttr.checked = false // ???????????? ?????? ??????
    },
    fnAddDeviceAttr() {
      this.popup({
        component: () => import('@/components/CommonCode'),
        title: this.$t('commoncode'),
        width: '600',
        height: '450',
        data: {
          depth2: 'DA00000000', // ???????????? ???????????? CD_ID
          isMultiSelect: true, // ???????????? ????????? ?????? ????????????
          isParentSelect: false // (??????????????? ??????)???????????? ?????? ????????????
        },
        callback: (data) => {
          if (!data || data === 'dismiss') {
            return
          }
          // ?????? ?????????????????? ??????????????? ???????????? Max??? ?????? (????????? ????????? ????????? ????????? ???????????? ?????? ????????????)
          let orderMaxValue = 0
          this.deviceAttrs.forEach(deviceAttr => {
            orderMaxValue = (orderMaxValue > parseInt(deviceAttr.orderNo)) ? orderMaxValue : parseInt(deviceAttr.orderNo)
          })
          let devAttbCdIds = this.deviceAttrs.map(deviceAttr => deviceAttr.devAttbCdId)
          data.forEach(commonCode => {
            if (devAttbCdIds.includes(commonCode.cdId) === false) { // ?????? ?????? ???????????? ??????
              this.deviceAttrs.push(new TbIotDevAttrDTO({
                selected: true,
                mode: 'I',
                sdevSeq: this.deviceModelData.sdevSeq,
                devClsCd: this.deviceModelData.devClsCd,
                devClsCdNm: this.deviceModelData.devClsCdNm,
                devMdlCd: this.deviceModelData.devMdlCd,
                devMdlNm: this.deviceModelData.devMdlNm,
                devAttbCdId: commonCode.cdId,
                devAttbCdNm: commonCode.cdNm,
                orderNo: orderMaxValue + 1,
                inputType: 'INPUT',
                colNmCd: this.collectTypes[orderMaxValue]
              }))
              orderMaxValue++
            }
          })
        }
      })
    },
    fnGetAttrSets(deviceAttr) {
      if (!deviceAttr.sdevAttbSeq) {
        this.alert(this.$t('unregistered-device-attb'), 'warning')
        return
      }
      this.selectedDeviceAttr = deviceAttr
      this.$emit('selected', this.selectedDeviceAttr)
    },
    fnCheckAll(event) {
      this.deviceAttrs.forEach((element) => {
        element.selected = event.target.checked
      })
    },
    fnSetObjUpdateMode(object) { // ??? ?????? ??? ???????????? ?????? ??? ?????? ?????? mode ????????????
      if (object) {
        object.selected = true
        if (object && !object.mode) {
          object.mode = 'U'
        }
      }
    },
    fnUploadExcelPopup() {
      let data = _.merge(this.bundleExcelDeviceAttr, { upload: { data: { sDevSeq: this.sdevSeq, svcCd: this.svcCd, devClsCd: this.deviceModelData.devClsCd, devMdlCd: this.deviceModelData.devMdlCd } } })
      this.popup({
        component: () => import('@/components/BundleExcel'),
        title: this.$t('addAll'),
        width: '500',
        height: '250',
        data: data,
        callback: (res) => {
          if (res === true) { // ???????????? ????????? ?????? ??? ?????? ????????? ????????????
            this.fnGetDeviceAttr()
          }
        }
      })
    }
  }
}
</script>

<style></style>
