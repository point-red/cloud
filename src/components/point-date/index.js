import momentjs from 'moment-timezone'

export default {
  install: (Vue) => {
    let moment = momentjs
    Vue.prototype.$moment = moment
    Vue.moment = moment

    Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
      // var offset = new Date().getTimezoneOffset()
      // return moment(value).add(offset, 'minute').format(format)
      return moment(value).add(0, 'minute').format(format)
    })

    Vue.mixin({
      methods: {
        serverDate (string) {
          if (string) {
            return this.$moment(string).tz('UTC').format('YYYY-MM-DD')
          }
        },
        serverDateTime (string) {
          if (string) {
            return this.$moment(string).tz('UTC').format('YYYY-MM-DD HH:mm:ss')
          }
        }
      }
    })
  }
}
