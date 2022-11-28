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
              <span
                v-if="modifiable"
                class="btn ico-delete remove-field"
                @click="fnFileDelete(file)"
              >
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
  requestMultipartJsonObject,
  requestDownloadApi
} from '@/api/ccp/requestApi'

export default {
  name: 'PostModifySvc',
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
      xMid: 'P06203',
      postList: [],
      postDetail: {},
      selectedFiles: [],
      postSeq: '',
      loginId: null,
      adminId: 'GN00000033', // 시스템 관리자 공통코드 하드코딩
      roleCdId: null,
      subject: '',
      content: ''
    }
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
      if (!this.postDetail.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.postDetail.tbIoTBrdFileListDTOlist.filter(
        file => file.mode !== 'D'
      )
    },
    modifiable() {
      if (!this.postDetail.loginUserId) {
        return false
      }
      return (
        this.postDetail.loginUserId === this.postDetail.regUsrId ||
        this.roleCdId === this.adminId
      )
    }
  },
  mounted() {
    this.fnGetPost()
  },
  methods: {
    fnGetPost() {
      let reqData = {
        postSeq: this.data.post.postSeq
      }
      requestApi({
        url: '/online/IotPostBoard/retrieveIotPostBoardDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          this.roleCdId = res.data.roleCdId
          this.loginId = res.data.loginUserId
          this.postDetail = res.data
          this.tbIoTBrdFileListDTOlist = res.data.tbIoTBrdFileListDTOlist
          this.subject = res.data.subject
          this.content = res.data.content
        }
      })
    },
    // fnInputContent(e) {
    //   if (e.target.value > 2000) {
    //     e.preventDefault()
    //   }
    // },
    fnFileDelete(file) {
      file.mode = 'D'
    },
    fnModifyConfirm() {
      // 자유게시판 상세 수정 시 유효성 검사
      // 제목 입력하지 않은 경우
      if (!this.subject || this.subject.trim() === '') {
        this.alert(this.$t('request-title-input'), 'warning')
        return
      }
      // 내용 입력하지 않은 경우
      if (!this.content || this.content.trim() === '') {
        this.alert(this.$t('lead-content'), 'warning')
        return
      }

      this.confirm(this.$t('post-modify-confirm'), this.fnModify)
    },
    fnModify() {
      let reqData = {
        postSeq: this.postDetail.postSeq,
        subject: this.subject,
        content: this.content,
        tbIoTPostBrdFileListDTOlist: this.postDetail.tbIoTBrdFileListDTOlist
      }

      requestMultipartJsonObject({
        url: '/online/IotPostBoard/updateIotPostBoard',
        headers: {
          'X-MID': this.xMid
        },
        data: reqData,
        files: getRequestFileArray(this.selectedFiles),
        callback: res => {
          if (res.result.status === '200') {
            this.alert(this.$t('save-success'), 'success')
            this.callback()
            this.close()
          }
        }
      })
    },
    fnDownloadFile(file) {
      let reqData = {
        fileListSeq: file.fileListSeq
      }
      requestDownloadApi({
        url: '/online/IotPostBoard/downloadFile',
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

<style></style>
