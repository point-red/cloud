import api from '@/api'

const url = '/human-resource/kpi/templates'

const state = {
  template: {},
  templates: [],
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
  template: state => {
    return state.template
  },
  templates: state => {
    return state.templates
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.templates = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.template = payload
  },
  'CREATE' (state, payload) {
    state.template = payload
  },
  'UPDATE' (state, payload) {
    state.template = payload
  },
  'DELETE' (state, payload) {
    state.template = {}
  }
}

const actions = {
  copyGroup ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/copy-group', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
  duplicate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/duplicate', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  },
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
      api.get(url, { params: payload }).then((response) => {
        commit('FETCH_ARRAY', response)
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
  },
  archive ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/archive', payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkArchive ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-archive', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  activate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/activate', payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkActivate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-activate', payload)
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
