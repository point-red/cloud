import api from '@/api'
import qs from 'qs'

const url = '/psychotest/position-categories'

const state = {
  positionCategory: {},
  positionCategories: []
}

const getters = {
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.positionCategories = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.positionCategory = payload
  },
  'CREATE' (state, payload) {
    state.positionCategory = payload
  },
  'UPDATE' (state, payload) {
    state.positionCategory = payload
  },
  'DELETE' (state, payload) {
    state.positionCategory = {}
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
            // context.dispatch('get')
            resolve(response)
          },
          (error) => {
            reject(error)
          })
    })
  },
  bulkCreate (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(`${url}/bulk-store`, payload)
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
  bulkUpdate (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(`${url}/bulk-update`, payload)
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
  bulkDelete (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(`${url}/bulk-delete`, payload)
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
