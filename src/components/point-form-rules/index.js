export default {
  install: (Vue) => {
    Vue.prototype.$formRules = {
      allowedToUpdate (form) {
        if (form.number == null) {
          return false
        }
        return true
      }
    }
  }
}
