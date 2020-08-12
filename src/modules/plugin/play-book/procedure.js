import api from '@/api'

const url = '/plugin/play-book/procedures'

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

    if (state.procedures.length < 1) {
      return results
    }

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
  async create ({ commit }, payload) {
    return api.get(`${url}/create`, {
      params: payload
    })
  },
  async store ({ commit, state }, procedure) {
    return api.post(url, procedure)
  },
  async update ({ commit }, procedure) {
    return api.put(`${url}/${procedure.id}`, procedure)
  },
  async get ({ commit, state }, payload) {
    const { data, meta } = await api.get(url, {
      params: payload
    })

    commit('SET_PROCEDURES', data)
    commit('SET_PAGINATION', meta)
  },
  async show ({ commit }, id) {
    const { procedure } = await api.get(`${url}/${id}`)

    return procedure
  },
  async delete ({ commit }, id) {
    return api.delete(`${url}/${id}`)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
