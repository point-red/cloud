<template>
  <div>
    <span @click="show" class="link"><i class="fa fa-list mr-5"></i>{{ mutableLabel || 'SELECT'}}</span>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select">
      <template slot="content">
        <input type="text" class="form-control" v-model="searchText" placeholder="Search..." @keydown.enter.prevent="">
        <hr>
        <div v-if="isLoadingSupplier || isLoadingCustomer || isLoadingEmployee">
          <h3 class="text-center">Loading ...</h3>
        </div>
        <template v-else>
          <div class="list-group push">
            <h4>Supplier</h4>
            <template v-for="(optionSupplier, index) in optionSuppliers">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{'active': optionSupplier.id == mutableId && type == 'supplier' }"
                @click="choose(optionSupplier)"
                href="javascript:void(0)">
                {{ optionSupplier.label }}
              </a>
            </template>
            <div class="alert alert-info text-center" v-if="searchText && optionSuppliers.length == 0 && !isLoadingSupplier">
              {{ $t('searching not found', [searchText]) | capitalize }}
            </div>
            <div class="alert alert-info text-center" v-if="!searchText && optionSuppliers.length == 0 && !isLoadingSupplier">
              {{ $t('you doesn\'t have any') | capitalize }} {{ $t('supplier') | capitalize }}
            </div>
          </div>

          <div class="list-group push">
            <h4>Customer</h4>
            <template v-for="(optionCustomer, index) in optionCustomers">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{'active': optionCustomer.id == mutableId && type == 'customer' }"
                @click="choose(optionCustomer)"
                href="javascript:void(0)">
                {{ optionCustomer.label }}
              </a>
            </template>
            <div class="alert alert-info text-center" v-if="searchText && optionCustomers.length == 0 && !isLoadingCustomer">
              {{ $t('searching not found', [searchText]) | capitalize }}
            </div>
            <div class="alert alert-info text-center" v-if="!searchText && optionCustomers.length == 0 && !isLoadingCustomer">
              {{ $t('you doesn\'t have any') | capitalize }} {{ $t('customer') | capitalize }}
            </div>
          </div>

          <div class="list-group push">
            <h4>Employee</h4>
            <template v-for="(optionEmployee, index) in optionEmployees">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{'active': optionEmployee.id == mutableId && type == 'employee' }"
                @click="choose(optionEmployee)"
                href="javascript:void(0)">
                {{ optionEmployee.label }}
              </a>
            </template>
            <div class="alert alert-info text-center" v-if="searchText && optionEmployees.length == 0 && !isLoadingEmployee">
              {{ $t('searching not found', [searchText]) | capitalize }}
            </div>
            <div class="alert alert-info text-center" v-if="!searchText && optionEmployees.length == 0 && !isLoadingEmployee">
              {{ $t('you doesn\'t have any') | capitalize }} {{ $t('employee') | capitalize }}
            </div>
          </div>
        </template>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-outline-danger">Close</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      searchText: '',
      options: [],
      optionSuppliers: [],
      optionCustomers: [],
      optionEmployees: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoadingSupplier: false,
      isLoadingCustomer: false,
      isLoadingEmployee: false
    }
  },
  computed: {
    ...mapGetters('masterSupplier', ['suppliers']),
    ...mapGetters('masterCustomer', ['customers']),
    ...mapGetters('humanResourceEmployee', ['employees'])
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    },
    label: {
      type: String
    },
    type: {
      type: String
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('masterSupplier', {
      getSupplier: 'get'
    }),
    ...mapActions('masterCustomer', {
      getCustomer: 'get'
    }),
    ...mapActions('humanResourceEmployee', {
      getEmployee: 'get'
    }),
    search () {
      this.isLoadingSupplier = true
      this.getSupplier({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.optionSuppliers = []
        this.mutableLabel = ''
        response.data.map((key, value) => {
          this.optionSuppliers.push({
            'id': key['id'],
            'label': key['name'],
            'type': 'supplier'
          })

          if (this.value == key['id'] && this.type == 'supplier') {
            this.mutableLabel = key['name']
          }
        })
        this.isLoadingSupplier = false
      }).catch(error => {
        this.isLoadingSupplier = false
      })

      this.isLoadingCustomer = true
      this.getCustomer({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.optionCustomers = []
        this.mutableLabel = ''
        response.data.map((key, value) => {
          this.optionCustomers.push({
            'id': key['id'],
            'label': key['name'],
            'type': 'customer'
          })

          if (this.value == key['id'] && this.type == 'customer') {
            this.mutableLabel = key['name']
          }
        })
        this.isLoadingCustomer = false
      }).catch(error => {
        this.isLoadingCustomer = false
      })

      this.isLoadingEmployee = true
      this.getEmployee({
        params: {
          sort_by: 'name',
          limit: 50,
          filter_like: {
            name: this.searchText
          }
        }
      }).then(response => {
        this.optionEmployees = []
        this.mutableLabel = ''
        response.data.map((key, value) => {
          this.optionEmployees.push({
            'id': key['id'],
            'label': key['name'],
            'type': 'employee'
          })

          if (this.value == key['id'] && this.type == 'employee') {
            this.mutableLabel = key['name']
          }
        })
        this.isLoadingEmployee = false
      }).catch(error => {
        this.isLoadingEmployee = false
      })
    },
    add () {
      this.isSaving = true
      this.create({
        name: this.searchText
      }).then(response => {
        this.search()
        this.isSaving = false
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    choose (option) {
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    show () {
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$refs['select-' + this.id].close()
      this.$emit('close', true)
    }
  }
}
</script>

<style>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px blueviolet;
  cursor: pointer;
}
</style>
