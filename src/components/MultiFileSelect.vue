<template>
  <div class="input-file">
    <div ref="inputArea"></div>
    <button class="file-add-btn" type="button" @click="addFile($event)">
      파일 추가
    </button>
  </div>
</template>

<script>
let fileLength = 0 // 업로드 파일 갯수

export default {
  name: 'MultiFileSelect',
  components: {},
  props: {
    fileList: null,
    // MegaByte
    maxSize: {
      type: Number,
      required: false,
      default: 0 // unlimited
    },
    // 이미 업로드된 파일 갯수
    fileListLength: {
      type: Number,
      required: false,
      default: 0
    },
    defaultListCount: {
      type: Number,
      required: false,
      default: 1
    }
  },
  data() {
    return {
      newFormFile:
        '<div class="form-file">' +
        '<span><input type="file" class="form-control" placeholder=""></span>' +
        '<span><a href="#" class="btn ico-delete remove-field">삭제</a></span>' +
        '</div>',
      maxSizeMb: this.maxSize * 1024 * 1024
    }
  },
  watch: {
    fileList: function(newValue) {
      if (!newValue) {
        this.$refs.inputArea.innerHTML = ''
      }
    },
    fileListLength() {
      fileLength--
    }
  },
  created() {},
  mounted() {
    let context = this
    let wrapper = $('.input-file')
    let addButton = $('.file-label')
    fileLength = this.fileListLength ? this.fileListLength : 0

    $(wrapper)
      .on('click', '.remove-field', function() {
        $(this)
          .parents('.form-file')
          .remove()
        fileLength--

        context.$emit(
          'update:fileList',
          $(context.$refs.inputArea)
            .children('div')
            .children('span')
            .children('input')
            .toArray()
            .filter(fileObj => {
              return fileObj.files.length > 0
            })
        )
      })
      .on('change', '.form-control', function(e) {
        // 지정한 maxSizeMb 사이즈보다 큰 파일 업로드 시 파일 선택 취소 후 알림
        if (
          context.maxSizeMb &&
          this.files.length &&
          context.maxSizeMb < this.files[0].size
        ) {
          $(this)
            .parents('.form-file')
            .remove()
          $(context.$refs.inputArea).append(context.newFormFile)

          context.alert(
            context
              .$t('max-size')
              .replace('$0', context.maxSizeMb / (1024 * 1024)),
            'warning'
          )
        }
        context.$emit(
          'update:fileList',
          $(context.$refs.inputArea)
            .children('div')
            .children('span')
            .children('input')
            .toArray()
            .filter(fileObj => {
              return fileObj.files.length > 0
            })
        )
      })

    // 파일선택 요소 defaultListCount 갯수만큼 미리 생성
    for (let i = 0; i < this.defaultListCount; i++) {
      $(addButton).click()
    }
  },
  methods: {
    addFile() {
      if (fileLength < 10) {
        fileLength++
        $(this.$refs.inputArea).append(this.newFormFile)
      } else {
        this.alert(this.$t('max-file'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.file-add-btn {
  display: inline-block;
  vertical-align: middle;
  height: 32px;
  line-height: 30px;
  padding: 0 7px;
  border-radius: 3px;
  background-color: #fff;
  color: #7c86a1;
  border: 1px solid #7c86a1;
  text-align: center;
  cursor: pointer;
}
</style>
