<template>
  <div>
    <div class="modal-body">
      <div class="form-row row">
        <div class="form-item col-sm-6 col-md-3">
          <span class="form-label w-32 lb-txt">{{ $t('symbol-name') }}</span>
          <input v-model="symbolData.symNm" type="text" class="form-control" />
        </div>
        <div class="form-item col-sm-6 col-md-3">
          <span class="form-label w-32 lb-txt">{{ $t('symbol-type') }}</span>
          <select v-model="symbolData.symType" class="form-control">
            <option value="">{{ $t('select') }}</option>
            <option
              v-for="(cd, index) in symTypeList"
              :key="`symType-${index}`"
              :value="cd.cdId"
            >
              {{ cd.cdNm }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-3 flex justify-between items-center">
        <h4 class="titH4">{{ $t('symbol-item') }}</h4>
        <div>
          <button type="button" class="btn btn-gray" @click="fnAddItem">
            {{ $t('add') }}
          </button>
        </div>
      </div>
      <div
        class="mt-1 table-wrap border-1"
        style="height: 390px; overflow-y: auto;"
      >
        <table class="table table-col" style="min-width:1024px">
          <colgroup>
            <col style="width: 40px" />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style="width: 120px" />
          </colgroup>
          <thead>
            <tr>
              <th rowspan="2"></th>
              <th rowspan="2">{{ $t('symbol-item') }}</th>
              <th rowspan="2">{{ $t('condition') }}</th>
              <th rowspan="2">{{ $t('value') }} / {{ $t('image') }}</th>
              <th colspan="3">{{ $t('position') }}</th>
              <th colspan="2">{{ $t('font') }}</th>
              <th rowspan="2"></th>
            </tr>
            <tr>
              <th class="border-left">{{ $t('align') }}</th>
              <th>X</th>
              <th>Y</th>
              <th>{{ $t('color') }}</th>
              <th>{{ $t('size') }}</th>
            </tr>
          </thead>
          <draggable v-model="symbolData.itemList" tag="tbody" handle=".handle">
            <tr
              v-for="(item, index) in symbolData.itemList"
              :key="`item-${index}`"
            >
              <td scope="row" class="handle">
                <img src="assets/drag_handle.png" />
              </td>
              <td v-for="key in itemKeyList" :key="`item-${index}-${key}`">
                <template v-if="key === 'itemNmCd'">
                  <select v-model="item[key]" class="form-control">
                    <option value="">{{ $t('select') }}</option>
                    <option
                      v-for="cd in itemNmCdList"
                      :key="`item-${index}-itemNm-${cd.cdId}`"
                      :value="cd.cdId"
                    >
                      {{ cd.cdNm }}
                    </option>
                  </select>
                </template>
                <template v-else>
                  <select v-model="item[key]" class="form-control">
                    <option value="Y">{{ $t('use') }}</option>
                    <option value="N">{{ $t('use-no') }}</option>
                  </select>
                </template>
              </td>
              <td>
                <button class="btn btn-gray" @click="fnRemoveItem(index)">
                  ??????
                </button>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-pink" @click="fnSaveConfirm">
          {{ $t('save') }}
        </button>
        <button type="button" class="btn btn-gray" @click="close">
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { requestApi } from '@/api/ccp/requestApi'
import { getCommonCodeByParentCdId } from '@/api/common/code'

export default {
  name: 'SymbolAddModifySvc',
  components: { draggable },
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
      symbolData: {
        symNm: '',
        symType: '',
        itemList: []
      },
      symTypeList: [],
      itemNmCdList: [],
      useYnList: [
        { cdId: 'Y', cdNm: this.$t('use') },
        { cdId: 'N', cdNm: this.$t('use-no') }
      ],
      item: {
        itemNmCd: '',
        whereCd: 'Y',
        valueCd: 'Y',
        posXCd: 'Y',
        posYCd: 'Y',
        alignCd: 'Y',
        fontColorCd: 'Y',
        fontSizeCd: 'Y',
        itemSort: ''
      },
      xMid: 'P09302'
    }
  },
  computed: {
    isNew() {
      return !this.data.symSeq
    },
    itemKeyList() {
      // ????????? ???????????? ????????? ??????
      return Object.keys(this.item).filter(key => key !== 'itemSort')
    }
  },
  watch: {},
  created() {
    if (this.isNew) {
      // ?????? ??????
      this.fnAddItem()
    } else {
      this.fnGetSymbolData()
    }
    this.fnGetCodes()
  },
  mounted() {},
  methods: {
    fnGetCodes() {
      // ?????? ??????
      getCommonCodeByParentCdId({
        parentCdId: 'GN00000341',
        xMid: this.xMid
      }).then(data => {
        this.symTypeList = data
      })
      // ?????? ????????? ??????
      getCommonCodeByParentCdId({
        parentCdId: 'GN00000345',
        xMid: this.xMid
      }).then(data => {
        this.itemNmCdList = data
      })
    },
    fnGetSymbolData() {
      let reqData = {
        symSeq: this.data.symSeq
      }
      requestApi({
        url: '/online/iotsym/retrieveSymbolDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.symbolData = res.data
          }
        }
      })
    },
    // ????????? ??????
    fnAddItem() {
      let item = JSON.parse(JSON.stringify(this.item))
      this.symbolData.itemList.push(item)
    },
    // ????????? ??????
    fnRemoveItem(index) {
      this.symbolData.itemList.splice(index, 1)
    },
    // ??????
    fnSaveConfirm() {
      if (!this.fnValidateData()) {
        return false
      }

      this.confirm(this.$t('saveYn'), this.fnSave)
    },
    fnSave() {
      this.symbolData.itemList.forEach((item, index) => {
        item.itemSort = index
      })

      let url = this.isNew
        ? '/online/iotsym/insertSymbol'
        : '/online/iotsym/updateSymbol'
      requestApi({
        url: url,
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: this.symbolData,
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    // ???????????? ?????? ??????, ?????? ??? ????????? ??????
    fnValidateData() {
      // ????????? ???????????? ?????? ??????
      if (
        !this.symbolData.symNm ||
        (this.symbolData.symNm && this.symbolData.symNm.trim() === '')
      ) {
        this.alert(
          this.$t('lead-not-inputed').replace('$0', this.$t('symbol-name'))
        )
        return false
      }
      // ????????? ???????????? ?????? ??????
      if (
        !this.symbolData.symType ||
        (this.symbolData.symType && this.symbolData.symType.trim() === '')
      ) {
        this.alert(
          this.$t('lead-not-choosed').replace('$0', this.$t('symbol-type'))
        )
        return false
      }
      // ????????? ?????? ??????
      let blank = this.symbolData.itemList.filter(item => item.itemNmCd === '')
      if (blank.length > 0) {
        this.alert(
          this.$t('lead-not-choosed').replace('$0', this.$t('symbol-item'))
        )
        return false
      }
      // ????????? ?????? ?????? ??????
      let duplicated = this.symbolData.itemList.filter(
        (item, index) =>
          this.symbolData.itemList.findIndex(
            i => i.itemNmCd === item.itemNmCd
          ) !== index
      )
      if (duplicated.length > 0) {
        this.alert(
          this.$t('duplicate-data').replace('$0', this.$t('symbol-item'))
        )
        return false
      }

      return true
    }
  }
}
</script>

<style></style>
