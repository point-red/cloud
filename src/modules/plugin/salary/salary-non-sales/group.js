import api from '@/api'

const url = '/plugin/salary-non-sales/groups'

const state = {
  group: {
    name: ''
  },
  groups: [],
  groupList: [],
  pagination: {
    current_page: null,
    from: null,
    to: null,
    path: null,
    last_page: null,
    per_page: null,
    total: null
  }
}

const getters = {
  group: state => {
    return state.group
  },
  groups: state => {
    return state.groups
  },
  groupList: state => {
    return state.groupList
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.jobLocations = payload.data
    state.pagination.current_page = payload.meta.current_page
    state.pagination.from = payload.meta.from
    state.pagination.to = payload.meta.to
    state.pagination.path = payload.meta.path
    state.pagination.last_page = payload.meta.last_page
    state.pagination.per_page = payload.meta.per_page
    state.pagination.total = payload.meta.total
  },
  'FETCH_SELECT_LIST' (state, payload) {
    // const array = []
    // payload.forEach(element => {
    //   array.push({
    //     id: element.id,
    //     label: element.name
    //   })
    // })
    state.groupList = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.group = payload.data
  },
  'CREATE' (state, payload) {
    state.group = payload
  },
  'UPDATE' (state, payload) {
    state.group = payload
  },
  'DELETE' (state, payload) {
    state.group = {}
  },
  'ADD_ROW' (state, payload) {
    state.groupList.unshift(payload)
  },
  'REMOVE_ROW' (state, payload) {
    state.groupList.splice(payload, -1)
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(response => {
          console.log('get -> response', response)
          // commit('FETCH_ARRAY', response)
          commit('FETCH_SELECT_LIST', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  create ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(response => {
          commit('ADD_ROW', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  delete ({ commit }, payload, index = null) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(response => {
          if (index) {
            commit('REMOVE_ROW', index)
          }
          resolve(response)
        }).catch(error => {
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
