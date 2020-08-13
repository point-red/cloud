import api from '@/api'

const url = (glossaryId) => `/plugin/play-book/glossaries/${glossaryId}/histories`

const state = {
  glossary: null,
  histories: [],
  pagination: {}
}

const getters = {
  glossary: state => {
    return state.glossary
  },
  histories: state => {
    return state.histories
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_GLOSSARY (state, glossary) {
    state.glossary = glossary
  },
  SET_HISTORIES (state, histories) {
    state.histories = histories
  },
  SET_PAGINATION (state, pagination) {
    state.pagination = pagination
  }
}

const actions = {
  async store ({ commit }, glossary) {
    return api.post(url, glossary)
  },
  async update ({ commit }, glossary) {
    return api.put(`${url}/${glossary.id}`, glossary)
  },
  async get ({ commit }, { glossaryId, params }) {
    commit('SET_GLOSSARY', null)
    commit('SET_HISTORIES', [])

    const { glossary, histories } = await api.get(url(glossaryId), {
      params
    })

    const pagination = (({ data, ..._histories }) => _histories)(histories)

    commit('SET_GLOSSARY', glossary)
    commit('SET_HISTORIES', histories.data)
    commit('SET_PAGINATION', pagination)
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
