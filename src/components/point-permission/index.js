export default {
  install: (Vue) => {
    Vue.prototype.$permission = {
      has (permission) {
        if (!Vue.store.state.Auth.user.permissions) {
          return false
        }
        var result = Vue.store.state.Auth.user.permissions.find(array => array === permission)
        if (result === undefined) {
          return false
        }
        return true
      }
    }
  }
}
