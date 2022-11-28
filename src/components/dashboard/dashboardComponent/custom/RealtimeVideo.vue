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
          {{ device.name }}
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
    ></web-rtc-player>
  </div>
</template>

<script>
import { vpRealtimeRequest } from '@/api/ccp/vpRealtimeRequest'
import WebRtcPlayer from '@/components/WebRtcPlayer'
import { realtime } from '@/envs'

export default {
  name: 'RealtimeVideo',
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
      wsUri: '',
      rtspUri: null,
      directions: [
        'PT_08',
        'PT_01',
        'PT_02',
        'PT_07',
        'PT_03',
        'PT_06',
        'PT_05',
        'PT_04'
      ]
    }
  },
  computed: {
    useControl() {
      return (
        this.device &&
        this.device.functions &&
        this.device.functions.includes('PT')
      )
    }
  },
  watch: {
    device() {
      if (!this.device.id) {
        this.clearDevice()
      } else {
        this.fnGetRtspUrl()
      }
    }
  },
  created() {
    this.wsUri = realtime.websocketUrl
    this.fnInit()
  },
  mounted() {},
  methods: {
    // -------------------- 데이터 및 토큰 조회
    async fnInit() {
      this.fnGetPlayDeviceList()
    },
    fnGetPlayDeviceList() {
      vpRealtimeRequest({
        url: '/online/vpcom/realtime/retrieveBroadcastList',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: {}
      }).then(res => {
        if (res.result.status === '200') {
          // TODO: d.broadcast.streamings.key가 있는 디바이스를 재생 가능한 것으로 보이나
          // 모든 디바이스가 null로 와서 이후 테스트 불가하여 주석 처리
          //
          // this.deviceList = res.data.device_groups[0].devices.filter(
          //   d => d.broadcast && d.broadcast.streamings && d.broadcast.streamings.key
          // )
          this.deviceList = res.data.device_groups[0].devices
        }
      })
    },
    fnGetRtspUrl() {
      // device.broadcast.streamings.key가 jobId
      // 현재 모든 device가 null로 와서 기본 세팅
      let jobId = 'job_1'
      if (
        this.device.broadcast &&
        this.device.broadcast.streamings &&
        this.device.broadcast.streamings.length > 0
      ) {
        let streaming = this.device.broadcast.streamings[this.device.broadcast.streamings.length - 1]
        if (streaming && streaming.key) {
          jobId = streaming.key
        }
      }
      let reqData = {
        deviceId: this.device.id,
        jobId: jobId
      }

      vpRealtimeRequest({
        url: '/online/vpcom/realtime/retreivePlayInfo',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: reqData
      }).then(res => {
        if (res.result.status === '200' && res.data.rtspUrl) {
          this.rtspUri = res.data.rtspUrl
        } else {
          if (res.data && res.data.errCode) {
            this.alert('영상을 재생할 수 없습니다.[' + res.data.errCode + ']')
          } else {
            console.error('[RealtimeVideo] fail to fnGetRtspUrl ', res)
          }
        }
      })
    },
    fnControl(direction) {
      if (!this.device.id) {
        return
      }
      let reqData = {
        ptzControl: direction,
        ptzSpeed: 10,
        deviceId: this.device.id
      }
      vpRealtimeRequest({
        url: '/online/vpcom/realtime/controlPtz',
        headers: { 'X-MID': this.xMid },
        method: 'post',
        data: reqData
      }).then(res => {
        if (res.result.status !== '200' || parseInt(res.data.code) !== 200) {
          console.error('[RealtimeVideo] fail to fnControl ', res)
          // this.alert('영상 제어 시 오류가 발생했습니다.')
        }
      })
    },
    clearDevice() {
      this.videoSrc = ''
    }
  }
}
</script>

<style lang="less" scoped></style>
