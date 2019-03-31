import api from '@/api'

const url = '/plugin/pin-point/sales-visitation-targets'

const state = {
  target: {},
  targets: []
}

const getters = {
  target: state => {
    return state.target
  },
  targets: state => {
    return state.targets
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.targets = payload
  },
  'FETCH_OBJECT' (state, payload) {
    state.target = payload
  },
  'CREATE' (state, payload) {
    state.target = payload
  },
  'UPDATE' (state, payload) {
    state.target = payload
  },
  'DELETE' (state, payload) {
    state.target = {}
  }
}

const actions = {
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/export', payload)
        .then((response) => {
          resolve(response)
        },
        (error) => {
          reject(error)
        })
    })
  },
  get ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url, payload)
        .then((response) => {
          commit('FETCH_ARRAY', response.data)
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
        .then((response) => {
          context.dispatch('get')
          resolve(response)
        }, (error) => {
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
