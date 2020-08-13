import api from '@/api'

const url = '/master/user-warehouses'

const state = {
  //
}

const getters = {
  //
}

const mutations = {
  //
}

const actions = {
  attach ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/attach', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  detach ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/detach', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  updateDefault ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/update-default', payload)
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
