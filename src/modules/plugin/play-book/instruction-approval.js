import api from '@/api'

const url = '/plugin/play-book/approval/instructions'

const state = {
  instructions: [],
  pagination: {}
}

const getters = {
  instructions: state => {
    return state.instructions
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_INSTRUCTIONS (state, instructions) {
    state.instructions = instructions
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

    commit('SET_INSTRUCTIONS', data)
    commit('SET_PAGINATION', meta)
  },
  async approve ({ commit }, id) {
    return api.post(`${url}/${id}/approve`)
  },
  async decline ({ commit }, payload) {
    return api.post(`${url}/${payload.id}/decline`, payload)
  },
  async approveStep ({ commit }, payload) {
    return api.post(`${url}/${payload.instruction_id}/approve/step/${payload.id}`)
  },
  async declineStep ({ commit }, payload) {
    return api.post(`${url}/${payload.instruction_id}/decline/step/${payload.id}`, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
