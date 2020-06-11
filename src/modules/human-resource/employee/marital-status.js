import api from '@/api'

const url = '/human-resource/employee/marital-statuses'

const state = {
  maritalStatus: {},
  maritalStatuses: [],
  maritalStatusList: []
}

const getters = {
  maritalStatus: state => {
    return state.maritalStatus
  },
  maritalStatuses: state => {
    return state.maritalStatuses
  },
  maritalStatusList: state => {
    return state.maritalStatusList
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.maritalStatuses = payload
  },
  'FETCH_SELECT_LIST' (state, payload) {
    const array = []
    payload.forEach(element => {
      array.push({
        id: element.id,
        label: element.name
      })
    })
    state.maritalStatusList = array
  },
  'FETCH_OBJECT' (state, payload) {
    state.maritalStatus = payload
  },
  'CREATE' (state, payload) {
    state.maritalStatus = payload
  },
  'UPDATE' (state, payload) {
    state.maritalStatus = payload
  },
  'DELETE' (state, payload) {
    state.maritalStatus = {}
  }
}

const actions = {
  get ({ commit }) {
    return new Promise((resolve, reject) => {
      api.get(url)
        .then(
          (response) => {
            commit('FETCH_ARRAY', response.data)
            commit('FETCH_SELECT_LIST', response.data)
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
