import api from '@/api'
import qs from 'qs'

const url = '/psychotest/kraepelins'

const state = {
  kraepelin: {},
  kraepelins: []
}

const getters = {}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.kraepelins = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.kraepelin = payload
  },
  'CREATE' (state, payload) {
    state.kraepelin = payload
  },
  'UPDATE' (state, payload) {
    state.kraepelin = payload
  },
  'DELETE' (state, payload) {
    state.kraepelin = {}
  }
}

const actions = {
  get ({ commit }, request) {
    return new Promise((resolve, reject) => {
      api.get(`${url}${request.params ? `?${qs.stringify(request.params)}` : ''}`)
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
            // context.dispatch('find', { id: response.data.id })
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
            // context.dispatch('find', { id: response.data.id })
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
