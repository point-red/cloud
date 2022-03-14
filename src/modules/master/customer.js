import api from '@/api'

const url = '/master/customers'

const state = {
  customer: {
    name: '',
    email: '',
    address: '',
    phone: '',
    pricing_group: {
      label: ''
    }
  },
  customers: [],
  pagination: {}
}

const getters = {
  customer: state => {
    return state.customer
  },
  customers: state => {
    return state.customers
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.customers = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    state.customer = payload.data
  },
  'CREATE' (state, payload) {
    state.customer = payload
  },
  'UPDATE' (state, payload) {
    state.customer = payload
  },
  'DELETE' (state, payload) {
    state.customer = {}
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
  },
  bulkDelete ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-delete', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  archive ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/archive', payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkArchive ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-archive', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  activate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/' + payload.id + '/activate', payload)
        .then(response => {
          commit('FETCH_OBJECT', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  bulkActivate ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.patch(url + '/bulk-activate', payload)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/export', payload, {
        responseType: 'blob'
      })
        .then((response) => {
          const url = URL.createObjectURL(new Blob([response], {
            type: 'application/vnd.ms-excel'
          }))
          var today = new Date();
          var date = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString();
          var time = today.getHours().toString() + today.getMinutes().toString() + today.getSeconds().toString();
          var tenantName = localStorage.getItem('tenantName');
          console.log(tenantName);
          var fileName = tenantName + "-" + date + time + "-customers";
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${fileName}.xlsx`)
          document.body.appendChild(link)
          link.click()
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
