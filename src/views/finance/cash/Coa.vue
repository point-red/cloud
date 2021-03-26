<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('select chart of account') | uppercase"
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
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div
        v-else
        class="list-group push"
      >
        <template v-for="(option, optionIndex) in options">
          <a
            :key="optionIndex"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{'active': option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.label | uppercase }}
          </a>
        </template>
      </div>
      <div
        v-if="searchText && options.length == 0 && !isLoading"
        class="text-center alert alert-info"
      >
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <div
        v-if="!searchText && options.length == 0 && !isLoading"
        class="text-center alert alert-info"
      >
        {{ $t('you don\'t have any') | capitalize }} {{ $t('chart of account') | capitalize }}, <br> {{ $t('you can create') }}
      </div>
      <div class="pull-right">
        <button
          type="button"
          class="mr-5 btn btn-sm btn-outline-secondary"
          @click="add()"
        >
          {{ $t('add') | uppercase }}
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="clear()"
        >
          {{ $t('clear') | uppercase }}
        </button>
      </div>
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
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      index: null,
      searchText: '',
      options: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('accountingChartOfAccount', ['chartOfAccounts'])
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
    ...mapActions('accountingChartOfAccount', ['get', 'create']),
    search () {
      this.isLoading = true
      if (this.type) {
        this.get({
          params: {
            join: 'account_type',
            fields: 'account.*',
            limit: 1000,
            filter_like: {
              'account_type.alias': this.searchText,
              'account.alias': this.searchText,
              'account.number': this.searchText
            },
            includes: 'type',
            sort_by: 'account.number;account.alias'
          }
        }).then(response => {
          this.options = []
          this.mutableLabel = null
          response.data.map((key, value) => {
            this.options.push({
              id: key.id,
              alias: key.alias,
              label: key.label
            })

            if (this.value == key.id) {
              this.mutableLabel = key.number + ' - ' + key.alias
            }
          })
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
        })
      } else {
        this.get({
          params: {
            join: 'account_type',
            fields: 'account.*',
            limit: 1000,
            filter_like: {
              'account_type.alias': this.searchText,
              'account.alias': this.searchText,
              'account.number': this.searchText
            },
            includes: 'type',
            sort_by: 'account.number;account.alias'
          }
        }).then(response => {
          this.options = []
          this.mutableLabel = null
          response.data.map((key, value) => {
            if (key.type.name.toUpperCase() === 'OTHER INCOME' ||
              key.type.name.toUpperCase() === 'CASH-BANK TRANSFER' ||
              key.type.name.toUpperCase() === 'OTHER CURRENT ASSET' ||
              key.type.name.toUpperCase() === 'INCOME TAX RECEIVABLE' ||
              key.type.name.toUpperCase() === 'INCOME TAX PAYABLE' ||
              key.type.name.toUpperCase() === 'OTHER ACCOUNT RECEIVABLE' ||
              key.type.name.toUpperCase() === 'OTHER CURRENT LIABILITY' ||
              key.type.name.toUpperCase() === 'LIABILITAS JANGKA PANJANG') {
              this.options.push({
                id: key.id,
                alias: key.alias,
                label: key.label
              })
            }

            if (this.value == key.id) {
              this.mutableLabel = key.number + ' - ' + key.alias
            }
          })
          this.isLoading = false
        }).catch(error => {
          this.isLoading = false
        })
      }
    },
    add () {
      //
    },
    choose (option) {
      option.index = this.index
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    open (index = null) {
      this.index = index
      this.$refs.modal.open()
      this.search()
    },
    close () {
      this.$refs.modal.close()
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
