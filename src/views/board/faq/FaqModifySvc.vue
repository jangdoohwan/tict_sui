<template>
  <div>
    <div class="modal-body">
      <div class="form-item col-sm-6">
        <span class="form-label w-32 lb-txt">{{ $t('category') }}</span>
        <select v-model="faqDetail.categoryCdId" class="form-control">
          <option
            v-for="category in categoryList"
            :key="category.categoryCdId"
            :value="category.categoryCdId"
            >{{ category.categoryCdNm }}</option
          >
        </select>
      </div>
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
        <span class="form-label w-32 lb-txt">{{ $t('question') }}</span>
        <div class="input-group form-box inner">
          <input
            v-model="question"
            type="text"
            class="form-control"
          />
          <p class="cmt-value">
            <span class="textarea-value">{{ questionLength }}</span
            >/100
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32 lb-txt">{{ $t('answer') }}</span>
        <div class="input-horizontal form-box">
          <textarea
            v-model="answer"
            cols="30"
            rows="7"
          ></textarea>
          <p class="cmt-value">
            <span class="textarea-value">{{ answerLength }}</span
            >/2,000
          </p>
        </div>
      </div>
      <div class="form-item width-100">
        <span class="form-label w-32">{{ $t('interest-question') }}</span>
        <div class="form-check">
          <label class="form-check-label" for="ch1">
            <input
              v-model="faqDetail.interestYn"
              class="form-check-input"
              type="checkbox"
              id="ch1"
              true-value="Y"
              false-value="N"
            />
            <span class="form-check-sign"></span>
          </label>
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
            v-if="faqDetail.tbIoTBrdFileListDTOlist"
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
import MultiFileSelect from '@/components/MultiFileSelect'
import getRequestFileArray from '@/utils/inputFile'
import { requestApi, requestMultipartJsonObject } from '@/api/ccp/requestApi'

export default {
  name: 'FaqModifySvc',
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
      xMid: 'P06503',
      faqDetail: [],
      subject: '',
      question: '',
      answer: '',
      selectedFiles: [],
      categoryList: []
    }
  },
  computed: {
    subjectLength() {
      return this.subject ? this.subject.length : 0
    },
    questionLength() {
      return this.question ? this.question.length : 0
    },
    answerLength() {
      return this.answer ? this.answer.length : 0
    },
    fileList() {
      if (!this.faqDetail.tbIoTBrdFileListDTOlist) {
        return []
      }
      return this.faqDetail.tbIoTBrdFileListDTOlist.filter(
        file => file.mode !== 'D'
      )
    }
  },
  created() {},
  mounted() {
    this.fnGetfaq()
  },
  watch: {
    subject() {
      if (this.subject.length > 100) {
        this.subject = this.subject.substr(0, 100)
        this.alert(this.$t('subject-length-limit'), 'warning')
      }
    },
    question() {
      if (this.question.length > 100) {
        this.question = this.question.substr(0, 100)
        this.alert(this.$t('subject-length-limit'), 'warning')
      }
    },
    answer() {
      if (this.answer.length > 2000) {
        this.answer = this.answer.substr(0, 2000)
        this.alert(this.$t('answer-length-limit'), 'warning')
      }
    }
  },
  methods: {
    fnGetfaq() {
      let reqData = {
        faqSeq: this.data.faq.faqSeq,
        parentCdId: 'GN00000009'
      }
      requestApi({
        url: '/online/iotfaqboard/retrieveIotFaqBoardDetail',
        headers: {
          'X-MID': this.xMid
        },
        method: 'post',
        data: reqData,
        callback: res => {
          if (res.data.faqDetail.interestYn === 'Y') {
            this.faqDetail.interestYn = 'Y'
          } else {
            this.faqDetail.interestYn = 'N'
          }
          this.faqDetail = res.data.faqDetail
          this.subject = res.data.faqDetail.subject
          this.question = res.data.faqDetail.question
          this.answer = res.data.faqDetail.answer
          this.categoryList = res.data.categoryList
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
      // FAQ 상세 수정 시 유효성 검사
      // 제목 입력하지 않은 경우
      if (this.subject.trim() === '') {
        this.alert(this.$t('request-title-input'), 'warning')
        return
      }
      // 질문 입력하지 않은 경우
      if (this.faqDetail.question.trim() === '') {
        this.alert(this.$t('lead-question'), 'warning')
        return
      }
      // 답변 입력하지 않은 경우
      if (this.answer.trim() === '') {
        this.alert(this.$t('lead-answer'), 'warning')
        return
      }

      this.confirm(this.$t('saveYn'), this.fnModify)
    },
    fnModify() {
      let reqData = {
        categoryCdId: this.faqDetail.categoryCdId,
        faqSeq: this.faqDetail.faqSeq,
        subject: this.subject,
        question: this.question,
        answer: this.answer,
        tbIoTBrdFileListDTOlist: this.faqDetail.tbIoTBrdFileListDTOlist,
        interestYn: this.faqDetail.interestYn
      }
      if (!this.faqDetail.interestYn === 'Y') {
        reqData.interestYn = 'N'
      }
      requestMultipartJsonObject({
        url: '/online/iotfaqboard/updateIotFaqBoard',
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
