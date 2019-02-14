import momentjs from 'moment-timezone'

export default {
  install: (Vue) => {
    let moment = momentjs
    Vue.prototype.$moment = moment
    Vue.moment = moment

    Vue.filter('dateFormat', function (value, format = 'YYYY-MM-DD') {
      if (value instanceof Date) {
      	return moment(value).add(7, 'hour').format(format)
      }	
      else {
      	return value
      }
    })
  }
}
