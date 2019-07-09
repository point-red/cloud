import api from '@/api'

const url = function (id) {
  return 'project/projects/' + id + '/database/reset'
}

const actions = {
  reset ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url(payload.id), {
        params: payload.params
      }).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}
