export default {
  install: (Vue) => {
    Vue.filter('capitalize', function (value, transformValue = true) {
      if (!value) return ''
      if (!transformValue) return value
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    })
    Vue.filter('uppercase', function (value, transformValue = true) {
      if (!value) return ''
      if (!transformValue) return value
      value = value.toString()
      return value.toUpperCase()
    })
    Vue.filter('lowercase', function (value, transformValue = true) {
      if (!value) return ''
      if (!transformValue) return value
      value = value.toString()
      return value.toLowerCase()
    })
    Vue.filter('titlecase', function (value, transformValue = true) {
      if (!value) return ''
      if (!transformValue) return value
      value = value.toString()
      value = value.replace(/([^\W_]+[^\s-]*) */g, function (s) {
        return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase()
      })
      var words = value.split(' ')
      var transform = ''
      var ignoredString = ['Vat', 'Id', 'Npwp', 'Kpi', 'Sdm', 'Sku', 'C', '%Ec', 'Spg', 'Wa']
      for (var i = 0; i < words.length; i++) {
        if (ignoredString.indexOf(words[i]) > -1) {
          transform += words[i].toUpperCase() + ' '
        } else {
          transform += words[i] + ' '
        }
      }
      return transform
    })
    Vue.upperCase = function (value, transformValue = true) {
      if (!value) return ''
      if (!transformValue) return value
      value = value.toString()
      return value.toUpperCase()
    }
  }
}
