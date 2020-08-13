import api from '@/api'

const url = '/plugin/play-book/approval/procedures'

const state = {
  procedures: [],
  pagination: {}
}

const getters = {
  procedures: state => {
    return state.procedures
  },
  allProcedures: (state, getters) => (procedures) => {
    let results = []

    procedures.forEach(procedure => {
      const subs = [...procedure.procedures]
      delete procedure.procedures

      results.push(procedure)
      results = results.concat(getters.allProcedures(subs))
    })

    return results
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_PROCEDURES (state, procedures) {
    state.procedures = procedures
  },
  SET_PAGINATION (state, pagination) {
    state.pagination = pagination
  }
}

const actions = {
  async send ({ commit }, payload) {
    return api.post(`${url}/send`, payload)
  },
  async get ({ commit, state }, payload) {
    const { data, meta } = await api.get(url, {
      params: payload
    })

    commit('SET_PROCEDURES', data)
    commit('SET_PAGINATION', meta)
  },
  async approve ({ commit }, id) {
    return api.post(`${url}/${id}/approve`)
  },
  async decline ({ commit }, payload) {
    return api.post(`${url}/${payload.id}/decline`, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
