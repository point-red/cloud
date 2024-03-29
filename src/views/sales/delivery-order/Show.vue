<template>
  <div>
    <breadcrumb v-if="deliveryOrder">
      <breadcrumb-sales />
      <router-link
        to="/sales/delivery-order"
        class="breadcrumb-item"
      >
        {{ $t('delivery order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ deliveryOrder.form.number | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div v-if="deliveryOrder.form.number">
      <p-show-form-approval-status
        form="sales delivery order"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessApproval"
        :approval-status="deliveryOrder.form.approval_status"
        :approval-reason="deliveryOrder.form.approval_reason"
        :approved-by="deliveryOrder.form.request_approval_to.full_name"
        :cancellation-status="deliveryOrder.form.cancellation_status"
        :close-status="deliveryOrder.form.close_status"
        @onApprove="onApprove"
        @onReject="onReject"
      />

      <p-show-form-cancellation-status
        form="sales delivery order"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessCancellationApproval"
        :approved-by="deliveryOrder.form.request_approval_to.full_name"
        :cancellation-status="deliveryOrder.form.cancellation_status"
        :close-status="deliveryOrder.form.close_status"
        :cancellation-approval-reason="deliveryOrder.form.cancellation_approval_reason"
        :request-cancellation-reason="deliveryOrder.form.request_cancellation_reason"
        @onCancellationApprove="onCancellationApprove"
        @onCancellationReject="onCancellationReject"
      />

      <p-show-form-close-status
        form="sales delivery order"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessCloseApproval"
        :approved-by="deliveryOrder.form.request_approval_to.full_name"
        :close-status="deliveryOrder.form.close_status"
        :close-approval-reason="deliveryOrder.form.close_approval_reason"
        :request-close-reason="deliveryOrder.form.request_close_reason"
        @onCloseApprove="onCloseApprove"
        @onCloseReject="onCloseReject"
      />
    </div>

    <div
      v-if="deliveryOrder"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="deliveryOrder.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <div
                v-if="deliveryOrder.form.number"
                class="text-right"
              >
                <button
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Send Receipt Delivery Order"
                  :disabled="isSendingEmail"
                  @click="() => $refs.formSendEmail.open()"
                >
                  <i
                    :class="{
                      'fa fa-paper-plane': !isSendingEmail,
                      'fa fa-asterisk fa-spin': isSendingEmail,
                    }"
                  />
                </button>
                <button
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Preview Receipt Delivery Order"
                  @click="() => $refs.printPreview.open()"
                >
                  <i class="si si-printer" />
                </button>
                <router-link
                  :to="{ name: 'sales.delivery-order.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  v-if="actions.edit"
                  :to="{ name: 'sales.delivery-order.edit', params: { id: deliveryOrder.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="actions.delete"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  :disabled="isDeleting"
                  @click="$refs.formRequestDelete.open()"
                >
                  <i
                    v-show="isDeleting"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('delete') | uppercase }}
                </button>
                <button
                  v-if="actions.close"
                  class="btn btn-sm btn-outline-secondary mr-5"
                  :disabled="isClosing"
                  @click="$refs.formRequestClose.open()"
                >
                  <i
                    v-show="isClosing"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('close') | uppercase }}
                </button>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('delivery order') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ deliveryOrder.form.number || deliveryOrder.form.edited_number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ deliveryOrder.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="deliveryOrder.sales_order">
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ deliveryOrder.sales_order.form.number }}</td>
                </tr>
                <tr v-if="deliveryOrder">
                  <td class="font-weight-bold">
                    {{ $t('warehouse') | uppercase }}
                  </td>
                  <td>{{ deliveryOrder.warehouse.name }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="deliveryOrder.form.branch">
                {{ deliveryOrder.form.branch.address | uppercase }}
                <br v-if="deliveryOrder.form.branch.phone">{{ deliveryOrder.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('customer') | uppercase }}
              </h6>
              {{ deliveryOrder.customer_name | uppercase }}
              <div style="font-size:12px">
                {{ deliveryOrder.customer_address | uppercase }}
                <br v-if="deliveryOrder.customer_phone">{{ deliveryOrder.customer_phone }}
                <br v-if="deliveryOrder.customer_email">{{ deliveryOrder.customer_email | uppercase }}
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
                Quantity Request
              </th>
              <th class="text-right">
                Quantity Delivered
              </th>
              <th class="text-right">
                Quantity Remaining
              </th>
            </tr>
            <template v-for="(row, index) in deliveryOrder.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item.label }}</td>
                <td class="text-right">
                  {{ row.quantity_requested | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.quantity_delivered | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.quantity_remaining | numberFormat }} {{ row.unit }}
                </td>
              </tr>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ deliveryOrder.form.notes }}
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
                {{ deliveryOrder.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ deliveryOrder.form.created_by.full_name | uppercase }}
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
                <template v-if="deliveryOrder.form.approval_at">
                  {{ deliveryOrder.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ deliveryOrder.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ deliveryOrder.form.request_approval_to.email | lowercase }}
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
    <m-form-request-close
      ref="formRequestClose"
      @closeRequest="onCloseRequest($event)"
    />
    <m-form-send-email
      ref="formSendEmail"
      @submit="onSendEmail($event)"
    />
    <m-print-preview
      ref="printPreview"
      :delivery-order="deliveryOrder"
    />
  </div>
</template>

<script>
import SalesMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSales from '../Breadcrumb'
import MPrintPreview from './MPrintPreview'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    SalesMenu,
    Breadcrumb,
    BreadcrumbSales,
    MPrintPreview,
    PointTable
  },
  data () {
    return {
      isLoading: false,
      isProccessApproval: false,
      isProccessCancellationApproval: false,
      isProccessCloseApproval: false,
      isDeleting: false,
      isClosing: false,
      isSendingEmail: false
    }
  },
  computed: {
    ...mapGetters('salesDeliveryOrder', ['deliveryOrder']),
    ...mapGetters('auth', ['authUser']),
    actions () {
      const { form } = this.deliveryOrder

      const whereApprove = form.approval_status == 1
      const wherePending = form.done == 0
      const whereNotArchived = !!form.number
      const whereNotCancelled = form.cancellation_status == null || form.cancellation_status != 1
      const whereNotClosed = form.close_status == null || form.close_status != 1

      return {
        edit: wherePending && whereNotClosed,
        delete: wherePending && whereNotArchived && whereNotClosed && whereNotCancelled,
        close: wherePending && whereNotArchived && whereNotClosed && whereApprove
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.$route.params.id = to.params.id
        this.deliveryOrderRequest()
      }
    }
  },
  created () {
    this.deliveryOrderRequest()
  },
  methods: {
    ...mapActions('salesDeliveryOrder', {
      find: 'find',
      delete: 'delete',
      closeForm: 'close',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      closeApprove: 'closeApprove',
      closeReject: 'closeReject'
    }),
    toggleMore () {
      const isMoreActive = this.deliveryOrder.items.some(function (el, index) {
        return el.more === false
      })
      this.deliveryOrder.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    deliveryOrderRequest () {
      this.isLoading = true
      this.find({
        id: this.$route.params.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'customer;' +
            'warehouse;' +
            'items.item;' +
            'items.allocation;' +
            'salesOrder.form;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        this.calculate()
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    calculate () {
      var subtotal = 0
      this.deliveryOrder.items.forEach(function (element) {
        if (element.discount_percent > 0) {
          element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        } else if (element.discount_value > 0) {
          element.total = element.quantity * (element.price - element.discount_value)
        } else {
          element.total = element.quantity * element.price
        }
        subtotal += parseFloat(element.total)
      })
      this.deliveryOrder.subtotal = subtotal
    },
    onDelete (reason) {
      this.isDeleting = true
      this.delete({
        id: this.$route.params.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.$notification.success('cancel success')
        this.deliveryOrderRequest()
      }).catch(error => {
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      }).finally(() => {
        this.isDeleting = false
      })
    },
    onCloseRequest (reason) {
      this.isClosing = true
      this.closeForm({ id: this.$route.params.id, reason: reason })
        .then(response => {
          this.$notification.success('close success')
          this.deliveryOrderRequest()
        }).catch(error => {
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        }).finally(() => {
          this.isClosing = false
        })
    },
    async onSendEmail (form) {
      this.isSendingEmail = true

      try {
        const params = {
          ...form,
          subject: 'Delivery Order Receipt',
          attachments: [
            {
              filename: 'Delivery Order Receipt ' + this.deliveryOrder.form.number + '.pdf',
              type: 'pdf',
              view: 'sales.delivery-order.delivery-order-receipt',
              view_data: { deliveryOrder: this.deliveryOrder }
            }
          ]
        }
        await this.$store.dispatch('emailService/send', { ...params })

        this.$notification.success('send receipt success')
      } catch (error) {
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      } finally {
        this.isSendingEmail = false
      }
    },
    onApprove () {
      this.isProccessApproval = true

      this.approve({ id: this.$route.params.id })
        .then(response => {
          this.$notification.success('approve success')
          this.deliveryOrderRequest()
        })
        .catch(error => {
          this.$notification.error(error?.message)
        })
        .finally(() => {
          this.isProccessApproval = false
        })
    },
    onReject (reason) {
      this.isProccessApproval = true

      this.reject({
        id: this.$route.params.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.deliveryOrderRequest()
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessApproval = false
      })
    },
    onCancellationApprove () {
      this.isProccessCancellationApproval = true

      this.cancellationApprove({
        id: this.$route.params.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/sales/delivery-order')
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessCancellationApproval = false
      })
    },
    onCancellationReject (reason) {
      this.isProccessCancellationApproval = true

      this.cancellationReject({
        id: this.$route.params.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.deliveryOrderRequest()
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessCancellationApproval = false
      })
    },
    onCloseApprove () {
      this.isProccessCloseApproval = true

      this.closeApprove({
        id: this.$route.params.id
      }).then(response => {
        this.$notification.success('close approved')
        this.$router.push('/sales/delivery-order')
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessCloseApproval = false
      })
    },
    onCloseReject (reason) {
      this.isProccessCloseApproval = true

      this.closeReject({
        id: this.$route.params.id,
        reason: reason
      }).then(response => {
        this.$notification.success('close rejected')
        this.deliveryOrderRequest()
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessCloseApproval = false
      })
    }
  }
}
</script>
