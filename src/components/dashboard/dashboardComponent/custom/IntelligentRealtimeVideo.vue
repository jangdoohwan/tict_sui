<template>
  <div class="_dashboard-video">
    <div class="_dashboard-video-header">
      <select v-model="device" class="form-control">
        <option value="">{{ $t('stat-act-device-null-alert') }}</option>
        <option
          v-for="(device, index) in deviceList"
          :key="`device-${index}`"
          :value="device"
        >
          {{ device.Name }}
        </option>
      </select>
    </div>
    <div style="display:none">{{ rtspUri }}</div>
    <web-rtc-player
      :idx="locNo"
      :wsUri="wsUri"
      :rtspUri="rtspUri"
      :directions="directions"
      @control="fnControl"
      :useControl="useControl"
    ></web-rtc-player>
  </div>
</template>

<script>
import { vpIntelligentRequest } from '@/api/ccp/vpIntelligentRequest'
import WebRtcPlayer from '@/components/WebRtcPlayer'
import { intelligent } from '@/envs'
import { removeCookie } from '@/utils/cookie'

const delayTime = 3 * 1000

export default {
  name: 'IntelligentRealtimeVideo',
  components: { WebRtcPlayer },
  props: {
    locNo: {
      type: String
    }
  },
  data() {
    return {
      xMid: 'P02001',
      device: '',
      deviceList: [],
      recoder: {},
      wsUri: null,
      rtspUri: null,
      directions: [
        'leftup',
        'up',
        'rightup',
        'left',
        'right',
        'leftdown',
        'down',
        'rightdown'
      ]
    }
  },
  computed: {
    useControl() {
      return this.device && this.device.DeviceType === 'PTZ'
    }
  },
  watch: {
    device() {
      if (!this.device.index) {
        this.fnClearDevice()
      } else {
        this.fnGetDeviceUri()
      }
    }
  },
  created() {
    this.wsUri = intelligent.websocketUrl
    this.fnGetPlayDeviceList()
  },
  mounted() {},
  methods: {
    fnGetPlayDeviceList() {
      // 토큰 만료 시 정확한 에러가 내려오지 않아서
      // 매번 호출 할 때 마다 login을 호출
      removeCookie(intelligent.accessTokenKey)
      removeCookie(intelligent.refreshTokenKey)
      vpIntelligentRequest({
        url: '/online/vpcom/intelligent/retrieveDeviceList',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: {}
      })
        .then(res => {
          let deviceList = res.data.Response.Devices.Device
          // 지능형 연동 시스템에서 키에 @를 넣어서 보내주므로 제거 후 사용
          deviceList.forEach(device => {
            device.index = device['@index']
            device.ch = device['@ch']
            device.nrs = device['@nrs']
          })
          this.deviceList = deviceList
        })
        .catch(e => {
          console.error(
            '[IntelligentRealtimeVideo] fail to fnGetPlayDeviceList',
            e
          )
        })
    },
    fnClearDevice() {
      this.recoder = {}
      this.rtspUri = null
    },
    fnGetDeviceUri() {
      vpIntelligentRequest({
        url: '/online/vpcom/intelligent/retrieveDeviceUri',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: {
          index: this.device.index
        }
      })
        .then(res => {
          if (
            res.data.Response &&
            res.data.Response.GetDeviceUri &&
            res.data.Response.GetDeviceUri.URL &&
            res.data.Response.GetDeviceUri.URL.RtspLow) {
              this.rtspUri = res.data.Response.GetDeviceUri.URL.RtspLow
          } else {
            console.error(
              '[IntelligentRealtimeVideo] fail to fnGetPlayDeviceList', res.data.Response
            )
          }
        })
        .catch(e => {
          console.error(
            '[IntelligentRealtimeVideo] fail to fnGetPlayDeviceList',
            e
          )
        })
    },
    // fnGetRecoder() {
    //   vpIntelligentRequest({
    //     url: '/online/vpcom/intelligent/retrieveRecoder',
    //     headers: { 'X-MID': this.xMid },
    //     method: 'post',
    //     data: {
    //       index: this.device.index
    //     }
    //   })
    //     .then(res => {
    //       this.recoder = res.data.Response.Recorders.Recorder

    //       this.fnGetRtspUri()
    //     })
    //     .catch(e => {
    //       console.error(
    //         '[IntelligentRealtimeVideo] fail to fnGetPlayDeviceList',
    //         e
    //       )
    //     })
    // },
    // fnGetRtspUri() {
    //   if (
    //     !this.device ||
    //     Object.keys(this.device).length === 0 ||
    //     !this.recoder ||
    //     Object.keys(this.recoder).length === 0
    //   ) {
    //     console.error(
    //       '[IntelligentRealtimeVideo] undefined device or recorder info'
    //     )
    //     return
    //   }
    //   let address = this.recoder.Address
    //   // TODO: 개발단계 시험 시 recorder 조회 하여 가져오는 address 가져오는 것이 불가능하여
    //   // address 하드코딩함.
    //   address = '180.228.85.60'
    //   this.rtspUri = `rtsp://${address}:${this.recoder.VideoPort}/${this.device.ch}/low`
    // },
    fnControl(direction) {
      if (!this.device.index) {
        return
      }
      // 방향 제어
      this.vpIntelligentRequest({
        index: this.device.index,
        direction: direction,
        speed: 5
      })

      // 3초 후 정지
      setTimeout(() => {
        this.vpIntelligentRequest({
          index: this.device.index,
          direction: 'stop',
          speed: 5
        })
      }, delayTime)
    },
    vpIntelligentRequest(data) {
      vpIntelligentRequest({
        url: '/online/vpcom/intelligent/controlPtz',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data
      })
        .then(res => {
          console.log('[IntelligentRealtimeVideo] success control')
        })
        .catch(e => {
          console.error('[IntelligentRealtimeVideo] fail to fnControl', e)
        })
    }
  }
}
</script>

<style></style>
