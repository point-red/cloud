<template>
  <div>
    <breadcrumb>
      <breadcrumb-finance />
      <span class="breadcrumb-item active">
        <router-link to="/finance/cash">{{ $t('cash') | uppercase }}</router-link>
      </span>
      <span class="breadcrumb-item active">{{ $t('in') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block :title="$t('payment collection')">
        <div class="input-group block">
          <p-form-input
            id="search-text"
            ref="searchText"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"
          />
        </div>
        <div class="text-center font-size-sm mb-10">
          <a
            href="javascript:void(0)"
            @click="isAdvanceFilter = !isAdvanceFilter"
          >
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down" />
          </a>
        </div>
        <div
          v-show="isAdvanceFilter"
          class="card"
          :class="{ 'fadeIn': isAdvanceFilter }"
        >
          <div class="row">
            <div class="col-sm-6 text-center">
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
            <div class="col-sm-6 text-center">
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
          </div>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th>Number</th>
              <th>Date</th>
              <th>To</th>
              <th>Account</th>
              <th>Notes</th>
              <th class="text-right">
                Amount
              </th>
              <th class="text-center" />
            </tr>
            <template v-for="(salesPaymentCollection, index) in salesPaymentCollections">
              <tr
                :key="'payment-collection-' + index "
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'sales.payment-collection.show', params: { id: salesPaymentCollection.id }}">
                    {{ salesPaymentCollection.form.number }}
                  </router-link>
                </th>
                <td>{{ salesPaymentCollection.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ salesPaymentCollection.customer.name }}</td>
                <td>{{ paymentCollectionAccountLabel }}</td>
                <td>{{ salesPaymentCollection.notes }}</td>
                <td class="text-right">
                  {{ salesPaymentCollection.amount | numberFormat }}
                </td>
                <td class="text-center">
                  <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    @click="payPaymentCollection(salesPaymentCollection)"
                  >
                    {{ $t('pay') | uppercase }}
                  </button>
                </td>
              </tr>
            </template>
            <template v-for="(downPayments, index) in downPayments">
              <tr
                :key="'down-payment-' + index "
                slot="p-body"
              >
                <th>
                  <router-link :to="{ name: 'sales.down-payment.show', params: { id: downPayments.id }}">
                    {{ downPayments.form.number }}
                  </router-link>
                </th>
                <td>{{ downPayments.form.date | dateFormat('DD MMMM YYYY HH:mm') }}</td>
                <td>{{ downPayments.customer.name }}</td>
                <td>{{ downPaymentAccountLabel }}</td>
                <td>{{ downPayments.notes }}</td>
                <td class="text-right">
                  {{ downPayments.amount | numberFormat }}
                </td>
                <td class="text-center">
                  <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    @click="payDownPayment(downPayments)"
                  >
                    {{ $t('pay') | uppercase }}
                  </button>
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbFinance from '../Breadcrumb'
import debounce from 'lodash/debounce'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbFinance,
    PointTable
  },
  data () {
    return {
      isAdvanceFilter: false,
      checkedRow: [],
      paymentCollectionAccountId: null,
      paymentCollectionAccountLabel: null,
      downPaymentAccountId: null,
      downPaymentAccountLabel: null,
      salesReturnAccountId: null,
      salesReturnAccountLabel: null,
      date: {
        start: this.$route.query.date_from ? this.$moment(this.$route.query.date_from).format('YYYY-MM-DD 00:00:00') : this.$moment().format('YYYY-MM-01 00:00:00'),
        end: this.$route.query.date_to ? this.$moment(this.$route.query.date_to).format('YYYY-MM-DD 23:59:59') : this.$moment().format('YYYY-MM-DD 23:59:59')
      },
      isLoading: true,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      limit: 100
    }
  },
  computed: {
    ...mapGetters('salesPaymentCollection', ['salesPaymentCollections', 'pagination']),
    ...mapGetters('salesDownPayment', ['downPayments', 'pagination'])
  },
  watch: {
    date: {
      handler: function () {
        this.$router.push({
          query: {
            ...this.$route.query,
            date_from: this.date.start,
            date_to: this.date.end
          }
        })
        this.search()
      },
      deep: true
    }
  },
  created () {
    this.search()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('salesPaymentCollection', {
      getPaymentCollection: 'get'
    }),
    ...mapActions('accountingSettingJournal', {
      findAccount: 'find'
    }),
    ...mapActions('salesDownPayment', { getSalesDownPayment: 'get' }),
    payDownPayment (downPayment) {
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
          referenceable_type: 'SalesDownPayment',
          reference_number: downPayment.form.number,
          paymentable_name: downPayment.customer.name,
          paymentable_type: 'Customer',
          paymentable_id: downPayment.customer_id,
          amount: downPayment.amount,
          details: details
        }
      })
      this.$router.push({ name: 'finance.cash.in.create' })
    },
    payPaymentCollection (salesPaymentCollection) {
      const details = []
      var invoiceAvailable = false
      var downPaymentAvailable = false
      var salesReturnAvailable = false
      var totalInvoice = 0
      var totalDownpayment = 0
      var totalSalesReturn = 0
      salesPaymentCollection.details.forEach(element => {
        if (element.chart_of_account_id) {
          var otherType = 'Income'
          var amount = element.amount
          if (element.chart_of_account.type.is_debit === 1) {
            amount = element.amount
            otherType = 'Cost'
          }
          details.push({
            chart_of_account_id: element.chart_of_account_id,
            chart_of_account_label: element.chart_of_account.label,
            notes: '',
            amount: amount,
            payment_collection_type: otherType
          })
        } else if (element.referenceable_type === 'SalesInvoice') {
          invoiceAvailable = true
          totalInvoice += parseFloat(element.amount)
        } else if (element.referenceable_type === 'SalesDownPayment') {
          downPaymentAvailable = true
          totalDownpayment += parseFloat(element.amount)
        } else if (element.referenceable_type === 'SalesReturn') {
          salesReturnAvailable = true
          totalSalesReturn += parseFloat(element.amount)
        }
      })
      if (invoiceAvailable) {
        details.push({
          chart_of_account_id: this.paymentCollectionAccountId,
          chart_of_account_label: this.paymentCollectionAccountLabel,
          notes: salesPaymentCollection.form.notes,
          amount: totalInvoice,
          payment_collection_type: 'SalesInvoice'
        })
      }
      if (downPaymentAvailable) {
        details.push({
          chart_of_account_id: this.downPaymentAccountId,
          chart_of_account_label: this.downPaymentAccountLabel,
          notes: '',
          amount: totalDownpayment,
          payment_collection_type: 'SalesDownPayment'
        })
      }
      if (salesReturnAvailable) {
        details.push({
          chart_of_account_id: this.salesReturnAccountId,
          chart_of_account_label: this.salesReturnAccountLabel,
          notes: '',
          amount: totalSalesReturn,
          payment_collection_type: 'SalesReturn'
        })
      }
      this.$store.commit('financePayment/FETCH_OBJECT', {
        data: {
          reference_form_id: salesPaymentCollection.form.id,
          referenceable_id: salesPaymentCollection.id,
          referenceable_type: 'PaymentCollection',
          reference_number: salesPaymentCollection.form.number,
          paymentable_name: salesPaymentCollection.customer.name,
          paymentable_type: 'Customer',
          paymentable_id: salesPaymentCollection.customer_id,
          amount: salesPaymentCollection.amount,
          details: details
        }
      })
      var isError = false
      if (!this.paymentCollectionAccountId) {
        this.$notification.error('please setting account receivable account')
        isError = true
      }
      if (!this.downPaymentAccountId) {
        this.$notification.error('please setting down payment account')
        isError = true
      }
      if (!isError) {
        this.$router.push({ name: 'finance.cash.in.create' })
      }
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.search()
    }, 300),
    search () {
      this.isLoading = true
      this.findAccount({
        feature: 'sales',
        name: 'account receivable'
      }).then(response => {
        this.paymentCollectionAccountId = response.data.id
        this.paymentCollectionAccountLabel = response.data.label
      })
      this.findAccount({
        feature: 'sales',
        name: 'down payment'
      }).then(response => {
        this.downPaymentAccountId = response.data.id
        this.downPaymentAccountLabel = response.data.label
      })
      this.getPaymentCollection({
        params: {
          join: 'form',
          sort_by: '-form.number',
          group_by: 'sales_payment_collection.id',
          fields: 'sales_payment_collection.*',
          filter_form: 'notArchived;pending;approvalApproved;notCanceled',
          filter_like: {
            'form.number': this.searchText,
            'form.notes': this.searchText
          },
          filter_null: 'sales_payment_collection.payment_id',
          filter_equal: {
            'sales_payment_collection.payment_type': 'cash',
            'form.notes': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.$moment(this.date.start).format('YYYY-MM-DD 00:00:00'))
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.$moment(this.date.end).format('YYYY-MM-DD 23:59:59'))
          },
          limit: this.limit,
          includes: 'form;customer;details;details.chartOfAccount;details.chartOfAccount.type;',
          page: this.currentPage
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
      this.getSalesDownPayment({
        params: {
          join: 'form,customer',
          fields: 'sales_down_payment.*',
          sort_by: '-form.number',
          group_by: 'sales_down_payment.id',
          filter_form: 'notArchived;pending;approvalApproved;notCanceled',
          filter_null: 'sales_down_payment.paid_by',
          filter_like: {
            'form.number': this.searchText,
            'customer.name': this.searchText
          },
          filter_date_min: {
            'form.date': this.serverDateTime(this.date.start, 'start')
          },
          filter_date_max: {
            'form.date': this.serverDateTime(this.date.end, 'end')
          },
          limit: this.limit,
          includes: 'form;customer',
          page: this.currentPage
        }
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.search()
    }
  }
}
</script>
