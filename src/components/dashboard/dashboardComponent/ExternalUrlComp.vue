<template>
  <div style="border: 1px solid #ddd; width: 100%; height: 100%">
    <iframe :src="url" style="width: 100%; height: 100%" />
  </div>
</template>

<script>
export default {
  name: 'ExternalUrlComp',
  props: {
    locNo: {
      type: String
    },
    initMsgData: {
      type: Array
    },
    componentData: {
      type: [Array, Object]
    }
  },
  computed: {
    url() {
      if (
        this.initMsgData &&
        this.initMsgData.length > 0 &&
        this.initMsgData[0] &&
        this.initMsgData[0].URL
      ) {
        return this.initMsgData[0].URL
      }
      return ''
    }
  },
  mounted() {},
  data() {
    return {}
  }
}
</script>
