import Vue from 'vue'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import router from './router'

Vue.use(VueCookie)

const instance = axios.create({
  baseURL: process.env.VUE_APP_NODE_API_ENDPOINT,
  timeout: 600 * 2 * 1000, // 2 minutes
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Tenant: window.location.host.split('.')[0]
  }
})

instance.defaults.headers.common.Authorization = 'Bearer ' + Vue.cookie.get('TNAT')

instance.interceptors.request.use((config) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Request: ', config.url)
    console.log('Request: ', config)
  }
  return config
}, function (error) {
  console.log('Response Error: ', error.response)
  return Promise.reject(error.response)
})

instance.interceptors.response.use((response) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Response: ', response.config.url)
    console.log('Response: ', response.data)
  }
  return response
}, async function (error) {
  if (!error.response) {
    // Network error
    // router.replace('/503')
    return Promise.reject(error)
  } else {
    // If reponse is unauthorized (401) get new token
    const originalRequest = error.config
    if (error.response.status == 401) {
      originalRequest._retry = true

      const { data } = await instance.post('/auth/get-token', {
        accessToken: Vue.cookie.get('TAT'),
        email: localStorage.getItem('userEmail'),
        id: localStorage.getItem('userId')
      })

      if (!data.token) { router.push('/auth/signin') }

      if (process.env.NODE_ENV === 'development') {
        Vue.cookie.set('TNAT', data.token)
      } else {
        Vue.cookie.set('TNAT', data.token, { domain: '.' + process.env.VUE_APP_DOMAIN }, 30)
      }

      const newToken = 'Bearer ' + data.token
      instance.defaults.headers.common.Authorization = newToken
      originalRequest.headers.Authorization = newToken

      return instance(originalRequest)
    }
    console.log('Response Error: ', error.response)
    return Promise.reject(error.response)
  }
})

export default instance
