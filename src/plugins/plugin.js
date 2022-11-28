import AlertPopup from '@/components/modalPopupSet/AlertPopup'
import ConfirmPopup from '@/components/modalPopupSet/ConfirmPopup'
import ContentPopup from '@/components/modalPopupSet/ContentPopup'

const CustomPlugin = {
  install: function (Vue, options) {
    Vue.prototype.alert = function (
      text,
      type = 'warning',
      width = '300',
      height = '150',
      confirmButtonText = '확인',
      clickToClose = true
    ) {
      return new Promise((resolve) => {
        document.body.classList.add('not-scroll')
        const name = 'dynamic-modal' + new Date().getTime()
        this.$modal.show(
          AlertPopup,
          {
            name,
            text,
            type,
            buttons: [
              {
                title: confirmButtonText,
                handler: () => {
                  resolve()
                },
                class: 'btn btn-gray rounded'
              }
            ]
          },
          {
            name: name,
            class: 'dialog-popup',
            width: width + 'px',
            height: 'auto',
            draggable: false,
            clickToClose: clickToClose
          }
        )
      })
    }

    Vue.prototype.confirm = function (
      text,
      callback,
      width = '300',
      height = '150',
      confirmButtonText = '확인',
      cancelButtonText = '취소'
    ) {
      return new Promise((resolve, reject) => {
        document.body.classList.add('not-scroll')

        let buttons = [
          {
            title: confirmButtonText,
            handler: () => {
              if (callback) {
                callback()
              }
              resolve()
            },
            class: 'btn btn-pink'
          },
          {
            title: cancelButtonText,
            handler: () => {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject()
            },
            class: 'btn btn-gray rounded'
          }
        ]

        this.$modal.show(
          ConfirmPopup,
          { text, buttons },
          {
            name: 'dynamic-modal',
            class: 'dialog-popup',
            width: width + 'px',
            height: height + 'px',
            draggable: false
          }
        )
      })
    }

    Vue.prototype.popup = function (args) {
      let width = args.width === 'wide' ? '95%' : args.width
      let height = args.height || 'auto'
      let func = () => {}

      // 팝업사이즈 체크
      if (width > window.innerWidth) {
        width = window.innerWidth - 30
      }
      if (
        height !== 'auto' &&
        (height === 'full' || height > window.innerHeight)
      ) {
        height = window.innerHeight - 30
      }

      this.$modal.show(
        ContentPopup,
        {
          component: args.component,
          title: args.title,
          data: args.data,
          callback: args.callback || func,
          dismissCallback: args.dismiss || func
        },
        {
          name: 'popup' + new Date().getTime(),
          class: 'tict-popup',
          width: width,
          height: height,
          draggable: '.popup-header',
          clickToClose: false
        }
      )
    }
  }
}

export default CustomPlugin
