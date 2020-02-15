<template>
  <div>
    <span @click="show" class="link">{{ mutableLabel || 'SELECT' | uppercase }}</span>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select">
      <template slot="content">
        <input type="text" class="form-control" v-model="searchText" placeholder="Search..." @keydown.enter.prevent="">
        <hr>
        <div v-if="isLoadingSupplier || isLoadingCustomer || isLoadingEmployee">
          <h3 class="text-center">Loading ...</h3>
        </div>
        <template v-else>
          <div class="list-group push" v-if="optionSuppliers">
            <template v-for="(optionSupplier, index) in optionSuppliers">
              <a
                :key="'supplier-' + index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{'active': optionSupplier.id == mutableId && type == 'supplier' }"
                @click="choose(optionSupplier)"
                href="javascript:void(0)">
                [SUPPLIER] {{ optionSupplier.label | uppercase }}
              </a>
            </template>
            <template v-for="(optionCustomer, index) in optionCustomers">
              <a
                :key="'customer-' + index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{'active': optionCustomer.id == mutableId && type == 'customer' }"
                @click="choose(optionCustomer)"
                href="javascript:void(0)">
                [Customer] {{ optionCustomer.label | uppercase }}
              </a>
            </template>
            <template v-for="(optionEmployee, index) in optionEmployees">
              <a
                :key="'employee-' + index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{'active': optionEmployee.id == mutableId && type == 'employee' }"
                @click="choose(optionEmployee)"
                href="javascript:void(0)">
                [EMPLOYEE] {{ optionEmployee.label | uppercase }}
              </a>
            </template>
          </div>

          <div class="list-group push" v-if="searchText && !isLoadingEmployee && !isLoadingCustomer && !isLoadingSupplier && optionEmployees.length == 0 && optionCustomers.length == 0 && optionSuppliers.length == 0">
            <div class="alert alert-info text-center">
              {{ $t('searching not found', [searchText]) | capitalize }}
            </div>
          </div>
        </template>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-outline-danger">{{ $t('close') | uppercase }}</button>
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
            'type': 'Supplier'
          })

          if (this.value == key['id'] && this.type == 'Supplier') {
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
            'type': 'Customer'
          })

          if (this.value == key['id'] && this.type == 'Customer') {
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
            'type': 'Employee'
          })

          if (this.value == key['id'] && this.type == 'Employee') {
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

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
