<template>
  <div>
    <router-view :key="key" />
  </div>
</template>

<script>
export default {
  name: 'RouterSection',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="less" scoped></style>
