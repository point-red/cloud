import api from '@/api'

const url = '/sales/delivery-orders'

const state = {
  deliveryOrder: {
    date: null,
    customer_id: null,
    warehouse: {
      name: null
    },
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
    customer: {
      name: null
    },
    items: []
  },
  deliveryOrders: [],
  pagination: {}
}

const getters = {
  deliveryOrder: state => {
    return state.deliveryOrder
  },
  deliveryOrders: state => {
    return state.deliveryOrders.map((deliveryOrder) => {
      deliveryOrder.form.last_status = deliveryOrder.form.approval_status

      if (deliveryOrder.form.close_status != null) {
        deliveryOrder.form.last_status = deliveryOrder.form.close_status
        return deliveryOrder
      }

      if (deliveryOrder.form.cancellation_status != null) {
        deliveryOrder.form.last_status = deliveryOrder.form.cancellation_status
        return deliveryOrder
      }

      return deliveryOrder
    })
  },
  pagination: state => {
    return state.pagination
  }
}

const mutations = {
  'FETCH_ARRAY' (state, payload) {
    state.deliveryOrders = payload.data
    state.pagination = payload.meta
  },
  'FETCH_OBJECT' (state, payload) {
    payload.data.items.forEach(element => {
      element.more = false
    })
    state.deliveryOrder = payload.data
  },
  'CREATE' (state, payload) {
    state.deliveryOrder = payload
  },
  'UPDATE' (state, payload) {
    state.deliveryOrder = payload
  },
  'DELETE' (state, payload) {
    state.deliveryOrder = {}
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
  closeReject (context, payload) {
    return new Promise((resolve, reject) => {
      api.post(url + '/' + payload.id + '/close-reject', payload)
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
  export ({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.get(url + '/export', payload)
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
