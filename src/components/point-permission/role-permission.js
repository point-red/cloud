export default {
  install: (Vue) => {
    Vue.prototype.$rolePermission = {
      has (permission, permissions) {
        if (!permissions) {
          return false
        }
        var result = permissions.find(array => array === permission)
        if (result === undefined) {
          return false
        }
        return true
      }
    }
  }
}
