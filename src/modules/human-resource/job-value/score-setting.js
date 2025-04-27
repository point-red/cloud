import api from '@/api'

const url = '/human-resource/job-value/score-setting'

const state = {
  score: {}
}

const getters = {
  score: (state) => state.score
}

const mutations = {
  FETCH_OBJECT (state, payload) {
    state.score = payload
  },
  UPDATE (state, payload) {
    state.score = payload
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload).then(
        (response) => {
          commit('FETCH_OBJECT', response.data)
          resolve(response)
        },
        (error) => {
          reject(error)
        }
      )
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api
        .patch(url, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
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
