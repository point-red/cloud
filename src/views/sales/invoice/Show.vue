<template>
  <div>
    <breadcrumb v-if="invoice">
      <breadcrumb-sales />
      <router-link
        to="/sales/invoice"
        class="breadcrumb-item"
      >
        {{ $t('sales invoice') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ invoice.form.number | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <p-show-form-approval-status-custom
      form-name="Sales Invoice"
      :is-loading="isLoading"
      :approved-by="invoice.form.requestApprovalToUser.fullName"
      :cancellation-status="invoice.form.cancellationStatus"
      :approval-status="invoice.form.approvalStatus"
      :approval-reason="invoice.form.approvalReason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status-custom
      form-name="Sales Invoice"
      :is-loading="isLoading"
      :approved-by="invoice.form.requestApprovalToUser.fullName"
      :cancellation-status="invoice.form.cancellationStatus"
      :cancellation-approval-reason="invoice.form.cancellationApprovalReason"
      :request-cancellation-reason="invoice.form.requestCancellationReason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="invoice"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <button
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Send sales invoice to customer"
                  @click="$refs['send-report-modal'].open()"
                >
                  <i class="si si-paper-plane" />
                </button>
                <button
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Print sales invoice"
                  @click="() => $refs['print-invoice'].open()"
                >
                  <i class="si si-printer" />
                </button>
                <router-link
                  :to="{ name: 'sales.invoice.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'sales.invoice.edit', params: { id: invoice.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="invoice.form.cancellationStatus == null || invoice.form.cancellationStatus == -1"
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
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('sales invoice') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ invoice.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ invoice.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="invoice.referenceable">
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ invoice.referenceable.form.number }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="invoice.form.branch">
                {{ invoice.form.branch.address | uppercase }}
                <br v-if="invoice.form.branch.phone">{{ invoice.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('customer') | uppercase }}
              </h6>
              {{ invoice.customer.name | uppercase }}
              <div style="font-size:12px">
                {{ invoice.customer.address | uppercase }}
                <br v-if="invoice.customer.phone">{{ invoice.customer.phone }}
                <br v-if="invoice.customer.email">{{ invoice.customer.email | uppercase }}
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th class="text-center">
                #
              </th>
              <th>Item</th>
              <th class="text-right">
                Quantity
              </th>
              <th class="text-right">
                Price
              </th>
              <th class="text-right">
                Discount
              </th>
              <th class="text-right">
                Total
              </th>
              <th>Allocation</th>
            </tr>
            <template v-for="(row, index) in invoice.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.itemName }}</td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.discountValue | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.quantity * (row.price - row.discountValue) | numberFormat }}
                </td>
                <td>{{ row.allocation && row.allocation.name }}</td>
              </tr>
            </template>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('subtotal') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ invoiceSubtotal | numberFormat }}</b>
              </td>
              <td />
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('discount') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ invoice.discountValue | numberFormat }}</b>
              </td>
              <td />
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('tax base') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ invoiceSubtotal - invoice.discountValue | numberFormat }}</b>
              </td>
              <td />
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('tax') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ invoice.tax | numberFormat }}</b>
              </td>
              <td />
            </tr>
            <tr slot="p-body">
              <th />
              <td />
              <td />
              <td />
              <td class="text-right">
                <b>{{ $t('total') | uppercase }}</b>
              </td>
              <td class="text-right">
                <b>{{ invoice.amount | numberFormat }}</b>
              </td>
              <td />
            </tr>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ invoice.form.notes }}
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
                {{ invoice.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ invoice.form.createdByUser.fullName | uppercase }}
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
                <template v-if="invoice.form.approvalAt">
                  {{ invoice.form.approvalAt | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ invoice.form.requestApprovalToUser.fullName | uppercase }}
              <div style="font-size:11px">
                {{ invoice.form.requestApprovalToUser.email | lowercase }}
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
      :title="$t('send invoice') | uppercase"
      overlay-theme="dark"
    >
      <form @submit.prevent="sendInvoice">
        <p-form-row
          id="send-invoice-email"
          ref="send-invoice-email"
          v-model="sendInvoiceData.email"
          type="email"
          required
          :disabled="!!invoice.customer.email"
          :label="$t('email') | uppercase"
          :is-horizontal="false"
        />
        <div class="form-group">
          <label
            class="col-form-label"
            for="send-invoice-message"
          >{{ 'Message' | uppercase }}</label>
          <div>
            <textarea
              id="send-invoice-message"
              v-model="sendInvoiceData.message"
              class="form-control"
              name="send-invoice-message"
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

    <print-sales-invoice
      ref="print-invoice"
      :invoice="invoice"
      :subtotal="invoiceSubtotal"
      :tax-base="tax"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '../Breadcrumb'
import PointTable from 'point-table-vue'
import PrintSalesInvoice from './PrintSalesInvoice'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    PointTable,
    PrintSalesInvoice
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      sendInvoiceData: {
        email: '',
        message: ''
      }
    }
  },
  computed: {
    ...mapGetters('salesInvoice', ['invoice']),
    ...mapGetters('auth', ['authUser']),
    invoiceSubtotal () {
      var subtotal = 0
      this.invoice.items.forEach(function (element) {
        if (element.discountPercent > 0) {
          element.total = element.quantity * (element.price - (element.price * element.discountPercent / 100))
        } else if (element.discountValue > 0) {
          element.total = element.quantity * (element.price - element.discountValue)
        } else {
          element.total = element.quantity * element.price
        }
        subtotal += parseFloat(element.total)
      })
      return subtotal
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.salesInvoiceRequest()
      }
    }
  },
  created () {
    this.salesInvoiceRequest()
  },
  methods: {
    ...mapActions('salesInvoice', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      sendReport: 'sendReport'
    }),
    salesInvoiceRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'customer;' +
            'items.item;' +
            'items.allocation;' +
            'salesQuotation.form;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.sendInvoiceData.email = this.invoice.customer.email
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
          reason: reason || null
        }
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.salesInvoiceRequest()
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
        this.salesInvoiceRequest()
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when approving the invoice creation')
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.salesInvoiceRequest()
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when rejecting the invoice creation')
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/sales/invoice')
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when approving the invoice cancellation')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.salesInvoiceRequest()
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when rejecting the invoice cancellation')
      })
    },
    async sendInvoice () {
      const { email, message } = this.sendInvoiceData
      try {
        await this.sendReport({
          id: this.id,
          email,
          message
        })

        this.sendInvoiceData.email = this.invoice.customer.email || ''
        this.sendInvoiceData.message = ''
        this.$refs['send-report-modal'].close()
        this.$notification.success('sales invoice sent')
      } catch (error) {
        // console.log(error)
        this.$notification.error('Something error when sending the invoice')
      }
    }
  }
}
</script>
