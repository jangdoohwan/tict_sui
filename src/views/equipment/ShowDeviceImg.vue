<template>
  <div>
    <div class="modal-body">
      <div class="image-box" style="height: 100%; width: 100%">
        <img :src="deviceImgPath" alt="" style="max-width: 100%; max-height: 100%;">
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'ShowDeviceImg',
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
  data () {
    return {
      deviceImgPath: '',
      xMid: 'P03003'
    }
  },
  created () {
    this.fnSearchPath()
  },
  mounted () {},
  methods: {
    fnSearchPath() {
      var paramObj = {}
      paramObj.entrDevSeq = this.data.devSeq
      requestApi({
        url: '/online/iotedevregi/searchDevImg',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: paramObj,
        callback: (res) => {
          if (res.result.status === '200' || res.result.status === '204') {
            if (res.data.devImg === '') {
              this.alert(this.$t('no-devImg'), 'warning')
              this.callback()
              this.close()
            } else {
              this.deviceImgPath = res.data.devImg
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
  .image-box {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
  }
</style>
