import api from '@/api'
import qs from 'qs'

const url = '/psychotest/candidates'

export const types = {
  'FETCH_ARRAY': 'FETCH_ARRAY',
  'FETCH_OBJECT': 'FETCH_OBJECT',
  'CREATE': 'CREATE',
  'UPDATE': 'UPDATE',
  'DELETE': 'DELETE'
}

const state = {
  candidate: null,
  candidates: []
}

const getters = {
  isAuth: state => state.candidate !== null && typeof state.candidate !== 'undefined'
}

const mutations = {
  [types.FETCH_ARRAY]: (state, payload) => {
    state.candidates = payload
  },
  [types.FETCH_OBJECT]: (state, payload) => {
    state.candidate = payload
  },
  [types.CREATE]: (state, payload) => {
    state.candidate = payload
  },
  [types.UPDATE]: (state, payload) => {
    state.candidate = payload
  },
  [types.DELETE]: (state, payload) => {
    state.candidate = {}
  }
}

const actions = {
  login ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(`${url}/login`, payload)
        .then(response => {
          // commit('FETCH_OBJECT', response.data)
          resolve(response)
        },
        (error) => {
          reject(error)
        })
    })
  },
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
  create ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(
          (response) => {
            // commit('FETCH_OBJECT', response.data)
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  update ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(
          (response) => {
            // context.dispatch('find', { id: response.data.id })
            // commit('FETCH_OBJECT', response.data)
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
