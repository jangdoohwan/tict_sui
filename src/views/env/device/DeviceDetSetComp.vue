<template>
  <div class="col-md-6">
    <div class="tit-wrap btn-in">
      <h4 class="titH4">
        {{ $t('device-symptom-set') }}
        {{
          selectedDeviceAttr
            ? `(${selectedDeviceAttr.devClsCdNm} - ${selectedDeviceAttr.devAttbCdNm})`
            : ''
        }}
      </h4>
      <div class="pull-right">
        <button
          @click="fnUploadExcelPopup"
          :disabled="!selectedDeviceAttr ? true : false"
          type="button"
          class="btn btn-pink rounded"
        >
          {{ $t('addAll') }}
        </button>
        <button
          @click="fnAddDeviceDetectSet"
          :disabled="!selectedDeviceAttr ? true : false"
          class="btn btn-info"
          type="button"
        >
          {{ $t('add') }}
        </button>
      </div>
    </div>
    <div class="table-wrap y-scroll set-table-height">
      <table class="table table-col">
        <caption>
          {{
            $t('device-attr')
          }}
          {{
            $t('registration')
          }}
        </caption>
        <colgroup>
          <col style="width:50px" />
          <col style="width:auto" />
          <col style="width:auto" />
          <col style="width:auto" />
          <col style="width:auto" />
          <col style="width:auto" />
          <col style="width:auto" />
          <col style="width:auto" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">
              <label class="checkbox">
                <input
                  ref="allCheckDeviceDetSet"
                  @change="fnCheckAll($event)"
                  role="checkbox"
                  class="cbox"
                  type="checkbox"
                /><i></i>
              </label>
            </th>
            <th scope="col">{{ $t('attb-code') }}</th>
            <th scope="col">{{ $t('attribute-name') }}</th>
            <th scope="col">{{ $t('symptom-set-code') }}</th>
            <th scope="col">{{ $t('symptom-set-name') }}</th>
            <th scope="col">
              <span class="lb-txt">{{ $t('condition') }}</span>
            </th>
            <th scope="col">{{ $t('icon') }}</th>
            <th scope="col">{{ $t('description') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(deviceDetSet, index) in deviceDetSets" :key="index">
            <td>
              <label class="checkbox"
                ><input
                  v-model="deviceDetSet.selected"
                  role="checkbox"
                  class="cbox"
                  type="checkbox"/><i></i
              ></label>
            </td>
            <td>{{ selectedDeviceAttr.devAttbCdId }}</td>
            <td>{{ selectedDeviceAttr.devAttbCdNm }}</td>
            <td>
              <input
                v-model="deviceDetSet.devDetSetCdId"
                type="text"
                disabled
              />
            </td>
            <td>
              <input
                v-model="deviceDetSet.devDetSetCdNm"
                type="text"
                disabled
              />
            </td>
            <td>
              <input
                v-model="deviceDetSet.detSetCond"
                @input="fnSetObjUpdateMode(deviceDetSet)"
                type="text"
                maxlength="50"
              />
            </td>
            <td>
              <input
                v-model="deviceDetSet.iconUrl"
                @input="fnSetObjUpdateMode(deviceDetSet)"
                type="text"
                maxlength="256"
              />
            </td>
            <td>
              <input
                v-model="deviceDetSet.detSetDesc"
                @input="fnSetObjUpdateMode(deviceDetSet)"
                type="text"
                maxlength="85"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="btn-wrap">
      <button
        @click="fnSaveDeviceDetectSet"
        :disabled="!selectedDeviceAttr ? true : false"
        type="button"
        class="btn btn-pink"
      >
        {{ $t('save') }}
      </button>
      <button
        @click="fnDeleteDeviceDetectSet()"
        :disabled="!selectedDeviceAttr ? true : false"
        type="button"
        class="btn btn-gray "
      >
        {{ $t('delete') }}
      </button>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import TbIotDevDetSetDTO from '@/api/ccp/dto/TbIotDevDetSetDTO'
import { isIncludeKorean } from '@/utils/check'

export default {
  name: 'DeviceDetSetComp',
  components: {},
  props: {
    xMid: {
      type: String,
      required: true
    },
    selectedDeviceAttr: {
      type: Object,
      default: null
    },
    svcCd: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      deviceDetSets: [],
      bundleExcelDeviceDetSet: {
        // ??????????????????SET ???????????? ????????????
        download: {
          url: '/online/iotdev/createIotPasteDevDetSetTemp',
          data: {},
          headers: {
            'X-MID': this.xMid
          }
        },
        upload: {
          url: '/online/iotdev/createIotDevDetSetAll',
          data: {},
          headers: {
            'X-MID': this.xMid
          }
        }
      }
    }
  },
  computed: {},
  watch: {
    selectedDeviceAttr() {
      if (this.selectedDeviceAttr && this.selectedDeviceAttr.sdevAttbSeq) {
        this.fnGetDeviceDetectSet()
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    fnGetDeviceDetectSet() {
      requestApi({
        url: '/online/iotdev/retrieveIotDevDetSet',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          sdevAttbSeq: this.selectedDeviceAttr.sdevAttbSeq
        },
        callback: data => {
          this.deviceDetSets = data.data.map(deviceAttr => {
            return new TbIotDevDetSetDTO(deviceAttr)
          })
        }
      })
    },
    fnSaveDeviceDetectSet() {
      this.confirm(this.$t('confirm-reload'), this.fnSaveDeviceDetectSetAPI)
    },
    fnSaveDeviceDetectSetAPI() {
      let validation = true

      if (this.deviceDetSets.length === 0) {
        validation = false
      }
      if (!validation) {
        this.alert(this.$t('alert-not-symptom'), 'warning')
        return
      }

      let selectedDeviceDetSetList = this.deviceDetSets.filter(
        deviceDetSet => deviceDetSet.selected && deviceDetSet.mode
      )

      // ?????? ?????? SET ???????????? ?????? ???????????? ?????? ??????
      selectedDeviceDetSetList.forEach(item => {
        if (
          !item.detSetCond ||
          (item.detSetCond && item.detSetCond.trim() === '')
        ) {
          validation = false
        }
      })
      if (!validation) {
        this.alert(this.$t('alert-not-inputed-symptom'), 'warning')
        return
      }

      // ?????? ???????????? SET ???????????? ?????? ????????? ????????? ??????
      selectedDeviceDetSetList.forEach(deviceDetSet => {
        if (
          !deviceDetSet.detSetCond ||
          isIncludeKorean(deviceDetSet.detSetCond) ||
          isIncludeKorean(deviceDetSet.iconUrl)
        ) {
          validation = false
        }
        deviceDetSet.svcCd = this.svcCd
      })
      if (!validation) {
        this.alert(this.$t('alert-korean-inputed-symptom'), 'warning')
        return
      }

      // ?????? ???????????? SET ???????????? ?????? ???????????? ?????? ??????
      if (selectedDeviceDetSetList.length === 0) {
        this.alert(this.$t('no-selected-symptom-or-modifyed-item'), 'warning')
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevDetSetParam',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tbIotDevDetSetDTOList: selectedDeviceDetSetList
        },
        callback: data => {
          if (data.result.status === '200') {
            this.fnGetDeviceDetectSet()
            this.$refs.allCheckDeviceDetSet.checked = false // ???????????? ?????? ??????
            this.alert(this.$t('save-success'), 'success')
          }
        }
      })
    },
    fnAddDeviceDetectSet() {
      this.popup({
        component: () => import('@/components/CommonCode'),
        title: this.$t('commoncode'),
        width: '500',
        height: '500',
        data: {
          depth2: 'DS00000000', // ???????????? ????????????SET CD_ID
          depth3: 'DS00000001', // ???????????? ??????????????????SET CD_ID
          isMultiSelect: true, // ???????????? ????????? ?????? ????????????
          isParentSelect: false // (??????????????? ??????)???????????? ?????? ????????????
        },
        callback: data => {
          if (data && data !== 'dismiss') {
            let devDetSetCdIds = this.deviceDetSets.map(
              deviceDetSet => deviceDetSet.devDetSetCdId
            )
            data.forEach(commonCode => {
              if (devDetSetCdIds.includes(commonCode.cdId) === false) {
                // ?????? ?????? ???????????? ??????
                this.deviceDetSets.push(
                  new TbIotDevDetSetDTO({
                    selected: true,
                    mode: 'I',
                    devAttbSeq: this.selectedDeviceAttr.devAttbSeq,
                    sdevAttbSeq: this.selectedDeviceAttr.sdevAttbSeq,
                    devDetSetCdId: commonCode.cdId,
                    devDetSetCdNm: commonCode.cdNm
                  })
                )
              }
            })
          }
        }
      })
    },
    fnDeleteDeviceDetectSet() {
      let context = this
      // ???????????? ????????? ??????
      let selectedDeviceDetSetList = this.deviceDetSets.filter(
        deviceDetSet => deviceDetSet.selected
      )
      if (selectedDeviceDetSetList.length === 0) {
        this.alert(this.$t('alert-not-selected-symptom'), 'warning')
        return
      }
      // ?????? ????????? ?????? ????????? seq?????? ?????? DB??? ?????? ???????????? ??????
      selectedDeviceDetSetList = selectedDeviceDetSetList.filter(
        deviceDetSet => deviceDetSet.sdevDetSetSeq
      )

      selectedDeviceDetSetList.forEach(deviceDetSet => {
        // mode??? D??? ??????
        deviceDetSet.mode = 'D'
      })

      // ?????? ????????? ????????? ???????????? ???????????? ????????? ??????.
      if (!selectedDeviceDetSetList.length) {
        afterProcess()
        return
      }

      requestApi({
        url: '/online/iotdev/taskIotDevDetSetParam',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          tbIotDevDetSetDTOList: selectedDeviceDetSetList
        },
        callback: data => {
          if (data.result.status === '200') {
            afterProcess()
            this.alert(this.$t('del-success'), 'success')
          }
        }
      })
      function afterProcess() {
        context.deviceDetSets = context.deviceDetSets.filter(
          deviceDetSet => !deviceDetSet.selected
        ) // ????????? ?????? ??????????????? ??????
        context.$refs.allCheckDeviceDetSet.checked = false // ???????????? ?????? ??????
      }
    },
    fnCheckAll(event) {
      this.deviceDetSets.forEach(element => {
        element.selected = event.target.checked
      })
    },
    fnSetObjUpdateMode(object) {
      if (object) {
        object.selected = true
        if (object && !object.mode) {
          object.mode = 'U'
        }
      }
    },
    fnUploadExcelPopup() {
      let data = _.merge(this.bundleExcelDeviceDetSet, {
        upload: {
          data: {
            sdevAttbSeq: this.selectedDeviceAttr.sdevAttbSeq,
            svcCd: this.selectedDeviceAttr.svcCd
          }
        }
      })
      this.popup({
        component: () => import('@/components/BundleExcel'),
        title: this.$t('addAll'),
        width: '500',
        height: '250',
        data: data,
        callback: res => {
          if (res === true) {
            // ???????????? ????????? ?????? ??? ?????? ????????? ????????????
            this.fnGetDeviceAttrSet()
          }
        }
      })
    },
    fnClearDeviceDetectSet() {
      this.deviceDetSets = []
    }
  }
}
</script>

<style></style>
