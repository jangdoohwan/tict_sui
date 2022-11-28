<template>
  <div>
    <div class="modal-body">
      <div class="table-wrap border-none">
        <table class="table table-row">
          <caption>
            {{
              $t('addAll')
            }}
          </caption>
          <colgroup>
            <col style="width:20%" />
            <col style="width:auto" />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">{{ $t('file-attach') }}</th>
              <td>
                <div class="input-file">
                  <input
                    ref="selectedFileName"
                    type="text"
                    class="file-name"
                    :placeholder="$t('noRecords')"
                    disabled
                  />
                  <label for="devIcoImgFile" class="file-label">{{
                    $t('file-select')
                  }}</label>
                  <input
                    ref="inputSelectedFile"
                    type="file"
                    id="devIcoImgFile"
                    style="display:none;"
                    class="file-upload"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    @change="changeSelectedFile"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="form-inline">
                  <div class="input-group">
                    <div class="text-center">
                      ※ {{ $t('user-add-all-desc') }}
                    </div>
                  </div>
                  <div class="input-group right">
                    <button
                      type="button"
                      class="btn btn-gray "
                      @click="downloadTemplate()"
                    >
                      {{ $t('template') }}
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button type="button" class="btn btn-pink" @click="confirmUpload()">
          {{ $t('create') }}
        </button>
        <button @click="close()" type="button" class="btn btn-gray">
          {{ $t('cancle') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  requestMultipartJsonObject,
  requestDownloadApi
} from '@/api/ccp/requestApi'
import getRequestFileArray from '@/utils/inputFile'

export default {
  name: 'BundleExcel',
  components: {},
  props: {
    /**
     * {
     *     download: {
     *         url: '/example', <== 필수
     *         data: {          <== 옵션
     *             seq: '123'
     *         },
     *         headers: {       <== 옵션
     *             'X-MID': 'bundleExcel'
     *         }
     *     },
     *     upload: {
     *         url: '/example', <== 필수
     *         data: {          <== 옵션
     *             seq: '1234'
     *         },
     *         headers: {       <== 옵션
     *             'X-MID': 'bundleExcel'
     *         }
     *     }
     * }
     */
    data: Object, // 넘겨받을 데이터,
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
      headers: {
        // 엑셀 업로드/다운로드 시 공통적으로 들어가는 헤더를 셋팅
        'X-MID': 'P00001'
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    downloadTemplate() {
      // 템플릿 양식 다운로드
      requestDownloadApi({
        url: this.data.download.url,
        headers: _.assign({}, this.headers, this.data.download.headers),
        method: 'post',
        data: this.data.download.data,
        callback: res => {}
      })
    },
    changeSelectedFile(event) {
      // 선택된 파일 있는 경우
      if (event.target.files.length > 0) {
        // xlsx 파일 확장자 체크
        if (!event.target.files[0].name.includes('xlsx')) {
          this.alert(this.$t('user-add-all-desc-check'), 'warning')
          this.$refs.selectedFileName.value = null
          // 5MB 파일 사이즈 체크
        } else if (event.target.files[0].size > 5 * 1024 * 1024) {
          this.alert(this.$t('board-max-size'), 'warning')
          this.$refs.selectedFileName.value = null
        } else if (event.target.files.length) {
          this.$refs.selectedFileName.value = event.target.files[0].name
        }
      }
    },
    confirmUpload() {
      // 파일 업로드 확인
      if (getRequestFileArray([this.$refs.inputSelectedFile]).length) {
        // 선택된 파일이 있는경우
        this.confirm(this.$t('confirm-upload-file'), this.uploadBundleExcel)
      } else {
        // 선택된 파일이 없는경우
        this.alert(this.$t('noti-not-selected-file'), 'warning')
      }
    },
    uploadBundleExcel() {
      // 엑셀파일 업로드
      requestMultipartJsonObject({
        url: this.data.upload.url,
        headers: _.assign({}, this.headers, this.data.upload.headers),
        data: this.data.upload.data,
        files: getRequestFileArray([this.$refs.inputSelectedFile]),
        callback: res => {
          if (res.result.status === '200' || res.result.status === '204') {
            this.alert(this.$t('save-success'), 'success')
            this.callback(true)
            this.close()
            // 파일 업로드 오류 시 파일 재업로드 알림 문구 노출 및 업로드 파일 초기화
          } else {
            this.$refs.inputSelectedFile.value = null
            this.$refs.selectedFileName.value = null

            if (res.result.desc === 'Network Error') {
              this.alert(this.$t('reupload-file'), 'warning')
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less"></style>
