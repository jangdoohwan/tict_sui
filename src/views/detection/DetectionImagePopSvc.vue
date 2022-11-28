<template>
  <div>
    <div class="image-wrap">
      <div class="image-body">
        <div class="image-button-box">
          <button v-bind:class="[prevButtonDisable ? 'image-prev-button_disabled' : 'image-prev-button']" :disabled="prevButtonDisable" @click="prevIamge()"></button>
        </div>
        <div class="image-box">
          <img v-if="imagePath" :src="imagePath" style="max-width: 640px; max-height: 608px;"/>
          <div v-else style="font-size: 20px;">{{ $t('nonexistentIamge') }}</div>
        </div>
        <div class="image-button-box">
          <button v-bind:class="[nextButtonDisable ? 'image-next-button_disabled' : 'image-next-button']" :disabled="nextButtonDisable" @click="nextIamge()"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetectionImagePopSvc',

  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      xMid: 'P04001',
      colImageList: [],
      imageData: [],
      imageIndex: 0,
      nextButtonDisable: false,
      prevButtonDisable: false,
      imagePath: null
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let imageIndex = 0
      this.data.colModelData.forEach(row => {
        let obj = {
          index: row.index,
          type: row.type,
          imageIndex: imageIndex
        }
        this.colImageList.push(obj)
        imageIndex = imageIndex + 1
      })
      imageIndex = 0
      this.colImageList = this.colImageList.filter(
        (row) => row.type === 'image'
      )
      this.imageData = this.data.detList[this.data.id]
      this.imageIndex = this.data.index
      if (this.imageIndex === this.colImageList[this.colImageList.length - 1].imageIndex) {
        this.nextButtonDisable = true
      }
      if (this.imageIndex === this.colImageList[0].imageIndex) {
        this.prevButtonDisable = true
      }
      this.setImage()
    },
    nextIamge() {
      this.imageIndex = this.imageIndex + 1
      this.setImage()
      this.prevButtonDisable = false
      if (this.imageIndex < this.colImageList[this.colImageList.length - 1].imageIndex) {
        this.nextButtonDisable = false
        return
      }
      this.nextButtonDisable = true
    },
    prevIamge() {
      this.imageIndex = this.imageIndex - 1
      this.setImage()
      this.nextButtonDisable = false
      if (this.imageIndex > this.colImageList[0].imageIndex) {
        this.prevButtonDisable = false
        return
      }
      this.prevButtonDisable = true
    },
    setImage() {
      let setImage = this.colImageList.filter(
        (row) => row.imageIndex === this.imageIndex
      )
      this.imagePath = this.imageData[setImage[0].index]
    }
  }
}
</script>

<style>
  .image-wrap {
    padding-top: 20px;
    padding-bottom: 20px;
    height:100%;
  }
  .image-body {
    display: grid;
    grid-template-columns: 80px 640px 80px;
    height:100%;
  }
  .image-button-box {
    display: flex;
    align-items: center;
  }
  .image-next-button {
    display: block;
    background-image: url(../../assets/images/ico_arrow_right.svg);
    background-position: center;
    background-repeat: no-repeat;
    height: 40px;
    width: 40px;
    text-align: center;
    margin-left: 20px;
    background-color: white;
    border-radius: 10%;
  }
  .image-next-button:hover {
    display: block;
    background-image: url(../../assets/images/ico_arrow_right_white.svg);
    background-position: center;
    background-repeat: no-repeat;
    height: 40px;
    width: 40px;
    text-align: center;
    margin-left: 20px;
    background-color: #d82b87;
    border-radius: 10%;
  }
  .image-next-button_disabled {
    background-image: url(../../assets/images/ico_arrow_right_gray.svg);
    background-position: center;
    background-repeat: no-repeat;
    height: 40px;
    width: 40px;
    text-align: center;
    margin-left: 20px;
    background-color: white;
    border-radius: 10%;
  }
  .image-prev-button {
    display: block;
    background-image: url(../../assets/images/ico_arrow_left.svg);
    background-position: center;
    background-repeat: no-repeat;
    height: 40px;
    width: 40px;
    text-align: center;
    margin-left: 20px;
    background-color: white;
    border-radius: 10%;
  }
  .image-prev-button:hover {
    display: block;
    background-image: url(../../assets/images/ico_arrow_left_white.svg);
    background-position: center;
    background-repeat: no-repeat;
    height: 40px;
    width: 40px;
    text-align: center;
    margin-left: 20px;
    background-color: #d82b87;
    border-radius: 10%;
  }
  .image-prev-button_disabled {
    background-image: url(../../assets/images/ico_arrow_left_gray.svg);
    background-position: center;
    background-repeat: no-repeat;
    height: 40px;
    width: 40px;
    text-align: center;
    margin-left: 20px;
    background-color: white;
    border-radius: 10%;
  }
  .image-box {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
  }
</style>
