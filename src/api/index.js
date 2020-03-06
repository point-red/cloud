import axios from '@/axios'

export default {
  get (url, request, config) {
    return axios.get(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  post (url, request, config) {
    return axios.post(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  patch (url, request, config) {
    return axios.patch(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  put (url, request, config) {
    return axios.patch(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  delete (url, request, config) {
    return axios.delete(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  }
}
