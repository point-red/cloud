<template>
  <div>
    <!-- Breadcrumb -->
    <breadcrumb>
      <breadcrumb-finance />
      <span class="breadcrumb-item active">{{ $t('cash') | uppercase }}</span>
    </breadcrumb>

    <!-- Menu Cash -->
    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="input-group block">
            <div class="col-12 px-0">
              <div class="row d-flex justify-content-center mx-0 my-20">
                <!-- Sub Menu Cash -->
                <div class="row">
                  <!-- Export to Excel -->
                  <download-excel
                    :name="`Cash_${$options.filters.dateFormat(
                      date.start,
                      'DD MMM YYYY'
                    )} - ${$options.filters.dateFormat(
                      date.end,
                      'DD MMM YYYY'
                    )}`"
                    :fetch="generateReport"
                    :header="[
                      `Export date: ${$options.filters.dateFormat(
                        new Date(),
                        'DD MMM YYYY HH:mm'
                      )} `,
                      `Export period: ${$options.filters.dateFormat(
                        date.start,
                        'DD MMM YYYY'
                      )} - ${$options.filters.dateFormat(
                        date.end,
                        'DD MMM YYYY'
                      )}`,
                      ' ',
                      'Cash',
                      ' '
                    ]"
                    class="input-group-prepend"
                    style="cursor: pointer"
                  >
                    <span class="input-group-text">
                      <i class="fa fa-download" />
                    </span>
                  </download-excel>
                  <!-- Cash In to Create -->
                  <router-link
                    v-if="$permission.has('create cash')"
                    to="/finance/cash/in"
                    class="input-group-prepend"
                  >
                    <span class="input-group-text">
                      <i class="fa fa-plus mr-5" />
                      {{ $t('cash in') | uppercase }}
                    </span>
                  </router-link>
                  <!-- Cash Out To Create -->
                  <router-link
                    v-if="$permission.has('create cash')"
                    to="/finance/cash/out/create"
                    class="input-group-prepend"
                  >
                    <span class="input-group-text">
                      <i class="fa fa-plus mr-5" />
                      {{ $t('cash out') | uppercase }}
                    </span>
                  </router-link>
                </div>
                <!-- Search -->
                <div class="col-12 col-lg-8 col-xl-9 pt-20 pt-lg-0 pr-md-0">
                  <p-form-input
                    id="search-text"
                    ref="searchText"
                    name="search-text"
                    placeholder="Search"
                    class="btn-block"
                    :value="searchText"
                    width="100%"
                    @input="filterSearch"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Advance Filter -->
          <div class="text-center font-size-sm mb-30">
            <a
              href="javascript:void(0)"
              @click="isAdvanceFilter = !isAdvanceFilter"
            >
              {{ $t('advance filter') | uppercase }}
              <i class="fa fa-caret-down" />
            </a>
          </div>
          <div
            v-show="isAdvanceFilter"
            class="card m-5 pt-10"
            :class="{ fadeIn: isAdvanceFilter }"
          >
            <!-- Advance Filter Date -->
            <div class="row">
              <!-- Advance Filter Date Start -->
              <div class="col-sm-3 text-center">
                <p-form-row
                  id="date-start"
                  name="date-start"
                  :label="$t('date start')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="date.start"
                      name="date"
                      label="date"
                    />
                  </div>
                </p-form-row>
              </div>
              <!-- Advance Filter Date End -->
              <div class="col-sm-3 text-center">
                <p-form-row
                  id="date-end"
                  name="date-end"
                  :label="$t('date end')"
                  :is-horizontal="false"
                >
                  <div slot="body">
                    <p-date-picker
                      id="date"
                      v-model="date.end"
                      name="date"
                      label="date"
                    />
                  </div>
                </p-form-row>
              </div>
              <!-- Advance Filter Cash Type -->
              <div class="col-sm-3 text-center">
                <p-form-row
                  id="cashType"
                  name="cashType"
                  :label="$t('cash type')"
                  :is-horizontal="false"
                >
                  <div
                    slot="body"
                    class="pt-2"
                  >
                    <span
                      class="select-link"
                      @click="$refs.selectCashType.open()"
                    >
                      {{ cashType.label || $t('select') | uppercase }}
                    </span>
                  </div>
                </p-form-row>
              </div>
              <!-- Advance Filter Person -->
              <div class="col-sm-3 text-center">
                <p-form-row
                  id="cashPerson"
                  name="cashPerson"
                  :label="$t('person')"
                  :is-horizontal="false"
                >
                  <div
                    slot="body"
                    class="pt-2"
                  >
                    <span
                      class="select-link"
                      @click="$refs.selectCashPerson.open()"
                    >
                      {{ paymentable_name || $t('select') | uppercase }}
                    </span>
                  </div>
                </p-form-row>
              </div>
            </div>
            <hr>
          </div>
          <hr>
          <!-- Cash Table -->
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>Payment From / To</th>
              <th>Account</th>
              <th>Notes</th>
              <th>Allocation</th>
              <th class="text-right">
                Amount
              </th>
            </tr>
            <template v-for="(payment, index) in payments">
              <tr
                :key="'payment-' + index"
                slot="p-body"
              >
                <th>
                  <router-link
                    v-if="payment.disbursed == false"
                    :to="{
                      name: 'finance.cash.in.show',
                      params: { id: payment.id }
                    }"
                  >
                    {{ payment.form.number }}
                  </router-link>
                  <router-link
                    v-if="payment.disbursed == true"
                    :to="{
                      name: 'finance.cash.out.show',
                      params: { id: payment.id }
                    }"
                  >
                    {{ payment.form.number }}
                  </router-link>
                </th>
                <td>
                  {{ payment.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                </td>
                <td>
                  {{ payment.paymentable ? payment.paymentable.name : '' }}
                </td>
                <td>
                  <template v-for="(paymentDetail, index2) in payment.details">
                    <span :key="'payment-detail-' + index2">
                      {{ paymentDetail.chart_of_account.number }} -
                      {{ paymentDetail.chart_of_account.alias }}
                      <br>
                    </span>
                  </template>
                </td>
                <td>
                  <template v-for="(paymentDetail, index2) in payment.details">
                    <span :key="'payment-detail-' + index2">
                      {{ paymentDetail.notes }}
                      <br>
                    </span>
                  </template>
                </td>
                <td>
                  <template v-for="(paymentDetail, index2) in payment.details">
                    <span :key="'payment-detail-' + index2">
                      {{
                        paymentDetail.allocation
                          ? paymentDetail.allocation.name
                          : ''
                      }}
                      <br>
                    </span>
                  </template>
                </td>
                <td>
                  <template v-for="(paymentDetail, index2) in payment.details">
                    <span
                      :key="'payment-detail-' + index2"
                      class="text-right"
                    >
                      {{ paymentDetail.amount | numberFormat }}
                      <br>
                    </span>
                  </template>
                </td>
              </tr>
            </template>
            <!-- <template v-for="(payment, index) in payments">
              <template v-for="(paymentDetail, index2) in payment.details">
                <tr
                  :key="'payment-' + index + '-' + index2"
                  slot="p-body"
                >
                  <th>
                    <router-link
                      v-if="payment.disbursed == false"
                      :to="{
                        name: 'finance.cash.in.show',
                        params: { id: payment.id }
                      }"
                    >
                      {{ payment.form.number }}
                    </router-link>
                    <router-link
                      v-if="payment.disbursed == true"
                      :to="{
                        name: 'finance.cash.out.show',
                        params: { id: payment.id }
                      }"
                    >
                      {{ payment.form.number }}
                    </router-link>
                  </th>
                  <td>
                    {{ payment.form.date | dateFormat('DD MMMM YYYY HH:mm') }}
                  </td>
                  <td>
                    {{ payment.paymentable ? payment.paymentable.name : '' }}
                  </td>
                  <td>
                    {{ paymentDetail.chart_of_account.number }} -
                    {{ paymentDetail.chart_of_account.alias }}
                  </td>
                  <td>{{ paymentDetail.notes }}</td>
                  <td>
                    {{
                      paymentDetail.allocation
                        ? paymentDetail.allocation.name
                        : ''
                    }}
                  </td>
                  <td class="text-right">
                    {{ paymentDetail.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </template> -->
          </point-table>
        </p-block-inner>
        <!-- Pagination Cash Table -->
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <!-- Select Cash Type Component Modal for Advance Filter Cash Type -->
    <m-select-cash-type
      ref="selectCashType"
      @choosen="chooseCashType($event)"
    />
    <!-- Select Cash Person Component Modal for Advance Filter Person -->
    <m-paymentable
      id="selectCashPerson"
      ref="selectCashPerson"
      @clear="clearCashPerson"
      @choosen="chooseCashPerson"
    />
    <!-- Select Cash Person Component Modal for Advance Filter Person -->
    <!-- <m-select-cash-person
      id="selectCashPerson"
      ref="selectCashPerson"
      @clear="clearCashPerson"
      @choosen="chooseCashPerson"
    /> -->
  </div>
</template>

<script>
// Import Library & Components
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import JsonExcel from 'vue-json-excel'
import axios from '@/axios'
// Import Vuex
import { mapGetters, mapActions } from 'vuex'

export default {
  // Use Library & Components
  components: {
    Breadcrumb,
    BreadcrumbFinance,
    PointTable,
    DownloadExcel: JsonExcel
  },

  data () {
    return {
      // Data Default Loading
      isLoading: true,
      // Data Default Filter
      // Date Default
      date: {
        // Date Start
        start: this.$route.query.date_from
          ? this.$moment(this.$route.query.date_from).format(
            'YYYY-MM-DD 00:00:00'
          )
          : this.$moment().format('YYYY-MM-01 00:00:00'),
        // Date End
        end: this.$route.query.date_to
          ? this.$moment(this.$route.query.date_to).format(
            'YYYY-MM-DD 23:59:59'
          )
          : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      // Search Text Default
      searchText: this.$route.query.search,
      // Current Page Default for Pagination
      currentPage: this.$route.query.page * 1 || 1,
      // Last Page Default for Pagination
      lastPage: 1,
      // Limit Data Default for Pagination
      limit: 10,
      // Data Default Show Button Advance Filter
      isAdvanceFilter: false,
      // Cash Type Default for Advance Filter
      cashType: {
        id: null,
        label: null,
        value: null
      },
      // Person Default for Advance Filter
      paymentable_id: null,
      paymentable_name: null
    }
  },

  computed: {
    // Get Data from Vuex Store
    // Finance Payment
    ...mapGetters('financePayment', ['payments', 'pagination'])
  },

  watch: {
    // Watch Data Filter Search
    date: {
      handler: function () {
        // Router Push with Filter Date
        this.$router.push({
          query: {
            // Query Filter
            ...this.$route.query,
            // Date Filter
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        // Get Data from Search Method
        this.search()
      },
      // Deep Value
      deep: true
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

  methods: {
    // Action Data from Vuex Store
    // Get Data Finance Payment
    ...mapActions('financePayment', ['get']),
    // Filter Data Finance Payment
    filterSearch: debounce(function (value) {
      // Router Push with Filter Date
      this.$router.push({ query: { search: value } })
      // Search Text for Filter Date
      this.searchText = value
      // Current Page for Pagination
      this.currentPage = 1
      // Get Data from Search Method
      this.search()
    }, 300),
    // Filter Cash Type Finance Payment
    chooseCashType (option) {
      // Initialization Data from Cash Type Filter
      this.cashType.label = option.label
      this.cashType.value = option.value
      // Get Data from Search Method
      this.search()
    },
    // Filter Person Finance Payment
    chooseCashPerson (paymentable) {
      // Initialization Data from Person Filter
      this.paymentable_id = paymentable.id
      this.paymentable_name = paymentable.label
      // Get Data from Search Method
      this.search()
    },
    // Clear Filter Person Finance Payment
    clearCashPerson () {
      // Initialization Data to Null from Person Filter
      this.paymentable_id = null
      this.paymentable_name = null
      // Get Data from Search Method
      this.search()
    },
    // Filter Params Finance Payment
    search () {
      // Loading
      this.isLoading = true
      // Get Data with Params
      this.get({
        params: {
          // Join
          join: 'form,payment_account,details,account,allocation',
          // Sort
          sort_by: '-form.date',
          // Fields
          fields: 'payment.*',
          // Filter Like
          filter_like: {
            // Number
            'form.number': this.searchText,
            // Person
            'payment.paymentable_name': this.searchText,
            // Account
            'account.alias': this.searchText,
            // Notes
            'payment_detail.notes': this.searchText,
            // Allocation
            'allocation.name': this.searchText
          },
          // Filter Equal
          filter_equal: {
            // Payment Type
            'payment.payment_type': 'cash',
            // Cash Type
            'payment.disbursed': this.cashType.value,
            // Person
            'payment.paymentable_name': this.paymentable_name
          },
          // Filter Date
          // Date Min
          filter_date_min: {
            'form.date': this.serverDateTime(
              this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00')
            )
          },
          // Date Max
          filter_date_max: {
            'form.date': this.serverDateTime(
              this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59')
            )
          },
          // Includes
          includes:
            'form;details.chartOfAccount;details.allocation;paymentable',
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
          console.log(response)
        })
        // Fail
        .catch((error) => {
          // loading
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
    // Export to Excel
    async generateReport () {
      // Loading
      this.isLoading = true
      // Initialization Data Payments
      try {
        const {
          data: { data: payments }
        } = await axios.get('/finance/payments', {
          // Get Data with Params
          params: {
            // Join
            join: 'form,payment_account,details,account,allocation',
            // Sort
            sort_by: '-form.date',
            // Fields
            fields: 'payment.*',
            filter_like: {
              // Number
              'form.number': this.searchText,
              // Person
              'payment.paymentable_name': this.searchText,
              // Account
              'account.alias': this.searchText,
              // Notes
              'payment_detail.notes': this.searchText,
              // Allocation
              'allocation.name': this.searchText
            },
            // Filter Equal
            filter_equal: {
              // Payment Type
              'payment.payment_type': 'cash',
              // Cash Type
              'payment.disbursed': this.cashType.value,
              // Person
              'payment.paymentable_name': this.paymentable_name
            },
            // Filter Date
            // Date Min
            filter_date_min: {
              'form.date': this.serverDateTime(
                this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00')
              )
            },
            // Date Max
            filter_date_max: {
              'form.date': this.serverDateTime(
                this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59')
              )
            },
            // Includes
            includes:
              'form;details.chartOfAccount;details.allocation;paymentable',
            // Limit
            limit: 10000,
            // Page
            page: 1
          }
        })
        // Initialization Data Payments to Table Excel
        let indexItem = 0
        const dataResult = payments.map((payment) => {
          return payment.details.map((detail) => {
            // Index
            indexItem++
            return {
              // No
              No: indexItem,
              // Date Form
              'Date Form': this.$options.filters.dateFormat(
                payment.form.date,
                'DD MMMM YYYY'
              ),
              // Form Number
              'Form Number': payment.form.number,
              // Person From / To
              'Payment Form / To': payment.paymentable.name,
              // Account Number
              'Account Number': detail.chart_of_account.number,
              // Account
              Account: detail.chart_of_account.alias,
              // Notes
              Notes: detail.notes,
              // Allocation
              Allocation: detail.allocation ? detail.allocation.name : '',
              // Amount
              Ammount: detail.amount
            }
          })
        })
        // Success
        // Loading
        this.isLoading = false
        // Data Result
        return dataResult.flat()
        // Fail
      } catch (error) {
        console.log(error)
        // Loading
        this.isLoading = false
        return this.$notification.error(error.message)
      }
    }
  }
}
</script>

<style scoped>
/* Style for 0 Padding in Large Layout */
@media screen and (min-width: 992px) {
  .pt-lg-0 {
    padding-top: 0 !important;
  }
}
</style>
