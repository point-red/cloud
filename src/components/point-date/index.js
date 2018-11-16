import momentjs from 'moment'

export default {
  install: (Vue) => {
    let moment = momentjs
    Vue.prototype.$moment = moment
    Vue.moment = moment

    Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
      return moment(value).format(format)
    })
  }
}
