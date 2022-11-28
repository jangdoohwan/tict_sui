<template>
  <div>
    <div class="modal-body">
      <detection-device-list-comp
        ref="deviceList"
        @selected="fnSelecteDevice"
      ></detection-device-list-comp>
      <div class="form-row mt-3">
        <detection-attb-list-comp
          ref="attbList"
          class="md-width-100 width-50 pr-2 md-p-0"
          :device="device"
        ></detection-attb-list-comp>
        <detection-alarm-info-comp
          ref="alarmInfo"
          class="md-width-100 width-50 pl-2 md-p-0 md-pt-3"
        ></detection-alarm-info-comp>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="fnSave()" type="button" class="btn btn-pink">
          {{ $t('save') }}
        </button>
        <button @click="fnClose()" type="button" class="btn btn-gray">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DetectionDeviceListComp from './DetectionDeviceListComp'
import DetectionAttbListComp from './DetectionAttbListComp'
import DetectionAlarmInfoComp from './DetectionAlarmInfoComp'
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'DetectionAlarmAddPopupSvc',
  components: {
    DetectionDeviceListComp,
    DetectionAttbListComp,
    DetectionAlarmInfoComp
  },
  props: {
    data: {
      type: Object,
      required: true
    },
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
      xMid: 'P04102',
      device: {}
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    fnSelecteDevice(device) {
      this.device = device
    },
    fnSave() {
      let deviceData = this.$refs.deviceList.fnGetDeviceData()
      let attbList = this.$refs.attbList.fnGetAttbList()

      // 이상징후 알람 상세 등록 시 유효성 검사
      // 선택된 대상 장비 없는 경우
      if (deviceData.deviceList.length === 0 && !deviceData.flagAllDevice) {
        this.alert('대상 장비를 선택해주세요')
        return
      }

      // 이상징후 조건 선택하지 않은 경우
      if (!deviceData.flagAllDevice && attbList.length === 0) {
        this.alert('이상징후 조건을 선택해주세요.')
        return
      }

      // 이상징후 조건 입력하지 않은 경우
      for (let i = 0; i < attbList.length; i++) {
        if (attbList[i].detSetCond.length === 0) {
          this.alert(this.$t('sms-det-attb-input-chk-msg'))
          return
        }
      }

      let alarmData = JSON.parse(
        JSON.stringify(this.$refs.alarmInfo.fnGetAlarmData())
      )
      if (alarmData.smsSendYn === 'Y' || alarmData.alrmPopYn === 'Y' || alarmData.emrgPopYn === 'Y') {
        // 알람 형태 선택 후 수신자 추가하지 않은 경우
        if (alarmData.rcvList.length === 0) {
          this.alert('수신자를 추가해주세요.')
          return
          // 알람 형태 선택 후 알람메시지 입력하지 않은 경우
        } else if (
          alarmData.sendMsg === '' ||
          alarmData.sendMsg.trim() === ''
        ) {
          this.alert('알람메시지를 입력해주세요.')
          return
        }
      }

      this.confirm('이상징후 알람을 등록 하시겠습니까?', this.fnSaveApi)
    },
    fnSaveApi() {
      let deviceData = this.$refs.deviceList.fnGetDeviceData()
      let attbList = this.$refs.attbList.fnGetAttbList()
      let alarmData = this.$refs.alarmInfo.fnGetAlarmData()

      let reqData = {
        svcCd: deviceData.svcCd,
        devClsCd: deviceData.devClsCd,
        devMdlCd: deviceData.devMdlCd,
        flagAllDevice: deviceData.flagAllDevice,
        attbList: attbList,
        deviceList: deviceData.deviceList
      }
      Object.assign(reqData, alarmData)

      requestApi({
        url: '/online/iotedevdetsms/createEdevDetSet',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnClose() {
      this.close()
    }
  }
}
</script>

<style></style>
