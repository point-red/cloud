<template>
  <div>
    <breadcrumb v-if="salesReturn">
      <breadcrumb-sales />
      <router-link
        to="/sales/return"
        class="breadcrumb-item"
      >
        {{ $t('sales return ') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ salesReturn.form.number | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div v-if="salesReturn.form.number">
      <p-show-form-approval-status
        form="sales return"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessApproval"
        :approval-status="salesReturn.form.approval_status"
        :approval-reason="salesReturn.form.approval_reason"
        :approved-by="salesReturn.form.request_approval_to.full_name"
        :cancellation-status="salesReturn.form.cancellation_status"
        :close-status="salesReturn.form.close_status"
        @onApprove="onApprove"
        @onReject="onReject"
      />

      <p-show-form-cancellation-status
        form="sales return"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessCancellationApproval"
        :approved-by="salesReturn.form.request_approval_to.full_name"
        :cancellation-status="salesReturn.form.cancellation_status"
        :close-status="salesReturn.form.close_status"
        :cancellation-approval-reason="salesReturn.form.cancellation_approval_reason"
        :request-cancellation-reason="salesReturn.form.request_cancellation_reason"
        @onCancellationApprove="onCancellationApprove"
        @onCancellationReject="onCancellationReject"
      />

      <p-show-form-close-status
        form="sales return"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessCloseApproval"
        :approved-by="salesReturn.form.request_approval_to.full_name"
        :close-status="salesReturn.form.close_status"
        :close-approval-reason="salesReturn.form.close_approval_reason"
        :request-close-reason="salesReturn.form.request_close_reason"
        @onCloseApprove="onCloseApprove"
        @onCloseReject="onCloseReject"
      />
    </div>

    <div
      v-if="salesReturn"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="salesReturn.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <span v-if="salesReturn.form.number">
                <div class="text-right">
                  <router-link
                    v-if="$permission.has('create sales return')"
                    :to="{ name: 'sales.return.create' }"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('create') | uppercase }}
                  </router-link>
                  <router-link
                    v-if="$permission.has('update sales return') && salesReturn.form.done === 0"
                    :to="{ name: 'sales.return.edit', params: { id: salesReturn.id }}"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('edit') | uppercase }}
                  </router-link>
                  <button
                    v-if="(salesReturn.form.cancellation_status == null || salesReturn.form.cancellation_status == -1) && $permission.has('delete sales return') && salesReturn.form.done === 0"
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
              <hr>
              <div class="row">
                <div class="col-sm-6">
                  <h4>{{ $t('sales return') | uppercase }}</h4>
                  <table class="table table-sm table-bordered">
                    <tr>
                      <td
                        width="150px"
                        class="font-weight-bold"
                      >
                        {{ $t('form number') | uppercase }}
                      </td>
                      <td v-if="salesReturn.form.number">
                        {{ salesReturn.form.number }}
                      </td>
                      <td v-if="salesReturn.form.edited_number">
                        {{ salesReturn.form.edited_number }}
                      </td>
                    </tr>
                    <tr>
                      <td class="font-weight-bold">
                        {{ $t('date') | uppercase }}
                      </td>
                      <td>{{ salesReturn.form.date | dateFormat('DD MMMM YYYY') }}</td>
                    </tr>
                    <tr v-if="salesReturn.sales_invoice">
                      <td class="font-weight-bold">
                        {{ $t('reference') | uppercase }}
                      </td>
                      <td>{{ salesReturn.sales_invoice.form.number }}</td>
                    </tr>
                  </table>
                </div>
                <div class="col-sm-6 text-right">
                  <h6 class="mb-5">
                    {{ authUser.tenant_name | uppercase }}
                  </h6>
                  <template v-if="salesReturn.form.branch">
                    {{ salesReturn.form.branch.address | uppercase }}
                    <br v-if="salesReturn.form.branch.phone">{{ salesReturn.form.branch.phone | uppercase }}
                  </template>
                  <h6 class="mt-30 mb-5">
                    {{ $t('customer') | uppercase }}
                  </h6>
                  {{ salesReturn.customer.name | uppercase }}
                  <div style="font-size:12px">
                    {{ salesReturn.customer.address | uppercase }}
                    <br v-if="salesReturn.customer.phone">{{ salesReturn.customer.phone }}
                    <br v-if="salesReturn.customer.email">{{ salesReturn.customer.email | uppercase }}
                  </div>
                </div>
              </div>
              <hr>
              <point-table class="mt-20">
                <tr slot="p-head">
                  <th class="text-center">
                    #
                  </th>
                  <th style="min-width: 120px">
                    Item
                  </th>
                  <th>Allocation</th>
                  <th class="text-right">
                    Quantity Sales
                  </th>
                  <th class="text-right">
                    Quantity Return
                  </th>
                  <th class="text-right">
                    Price Sales
                  </th>
                  <th class="text-right">
                    Total
                  </th>
                </tr>
                <template v-for="(row, index) in salesReturn.items">
                  <tr
                    slot="p-body"
                    :key="index"
                  >
                    <th class="text-center">
                      {{ index + 1 }}
                    </th>
                    <td>{{ row.item.name }}</td>
                    <td>{{ row.allocation && row.allocation.name }}</td>
                    <td class="text-right">
                      {{ row.quantity_sales | numberFormat }} {{ row.unit }}
                    </td>
                    <td class="text-right">
                      {{ row.quantity | numberFormat }} {{ row.unit }}
                    </td>
                    <td class="text-right">
                      {{ (row.price - row.discount_value) | numberFormat }}
                    </td>
                    <td class="text-right">
                      {{ row.quantity * (row.price - row.discount_value) | numberFormat }}
                    </td>
                  </tr>
                </template>
                <tr slot="p-body">
                  <th />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td class="text-right">
                    <b>{{ $t('sub total') | uppercase }}</b>
                  </td>
                  <td class="text-right">
                    <b>{{ subTotal | numberFormat }}</b>
                  </td>
                  <td />
                </tr>
                <tr slot="p-body">
                  <th />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td class="text-right">
                    <b>{{ $t('tax base') | uppercase }}</b>
                  </td>
                  <td class="text-right">
                    <b>{{ subTotal | numberFormat }}</b>
                  </td>
                  <td />
                </tr>
                <tr slot="p-body">
                  <th />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td class="text-right">
                    <b>{{ $t('tax') | uppercase }}</b>
                  </td>
                  <td class="text-right">
                    <b>{{ salesReturn.tax | numberFormat }}</b>
                  </td>
                  <td />
                </tr>
                <tr slot="p-body">
                  <th />
                  <td />
                  <td />
                  <td />
                  <td />
                  <td class="text-right">
                    <b>{{ $t('total') | uppercase }}</b>
                  </td>
                  <td class="text-right">
                    <b>{{ salesReturn.amount | numberFormat }}</b>
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
                    {{ salesReturn.form.notes }}
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
                    {{ salesReturn.form.date | dateFormat('DD MMMM YYYY') }}
                  </div>
                  {{ salesReturn.form.created_by.full_name | uppercase }}
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
                    <template v-if="salesReturn.form.approval_at">
                      {{ salesReturn.form.approval_at | dateFormat('DD MMMM YYYY') }}
                    </template>
                    <template v-else>
                      _______________
                    </template>
                  </div>
                  {{ salesReturn.form.request_approval_to.full_name | uppercase }}
                  <div style="font-size:11px">
                    {{ salesReturn.form.request_approval_to.email | lowercase }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr>
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
      isDeleting: false
    }
  },
  computed: {
    ...mapGetters('salesReturn', ['salesReturn']),
    ...mapGetters('auth', ['authUser']),
    subTotal () {
      var subtotal = 0
      this.salesReturn.items.forEach(function (element) {
        element.total = element.quantity * (element.price - element.discount_value)
        subtotal += parseFloat(element.total)
      })
      return subtotal
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.salesReturnRequest()
      }
    }
  },
  created () {
    this.salesReturnRequest()
  },
  methods: {
    ...mapActions('salesReturn', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      sendReport: 'sendReport'
    }),
    ...mapActions('salesReturnApproval', ['send']),
    salesReturnRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'customer;' +
            'items.item;' +
            'items.allocation;' +
            'items.salesInvoiceItem;' +
            'salesInvoice.form;' +
            'salesInvoice.items;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
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
        this.salesReturnRequest()
        this.send({
          ids: [{ id: this.id }]
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
        this.salesReturnRequest()
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when approving sales return creation')
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.salesReturnRequest()
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when rejecting sales return creation')
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/sales/return')
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when approving sales return cancellation')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.salesReturnRequest()
      }).catch(error => {
        // console.log(error)
        this.$notification.error('Something error when rejecting the invoice cancellation')
      })
    }
  }
}
</script>
