import api from '@/api'

const url = '/accounting/memo-journals'

const state = {
  accountingMemoJournal: {
    date: null,
    form: {
      number: null,
      notes: null,
      created_by: {
        name: null
      },
      request_approval_to: {
        full_name: null
      }
    },
    items: []
  },
  accountingMemoJournals: [],
  historyMemoJournals: [],
  pagination: {}
}

const getters = {
  accountingMemoJournal: state => {
    return state.accountingMemoJournal
  },
  accountingMemoJournals: state => {
    return state.accountingMemoJournals
  },
  historyMemoJournals: state => {
    return state.historyMemoJournals
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.accountingMemoJournals = payload.data
    state.historyMemoJournals = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    payload.data.items.forEach(element => {
      element.more = false
    })
    state.accountingMemoJournal = payload.data
  },
  'CREATE' (state, payload) {
    state.accountingMemoJournal = payload
  },
  'UPDATE' (state, payload) {
    state.accountingMemoJournal = payload
  },
  'DELETE' (state, payload) {
    state.accountingMemoJournal = {}
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
          console.log(error)
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
      api.patch(url + '/' + payload.old_id, payload)
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
  },
  approve (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  reject (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/reject', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  close (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/close', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  approveByEmail (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  rejectByEmail (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/reject', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  cancellationApprove (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/cancellation-approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  cancellationReject (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/cancellation-reject', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  closeApprove (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/close-approve', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  addHistories (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/histories', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getHistories ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/' + payload.id + '/histories', payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  getFormReferences ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/form-references', payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  getDataFormReferences ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/data-form-references', payload)
        .then(response => {
          commit('FETCH_ARRAY', response)
          resolve(response)
        }).catch(error => {
          console.log(error)
          reject(error)
        })
    })
  },
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/export', payload)
        .then((response) => {
          resolve(response)
        }, (error) => {
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
