import Vue from 'vue'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import router from './router'

Vue.use(VueCookie)

const instance = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT,
  timeout: 600 * 2 * 1000, // 2 minutes
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Tenant': window.location.host.split('.')[0]
  }
})

instance.defaults.headers.common['Authorization'] = Vue.cookie.get('TTT') + ' ' + Vue.cookie.get('TAT')

instance.interceptors.request.use((config) => {
  console.log('Request: ', config)
  return config
}, function (error) {
  console.log('Response Error: ', error.response)
  return Promise.reject(error.response)
})

instance.interceptors.response.use((response) => {
  console.log('Response: ', response)
  return response
}, function (error) {
  if (!error.response) {
    // Network error
    router.replace('/503')
    return Promise.reject(error)
  } else {
    // If reponse is unauthorized (401) then redirect user to login page
    if (error.response.status == 401) {
      router.push('/auth/signin')
    }
    console.log('Response Error: ', error.response)
    return Promise.reject(error.response)
  }
})

export default instance
