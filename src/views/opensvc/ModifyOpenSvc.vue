<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item width-100">
          <span class="form-label w-40 lb-txt">{{ $t('open-svc-nm') }}</span>
          <div class="input-group">
            <input v-model="openSvcNm" type="text" class="form-control" maxlength="100" />
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('customer') }}</span>
          <select v-model="custSeq" class="form-control">
            <option value="">{{ $t('select') }}</option>
            <option v-for="cust in custList" :key="cust.custSeq" :value="cust.custSeq">{{ cust.custNm }}</option>
          </select>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('en-ip') }}</span>
          <div class="input-group">
            <input v-model="ip" type="text" class="form-control"  maxlength="20" />
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('en-port') }}</span>
          <div class="input-group">
            <input v-model="port" type="text" class="form-control" maxlength="10" />
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item width-100">
          <span class="form-label w-40 lb-txt">{{ $t('certKey') }}</span>
          <div class="input-group">
            <input v-model="certKey" type="text" class="form-control" readonly maxlength="32" />
          </div>
          <div class="input-group-button">
            <button disabled="false" type="button" class="btn btn-gray pull-right" @click="fnMakecertKey()">
              {{ $t('produce') }}
            </button>
          </div>
        </div>
      </div>
      <div class="form-row row">
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('token-time-out') }}</span>
          <div class="input-group">
            <input v-model="tokenTimeOut" type="text" class="form-control"  maxlength="10" />
            <span class="form-label" style="margin-left: 6px;">{{ $t('minute') }}</span>
          </div>
        </div>
        <div class="form-item col-sm-6">
          <span class="form-label w-40 lb-txt">{{ $t('useYn') }}</span>
          <div class="input-group">
            <select v-model="useYn" class="form-control">
              <option v-for="item in useOpt" v-bind:Key="item.optVal" :value="item.optVal">
                {{ item.otpName }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="table-wrap grid-container mt-3">
        <div class="tit-wrap">
          <h4 class="titH4" style="margin-top: 10px;">{{ $t('api') }}</h4>
          <div class="text-right">
          <button class="btn btn-gray" @click="fnAddOpenSvcApiList">
            {{ $t('add') }}
          </button>
        </div>
        </div>
        <div class="grid-container grid-scroll mt-1">
          <div class="table-wrap y-scroll" style="min-height: 200px">
            <table class="table table-col" style="min-width: 710px">
              <caption></caption>
              <colgroup>
                <col style="width: 220px" />
                <col style="width: 220px" />
                <col style="width: 120px" />
                <col style="width: 150px" />
              </colgroup>
              <thead>
                <tr>
                  <th>{{ $t('api-nm') }}</th>
                  <th>{{ $t('url') }}</th>
                  <th>{{ $t('methodKo') }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(col, index) in openSvcApiList" :key="`openSvcApiList-${index}`">
                  <td>
                    {{col.apiNm}}
                  </td>
                  <td>
                    {{col.apiUrl}}
                  </td>
                  <td>
                    {{col.apiMethod}}
                  </td>
                  <td>
                    <button class="btn" @click="fnRemoveOpenSvcApiList(index)">
                      {{ $t('delete') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="fnConfirmModify()" type="button" class="btn btn-pink">
          {{ $t('modify') }}
        </button>
        <button @click="close" type="button" class="btn btn-gray" data-dismiss="modal">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import requestApi from '@/api/ccp/requestApi'

export default {
  name: 'AddOpenSvc',
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
      openSvcSeq: '',
      custNm: '',
      openSvcNm: '',
      custSeq: '',
      ip: '',
      port: '',
      certKey: '',
      tokenTimeOut: '',
      useYn: 'Y',
      openSvcApiList: [],
      custList: [],
      useOpt: [
        { otpName: this.$t('use'), optVal: 'Y' },
        { otpName: this.$t('use-no'), optVal: 'N' }
      ],
      xMid: 'P15004'
    }
  },
  watch: {},
  created() {
  },
  mounted() {
    this.fnGetOpenSvc()
    this.fnGetCustList()
  },
  methods: {
    // 고객사 목록 조회
    fnGetCustList() {
      requestApi({
        url: '/online/iotoutsvrreport/cmnctSttsCustNmList',
        method: 'post',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        callback: res => {
          this.custList = res.data.cmnctSttsCustNmList
        }
      })
    },
    fnGetOpenSvc() {
      let dataObj = {
        openSvcSeq: this.data.idx
      }
      requestApi({
        url: '/online/iotOpenSvc/retrieveOpenSvc',
        headers: {
          'X-MID': this.xMid
        },
        data: dataObj,
        method: 'post',
        callback: (res) => {
          this.openSvcSeq = res.data.openSvcSeq
          this.openSvcNm = res.data.openSvcNm
          this.custSeq = res.data.custSeq
          this.ip = res.data.ip
          this.port = res.data.port
          this.certKey = res.data.certKey
          this.tokenTimeOut = res.data.tokenTimeOut
          this.useYn = res.data.useYn
          this.openSvcApiList = res.data.openSvcApiList
        }
      })
    },
    fnAddOpenSvcApiList() {
      this.popup({
        component: () => import('@/views/opensvc/AddOpenSvcApi'),
        title: this.$t('open-api-select'),
        width: '800',
        callback: (data) => {
          data.forEach(api => {
            if (!this.openSvcApiList.find(existenceApi => existenceApi.openApiSeq === api.openApiSeq)) {
              this.openSvcApiList.push(api)
            }
          })
        }
      })
    },
    fnMakecertKey() {
      requestApi({
        url: '/online/iotOpenSvc/makeCertkey',
        headers: {
          'X-MID': this.xMid
        },
        data: {},
        method: 'post',
        callback: (res) => {
          this.certKey = res.data.certKey
        }
      })
    },
    fnRemoveOpenSvcApiList(index) {
      this.openSvcApiList.splice(index, 1)
    },
    fnValidation() {
      if (this.openSvcNm === undefined || this.openSvcNm === null || this.openSvcNm.trim() === '') {
        this.alert(this.$t('open-svc-nm-input'), 'warning')
        return false
      }
      if (this.custSeq === undefined || this.custSeq === null || this.custSeq === '') {
        this.alert(this.$t('cust-select'), 'warning')
        return false
      }
      if (this.ip === undefined || this.ip === null || this.ip.trim() === '') {
        this.alert(this.$t('ip-blank-chk'), 'warning')
        return false
      }
      if (!this.fnIpChk(this.ip.trim())) {
        this.alert(this.$t('validation-ip-chk'), 'warning')
        return false
      }
      if (this.port === undefined || this.port === null || this.port.trim() === '') {
        this.alert(this.$t('port-input'), 'warning')
        return false
      }
      if (!this.fnNumChk(this.port.trim())) {
        this.alert(this.$t('validation-port-num'), 'warning')
        return false
      }
      if (this.certKey === undefined || this.certKey === null || this.certKey.trim() === '') {
        this.alert(this.$t('certKey-make'), 'warning')
        return false
      }
      if (this.tokenTimeOut === undefined || this.tokenTimeOut === null || this.tokenTimeOut.trim() === '') {
        this.alert(this.$t('token-time-out-input'), 'warning')
        return false
      }
      if (!this.fnNumChk(this.tokenTimeOut.trim())) {
        this.alert(this.$t('validation-token-time-out-num'), 'warning')
        return false
      }
      return true
    },
    fnConfirmModify() {
      if (!this.fnValidation()) {
        return
      }

      this.confirm(this.$t('saveYn'), this.submit)
    },
    fnIpChk(ip) {
      if (ip !== null && ip !== '') {
        return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(this.ip.trim())
      } else {
        return true
      }
    },
    fnNumChk(num) {
      if (num !== null && num !== '') {
        return /^[0-9]*$/.test(num)
      } else {
        return true
      }
    },
    submit() {
      let dataObj = {
        openSvcSeq: this.openSvcSeq,
        openSvcNm: this.openSvcNm.trim(),
        custSeq: this.custSeq,
        ip: this.ip.trim(),
        port: this.port.trim(),
        certKey: this.certKey,
        tokenTimeOut: this.tokenTimeOut.trim(),
        useYn: this.useYn,
        openSvcApiList: this.openSvcApiList
      }
      requestApi({
        url: '/online/iotOpenSvc/updateOpenSvc',
        headers: {
          'X-MID': this.xMid
        },
        data: dataObj,
        method: 'post',
        callback: (res) => {
          if (
            res.result.status === '200'
          ) {
            this.alert(this.$t('modify-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
