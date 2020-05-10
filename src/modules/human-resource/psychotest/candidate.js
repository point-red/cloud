import api from '@/api'
import qs from 'qs'

const url = '/psychotest/candidates'

const state = {
  candidate: {},
  candidates: []
}

const getters = {
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.candidates = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.candidate = payload
  },
  'CREATE' (state, payload) {
    state.candidate = payload
  },
  'UPDATE' (state, payload) {
    state.candidate = payload
  },
  'DELETE' (state, payload) {
    state.candidate = {}
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
  find ({ commit }, request) {
    return new Promise((resolve, reject) => {
      api.get(`${url}/${request.id}${request.params ? `?${qs.stringify(request.params)}` : ''}`)
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
