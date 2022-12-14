<template>
  <div>
    <div class="modal-body">
      <div class="table-wrap border-none">
        <table class="table table-row">
          <caption>
            {{
              $t('deviceCopy')
            }}
          </caption>
          <colgroup>
            <col style="width:25%" />
            <col style="width:auto" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">
                <span class="lb-txt">{{ $t('model-code') }}</span>
              </th>
              <td class="form-inline">
                <div class="input-group">
                  <input
                    ref="devMdlCd"
                    v-model="device.devMdlCd"
                    @change="checkedDuplModelId = false"
                    type="text"
                    class="form-control"
                    placeholder=""
                  />
                  <button
                    class="btn btn-gray input-group-addon"
                    type="button"
                    @click="checkDuplModelId()"
                  >
                    {{ $t('duplication-check') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="lb-txt">{{ $t('dev-mdl-nm') }}</span>
              </th>
              <td class="form-inline">
                <div class="input-group">
                  <input
                    v-model="device.devMdlNm"
                    type="text"
                    class="form-control"
                    placeholder=""
                    @change="flagDuplDevMdlNm = false"
                  />
                  <button
                    class="btn btn-gray input-group-addon"
                    type="button"
                    @click="checkDuplDevMdlNm"
                  >
                    {{ $t('duplication-check') }}
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="lb-txt">{{ $t('manufacturer') }}</span>
              </th>
              <td>
                <input
                  v-model="device.vendorNm"
                  type="text"
                  class="form-control"
                  placeholder=""
                  style="width:100%"
                />
              </td>
            </tr>
            <tr>
              <th scope="row">
                <span class="lb-txt">{{ $t('useYn') }}</span>
              </th>
              <td>
                <select
                  v-model="device.useYn"
                  class="form-control"
                  style="width:100%"
                >
                  <option value="A">{{ $t('use') }}</option>
                  <option value="C">{{ $t('use-no') }}</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="btn-wrap text-center">
        <button @click="copyDevice()" type="button" class="btn btn-pink">
          {{ $t('complete') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'
import TbIotDevDTO from '@/api/ccp/dto/TbIotDevDTO'

export default {
  name: 'DeviceCopy',
  components: {},
  props: {
    data: Object, // 넘겨받을 데이터,
    callback: {
      // 호출할 콜백함수
      type: Function,
      required: true
    },
    close: {
      // 팝업 닫는함수
      type: Function,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P08404',
      checkedDuplModelId: false, // 모델ID 중복확인여부,
      flagDuplDevMdlNm: false, // 모델명 중복확인 여부
      device: null
    }
  },
  created() {
    this.device = new TbIotDevDTO({
      sdevSeq: this.data.sdevSeq,
      svcCd: this.data.svcCd,
      useYn: 'A'
    })
  },
  mounted() {},
  computed: {},
  methods: {
    checkDuplModelId() {
      // 모델코드
      if (!this.device.devMdlCd || this.device.devMdlCd.trim() === '') {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('model-code')),
          'warning'
        )
        return
      }
      // 모델코드 중복 확인
      requestApi({
        url: '/online/iotdev/retrieveIotDup',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          devMdlCd: this.device.devMdlCd
        },
        callback: data => {
          if (data.result.status === '200' || data.result.status === '204') {
            this.checkedDuplModelId = true
            this.alert(this.$t('no-duplicate-data'), 'success')
          }
        }
      })
    },
    copyDevice() {
      // 모델코드
      if (!this.device.devMdlCd || this.device.devMdlCd.trim() === '') {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('model-code')),
          'warning'
        )
        // 모델코드 중복 확인 여부
      } else if (!this.checkedDuplModelId) {
        this.alert(
          this.$t('lead-duplicate-data').replace('$0', this.$t('model-code')),
          'warning'
        )
        // 모델명
      } else if (!this.device.devMdlNm || this.device.devMdlNm.trim() === '') {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('dev-mdl-nm')),
          'warning'
        )
        // 모델명 중복 확인 여부
      } else if (!this.flagDuplDevMdlNm) {
        this.alert(
          this.$t('lead-duplicate-data').replace('$0', this.$t('dev-mdl-nm')),
          'warning'
        )
        // 제조사
      } else if (!this.device.vendorNm || this.device.vendorNm.trim() === '') {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('manufacturer')),
          'warning'
        )
        // 장비 복사
      } else {
        requestApi({
          url: '/online/iotdev/insertIotDevCopy',
          headers: {
            'X-MID': this.xMid
          },
          method: 'post',
          data: this.device,
          callback: res => {
            if (res.result.status === '200') {
              this.callback(true)
              this.close()
              this.alert(this.$t('copy-success'), 'success')
            }
          }
        })
      }
    },
    checkDuplDevMdlNm() {
      if (!this.device.devMdlNm || this.device.devMdlNm.trim() === '') {
        this.alert(
          this.$t('not-inputed').replace('$0', this.$t('dev-mdl-nm')),
          'warning'
        )
        return
      }
      requestApi({
        url: '/online/iotdev/retrieveIotMdlDup',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: {
          devMdlNm: this.device.devMdlNm
        },
        callback: data => {
          if (data.result.status === '200' || data.result.status === '204') {
            this.flagDuplDevMdlNm = true
            this.alert(this.$t('no-duplicate-data'), 'success')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
