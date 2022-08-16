<template>
  <div>
    <breadcrumb v-if="salesPaymentCollection">
      <breadcrumb-sales />
      <router-link
        to="/sales/payment-collection"
        class="breadcrumb-item"
      >
        {{ $t('sales payment collection') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ salesPaymentCollection.form.number | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div
      v-if="salesPaymentCollection"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('sales payment collection') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ number }}</td>
                </tr>
                <tr v-if="payment_type">
                  <td class="font-weight-bold">
                    {{ $t('payment method') | uppercase }}
                  </td>
                  <td>{{ payment_type | uppercase }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="salesPaymentCollection.form.branch">
                {{ salesPaymentCollection.form.branch.address | uppercase }}
                <br v-if="salesPaymentCollection.form.branch.phone">{{ salesPaymentCollection.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('customer') | uppercase }}
              </h6>
              {{ salesPaymentCollection.customer_name | uppercase }}
              <div style="font-size:12px">
                {{ salesPaymentCollection.customer.customer_address | uppercase }}
                <br v-if="salesPaymentCollection.customer.customer_phone">{{ salesPaymentCollection.customer.customer_phone }}
                <br v-if="salesPaymentCollection.customer.customer_email">{{ salesPaymentCollection.customer.customer_email | uppercase }}
              </div>
            </div>
          </div>
          <hr>

          <div v-if="details.salesInvoice.length > 0">
            <h5>{{ $t('invoice collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="20%">
                  Date
                </th>
                <th width="20%">
                  Form Number
                </th>
                <th width="15%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Available Invoice
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Invoice
                </th>
              </tr>
              <template v-for="(row, index) in details.salesInvoice">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.referenceable_form_date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.referenceable_form_number }}</td>
                  <td>{{ row.referenceable_form_notes }}</td>
                  <td class="text-right">
                    {{ row.available | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="details.salesDownPayment.length > 0">
            <h5>{{ $t('down payment collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="20%">
                  Date
                </th>
                <th width="20%">
                  Form Number
                </th>
                <th width="15%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Available Down Payment
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Down Payment
                </th>
              </tr>
              <template v-for="(row, index) in details.salesDownPayment">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.referenceable_form_date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.referenceable_form_number }}</td>
                  <td>{{ row.referenceable_form_notes }}</td>
                  <td class="text-right">
                    {{ row.available | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="details.salesReturn.length > 0">
            <h5>{{ $t('return collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="20%">
                  Date
                </th>
                <th width="20%">
                  Form Number
                </th>
                <th width="15%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Available Return
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Return
                </th>
              </tr>
              <template v-for="(row, index) in details.salesReturn">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.referenceable_form_date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.referenceable_form_number }}</td>
                  <td>{{ row.referenceable_form_notes }}</td>
                  <td class="text-right">
                    {{ row.available | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="details.other.length > 0">
            <h5>{{ $t('other collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th
                  width="5%"
                  class="text-center"
                >
                  #
                </th>
                <th width="40%">
                  Account
                </th>
                <th width="15%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Amount
                </th>
                <th width="20%">
                  Allocation
                </th>
              </tr>
              <template v-for="(row, index) in details.other">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.chart_of_account_name }}</td>
                  <td>{{ row.notes }} </td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                  <td>
                    {{ row.allocation_name }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div class="row">
            <div class="col-sm-7" />
            <div class="col-sm-5">
              <point-table>
                <tr slot="p-body">
                  <td>Total Invoice</td>
                  <td class="text-right">
                    {{ total_invoice | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Down Payment</td>
                  <td class="text-right">
                    {{ total_down_payment | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Return</td>
                  <td class="text-right">
                    {{ total_return | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Other</td>
                  <td class="text-right">
                    {{ total_other | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Amount</td>
                  <td class="text-right">
                    {{ amount | numberFormat }}
                  </td>
                </tr>
              </point-table>
            </div>
          </div>

          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ notes }}
              </div>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('created by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                {{ date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ requestedBy | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('approved by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                &nbsp;
              </div>
              {{ approver_name | uppercase }}
            </div>

            <div class="col-sm-12">
              <hr>
              <button
                type="button"
                class="btn btn-block btn-sm btn-outline-secondary"
                @click="back()"
              >
                {{ $t('back') | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-form-request-delete
      ref="formRequestDelete"
      @delete="onDelete($event)"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      total_invoice: 0,
      total_down_payment: 0,
      total_return: 0,
      total_other: 0,
      total_amount: 0,
      source: null,
      requestedBy: localStorage.getItem('fullName'),
      approver_name: null,
      payment_type: null,
      date: null,
      number: null,
      notes: null,
      amount: 0,
      details: {
        salesInvoice: [],
        salesDownPayment: [],
        salesReturn: [],
        other: []
      }
    }
  },
  computed: {
    ...mapGetters('salesPaymentCollection', ['salesPaymentCollection']),
    ...mapGetters('auth', ['authUser'])
  },
  mounted () {
    this.source = this.$route.params.source
  },
  created () {
    this.getDataFromStorage()
  },
  methods: {
    ...mapActions('salesPaymentCollection', {
      generateFormNumber: 'generateFormNumber'
    }),
    getDataFromStorage () {
      this.isLoading = true
      console.log(this.source)
      var data = JSON.parse(localStorage.getItem('paymentCollectionData'))
      if (data) {
        this.total_invoice = data.form.total_invoice
        this.total_down_payment = data.form.total_down_payment
        this.total_return = data.form.total_return
        this.total_other = data.form.total_other
        this.total_amount = data.form.total_amount
        this.approver_name = data.form.approver_name
        this.payment_type = data.form.payment_type
        this.date = data.form.date
        this.notes = data.form.notes
        this.amount = data.form.amount
        this.number = data.form.number
        data.form.details.forEach(element => {
          if (element.referenceable_type === 'SalesInvoice') {
            this.details.salesInvoice.push(element)
          } else if (element.referenceable_type === 'SalesDownPayment') {
            this.details.salesDownPayment.push(element)
          } else if (element.referenceable_type === 'SalesReturn') {
            this.details.salesReturn.push(element)
          }
        })
        if (data.form.others.length > 0) {
          if (data.form.others[0].chart_of_account_id) {
            this.details.other = data.form.others
          }
        }
        data.form.increment_group = this.$moment(data.form.date).format('YYYYMM')
      }
      if (this.source != 'edit') {
        this.generateFormNumber(data.form)
          .then(response => {
            this.number = response.data.number
          }).catch(error => {
            this.$notification.error(error.message)
          }).finally(() => {
            this.isLoading = false
          })
      } else {
        this.isLoading = false
      }
    },
    back () {
      if (this.source === 'edit') {
        this.$router.push('/sales/payment-collection/' + this.id + '/edit')
      } else {
        this.$router.push('/sales/payment-collection/create')
      }
    }
  }
}
</script>
