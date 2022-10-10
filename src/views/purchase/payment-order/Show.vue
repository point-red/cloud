<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/payment-order"
        class="breadcrumb-item"
      >
        {{ $t('payment order') | uppercase }}
      </router-link>
    </breadcrumb>

    <purchase-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="purchasePaymentOrder.approvedBy"
      :cancellation-status="purchasePaymentOrder.form.cancellation_status"
      :approval-status="purchasePaymentOrder.form.approval_status"
      :approval-reason="purchasePaymentOrder.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchasePaymentOrder.form.cancellation_status"
      :cancellation-approval-reason="purchasePaymentOrder.form.cancellation_approval_reason"
      :request-cancellation-reason="purchasePaymentOrder.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div class="row">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <hr>
            <div class="col-sm-6">
              <h4>{{ $t('purchase payment order') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ purchasePaymentOrder.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ purchasePaymentOrder.form_number }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    {{ $t('payment method') | uppercase }}
                  </td>
                  <td>{{ purchasePaymentOrder.payment_method | uppercase }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <h6 class="mt-30 mb-5">
                {{ $t('supplier') | uppercase }} : {{ purchasePaymentOrder.supplier_name | uppercase }}
              </h6>
            </div>
          </div>
          <hr>

          <div v-if="purchasePaymentOrder.invoice_collection.length > 0">
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
                  Amount Order
                </th>
              </tr>
              <template v-for="(row, index) in purchasePaymentOrder.invoice_collection">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.form_number }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.available_amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount_order | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="purchasePaymentOrder.down_payment_collection.length > 0">
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
                  Amount Order
                </th>
              </tr>
              <template v-for="(row, index) in purchasePaymentOrder.down_payment_collection">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.form_number }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.available_amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount_order | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="purchasePaymentOrder.return_collection.length > 0">
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
                  Amount Order
                </th>
              </tr>
              <template v-for="(row, index) in purchasePaymentOrder.return_collection">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.date | dateFormat('DD MMMM YYYY') }}</td>
                  <td>{{ row.form_number }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.available_amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.amount_order | numberFormat }}
                  </td>
                </tr>
              </template>
            </point-table>
          </div>

          <div v-if="purchasePaymentOrder.other_collection.length > 0">
            <h5>{{ $t('other collection') | uppercase }}</h5>
            <point-table>
              <tr slot="p-head">
                <th class="text-center">
                  #
                </th>
                <th width="25%">
                  Account
                </th>
                <th width="25%">
                  Notes
                </th>
                <th
                  width="20%"
                  class="text-right"
                >
                  Amount
                </th>
                <th
                  width="25%"
                  class="text-right"
                >
                  Allocation
                </th>
              </tr>
              <template v-for="(row, index) in purchasePaymentOrder.other_collection">
                <tr
                  slot="p-body"
                  :key="index"
                >
                  <th class="text-center">
                    {{ index + 1 }}
                  </th>
                  <td>{{ row.account }}</td>
                  <td>{{ row.notes }}</td>
                  <td class="text-right">
                    {{ row.amount | numberFormat }}
                  </td>
                  <td class="text-right">
                    {{ row.allocation | uppercase }}
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
                    {{ purchasePaymentOrder.total_invoice | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Down Payment</td>
                  <td class="text-right">
                    {{ purchasePaymentOrder.total_down_payment | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Return</td>
                  <td class="text-right">
                    {{ purchasePaymentOrder.total_return | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Other</td>
                  <td class="text-right">
                    {{ purchasePaymentOrder.total_other | numberFormat }}
                  </td>
                </tr>
                <tr slot="p-body">
                  <td>Total Amount</td>
                  <td class="text-right">
                    {{ purchasePaymentOrder.total_amount | numberFormat }}
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
                {{ purchasePaymentOrder.notes }}
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
                {{ purchasePaymentOrder.created_at | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ purchasePaymentOrder.created_by | uppercase }}
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
              <div>{{ purchasePaymentOrder.approved_by | uppercase }}</div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import PurchaseMenu from '../Menu'
import PointTable from 'point-table-vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPurchase,
    PurchaseMenu,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      rows: [],
      isLoading: false,
      form: {
        invoices: [{
          test: '1'
        }],
        downPayments: [{
          test: '1'
        }],
        returns: [{
          test: '1'
        }],
        others: [{
          test: '1'
        }]
      }
    }
  },
  computed: {
    ...mapGetters('purchasePaymentOrder', ['purchasePaymentOrder']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.getDetail()
  },
  methods: {
    ...mapActions('purchasePaymentOrder', ['approve', 'reject', 'find']),
    getDetail () {
      this.isLoading = true
      this.find({
        id: this.id
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.getDetail()
        // this.addHistories({ id: response.data.id, activity: 'Approved' })
        //   .catch(error => {
        //     console.log(error.message)
        //   })
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
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
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onCancellationApprove () {
      console.log('reject')
    },
    onCancellationReject () {
      console.log('reject')
    }
  }
}
</script>
