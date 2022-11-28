<template>
  <div>
    <div class="modal-body">
      <Datepicker
        v-model="date"
        :inline="true"
        :language="view.ko"
        :minimum-view="minimumView"
      ></Datepicker>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="confirm" type="button" class="btn btn-pink">
          {{ $t('confirm') }}
        </button>
        <button @click="close" type="button" class="btn btn-gray">
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import { ko } from 'vuejs-datepicker/dist/locale'

export default {
  name: 'DatePickerPopup',
  components: { Datepicker },
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
      date: null,
      view: {
        ko: ko
      }
    }
  },
  computed: {
    minimumView() {
      if (this.data.format === 'YYYY-MM') {
        return 'month'
      }
      return 'day'
    }
  },
  mounted() {
    if (this.data.date) {
      if (this.data.date instanceof Date) {
        this.date = this.data.date
      } else if (
        typeof this.data.date === 'string' &&
        this.data.date.length > 0
      ) {
        this.date = new Date(this.data.date)
      }
    }
  },
  methods: {
    confirm() {
      this.callback(moment(this.date).format(this.data.format || 'YYYY-MM-DD'))
      this.close()
    }
  }
}
</script>

<style></style>
