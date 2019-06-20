export default {
  install: (Vue) => {
    Vue.prototype.$notification = {
      custom (options) {
        Vue.prototype.$nextTick(() => {
          Vue.notify({
            group: 'notification',
            type: options.type,
            title: options.title,
            text: options.text
          })
        })
      },
      info (title, text = '') {
        this.custom({ title, text, type: 'info' })
      },
      success (title, text = '') {
        this.custom({ title, text, type: 'success' })
      },
      warn (title, text = '') {
        this.custom({ title, text, type: 'warn' })
      },
      error (title, text = '') {
        this.custom({ title, text, type: 'error' })
      }
    }
  }
}
