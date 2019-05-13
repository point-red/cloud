import api from '@/api'

const url = '/project/request-join'

const state = {
  requestJoinProject: {},
  requestJoinProjects: []
}

const getters = {
  requestJoinProject: state => {
    return state.requestJoinProject
  },
  requestJoinProjects: state => {
    return state.requestJoinProjects
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.requestJoinProjects = payload.data
  },
  'FETCH_OBJECT' (state, payload) {
    state.requestJoinProject = payload.data
  },
  'CREATE' (state, payload) {
    state.requestJoinProject = payload
  },
  'UPDATE' (state, payload) {
    state.requestJoinProject = payload
  },
  'DELETE' (state, payload) {
    state.requestJoinProject = {}
  },
  'REMOVE_OBJECT' (state, payload) {
    var index = state.requestJoinProjects.indexOf(payload)
    state.requestJoinProjects.splice(index, 1)
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
