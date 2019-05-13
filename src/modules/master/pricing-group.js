import api from '@/api'

const url = '/master/pricing-groups'

const state = {
  pricingGroup: {
    code: '',
    name: ''
  },
  pricingGroups: []
}

const getters = {
  pricingGroup: state => {
    return state.pricingGroup
  },
  pricingGroups: state => {
    return state.pricingGroups
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.pricingGroups = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.pricingGroup = payload.data
  },
  'CREATE' (state, payload) {
    state.pricingGroup = payload
  },
  'UPDATE' (state, payload) {
    state.pricingGroup = payload
  },
  'DELETE' (state, payload) {
    state.pricingGroup = {}
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  find ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id, payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  create (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url, payload)
        .then(response => {
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
  delete (context, payload) {
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
