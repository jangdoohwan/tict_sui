<template>
  <div>
    <div class="modal-body">
      <div class="border-1 px-2 py-2">
        <div class="form-row row">
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('service') }}</span>
            <select
              v-model="deviceModelData.svcCd"
              ref="svcCd"
              class="form-control"
              title="서비스"
              :disabled="!isNew"
            >
              <option
                v-for="(svc, index) in svcCdList"
                :key="`svcCd-${index}`"
                :value="svc.svcCd"
                >{{ svc.svcCdNm }}</option
              >
            </select>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('dev-cls') }}</span>
            <select
              v-model="deviceModelData.devClsCd"
              class="form-control"
              :disabled="!isNew"
            >
              <option value="">{{ $t('select') }}</option>
              <option
                v-for="(devCls, index) in devClsList"
                :key="`devCls-${index}`"
                :value="devCls.devClsCd"
                >{{ devCls.devClsNm }}</option
              >
            </select>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('model-code') }}</span>
            <div class="input-group">
              <input
                ref="devMdlCd"
                v-model="deviceModelData.devMdlCd"
                type="text"
                class="form-control"
                maxlength="20"
                :title="`$t('model-code') $t('input')`"
                @change="flagDuplDevMdlCd = false"
                :disabled="!isNew"
              />
              <button
                class="btn btn-gray input-group-addon"
                type="button"
                @click="checkDuplDevMdlCd"
                :disabled="!isNew"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('dev-mdl-nm') }}</span>
            <div class="input-group">
              <input
                ref="devMdlNm"
                v-model="deviceModelData.devMdlNm"
                type="text"
                class="form-control"
                maxlength="16"
                :title="`$t('dev-mdl-nm') $t('input')`"
                @change="flagDuplDevMdlNm = false"
              />
              <button
                class="btn btn-gray input-group-addon"
                type="button"
                @click="checkDuplDevMdlNm"
              >
                {{ $t('duplication-check') }}
              </button>
            </div>
          </div>
        </div>
        <div class="form-row row">
          <div class="form-item col-sm-3">
            <span class="form-label w-32 lb-txt">{{ $t('manufacturer') }}</span>
            <input
              v-model="deviceModelData.vendorNm"
              type="text"
              class="form-control"
              maxlength="16"
              :title="`$t('manufacturer') $t('input')`"
            />
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32">{{ $t('device-value') }}</span>
            <input
              ref="devMdlVal"
              v-model="deviceModelData.devMdlVal"
              min="0"
              maxlength="20"
              type="number"
              class="form-control"
              placeholder="Number"
              :title="$t('model-value')"
            />
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32">{{ $t('parentYn') }}</span>
            <select class="form-control" v-model="deviceModelData.parentDevSeq">
              <option :value="1" selected>{{ $t('use') }}</option>
              <option :value="0">{{ $t('use-no') }}</option>
            </select>
          </div>
          <div class="form-item col-sm-3">
            <span class="form-label w-32">{{ $t('eq-code') }}</span>
            <input
              v-model="deviceModelData.eqCode"
              type="text"
              class="form-control"
              maxlength="16"
              :title="$t('eq-code')"
            />
          </div>
        </div>
        <div class="text-right mt-3">
          <button @click="fnSaveModel" type="button" class="btn btn-pink">
            {{ $t('save') }}
          </button>
        </div>
      </div>
      <div class="grid-container grid-scroll mt-3">
        <div class="row">
          <!-- 장비 속성 -->
          <device-attr-comp
            ref="deviceAttr"
            :xMid="xMid"
            :sdevSeq="sdevSeq"
            :device-model-data="deviceModelData"
            :svcCd="deviceModelData.svcCd"
            @clearSets="fnClearSets"
            @selected="fnSelectedDeviceAttr"
          ></device-attr-comp>
        </div>
        <div class="row half full-size">
          <device-attr-set-comp
            ref="deviceAttrSet"
            :xMid="xMid"
            :selected-device-attr="selectedDeviceAttr"
            :svcCd="deviceModelData.svcCd"
          ></device-attr-set-comp>
          <device-det-set-comp
            ref="deviceDetSet"
            :xMid="xMid"
            :selected-device-attr="selectedDeviceAttr"
            :svcCd="deviceModelData.svcCd"
          ></device-det-set-comp>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import DeviceAttrComp from './DeviceAttrComp'
import DeviceAttrSetComp from './DeviceAttrSetComp'
import DeviceDetSetComp from './DeviceDetSetComp'
import { isAlphaHyphenUnderscore } from '@/utils/check'
import { getSvcList, getDevClsCdListBySvcCd } from '@/api/common/usrSvcDevice'

export default {
  name: 'DeviceCreateModifySvc',
  components: { DeviceAttrComp, DeviceAttrSetComp, DeviceDetSetComp },
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
      xMid: 'P08402',
      sdevSeq: '',
      deviceModelData: {
        svcCd: '',
        devClsCd: '',
        devMdlCd: '',
        devMdlNm: '',
        useYn: 'Y',
        vendorNm: '',
        devMdlVal: '',
        parentDevSeq: 0,
        eqCode: ''
      },
      svcCdList: [],
      devClsList: [],
      flagDuplDevMdlCd: false,
      flagDuplDevMdlNm: false,
      selectedDeviceAttr: null
    }
  },
  computed: {
    isNew() {
      return !this.sdevSeq || this.sdevSeq === ''
    }
  },
  watch: {
    'deviceModelData.svcCd'() {
      this.fnGetDevClsList()
    }
  },
  created() {
    if (this.data.sdevSeq) {
      this.sdevSeq = this.data.sdevSeq
      this.fnGetDeviceModel()
    }
    this.fnGetSvcCdList()
  },
  mounted() {},
  methods: {
    // ------------------- 모델 영역
    fnGetSvcCdList() {
      getSvcList({ xMid: this.xMid })
        .then(data => {
          this.svcCdList = data
          if (this.svcCdList.length > 0) {
            if (this.isNew) {
              this.deviceModelData.svcCd = this.svcCdList[0].svcCd
            }
          }
        })
        .catch(e => {
          console.error(e)
        })
    },
    fnGetDevClsList() {
      if (this.isNew) {
        this.deviceModelData.devClsCd = ''
      }
      this.devClsList = []
      if (this.deviceModelData.svcCd === '') {
        return false
      }
      getDevClsCdListBySvcCd({
        xMid: this.xMid,
        svcCd: this.deviceModelData.svcCd
      })
        .then(data => {
          this.devClsList = data.devClsList
        })
        .catch(e => {
          console.error(e)
        })
    },
    checkDuplDevMdlCd() {
      // 모델코드 중복 확인 시 유효성 검사
      // 모델코드 입력되지 않은 경우
      if (
        !this.deviceModelData.devMdlCd ||
        this.deviceModelData.devMdlCd.trim() === ''
      ) {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('model-code')),
          'warning'
        )
        this.$refs.devMdlCd.focus()
        return
      }
      // 모델코드 모델ID는 LGE_로 시작되는 경우
      if (this.deviceModelData.devMdlCd.startsWith('LGE_')) {
        this.alert(this.$t('model-id-can-not-start-lge'), 'warning')
        return
      }
      // 모델코드 숫자 + 영어 조합이 아닌 경우
      if (!isAlphaHyphenUnderscore(this.deviceModelData.devMdlCd)) {
        this.alert(
          this.$t('alert-input-alpha-hyphen-underscore').replace(
            '$0',
            this.$t('model-code')
          ),
          'warning'
        )
        return
      }

      requestApi({
        url: '/online/iotdev/retrieveIotDup',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          devMdlCd: this.deviceModelData.devMdlCd,
          svcDevSeq: this.sdevSeq
        },
        callback: data => {
          if (data.result.status === '200' || data.result.status === '204') {
            this.alert(this.$t('no-duplicate-data'), 'success')
            this.flagDuplDevMdlCd = true
          } else {
            this.flagDuplDevMdlCd = false
          }
        }
      })
    },
    checkDuplDevMdlNm() {
      // 모델명 중복 확인 시 유효성 검사
      // 모델명 입력되지 않은 경우
      if (
        !this.deviceModelData.devMdlNm ||
        this.deviceModelData.devMdlNm.trim() === ''
      ) {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('dev-mdl-nm')),
          'warning'
        )
        this.$refs.devMdlNm.focus()
        return
      }

      requestApi({
        url: '/online/iotdev/retrieveIotMdlDup',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          devMdlNm: this.deviceModelData.devMdlNm,
          svcDevSeq: this.sdevSeq
        },
        callback: data => {
          if (data.result.status === '200' || data.result.status === '204') {
            this.alert(this.$t('no-duplicate-data'), 'success')
            this.flagDuplDevMdlNm = true
          } else {
            this.flagDuplDevMdlNm = false
          }
        }
      })
    },
    fnGetDeviceModel() {
      if (this.sdevSeq === '') {
        return false
      }

      let reqData = {
        svcDevSeq: this.sdevSeq,
        currentPage: 1,
        displayRowCount: 15
      }

      requestApi({
        url: '/online/iotdev/retrieveIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: data => {
          if (data.data.boardList.length === 1) {
            this.deviceModelData = data.data.boardList[0]
            this.flagDuplDevMdlCd = true
            this.flagDuplDevMdlNm = true
            if (this.deviceModelData.parentDevSeq === null) {
              this.deviceModelData.parentDevSeq = '0'
            }
            this.svcCd = data.data.boardList[0].svcCd
          }
        }
      })
    },
    fnSaveModel() {
      if (!this.fnValidSaveModel()) {
        return false
      }
      this.deviceModelData.devMdlVal = !this.deviceModelData.devMdlVal
        ? null
        : this.deviceModelData.devMdlVal
      this.confirm(this.$t('saveYn')).then(() => {
        if (this.isNew) {
          this.fnAddModel()
        } else {
          this.fnUpdateModel()
        }
      })
    },
    fnUpdateModel() {
      requestApi({
        url: '/online/iotdev/updateIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.deviceModelData,
        callback: data => {
          if (data.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.fnGetDeviceModel()
            this.$refs.deviceAttr.fnGetDeviceAttr()
            this.callback()
          }
        }
      })
    },
    fnAddModel() {
      requestApi({
        url: '/online/iotdev/insertIotDev',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.deviceModelData,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.sdevSeq = res.data.devSeq
            this.fnGetDeviceModel()
          }
        }
      })
    },
    // 장비속성관리 상세 저장 시 유효성 체크
    fnValidSaveModel() {
      // 서비스 선택하지 않은 경우
      if (!this.deviceModelData.svcCd) {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('service')),
          'warning'
        )
        return false
        // 장비유형 선택하지 않은 경우
      } else if (
        !this.deviceModelData.devClsCd ||
        this.deviceModelData.devClsCd === ''
      ) {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('dev-type')),
          'warning'
        )
        return false
        // 모델코드 입력하지 않은 경우
      } else if (
        !this.deviceModelData.devMdlCd ||
        this.deviceModelData.devMdlCd.trim() === ''
      ) {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('model-code')),
          'warning'
        )
        return false
        // 모델코드 중복 확인 하지 않은 경우
      } else if (!this.flagDuplDevMdlCd) {
        this.alert(
          this.$t('model-code') + this.$t('alert-check-duplicate'),
          'warning'
        )
        return false
        // 모델명 입력하지 않은 경우
      } else if (
        !this.deviceModelData.devMdlNm ||
        this.deviceModelData.devMdlNm.trim() === ''
      ) {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('dev-mdl-nm')),
          'warning'
        )
        return false
        // 모델명 중복 확인 하지 않은 경우
      } else if (!this.flagDuplDevMdlNm) {
        this.alert(
          this.$t('dev-mdl-nm') + this.$t('alert-check-duplicate'),
          'warning'
        )
        return false
        // 제조사 입력하지 않은 경우
      } else if (
        !this.deviceModelData.vendorNm ||
        this.deviceModelData.vendorNm.trim() === ''
      ) {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('manufacturer')),
          'warning'
        )
        return false
      }

      return true
    },
    fnClearSets() {
      this.$refs.deviceAttrSet.fnClearDeviceAttrSets() // 조회한 장비속성SET 초기화
    },
    fnSelectedDeviceAttr(selectedDeviceAttr) {
      this.selectedDeviceAttr = selectedDeviceAttr
    }
  }
}
</script>

<style lang="less" scoped>
.table-height {
  height: 215px;
}
.set-table-height {
  height: 150px;
}
.selected-attr {
  background-color: #ccc;
}
</style>
