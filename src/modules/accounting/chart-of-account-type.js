import api from '@/api'

const url = '/accounting/chart-of-account-types'

const state = {
  chartOfAccountType: {},
  chartOfAccountTypes: [],
  chartOfAccountTypeList: []
}

const getters = {
  chartOfAccountType: state => {
    return state.chartOfAccountType
  },
  chartOfAccountTypeList: state => {
    return state.chartOfAccountTypeList
  },
  chartOfAccountTypes: state => {
    return state.chartOfAccountTypes
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.chartOfAccountTypes = payload
  },
  'FETCH_SELECT_LIST' (state, payload) {
    let array = []
    payload.forEach(element => {
      array.push({
        id: element.id,
        label: element.alias
      })
    })
    state.chartOfAccountTypeList = array
  },
  'FETCH_OBJECT' (state, payload) {
    state.chartOfAccountType = payload
  },
  'CREATE' (state, payload) {
    state.chartOfAccountType = payload
  },
  'UPDATE' (state, payload) {
    state.chartOfAccountType = payload
  },
  'DELETE' (state, payload) {
    state.chartOfAccountType = {}
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
