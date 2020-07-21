<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <input
        v-model="searchText"
        type="text"
        class="form-control"
        placeholder="Search..."
        @keydown.enter.prevent=""
      >
      <hr>
      <div v-if="isLoadingSupplier || isLoadingCustomer || isLoadingEmployee">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <template v-else>
        <div
          v-if="optionSuppliers"
          class="list-group push"
        >
          <template v-for="(optionSupplier, index) in optionSuppliers">
            <a
              :key="'supplier-' + index"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{'active': optionSupplier.id == mutableId && type == 'supplier' }"
              href="javascript:void(0)"
              @click="choose(optionSupplier)"
            >
              [SUPPLIER] {{ optionSupplier.label | uppercase }}
            </a>
          </template>
          <template v-for="(optionCustomer, index) in optionCustomers">
            <a
              :key="'customer-' + index"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{'active': optionCustomer.id == mutableId && type == 'customer' }"
              href="javascript:void(0)"
              @click="choose(optionCustomer)"
            >
              [CUSTOMER] {{ optionCustomer.label | uppercase }}
            </a>
          </template>
          <template v-for="(optionEmployee, index) in optionEmployees">
            <a
              :key="'employee-' + index"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="{'active': optionEmployee.id == mutableId && type == 'employee' }"
              href="javascript:void(0)"
              @click="choose(optionEmployee)"
            >
              [EMPLOYEE] {{ optionEmployee.label | uppercase }}
            </a>
          </template>
        </div>

        <div
          v-if="searchText && !isLoadingEmployee && !isLoadingCustomer && !isLoadingSupplier && optionEmployees.length == 0 && optionCustomers.length == 0 && optionSuppliers.length == 0"
          class="list-group push"
        >
          <div class="alert alert-info text-center">
            {{ $t('searching not found', [searchText]) | capitalize }}
          </div>
        </div>
      </template>
      <button
        type="button"
        class="btn btn-sm btn-outline-danger"
        @click="close()"
      >
        {{ $t('close') | uppercase }}
      </button>
    </sweet-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    },
    label: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
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
  beforeDestroy () {
    this.close()
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
        response.data.map((key, value) => {
          this.optionSuppliers.push({
            id: key.id,
            label: key.name,
            type: 'Supplier'
          })

          if (this.value == key.id && this.type == 'Supplier') {
            this.mutableLabel = key.name
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
        response.data.map((key, value) => {
          this.optionCustomers.push({
            id: key.id,
            label: key.name,
            type: 'Customer'
          })

          if (this.value == key.id && this.type == 'Customer') {
            this.mutableLabel = key.name
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
        response.data.map((key, value) => {
          this.optionEmployees.push({
            id: key.id,
            label: key.name,
            type: 'Employee'
          })

          if (this.value == key.id && this.type == 'Employee') {
            this.mutableLabel = key.name
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
    open () {
      this.$refs['select-' + this.id].open()
      this.search()
    },
    close () {
      this.$refs['select-' + this.id].close()
    },
    onClose () {
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
