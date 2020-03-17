import api from '@/api'

const url = '/project/project-users'

const state = {}

const getters = {}

const mutations = {}

const actions = {
  delete (context, payload) {
    console.log(payload)
    return new Promise((resolve, reject) => {
      api.delete(url, { data: payload })
        .then(response => {
          resolve(response)
        }).catch(error => {
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
