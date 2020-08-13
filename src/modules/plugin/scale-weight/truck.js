import api from '@/api'

const url = '/plugin/scale-weight/trucks'

const state = {
  scaleWeight: {},
  scaleWeights: [],
  pagination: {}
}

const getters = {
  scaleWeight: state => {
    return state.scaleWeight
  },
  scaleWeights: state => {
    return state.scaleWeights
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.scaleWeights = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.scaleWeight = payload
  },
  'CREATE' (state, payload) {
    state.scaleWeight = payload
  },
  'UPDATE' (state, payload) {
    state.scaleWeight = payload
  },
  'DELETE' (state, payload) {
    state.scaleWeight = {}
  }
}

const actions = {
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/export', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then((response) => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }, (error) => {
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
