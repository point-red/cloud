import api from '@/api'

const url = (procedureId) => `/plugin/play-book/procedures/${procedureId}/histories`

const state = {
  procedure: null,
  histories: [],
  pagination: {}
}

const getters = {
  procedure: state => {
    return state.procedure
  },
  histories: state => {
    return state.histories
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_PROCEDURE (state, procedure) {
    state.procedure = procedure
  },
  SET_HISTORIES (state, histories) {
    state.histories = histories
  },
  SET_PAGINATION (state, pagination) {
    state.pagination = pagination
  }
}

const actions = {
  async store ({ commit }, procedure) {
    return api.post(url, procedure)
  },
  async update ({ commit }, procedure) {
    return api.put(`${url}/${procedure.id}`, procedure)
  },
  async get ({ commit }, { procedureId, params }) {
    commit('SET_PROCEDURE', null)
    commit('SET_HISTORIES', [])

    const { procedure, histories } = await api.get(url(procedureId), {
      params
    })

    const pagination = (({ data, ..._histories }) => _histories)(histories)

    commit('SET_PROCEDURE', procedure)
    commit('SET_HISTORIES', histories.data)
    commit('SET_PAGINATION', pagination)
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
