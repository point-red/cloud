import api from '@/api'

const url = '/plugin/play-book/instructions'

const state = {
  instructions: [],
  steps: [],
  pagination: {}
}

const getters = {
  instruction: state => {
    return state.instruction
  },
  instructions: state => {
    return state.instructions
  },
  steps: state => state.steps,
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  SET_INSTRUCTIONS (state, instructions) {
    state.instructions = instructions
  },
  SET_STEPS (state, steps) {
    state.steps = steps
  },
  ADD_INSTRUCTION (state, instruction) {
    instruction.steps = []
    state.instructions.push(instruction)
  },
  ADD_INSTRUCTION_STEP (state, { instruction, step }) {
    instruction.steps.push(step)
  },
  SET_PAGINATION (state, pagination) {
    state.pagination = pagination
  }
}

const actions = {
  async create ({ commit, state }, payload) {
    return api.get(`${url}/create`, {
      params: payload
    })
  },
  async store ({ commit, state }, instruction) {
    return api.post(url, instruction)
  },
  async storeStep ({ commit, state }, payload) {
    return api.post(`${url}/${payload.instruction_id}/steps`, payload)
    // const instruction = state.instructions
    //   .find(_instruction => parseInt(_instruction.id) === parseInt(payload.instruction_id))
    // commit('ADD_INSTRUCTION_STEP', { instruction, step: payload })
  },
  async update ({ commit }, instruction) {
    return api.put(`${url}/${instruction.id}`, instruction)
  },
  async updateStep ({ commit, state }, payload) {
    return api.put(`${url}/${payload.instruction_id}/steps/${payload.id}`, payload)
  },
  async get ({ commit, state }, payload) {
    commit('SET_STEPS', [])
    commit('SET_PAGINATION', {})

    const { instructions } = await api.get(url, {
      params: payload
    })

    commit('SET_INSTRUCTIONS', instructions)
  },
  async getSteps ({ commit, state }, payload) {
    const { data, meta } = await api.get(`${url}/${payload.instruction_id}/steps`, {
      params: payload
    })

    commit('SET_STEPS', data)
    commit('SET_PAGINATION', meta)
  },
  async show ({ commit }, id) {
    const { instruction } = await api.get(`${url}/${id}`)

    return instruction
  },
  async delete ({ commit }, id) {
    return api.delete(`${url}/${id}`)
  },
  async deleteStep ({ commit }, payload) {
    return api.delete(`${url}/${payload.instruction_id}/steps/${payload.id}`)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
