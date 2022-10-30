<template>
  <div>
    <!-- COA Modal -->
    <sweet-modal
      ref="modal"
      :title="title || $t('select chart of account') | uppercase"
      overlay-theme="dark"
      @close="close()"
    >
      <!-- Search -->
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
        <!-- COA Options -->
        <template v-for="(option, optionIndex) in options">
          <a
            :key="optionIndex"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{ active: option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            {{ option.label | uppercase }}
          </a>
        </template>
      </div>
      <!-- Search Not Found Alert-->
      <div
        v-if="searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t('searching not found', [searchText]) | capitalize }} <br>
      </div>
      <!-- Create Recommendation Alert -->
      <div
        v-if="!searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t("you don't have any") | capitalize }}
        {{ $t('chart of account') | capitalize }}, <br>
        {{ $t('you can create') }}
      </div>

      <div class="row">
        <!-- Pagination COA -->
        <div class="col d-flex justify-content-start">
          <p-pagination
            :current-page="currentPage"
            :last-page="lastPage"
            @updatePage="updatePage"
          />
        </div>
        <!-- Button Actions -->
        <div class="col d-flex justify-content-end">
          <!--  Button Add -->
          <!-- <button
            type="button"
            class="btn btn-sm btn-outline-secondary mr-5"
            @click="add()"
          >
            {{ $t('add') | uppercase }}
          </button> -->
          <!-- Button Clear -->
          <button
            type="button"
            class="btn btn-md btn-outline-danger"
            @click="clear()"
          >
            {{ $t('clear') | uppercase }}
          </button>
        </div>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
// Import Library & Components
import debounce from 'lodash/debounce'
// Import Vuex
import { mapGetters, mapActions } from 'vuex'

export default {
  // Props Data
  props: {
    // Id
    id: {
      type: String,
      default: ''
    },
    // Value
    value: {
      type: [String, Number],
      default: ''
    },
    // Label
    label: {
      type: String,
      default: ''
    },
    // Title
    title: {
      type: String,
      default: ''
    },
    // Type
    type: {
      type: String,
      default: ''
    },
    // Type In
    typeIn: {
      type: Array,
      default: function () {
        return []
      }
    },
    // Exclude
    exclude: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      // Data Default Loading
      isLoading: false,
      // Data Default Options
      options: [],
      // Data Default Index
      index: null,
      // Data Default Mutable Id & Label
      mutableId: this.value,
      mutableLabel: this.label,
      // Data Default Filter
      // Search Text Default
      searchText: this.$route.query.search,
      // Current Page Default
      currentPage: this.$route.query.page * 1 || 1,
      // Last Page Default
      lastPage: 1,
      // Limit Default
      limit: 10
    }
  },
  computed: {
    // Get Data from Vuex Store
    // Chart Of Account
    ...mapGetters('accountingChartOfAccount', ['chartOfAccounts', 'pagination'])
  },
  watch: {
    // Watch Data Filter Search
    // Search Text
    searchText: debounce(function () {
      // Get Data from Search Method
      this.search()
    }, 300),
    // Label
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
    // Created Data
    // Get Data from Search Method
    this.search()
  },
  updated () {
    // Updated Data
    // Update Last Page Pagination
    this.lastPage = this.pagination.last_page
  },
  beforeDestroy () {
    // Before Destroy
    // Close Modal
    this.close()
  },
  methods: {
    // Action Data from Vuex Store
    // Get Data Chart Of Account
    ...mapActions('accountingChartOfAccount', ['get']),
    // Filter Params COA
    search () {
      // Loading
      this.isLoading = true
      // Get Data with Conditional & Params
      if (this.type && !this.typeIn.length) {
        this.get({
          params: {
            // Join
            join: 'account_type',
            // Sort
            sort_by: 'account.alias',
            // Fields
            fields: 'account.*',
            // Filter Like
            filter_like: {
              // Account Type
              'account_type.alias': this.searchText,
              // Account
              'account.alias': this.searchText
            },
            // Filter Equal
            filter_equal: {
              // Account Type
              'account_type.name': this.type
            },
            // Includes
            includes: 'type',
            // Limit
            limit: this.limit,
            // Page
            page: this.currentPage
          }
        })
          // Success
          .then((response) => {
            this.options = []
            this.mutableLabel = null
            response.data.map((key, value) => {
              this.options.push({
                id: key.id,
                alias: key.alias,
                type: {
                  name: key.type.name
                },
                label: key.label,
                number: key.number,
                position: key.position,
                sub_ledger: key.sub_ledger
              })

              if (this.value == key.id) {
                this.mutableLabel = key.number + ' - ' + key.alias
              }
            })
            this.isLoading = false
          })
          // Fail
          .catch((error) => {
            this.isLoading = false
          })
      } else {
        this.get({
          params: {
            // Join
            join: 'account_type',
            // Sort
            sort_by: 'account.alias',
            // Fields
            fields: 'account.*',
            // Filter Like
            filter_like: {
              // Account Type
              'account_type.alias': this.searchText,
              // Account
              'account.alias': this.searchText
            },
            // Filter Equal Or
            filter_equal_or: {
              // Account Type
              'account_type.alias': this.typeIn
            },
            // Includes
            includes: 'type',
            // Limit
            limit: this.limit,
            // Page
            page: this.currentPage
          }
        })
          // Success
          .then((response) => {
            // Initialization Data COA to Options
            this.options = []
            this.mutableLabel = null
            response.data.map((key, value) => {
              if (this.exclude.includes(key.type_id) == false) {
                this.options.push({
                  id: key.id,
                  alias: key.alias,
                  type: {
                    name: key.type.name
                  },
                  label: key.label,
                  number: key.number,
                  position: key.position,
                  sub_ledger: key.sub_ledger
                })
              }
              if (this.value == key.id) {
                this.mutableLabel = key.number + ' - ' + key.alias
              }
            })
            this.isLoading = false
          })
          // Fail
          .catch((error) => {
            this.isLoading = false
          })
      }
    },
    // Update Page for Pagination
    updatePage (value) {
      // Current Page
      this.currentPage = value
      // Get Data from Search Method
      this.search()
    },
    // Add COA
    add () {
      //
    },
    // Choose Option COA
    choose (option) {
      option.index = this.index
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    // Clear Choose Option
    clear (option) {
      // Initialization Data Options to Null
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('input', null)
      this.$emit('choosen', {
        index: this.index,
        id: null,
        alias: null,
        label: null,
        number: null,
        position: null,
        sub_ledger: null,
        type: {
          name: null
        }
      })
      // Close Modal
      this.close()
    },
    // Open Modal
    open (index = null, update = false) {
      this.index = index
      this.$refs.modal.open()
      if (update) this.search()
    },
    // Close Modal
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style scoped>
/* Style for input */
input:readonly {
  background-color: white;
}
input {
  min-width: 200px;
}
/* Style for Link */
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
