import api from '@/api'

const url = '/'

const state = { }

const getters = { }

const mutations = { }

const actions = {
  send (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + 'send-email', payload)
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
