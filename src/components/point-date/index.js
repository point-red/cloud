import momentjs from 'moment-timezone'

export default {
  install: (Vue) => {
    let moment = momentjs
    Vue.prototype.$moment = moment
    Vue.moment = moment

    Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
      return moment(value).add(7, 'hour').format(format)
    })
  }
}
