import api from '@/api'

const url = '/human-resource/employee/genders'

const state = {
  gender: {},
  genders: [],
  genderList: []
}

const getters = {
  gender: state => {
    return state.gender
  },
  genders: state => {
    return state.genders
  },
  genderList: state => {
    return state.genderList
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.genders = payload
  },
  'FETCH_SELECT_LIST' (state, payload) {
    const array = []
    payload.forEach(element => {
      array.push({
        id: element.id,
        label: element.name
      })
    })
    state.genderList = array
  },
  'FETCH_OBJECT' (state, payload) {
    state.gender = payload
  },
  'CREATE' (state, payload) {
    state.gender = payload
  },
  'UPDATE' (state, payload) {
    state.gender = payload
  },
  'DELETE' (state, payload) {
    state.gender = {}
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
