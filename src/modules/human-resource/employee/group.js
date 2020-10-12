import api from '@/api'

const url = '/human-resource/employee/groups'

const state = {
  group: {},
  groups: [],
  pagination: {},
  groupList: []
}

const getters = {
  group: state => {
    return state.group
  },
  groups: state => {
    return state.groups
  },
  pagination: state => {
    return state.pagination
  },
  groupList: state => {
    return state.groupList
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.groups = payload.data
    state.pagination = payload.meta
  },
  'FETCH_SELECT_LIST' (state, payload) {
    const array = []
    if (payload) {
      payload.forEach(element => {
        array.push({
          id: element.id,
          label: element.name
        })
      })
    }
    state.groupList = array
  },
  'FETCH_OBJECT' (state, payload) {
    state.group = payload
  },
  'CREATE' (state, payload) {
    state.group = payload
  },
  'UPDATE' (state, payload) {
    state.group = payload
  },
  'DELETE' (state, payload) {
    state.group = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(
          (response) => {
            commit('FETCH_ARRAY', response)
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
