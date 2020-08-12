import api from '@/api'

const url = '/plugin/play-book/instructions'

const state = {
  instruction: null
}

const getters = {
  instruction: state => {
    return state.instruction
  },
  instructionHistory: state => {
    if (!state.instruction) {
      return []
    }

    const longestIndex = Math.max(
      state.instruction.name.length, state.instruction.number.length
    )

    const result = []
    let lastNumber = null
    let lastName = null
    for (let i = 0; i < longestIndex; i++) {
      lastNumber = state.instruction.number[i] || lastNumber
      lastName = state.instruction.name[i] || lastName

      result.push({
        number: lastNumber,
        name: lastName
      })
    }

    return result
  },
  glossaries: state => {
    const glossaries = []

    if (state.instruction) {
      state.instruction.steps.forEach(_step => {
        _step.histories.forEach(_history => {
          _history.contents.forEach(_content => {
            if (!glossaries.find(_glossary => _glossary.id === _content.glossary_id)) {
              glossaries.push(_content.glossary)
            }
          })
        })
      })
    }

    return glossaries
  },
  steps: state => {
    const steps = []

    if (state.instruction) {
      state.instruction.steps.forEach(_step => {
        _step.histories.forEach(_history => {
          steps.push(_history)
        })
      })
    }

    return steps.map(_step => {
      const contents = {}
      _step = { ..._step }

      _step.contents.forEach(_content => {
        contents[`${_content.glossary_id}`] = _content.content
      })

      _step.contentsForView = contents

      return _step
    })
  }
}

const mutations = {
  SET_INSTRUCTION (state, instruction) {
    state.instruction = instruction
  }
}

const actions = {
  async get ({ commit, state }, instructionId) {
    const { instruction } = await api.get(`${url}/${instructionId}/histories`)

    commit('SET_INSTRUCTION', instruction)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
