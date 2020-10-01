import api from '@/api'

const url = '/plugin/salary-non-sales/job-locations'

const state = {}

const getters = {}

const mutations = {}

const actions = {
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .patch(url + '/' + payload.id, payload)
        .then(response => {
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
