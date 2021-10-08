import axiosNode from '@/axiosNode'

export default {
  get (url, request, config) {
    return axiosNode.get(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  post (url, request, config) {
    return axiosNode.post(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  patch (url, request, config) {
    return axiosNode.patch(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  put (url, request, config) {
    return axiosNode.patch(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  },
  delete (url, request, config) {
    return axiosNode.delete(url, request, config)
      .then(response => Promise.resolve(response.data))
      .catch(error => Promise.reject(error.data))
  }
}
