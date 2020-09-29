import api from '@/api'

const url = '/plugin/salary-non-sales/group-factors'

const state = {
  groupFactor: {
    name: '',
    gruop_id: null
  },
  groupFactors: [],
  groupFactorList: [],
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
  groupFactor: state => {
    return state.groupFactor
  },
  groupFactors: state => {
    return state.groupFactors
  },
  groupFactorList: state => {
    return state.groupFactorList
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
    state.groupFactorList = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.groupFactor = payload.data
  },
  'CREATE' (state, payload) {
    state.groupFactor = payload
  },
  'UPDATE' (state, payload) {
    state.groupFactor = payload
  },
  'DELETE' (state, payload) {
    state.groupFactor = {}
  },
  'ADD_ROW' (state, payload) {
    state.groupFactorList.unshift(payload)
  },
  'REMOVE_ROW' (state, payload) {
    state.groupFactorList = state.groupFactorList.filter((value, index) => {
      return index != payload
    })
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
  delete ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.delete(url + '/' + payload.id, payload)
        .then(response => {
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
