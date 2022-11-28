<template>
  <div>
    <div class="modal-body">
      <web-rtc-player :wsUri="wsUri" :rtspUri="rtspUri" :useControl="false" style="height: 400px"></web-rtc-player>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button class="btn btn-gra" @click="close">{{ $t('close') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import WebRtcPlayer from '@/components/WebRtcPlayer'
import { vpIntelligentRequest } from '@/api/ccp/vpIntelligentRequest'
import requestApi from '@/api/ccp/requestApi'
import moment from 'moment'
import { intelligent } from '@/envs'
import { removeCookie } from '@/utils/cookie'

export default {
  name: 'VpIntelligentDetectionPopupSvc',
  components: { WebRtcPlayer },
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
      xMid: 'P02001',
      wsUri: '',
      rtspUri: '',
      videoDevice: {}
    }
  },
  computed: {},
  watch: {},
  created() {
    this.wsUri = intelligent.websocketUrl
  },
  mounted() {
    this.fnGetDeviceData()
  },
  methods: {
    fnGetDeviceData() {
      requestApi({
        url: '/online/vpdevice/getIotVpDeviceDetailByEntrDevSeq',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          entrDevSeq: this.data.item.entrDevSeq
        },
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204' || res.data.status === 200 || (res.data && Object.keys(res.data).length > 0)) {
            this.videoDevice = res.data
            this.fnGetDeviceUrl()
          }
        }
      })
    },
    fnGetDeviceUrl() {
      // 토큰 만료 시 정확한 에러가 내려오지 않아서
      // 매번 호출 할 때 마다 login을 호출
      removeCookie(intelligent.accessTokenKey)
      removeCookie(intelligent.refreshTokenKey)
      vpIntelligentRequest({
        url: '/online/vpcom/intelligent/retrieveDeviceUri',
        method: 'post',
        headers: { 'X-MID': this.xMid },
        data: {
          index: this.videoDevice.vpDeviceId
        }
      }).then(res => {
        if (res.result.status === '200' && res.data.Response.GetDeviceUri) {
          let deviceUrl = res.data.Response.GetDeviceUri
          let colDate = moment(this.data.item.colDate).format('YYYYMMDD')
          let startTime = moment(this.data.item.colDate).subtract(5, 'minutes').format('HHmmss')
          let endTime = moment(this.data.item.colDate).add(5, 'minutes').format('HHmmss')
          this.rtspUri = `rtsp://${deviceUrl.Address}:${deviceUrl.VideoPort}/playback/record?channel=${deviceUrl.Channel}&start_date=${colDate}&start_time=${startTime}&end_date=${colDate}&end_time=${endTime}`
          console.log('rtspUri', this.rtspUri)
        }
      })
    }
  }
}
</script>

<style></style>
