export default {
  install: (Vue) => {
    Vue.prototype.$alert = {
      custom (options) {
        return new Promise((resolve) => {
          Vue.prototype.$nextTick(() => {
            Vue.swal.fire({
              icon: options.type,
              title: options.title,
              html: options.text,
              footer: options.footer,
              showCloseButton: true,
              backdrop: `
                rgba(0,0,0,0.4)
                center left
                no-repeat
              `
            }).then(() => {
              resolve()
            })
          })
        })
      },
      show (title, text = '') {
        return new Promise((resolve, reject) => {
          this.custom({ title, text }).then(() => {
            resolve()
          })
        })
      },
      info (title, text = '') {
        return new Promise((resolve, reject) => {
          this.custom({ title, text, type: 'info' }).then(() => {
            resolve()
          })
        })
      },
      question (title, text = '') {
        return new Promise((resolve, reject) => {
          this.custom({ title, text, type: 'question' }).then(() => {
            resolve()
          })
        })
      },
      success (title, text = '') {
        return new Promise((resolve, reject) => {
          this.custom({ title, text, type: 'success' }).then(() => {
            resolve()
          })
        })
      },
      error (title, text = '') {
        return new Promise((resolve, reject) => {
          this.custom({ title, text, type: 'error' }).then(() => {
            resolve()
          })
        })
      },
      confirm (title = 'Are you sure?', text = '') {
        return new Promise((resolve, reject) => {
          Vue.swal.fire({
            title: Vue.upperCase(title),
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm'
          }).then((result) => {
            if (result.value) {
              resolve()
            } else {
              reject(new Error('fail'))
            }
          })
        })
      }
    }
    const toast = Vue.swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      background: '#F4F4F4'
    })
    Vue.prototype.$toast = {
      custom (options) {
        Vue.prototype.$nextTick(() => {
          toast.fire({
            type: options.type,
            title: options.text
          })
        })
      },
      show (text) {
        this.custom({ text })
      },
      info (text) {
        this.custom({ text, type: 'info' })
      },
      question (text) {
        this.custom({ text, type: 'question' })
      },
      success (text) {
        this.custom({ text, type: 'success' })
      },
      warning (text) {
        this.custom({ text, type: 'warning' })
      },
      error (text) {
        this.custom({ text, type: 'error' })
      }
    }
  }
}
