<template>
  <!-- Parrent Modal Select Reference Cash Advance -->
  <div class="parrent-modal-cash-advance">
    <!-- Modal Select Reference Cash Advance -->
    <sweet-modal
      ref="modal"
      :title="'select reference cash advance' | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <!-- Search -->
      <div class="row">
        <p-block :title="$t('reference cash advance')">
          <div class="input-group block">
            <p-form-input
              id="search-text"
              ref="searchText"
              v-model="searchText"
              name="search-text"
              placeholder="Search..."
              class="btn-block"
              @input="filterSearch"
              @keydown.enter.prevent=""
            />
          </div>
          <hr>
          <!-- Table Reference Cash Advance  -->
          <p-block-inner :is-loading="isLoading">
            <point-table>
              <tr
                slot="p-head"
                class="text-center"
              >
                <th>Number</th>
                <th>Date</th>
                <th>Person</th>
                <th>Amount</th>
                <th>Amount Remaining</th>
                <th>Notes</th>
                <th>Created By</th>
              </tr>
              <template v-for="(option, optionIndex) in options">
                <tr
                  :key="optionIndex"
                  slot="p-body"
                  style="cursor: pointer"
                  class="table-select text-center"
                  :class="{ active: option.id == mutableId }"
                  @click="chooseCashAdvance(option)"
                >
                  <th>
                    <router-link
                      :to="{
                        name: 'finance.cash-advance.show',
                        params: { id: option.id }
                      }"
                      class="link-color"
                    >
                      {{ option.form.number }}
                    </router-link>
                  </th>
                  <td>
                    {{ option.form.date | dateFormat('DD MMMM YYYY') }}
                  </td>
                  <td>
                    {{ option.employee.name }}
                  </td>
                  <td>
                    {{ option.amount | numberFormat }}
                  </td>
                  <td>
                    {{ option.amount_remaining | numberFormat }}
                  </td>
                  <td>
                    {{ option.details[0].notes }}
                  </td>
                  <td>
                    {{ option.form.created_by.name }}
                  </td>
                </tr>
              </template>
            </point-table>
          </p-block-inner>
        </p-block>
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
import PointTable from 'point-table-vue'
// Import Vuex
import { mapGetters, mapActions } from 'vuex'

export default {
  // Use Library & Components
  components: {
    PointTable
  },
  data () {
    return {
      // Data Default Loading
      isLoading: false,
      // Date Default
      date: {
        start: this.$route.query.date_from
          ? this.$moment(this.$route.query.date_from).format(
            'YYYY-MM-DD 00:00:00'
          )
          : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to
          ? this.$moment(this.$route.query.date_to).format(
            'YYYY-MM-DD 23:59:59'
          )
          : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      // Search Text Default
      searchText: '',
      // Current Page Default
      currentPage: 1,
      // Last Page Default
      lastPage: 1,
      // Limit Data Default
      limit: 10,
      // Active Select
      isActiveSelect: false,
      //
      options: [],
      // Data Default Index
      index: null,
      // Data Default Mutable Id & Label
      mutableId: null
    }
  },

  computed: {
    // Get Data from Vuex Store
    // Reference Cash Advance
    ...mapGetters('financeCashAdvance', ['cashAdvances', 'pagination'])
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

  methods: {
    // Action Data from Vuex Store
    // Get Data Reference Cash Advance
    ...mapActions('financeCashAdvance', {
      getReferenceCashAdvance: 'get'
    }),
    // Filter Data Reference Cash Advance
    filterSearch: debounce(function (value) {
      // Initialization Search Text
      this.searchText = value
      // Get Data from Search Method
      this.search()
    }, 300),
    //
    search () {
      // Loading
      this.isLoading = true
      // Get Data with Params
      this.getReferenceCashAdvance({
        params: {
          // Join
          join: 'form,details,account,employee',
          // Sort
          sort_by: 'form.date',
          // Group
          group_by: 'cash_advance.id',
          // Fields
          fields: 'cash_advance.*',
          // Filter Form
          filter_form: 'active;pending;approvalApproved',
          // Filter Not Equal
          filter_not_equal: {
            amount_remaining: 0
          },
          // Filter Equal
          filter_equal: {
            payment_type: 'cash'
          },
          // Filter Like
          filter_like: {
            'form.number': this.searchText,
            'employee.name': this.searchText,
            'cash_advance_detail.notes': this.searchText
          },
          // Includes
          includes: 'employee;form;details.account;form.createdBy',
          // Limit
          limit: this.limit,
          // Page
          page: this.currentPage
        }
      })
        // Success
        .then((response) => {
          // Initialization Data Options
          this.options = response.data
          // Loading
          this.isLoading = false
        })
        // Fail
        .catch((error) => {
          // Loading
          this.isLoading = false
          this.$notification.error(error.message)
        })
    },
    // Update Page for Pagination
    updatePage (value) {
      // Current Page
      this.currentPage = value
      // Get Data from Search Method
      this.search()
    },
    // Choose Cash Advance
    chooseCashAdvance (option) {
      // Initialization Data Option
      this.mutableId = option.id
      this.$emit('input', option.id)
      this.$emit('choosen', option)
      // Close Modal
      this.close()
    },
    // Open Modal
    async open (index = null) {
      // Initialization Data Index
      this.index = index
      // Get Data from Search Method
      this.search()
      // Open
      await this.$refs.modal.open()
      // Add Style for Responsive Table
      const parrentClass = document.querySelector(
        'div.parrent-modal-cash-advance'
      )
      const addStyle = parrentClass.querySelector('div.sweet-content-content')
      addStyle.style.width = '100%'
    },
    // Clear Choose Reference Cash Advance
    clear (option) {
      // Initialization Data Select to Reset Default
      // Search Text
      this.searchText = ''
      // Mutable Id
      this.mutableId = null
      // Current Page
      this.currentPage = 1
      // Emit Choose
      this.$emit('choosen', {
        id: null,
        form: {
          number: null
        },
        details: [
          {
            notes: null
          }
        ],
        amount: 0,
        amount_remaining: 0,
        amount_usage: 0
      })
      // Close Modal
      this.close()
    },
    // Close Modal
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
/* Style for Select Table Hover */
.table-select:hover > th,
.table-select:hover > td {
  background-color: #f6f7f9;
}
/* Style for Select Table Active */
.active > th,
.active > th > .link-color,
.active > td {
  color: white !important;
  background-color: #3f9ce8 !important;
}
/* Style for Hide Border */
.block {
  background-color: none !important;
  -webkit-box-shadow: 0 0px 0px #e4e7ed !important;
  box-shadow: 0 0px 0px #e4e7ed !important;
}
</style>
