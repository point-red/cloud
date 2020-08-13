import momentjs from 'moment-timezone'

export default {
  install: (Vue) => {
    const moment = momentjs
    Vue.prototype.$moment = moment
    Vue.moment = moment

    Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
      // var offset = new Date().getTimezoneOffset()
      // return moment(value).add(offset, 'minute').format(format)
      return moment(value).add(0, 'minute').format(format)
    })

    Vue.filter('fromNow', function (value) {
      // var offset = new Date().getTimezoneOffset()
      // return moment(value).add(offset, 'minute').format(format)
      return moment(value).fromNow()
    })

    Vue.mixin({
      methods: {
        formattedDate (string) {
          if (string) {
            return this.$moment(string).format('DD-MM-YYYY')
          }
        },
        formattedDateTime (string) {
          if (string) {
            return this.$moment(string).format('DD-MM-YYYY HH:mm')
          }
        },
        serverDate (string = new Date()) {
          if (string) {
            return this.$moment(string).format('YYYY-MM-DD')
          }
        },
        serverDateTime (string = new Date(), time = 'now') {
          if (string && time == 'now') {
            return this.$moment(string).format('YYYY-MM-DD HH:mm:ss')
          } else if (string && time == 'start') {
            return this.$moment(string).format('YYYY-MM-DD 00:00:00')
          } else if (string && time == 'end') {
            return this.$moment(string).format('YYYY-MM-DD 23:59:59')
          }
        }
      }
    })
  }
}
