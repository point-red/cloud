import api from '@/api'

const url = function (id) {
  return 'project/projects/' + id + '/database/backups'
}

const state = {
  backups: []
}

const getters = {
  backups: state => {
    return state.backups
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.backups = payload.data
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url(payload.id), payload).then(response => {
        commit('FETCH_ARRAY', response)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url(payload.id), payload)
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
