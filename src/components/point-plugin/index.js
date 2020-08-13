export default {
  install: (Vue) => {
    Vue.prototype.$plugin = {
      has (plugin) {
        if (!Vue.store.state.auth.user.plugins) {
          return false
        }
        var result = Vue.store.state.auth.user.plugins.find(array => array === plugin)
        if (result === undefined) {
          return false
        }
        return true
      }
    }
  }
}
