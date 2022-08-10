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
      <span class="breadcrumb-item active">
        <span v-if="salesPaymentCollection.form.number">
          {{ salesPaymentCollection.form.number | uppercase }}
        </span>
        <span v-if="salesPaymentCollection.form.edited_number">
          {{ $t('archive') | uppercase }}
        </span>
      </span>
    </breadcrumb>

    <sales-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="salesPaymentCollection.form.request_approval_to.full_name"
      :cancellation-status="salesPaymentCollection.form.cancellation_status"
      :approval-status="salesPaymentCollection.form.approval_status"
      :approval-reason="salesPaymentCollection.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="salesPaymentCollection.form.cancellation_status"
      :cancellation-approval-reason="salesPaymentCollection.form.cancellation_approval_reason"
      :request-cancellation-reason="salesPaymentCollection.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="salesPaymentCollection"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="salesPaymentCollection.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <span v-if="salesPaymentCollection.form.number">
                <div class="text-right">
                  <button
                    class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                    title="Print payment collection"
                    @click="() => $refs['print-payment-collection'].open()"
                  >
                    <i class="si si-printer" />
                  </button>
                  <router-link
                    v-if="$permission.has('create sales payment collection')"
                    :to="{ name: 'sales.payment-collection.create' }"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('create') | uppercase }}
                  </router-link>
                  <router-link
                    v-if="$permission.has('update sales payment collection')"
                    :to="{ name: 'sales.payment-collection.edit', params: { id: salesPaymentCollection.id }}"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('edit') | uppercase }}
                  </router-link>
                  <button
                    v-if="(salesPaymentCollection.form.cancellation_status == null || salesPaymentCollection.form.cancellation_status == -1) && $permission.has('delete sales payment collection')"
                    class="btn btn-sm btn-outline-secondary mr-5"
                    @click="$refs.formRequestDelete.open()"
                  >
                    {{ $t('delete') | uppercase }}
                  </button>
                  <m-form-request-delete
                    ref="formRequestDelete"
                    @delete="onDelete($event)"
                  />
                </div>
              </span>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('sales payment collection') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ salesPaymentCollection.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td v-if="salesPaymentCollection.form.number">
                    {{ salesPaymentCollection.form.number }}
                  </td>
                  <td v-if="salesPaymentCollection.form.edited_number">
                    {{ salesPaymentCollection.form.edited_number }}
                  </td>
                </tr>
                <tr v-if="salesPaymentCollection.payment_type">
                  <td class="font-weight-bold">
                    {{ $t('payment method') | uppercase }}
                  </td>
                  <td>{{ salesPaymentCollection.payment_type | uppercase }}</td>
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
                  <td>{{ row.chart_of_account.label }}</td>
                  <td>{{ row.notes }} {{ row.unit }}</td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                  <td>
                    {{ row.allocation ? row.allocation.label : '' }}
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
                    {{ salesPaymentCollection.amount | numberFormat }}
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
                {{ salesPaymentCollection.form.notes }}
              </div>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">
                {{ $t('requested by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                {{ salesPaymentCollection.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ salesPaymentCollection.form.created_by.full_name | uppercase }}
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
                <template v-if="salesPaymentCollection.form.approval_at">
                  {{ salesPaymentCollection.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ salesPaymentCollection.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ salesPaymentCollection.form.request_approval_to.email | lowercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-form-request-delete
      ref="formRequestDelete"
      @delete="onDelete($event)"
    />

    <sweet-modal
      ref="send-report-modal"
      :title="$t('send payment collection') | uppercase"
      overlay-theme="dark"
    >
      <form @submit.prevent="sendPaymentCollection">
        <p-form-row
          id="send-payment-collection-email"
          ref="send-payment-collection-email"
          v-model="sendPaymentCollectionData.email"
          type="email"
          required
          :disabled="!!salesPaymentCollection.customer.email"
          :label="$t('email') | uppercase"
          :is-horizontal="false"
        />
        <div class="form-group">
          <label
            class="col-form-label"
            for="send-payment-collection-message"
          >{{ 'Message' | uppercase }}</label>
          <div>
            <textarea
              id="send-payment-collection-message"
              v-model="sendPaymentCollectionData.message"
              class="form-control"
              name="send-payment-collection-message"
              cols="30"
              rows="10"
            />
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-primary"
          >
            Send
          </button>
        </div>
      </form>
    </sweet-modal>

    <print-payment-collection
      ref="print-payment-collection"
      :paymentcollection="salesPaymentCollection"
      :details="details"
      :totalinvoice="total_invoice"
      :totaldownpayment="total_down_payment"
      :totalreturn="total_return"
      :totalother="total_other"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '../Breadcrumb'
import PointTable from 'point-table-vue'
import PrintPaymentCollection from './PrintPaymentCollection'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    PointTable,
    PrintPaymentCollection
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
      details: {
        salesInvoice: [],
        salesDownPayment: [],
        salesReturn: [],
        other: []
      },
      sendPaymentCollectionData: {
        email: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapGetters('salesPaymentCollection', ['salesPaymentCollection']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.salesPaymentCollectionRequest()
      }
    }
  },
  created () {
    this.salesPaymentCollectionRequest()
  },
  methods: {
    ...mapActions('salesPaymentCollection', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      addHistories: 'addHistories'
    }),
    ...mapActions('salesPaymentCollectionApproval', ['sendCancellation']),
    salesPaymentCollectionRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'form;' +
            'customer;' +
            'details;' +
            'details.chartOfAccount;' +
            'details.chartOfAccount.type;' +
            'details.allocation;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.total_other = 0
        this.total_invoice = 0
        this.total_return = 0
        this.total_down_payment = 0
        this.details.salesInvoice = []
        this.details.salesDownPayment = []
        this.details.other = []
        response.data.details.forEach(element => {
          if (element.chart_of_account_id) {
            this.details.other.push(element)
            if (element.chart_of_account.type.is_debit === 1) {
              this.total_other -= parseFloat(element.amount)
            } else {
              this.total_other += parseFloat(element.amount)
            }
          } else if (element.referenceable_type === 'SalesInvoice') {
            this.details.salesInvoice.push(element)
            this.total_invoice += parseFloat(element.amount)
          } else if (element.referenceable_type === 'SalesDownPayment') {
            this.details.salesDownPayment.push(element)
            this.total_down_payment += parseFloat(element.amount)
          } else if (element.referenceable_type === 'SalesReturn') {
            this.details.salesReturn.push(element)
            this.total_return += parseFloat(element.amount)
          }
        })
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    onDelete (reason) {
      this.isDeleting = true
      this.delete({
        id: this.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.salesPaymentCollectionRequest()
        this.sendCancellation({
          id: this.id,
          total_invoice: this.total_invoice,
          total_down_payment: this.total_down_payment,
          total_return: this.total_return,
          total_other: this.total_other
        })
          .catch(error => {
            this.$notification.error(error.message)
            this.form.errors.record(error.errors)
          })
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.salesPaymentCollectionRequest()
        this.addHistories({ id: response.data.id, activity: 'Approved' })
          .catch(error => {
            console.log(error.message)
          })
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onReject (reason) {
      if (!reason) {
        this.$notification.error('reason cannot empty')
      }
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.salesPaymentCollectionRequest()
        this.addHistories({ id: response.data.id, activity: 'Rejected' })
          .catch(error => {
            console.log(error.message)
          })
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/sales/payment-collection')
        this.addHistories({ id: response.data.id, activity: 'Cancelation Approved' })
          .catch(error => {
            console.log(error.message)
          })
      })
    },
    onCancellationReject (reason) {
      if (!reason) {
        this.$notification.error('reason cannot empty')
      }
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.salesPaymentCollectionRequest()
        this.addHistories({ id: response.data.id, activity: 'Cancelation Rejected' })
          .catch(error => {
            console.log(error.message)
          })
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
