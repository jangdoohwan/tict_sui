<template>
  <div>
    <div class="modal-body">
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('title') }}</span>
        <div class="input-group form-box inner">
          <input
            v-model="subject"
            type="text"
            class="form-control"
          />
          <p class="cmt-value">
            <span class="textarea-value">{{ subjectLength }}</span
            >/100
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('content') }}</span>
        <div class="input-horizontal form-box">
          <textarea
            v-model="content"
            cols="30"
            rows="5"
          ></textarea>
          <p class="cmt-value">
            <span class="textarea-value">{{ contentLength }}</span
            >/2,000
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32">{{ $t('file-attach') }}</span>
        <div class="input-horizontal">
          <div class="fileClass">
            <div
              v-for="file in fileList"
              :key="file.fileListSeq"
              class="form-file"
            >
              <span class="form-data file-add">
                <a href="javascript:void(0)" @click="fnDownloadFile(file)">
                  {{ file.orgFileName }} [ {{ file.fileSizeLabel }} ]
                </a>
              </span>
              <span v-if="modifiable">
                <a
                  href="javascript:void(0)"
                  class="btn ico-delete remove-field"
                  @click="fnFileDelete(file)"
                ></a>
              </span>
            </div>
          </div>
          <multi-file-select
            v-if="modifiable"
            :maxSize="5"
            :fileListLength="fileList.length"
            :fileList.sync="selectedFiles"
          ></multi-file-select>
          <div v-if="modifiable">{{ $t('board-max-size') }}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button
          v-if="modifiable"
          @click="fnModifyConfirm"
          type="button"
          class="btn btn-pink"
        >
          {{ $t('modify') }}
        </button>
        <button
          @click="close()"
          type="button"
          class="btn btn-gray"
          data-dismiss="modal"
        >
          {{ $t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MultiFileSelect from '@/components/MultiFileSelect'
import getRequestFileArray from '@/utils/inputFile'
import {
  requestApi,
  requestDownloadApi,
  requestMultipartJsonObject
} from '@/api/ccp/requestApi'

export default {
  name: 'LibModifySvc',
  components: {
    MultiFileSelect
  },
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
      xMid: 'P06303',
      libDetail: [],
      subject: '',
      content: '',
      libSeq: '',
      selectedFiles: [],
      regUserId: null,
      // 시스템 관리자 공통코드 하드코딩
      adminId: 'GN00000033',
      loginId: null,
      roleCdId: null
    }
  },
  created() {
    this.libSeq = this.data.lib.libSeq
    this.regUserId = 'cust'
  },
  mounted() {
    this.fnGetLib()
  },
  watch: {
    subject() {
      if (this.subject.length > 100) {
        this.subject = this.subject.substr(0, 100)
        this.alert(this.$t('subject-length-limit'), 'warning')
      }
    },
    content() {
      if (this.content.length > 2000) {
        this.content = this.content.substr(0, 2000)
        this.alert(this.$t('content-length-limit'), 'warning')
      }
    }
  },
  computed: {
    subjectLength() {
      return this.subject ? this.subject.length : 0
    },
    contentLength() {
      return this.content ? this.content.length : 0
    },
    fileList() {
      if (!this.libDetail.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.libDetail.tbIoTBrdFileListDTOlist.filter(
        file => file.mode !== 'D'
      )
    },
    modifiable() {
      if (!this.libDetail.loginUserId) {
        return false
      }
      return (
        this.libDetail.loginUserId === this.libDetail.regUsrId ||
        this.roleCdId === this.adminId
      )
    }
  },
  methods: {
    // fnInputContent(e) {
    //   if (e.target.value > 2000) {
    //     e.preventDefault()
    //   }
    // },
    fnGetLib() {
      let reqData = {
        libSeq: this.libSeq
      }
      requestApi({
        url: '/online/IotlibraryBoard/retrieveIotLibraryBoardDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.libDetail = res.data
          this.roleCdId = res.data.roleCdId
          this.loginId = res.data.loginUserId
          this.tbIoTBrdFileListDTOlist = this.libDetail.tbIoTBrdFileListDTOlist
          this.subject = res.data.subject
          this.content = res.data.content
        }
      })
    },
    fnModifyConfirm() {
      // 자료실 상세 수정 시 유효성 검사
      // 제목 입력하지 않은 경우
      if (this.subject.trim() === '') {
        this.alert(this.$t('request-title-input'), 'warning')
        return
      }
      // 내용 입력하지 않은 경우
      if (this.content.trim() === '') {
        this.alert(this.$t('lead-content'), 'warning')
        return
      }

      this.confirm(this.$t('library-confirm'), this.fnModify)
    },
    fnModify() {
      let reqData = {
        libSeq: this.libSeq,
        subject: this.subject,
        content: this.content,
        tbIoTBrdFileListDTOlist: this.tbIoTBrdFileListDTOlist
      }
      requestMultipartJsonObject({
        url: '/online/IotlibraryBoard/updateIotLibBoard',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        files: getRequestFileArray(this.selectedFiles),
        callback: data => {
          if (data.result.status === '200') {
            this.selectedFiles = null
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnFileDelete(file) {
      file.mode = 'D'
    },
    fnDownloadFile(file) {
      let reqData = {
        fileListSeq: file.fileListSeq
      }
      requestDownloadApi({
        url: '/online/IotlibraryBoard/downloadFile',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        callback: data => {}
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
