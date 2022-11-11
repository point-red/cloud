<template>
  <!-- Parrent Modal Select Reference Cash Out -->
  <div class="parrent-modal-cash-out">
    <!-- Modal Select Reference Cash Out -->
    <sweet-modal
      ref="modal"
      :title="'select reference cash out' | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <!-- Search -->
      <div class="row">
        <p-block :title="$t('reference cash out')">
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
          <!-- Table Reference Cash Out  -->
          <p-block-inner :is-loading="isLoading">
            <point-table>
              <tr
                slot="p-head"
                class="text-center"
              >
                <th>Number</th>
                <th>Date</th>
                <th>Person</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Notes</th>
                <th>Created By</th>
              </tr>
              <template v-for="(reference, index) in references">
                <!-- Table Payment Order -->
                <template
                  v-for="(referenceDetail, index2) in reference.details"
                >
                  <tr
                    v-if="reference.form.formable_type === 'PaymentOrder'"
                    :key="'reference-' + index + index2"
                    slot="p-body"
                    style="cursor: pointer"
                    class="table-select text-center"
                    :class="{
                      active:
                        reference.id == mutableId &&
                        reference.form.formable_type === mutableType
                    }"
                    @click="choosePaymentOrder(reference)"
                  >
                    <th>
                      <router-link
                        :to="{
                          name: 'finance.payment-order.show',
                          params: { id: reference.id }
                        }"
                        class="link-color"
                      >
                        {{ reference.form.number }}
                      </router-link>
                    </th>
                    <td>
                      {{
                        reference.form.date | dateFormat('DD MMMM YYYY HH:mm')
                      }}
                    </td>
                    <td>
                      {{ reference.paymentable.name }}
                    </td>
                    <td>{{ referenceDetail.account.label }}</td>
                    <td>
                      {{ referenceDetail.amount | numberFormat }}
                    </td>
                    <td>{{ referenceDetail.notes }}</td>
                    <td>
                      {{ reference.form.created_by.name }}
                    </td>
                  </tr>
                </template>
                <!-- Table Down Payment -->
                <tr
                  v-if="reference.form.formable_type === 'PurchaseDownPayment'"
                  :key="'reference-' + index"
                  slot="p-body"
                  style="cursor: pointer"
                  class="table-select text-center"
                  :class="{
                    active:
                      reference.id == mutableId &&
                      reference.form.formable_type === mutableType
                  }"
                  @click="chooseDownPayment(reference)"
                >
                  <th>
                    <router-link
                      :to="{
                        name: 'purchase.down-payment.show',
                        params: { id: reference.id }
                      }"
                      class="link-color"
                    >
                      {{ reference.form.number }}
                    </router-link>
                  </th>
                  <td>
                    {{ reference.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </td>
                  <td>{{ reference.supplier.name }}</td>
                  <td>{{ downPaymentAccountLabel }}</td>
                  <td class="text-right">
                    {{ reference.amount | numberFormat }}
                  </td>
                  <td>{{ reference.form.notes }}</td>
                  <td>
                    {{ reference.form.created_by.name }}
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
      // Data Default Account Down Payment
      downPaymentAccountId: null,
      downPaymentAccountLabel: null,
      // Data Default Options
      options: [],
      // Data Default Mutable Id & Type
      mutableId: null,
      mutableType: null,
      // Data Default Filter
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
      limit: 10
    }
  },

  computed: {
    // Get Data from Vuex Store
    // Reference Cash Out
    ...mapGetters('financeCashOutReference', ['references', 'pagination'])
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
    // Find Data Account
    ...mapActions('accountingSettingJournal', {
      findAccount: 'find'
    }),
    // Get Data Reference Cash Out
    ...mapActions('financeCashOutReference', {
      getReferences: 'get'
    }),
    // Filter Data Reference Cash Out
    filterSearch: debounce(function (value) {
      // Initialization Search Text
      this.searchText = value
      // Get Data from Search Method
      this.search()
    }, 300),
    // Filter Params Reference Cash Out
    search () {
      // Loading
      this.isLoading = true
      // Find Account for Down Payment
      this.findAccount({
        feature: 'purchase',
        name: 'down payment'
      })
        // Success
        .then((response) => {
          // Initialization Account Down Payment
          this.downPaymentAccountId = response.data.id
          this.downPaymentAccountLabel = response.data.label
        })
      // Get Data with Params
      this.getReferences({
        params: {
          // Global Params
          // Sort
          sort_by: 'form.date',
          // Payment Order
          // Join
          paymentorder_join: 'form,details,account',
          // Group
          paymentorder_group_by: 'payment_order.id',
          // Fields
          paymentorder_fields: 'payment_order.*',
          // Filter Form
          paymentorder_filter_form: 'notArchived;pending;approvalApproved',
          // Filter Like
          paymentorder_filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            paymentable_name: this.searchText
          },
          // Filter Null
          paymentorder_filter_null: 'payment_order.payment_id',
          // Filter Equal
          paymentorder_filter_equal: {
            'payment_order.payment_type': 'cash'
          },
          // Includes
          paymentorder_includes:
            'form;paymentable;details.account;details.allocation;form.createdBy',
          // Down Payment
          // Join
          downpayment_join: 'form',
          // Group
          downpayment_group_by: 'purchase_down_payment.id',
          // Fields
          downpayment_fields: 'purchase_down_payment.*',
          // Filter Form
          downpayment_filter_form: 'notArchived;pending;approvalApproved',
          // Filter Like
          downpayment_filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText,
            supplier_name: this.searchText
          },
          // Includes
          downpayment_includes: 'form;supplier;form.createdBy',
          // Global Params
          // Limit
          limit: this.limit,
          // Page
          page: this.currentPage
        }
      })
        // Success
        .then((response) => {
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
    // Choose Payment Order
    choosePaymentOrder (paymentOrder) {
      // Initialization Data Cash Person
      const details = []
      paymentOrder.details.forEach((el) => {
        details.push({
          chart_of_account_id: el.account.id,
          chart_of_account_label: el.account.label,
          allocation_id: el.allocation ? el.allocation.id : null,
          allocation_name: el.allocation ? el.allocation.name : null,
          notes: el.notes,
          amount: el.amount
        })
      })
      this.$store.commit('financePayment/FETCH_OBJECT', {
        data: {
          reference_form_id: paymentOrder.form.id,
          referenceable_id: paymentOrder.id,
          referenceable_type: 'PaymentOrder',
          reference_number: paymentOrder.form.number,
          paymentable_name: paymentOrder.paymentable.name,
          paymentable_type: paymentOrder.paymentable_type,
          paymentable_id: paymentOrder.paymentable_id,
          amount: paymentOrder.amount,
          details: details
        }
      })
      // Initialization Data Select
      this.mutableId = paymentOrder.id
      this.mutableType = paymentOrder.form.formable_type
      this.$emit('input', paymentOrder.id)
      this.$emit('choosen', paymentOrder)
      this.close()
    },
    // Choose Down Payment
    chooseDownPayment (downPayment) {
      const details = []
      details.push({
        chart_of_account_id: this.downPaymentAccountId,
        chart_of_account_label: this.downPaymentAccountLabel,
        notes: downPayment.form.notes,
        amount: downPayment.amount
      })
      this.$store.commit('financePayment/FETCH_OBJECT', {
        data: {
          reference_form_id: downPayment.form.id,
          referenceable_id: downPayment.id,
          referenceable_type: 'PurchaseDownPayment',
          reference_number: downPayment.form.number,
          paymentable_name: downPayment.supplier.name,
          paymentable_type: 'Supplier',
          paymentable_id: downPayment.supplier_id,
          amount: downPayment.amount,
          details: details
        }
      })
      // Initialization Data Select
      this.mutableId = downPayment.id
      this.mutableType = downPayment.form.formable_type
      this.$emit('input', downPayment.id)
      this.$emit('choosen', downPayment)
      this.close()
    },
    // Open Modal
    async open (index = null) {
      this.index = index
      // Get Data from Search Method
      this.search()
      // Open
      await this.$refs.modal.open()
      // Add Style for Responsive Table
      const parrentClass = document.querySelector('div.parrent-modal-cash-out')
      const addStyle = parrentClass.querySelector('div.sweet-content-content')
      addStyle.style.width = '100%'
    },
    // Clear Choose Reference Cash Out
    clear (clear) {
      // Initialization Data Select to Reset Default
      // Search Text
      this.searchText = ''
      // Mutable Id
      this.mutableId = null
      this.mutableType = null
      // Current Page
      this.currentPage = 1
      // Payment Data
      this.$store.commit('financePayment/FETCH_OBJECT', {
        data: {
          reference_form_id: null,
          referenceable_id: null,
          referenceable_type: null,
          reference_number: null,
          paymentable_name: null,
          paymentable_type: null,
          paymentable_id: null,
          amount: null,
          details: null
        }
      })
      // Emit Choose
      this.$emit('choosen', clear)
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
