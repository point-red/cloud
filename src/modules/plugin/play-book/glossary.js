import api from '@/api'

const url = '/plugin/play-book/glossaries'

const state = {
  glossaries: [],
  pagination: {}
}

const getters = {
  glossary: state => {
    return state.glossary
  },
  glossaries: state => {
    return state.glossaries
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_GLOSSARIES (state, glossaries) {
    state.glossaries = glossaries
  },
  SET_PAGINATION (state, pagination) {
    state.pagination = pagination
  }
}

const actions = {
  async create ({ commit }) {
    return api.get(`${url}/create`)
  },
  async store ({ commit }, glossary) {
    return api.post(url, glossary)
  },
  async update ({ commit }, glossary) {
    return api.put(`${url}/${glossary.id}`, glossary)
  },
  async get ({ commit }, payload) {
    const { data, meta } = await api.get(url, {
      params: payload
    })

    commit('SET_GLOSSARIES', data)
    commit('SET_PAGINATION', meta)
  },
  async show ({ commit }, id) {
    const { glossary } = await api.get(`${url}/${id}`)

    return glossary
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
