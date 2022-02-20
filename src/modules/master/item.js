import api from '@/api'

const url = '/master/items'

const state = {
  item: {
    code: '',
    name: '',
    stock: null,
    units: [
      {
        label: '',
        name: '',
        converter: null
      }
    ],
    account: [
      {
        number: '',
        name: ''
      }
    ]
  },
  items: [
    {
      code: '',
      name: '',
      stock: null,
      units: [
        {
          label: '',
          name: '',
          converter: null
        }
      ],
      account: [
        {
          number: '',
          name: ''
        }
      ]
    }
  ],
  pagination: {}
}

const getters = {
  item: state => {
    return state.item
  },
  items: state => {
    return state.items
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.items = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.item = payload.data
  },
  'CREATE' (state, payload) {
    state.item = payload
  },
  'UPDATE' (state, payload) {
    state.item = payload
  },
  'DELETE' (state, payload) {
    state.item = {}
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
  import (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/import', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  excelExport () {
    return new Promise((resolve, reject) => {
      api.get(url + '/exportToExcel',
        { responseType: 'arraybuffer' })
        .then(response => {
          var fileURL = window.URL.createObjectURL(new Blob([response]))
          var fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', 'test.xlsx')
          document.body.appendChild(fileLink)
          fileLink.click()
        })
    })
  },
  update (context, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id, payload)
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
