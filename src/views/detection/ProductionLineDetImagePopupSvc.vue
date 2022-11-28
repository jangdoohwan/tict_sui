<template>
  <div>
    <div class="image-wrap">
      <div class="image-body">
        <div class="image-box">
          <img :src="data.item.imagePath" style="max-width: 100%;"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProductionLineDetImagePopupSvc',
  components: {},
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
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
  }
}
</script>

<style>
  .image-wrap {
    padding-top: 20px;
    padding-bottom: 20px;
    height:100%;
  }
  .image-body {
    display: grid;
    margin-left: 20px;
    margin-right: 20px;
    grid-template-columns: 760px;
    height:100%;
  }
  .image-box {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
  }
</style>
