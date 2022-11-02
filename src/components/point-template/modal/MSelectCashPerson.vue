<template>
  <div>
    <!-- Select Cash Person Modal -->
    <sweet-modal
      :ref="'select-' + id"
      :title="'select person' | uppercase"
      overlay-theme="dark"
      @close="onClose()"
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
      <!-- Cash Person Options -->
      <div
        v-else
        class="list-group push"
      >
        <template v-for="(option, index) in options">
          <a
            :key="'person-' + index"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            :class="{ active: option.id == mutableId }"
            href="javascript:void(0)"
            @click="choose(option)"
          >
            [{{ option.type }}] &nbsp; {{ option.label }}
          </a>
        </template>
      </div>
      <!-- Search Not Found Alert-->
      <div
        v-if="searchText && !isLoading && options.length == 0"
        class="list-group push"
      >
        <div class="alert alert-info text-center">
          {{ $t('searching not found', [searchText]) | capitalize }}
        </div>
      </div>

      <div class="row">
        <!-- Pagination Cash Person -->
        <div class="col d-flex justify-content-start">
          <p-pagination-modal
            :current-page="currentPage"
            :last-page="lastPage"
            @updatePage="updatePage"
          />
        </div>
        <!-- Button Clear -->
        <div class="col d-flex justify-content-end">
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
      required: true
    },
    // Value
    value: {
      type: [String, Number],
      default: null
    },
    // Label
    label: {
      type: String,
      default: null
    },
    // Type
    type: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      // Data Default Loading
      isLoading: false,
      // Data Default Options
      options: [],
      // Data Default Mutable Id & Label
      mutableId: null,
      mutableLabel: null,
      // Data Default Filter
      // Search Text Default
      searchText: '',
      // Current Page Default
      currentPage: 1,
      // Last Page Default
      lastPage: 1,
      // Limit Data Default
      limit: 10
    }
  },
  computed: {
    // Get Data from Vuex Store
    // Cash Person
    ...mapGetters('financeCashOutPaymentable', ['paymentables', 'pagination'])
  },
  watch: {
    // Watch Data Filter Search
    // Search Text
    searchText: debounce(function () {
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
    // Get Data Cash Perspn
    ...mapActions('financeCashOutPaymentable', {
      getPaymentables: 'get'
    }),
    // Filter Params Cash Person
    search () {
      // Loading
      this.isLoading = true
      // Get Data with Params
      this.getPaymentables({
        params: {
          // Sort
          sort_by: 'paymentable_name',
          // Group
          group_by: '.paymentable_type;paymentable_name',
          // Filter Like
          filter_like: {
            // Person
            paymentable_name: this.searchText
          },
          // Limit
          limit: this.limit,
          // Page
          page: this.currentPage
        }
      })
        // Success
        .then((response) => {
          this.isLoading = false
          // Push Response to Options
          this.options = []
          response.data.map((paymentable) => {
            this.options.push({
              id: paymentable.paymentable_id,
              label: paymentable.paymentable_name,
              type: paymentable.paymentable_type
            })
          })
        })
        .catch((error) => {
          this.isLoading = false
        })
    },
    // Update Page for Pagination
    updatePage (value) {
      // Current Page
      this.currentPage = value
      // Get Data from Search Method
      this.search()
    },
    // Choose Option Cash Person
    choose (option) {
      // Initialization Data Cash Person
      this.mutableId = option.id
      this.mutableLabel = option.label
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      // Close
      this.close()
    },
    // Clear Choose Option
    clear () {
      // Initialization Data Options to Null
      this.mutableId = null
      this.mutableLabel = null
      this.$emit('clear', true)
      this.close()
    },
    // Open Modal
    open (index = null, update = false) {
      this.index = index
      this.$refs['select-' + this.id].open()
      if (update) this.search()
    },
    // Close Modal
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
