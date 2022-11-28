<template>
  <div class="_dashboard-video">
    <div class="_dashboard-video-header">
      <select
        v-model="rtsp.devUname"
        class="form-control"
        @change="setViewRtspUri"
      >
        <option value="">선택</option>
        <option
          v-for="(dev, index) in view.devList"
          :key="`rtsp-dev-${index}`"
          :value="dev.devUname"
        >
          {{ dev.devUname }}
        </option>
      </select>
      <div class="form-check" style="border-bottom: none">
        <label class="form-check-label" style="padding-left: 10px">
          <input
            v-model="view.isOnVideo"
            type="checkbox"
            class="form-check-input"
          />
          <span class="form-switch-sign"></span>
        </label>
      </div>
    </div>
    <web-rtc-player
      ref="webRtc"
      :idx="locNo"
      :wsUri="rtsp.wsUri"
      :rtspUri="view.rtspUri"
      :useControl="rtsp.useControl"
    ></web-rtc-player>
  </div>
</template>

<script>
import { requestApi } from '@/api/ccp/requestApi'
import WebRtcPlayer from '@/components/WebRtcPlayer'
import { smartPort } from '@/envs'

export default {
  name: 'SmartPortVideo',
  components: { WebRtcPlayer },
  props: {
    locNo: {
      type: String
    }
  },
  data() {
    return {
      xMid: 'P02001',
      formData: {
        devRtspUri: ''
      },
      rtsp: {
        wsUri: '',
        rtspUri: '',
        useControl: false,
        devUname: ''
      },
      view: {
        devList: [],
        rtspUri: '',
        isOnVideo: false
      }
    }
  },
  watch: {
    'view.isOnVideo'() {
      this.setViewRtspUri()
    }
  },
  mounted() {
    this.rtsp.wsUri = smartPort.websocketUrl
    this.getRtspDevList()
  },
  methods: {
    getRtspDevList() {
      requestApi({
        url: '/online/iotedev/retrieveRtspDevList',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {},
        callback: (res) => {
          this.view.devList = res.data
        }
      })
    },
    setViewRtspUri() {
      this.view.rtspUri = this.view.isOnVideo && this.rtsp.devUname
        ? this.view.devList.filter((item) =>
          item.devUname === this.rtsp.devUname
        )[0].rtspUri : ''
    }
  }
}
</script>
