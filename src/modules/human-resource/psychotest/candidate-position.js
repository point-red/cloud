import api from '@/api'
import qs from 'qs'

const url = '/psychotest/candidate-positions'

const state = {
  candidatePosition: {},
  candidatePositions: []
}

const getters = {
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.candidatePositions = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.candidatePosition = payload
  },
  'CREATE' (state, payload) {
    state.candidatePosition = payload
  },
  'UPDATE' (state, payload) {
    state.candidatePosition = payload
  },
  'DELETE' (state, payload) {
    state.candidatePosition = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      let queryString = null
      if (payload && payload.params) {
        queryString = qs.stringify(payload.params)
      }
      api.get(`${url}${queryString ? `?${queryString}` : ''}`)
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
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id)
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
            // context.dispatch('get')
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
            // context.dispatch('get')
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
            // context.dispatch('get')
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
