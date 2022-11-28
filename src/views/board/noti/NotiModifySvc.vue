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
        <span class="form-label w-32 lb-txt">{{ $t('notice-duration') }}</span>
        <datetime-picker
          :isPair="true"
          :startDate.sync="notiDetail.startDt"
          :endDate.sync="notiDetail.endDt"
        ></datetime-picker>
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
              <span>{{ file.orgFileName }} [ {{ file.fileSizeLabel }} ]</span>
              <span v-on:click="fnFileDelete(file)">
                <a href="#" class="btn ico-delete remove-field"></a>
              </span>
            </div>
          </div>
          <multi-file-select
            v-if="notiDetail.tbIoTBrdFileListDTOlist"
            :maxSize="5"
            :fileListLength="fileList.length"
            :fileList.sync="selectedFiles"
          ></multi-file-select>
          <div>{{ $t('board-max-size') }}</div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center">
        <button @click="fnModifyConfirm" type="button" class="btn btn-pink">
          {{ $t('modify') }}
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
import DatetimePicker from '@/components/DatetimePicker'
import MultiFileSelect from '@/components/MultiFileSelect'
import getRequestFileArray from '@/utils/inputFile'
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'

export default {
  name: 'NotiModifySvc',
  components: { DatetimePicker, MultiFileSelect },
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
      xMid: 'P06403',
      notiDetail: {},
      selectedFiles: [],
      subject: '',
      content: ''
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
      if (!this.notiDetail.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.notiDetail.tbIoTBrdFileListDTOlist.filter(
        file => file.mode !== 'D'
      )
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
  created() {},
  mounted() {
    this.fnGetNotice()
  },
  methods: {
    fnGetNotice() {
      let reqData = {
        notiSeq: this.data.notice.notiSeq
      }

      requestApi({
        url: '/online/iotnotiboard/retrieveIotNotiBoardDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          res.data.startDt = moment(res.data.startDt, 'YYYY-MM-DD').toDate()
          res.data.endDt = moment(res.data.endDt, 'YYYY-MM-DD').toDate()
          this.notiDetail = res.data
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
      // 공지사항 상세 수정 시 유효성 검사
      // 제목 입력하지 않은 경우
      if (this.subject.trim() === '') {
        this.alert(this.$t('lead-title'), 'warning')
        return
      }
      // 시작일 입력하지 않은 경우
      if (!this.notiDetail.startDt) {
        this.alert(this.$t('lead-startDate'), 'warning')
        return false
      }
      // 종료일 입력하지 않은 경우
      if (!this.notiDetail.endDt) {
        this.alert(this.$t('lead-endDate'), 'warning')
        return false
      }
      // 내용 입력하지 않은 경우
      if (this.content.trim() === '') {
        this.alert(this.$t('lead-content'), 'warning')
        return
      }

      this.confirm(this.$t('modifyYn'), this.fnModify)
    },
    fnModify() {
      let reqData = {
        notiSeq: this.notiDetail.notiSeq,
        subject: this.subject,
        content: this.content,
        tbIoTBrdFileListDTOlist: this.notiDetail.tbIoTBrdFileListDTOlist,
        startDt: moment(this.notiDetail.startDt).format('YYYYMMDD'),
        endDt: moment(this.notiDetail.endDt).format('YYYYMMDD'),
        urgencyYn: 'N'
      }

      requestMultipartJsonObject({
        url: '/online/iotnotiboard/updateIotNotiBoard',
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
    }
  }
}
</script>

<style></style>
