export default {
  install: (Vue) => {
    Vue.mixin({
      data: function () {
        return {
          pointPackageVersion: '',
          pointSwVersion: '',
          pointUpdateAvailable: false
        }
      },
      created () {
        this.pointPackageVersion = process.env.VUE_APP_VERSION
        this.pointSwVersion = localStorage.getItem('pointSwVersion')

        if (this.pointSwVersion !== this.pointPackageVersion) {
          this.pointUpdateAvailable = true
        }
      }
    })
  }
}
