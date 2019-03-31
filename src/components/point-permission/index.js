export default {
  install: (Vue) => {
    Vue.prototype.$permission = {
      has (permission) {
        if (!Vue.store.state.auth.user.permissions) {
          return false
        }
        var result = Vue.store.state.auth.user.permissions.find(array => array === permission)
        if (result === undefined) {
          return false
        }
        return true
      }
    }
  }
}
