import api from '@/api'

const url = '/human-resource/employee/user-employee'

const state = {
  user_employees: []
}

const getters = {
  user_employees: state => {
    return state.user_employees
  },
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.user_employees = payload
  }
}

const actions = {
  get ({ commit }) {
    return new Promise((resolve, reject) => {
      api.get(url)
        .then(
          (response) => {
            commit('FETCH_ARRAY', response.data)
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
