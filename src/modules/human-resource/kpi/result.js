import api from '@/api'

const url = '/human-resource/kpi/results'

const state = {
  result: {},
  results: []
}

const getters = {
  result: state => {
    return state.result
  },
  results: state => {
    return state.results
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.results = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.result = payload
  },
  'CREATE' (state, payload) {
    state.result = payload
  },
  'UPDATE' (state, payload) {
    state.result = payload
  },
  'DELETE' (state, payload) {
    state.result = {}
  }
}

const actions = {
  get ({ commit }, request) {
    return new Promise((resolve, reject) => {
      api.get(url)
        .then(
          (response) => {
            commit('FETCH_ARRAY', response.data)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  find ({ commit }, request) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + request.id)
        .then(
          (response) => {
            commit('FETCH_OBJECT', response.data)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  findByScorePercentage ({ commit }, request) {
    return new Promise((resolve, reject) => {
      api.get(url + '/showBy', {
        params: {
          score_percentage: request
        }
      })
        .then(
          (response) => {
            commit('FETCH_OBJECT', response.data)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  delete (context, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(
          (response) => {
            context.dispatch('get')
            resolve(response)
          },
          (error) => {
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
