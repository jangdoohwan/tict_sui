<template>
  <div>
    <div class="modal-body">
      <input v-model="dashNm" type="text" class="form-control" />
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-pink" @click="fnSaveConfirm">
        {{ $t('change') }}
      </button>
      <button type="button" class="btn btn-gray" @click="close">
        {{ $t('cancel') }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserDashboardNameSVC',
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
      dashNm: ''
    }
  },
  mounted() {
    this.dashNm = this.data.dashNm
  },
  methods: {
    fnSaveConfirm() {
      if (this.dashNm.length === 0) {
        this.alert(
          this.$t('lead-not-inputed').replace('$0', this.$t('dashboard'))
        )
        return
      }
      this.callback(this.dashNm)
      this.close()
    }
  }
}
</script>
