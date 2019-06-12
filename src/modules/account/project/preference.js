import api from '@/api'

const url = function (id) {
  return 'project/projects/' + id + '/preferences'
}

const state = {
  preference: {}
}

const getters = {
  preference: state => {
    return state.preference
  }
}

const mutations = {
  'FETCH_OBJECT' (state, payload) {
    state.preference = payload.data
  },
  'UPDATE' (state, payload) {
    state.preference = payload
  }
}

const actions = {
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.id), payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  update ({ context, commit }, payload) {
    console.log(payload)
    return new Promise((resolve, reject) => {
      api.patch(url(payload.id), payload)
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
