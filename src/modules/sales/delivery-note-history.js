import api from '@/api'

const url = '/sales/delivery-notes'

const state = {
  deliveryNoteHistories: [],
  pagination: {}
}

const getters = {
  deliveryNoteHistories: state => {
    return state.deliveryNoteHistories
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.deliveryNoteHistories = payload.data
    state.pagination = payload.meta
  }
}

const actions = {
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id + '/histories', payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  add (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/histories', payload)
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
