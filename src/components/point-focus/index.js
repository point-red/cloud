export default {
  install: (Vue) => {
    Vue.directive('focus', {
      inserted: function (el, binding) {
        if (binding.value) el.focus()
        else el.blur()
      }
    })
  }
}
