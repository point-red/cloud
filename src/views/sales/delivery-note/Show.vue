<template>
  <div>
    <breadcrumb v-if="deliveryNote">
      <breadcrumb-sales />
      <router-link
        to="/sales/delivery-note"
        class="breadcrumb-item"
      >
        {{ $t('delivery note') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ deliveryNote.form.number || deliveryNote.form.edited_number | uppercase }}</span>
    </breadcrumb>

    <sales-menu />

    <div v-if="deliveryNote.form.number && deliveryNote.form.request_approval_to">
      <p-show-form-approval-status
        form="sales delivery note"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessApproval"
        :approval-status="deliveryNote.form.approval_status"
        :approval-reason="deliveryNote.form.approval_reason"
        :approved-by="deliveryNote.form.request_approval_to.full_name"
        :cancellation-status="deliveryNote.form.cancellation_status"
        :close-status="deliveryNote.form.close_status"
        @onApprove="onApprove"
        @onReject="onReject"
      />

      <p-show-form-cancellation-status
        form="sales delivery note"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessCancellationApproval"
        :approved-by="deliveryNote.form.request_approval_to.full_name"
        :cancellation-status="deliveryNote.form.cancellation_status"
        :close-status="deliveryNote.form.close_status"
        :cancellation-approval-reason="deliveryNote.form.cancellation_approval_reason"
        :request-cancellation-reason="deliveryNote.form.request_cancellation_reason"
        @onCancellationApprove="onCancellationApprove"
        @onCancellationReject="onCancellationReject"
      />
    </div>

    <div
      v-if="deliveryNote"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="deliveryNote.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <div
                v-if="deliveryNote.form.number"
                class="text-right"
              >
                <button
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Send Receipt Delivery Note"
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
                  title="Preview Receipt Delivery Note"
                  @click="$refs.printPreview.open()"
                >
                  <i class="si si-printer" />
                </button>
                <router-link
                  :to="{ name: 'sales.delivery-note.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  v-if="actions.edit"
                  :to="{ name: 'sales.delivery-note.edit', params: { id: deliveryNote.id }}"
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
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('delivery note') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.form.number || deliveryNote.form.edited_number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.form.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.delivery_order.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('warehouse') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.warehouse.name }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('driver') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.driver }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('license plate') | uppercase }}
                  </td>
                  <td>{{ deliveryNote.license_plate }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="deliveryNote.form.branch">
                {{ deliveryNote.form.branch.address | uppercase }}
                <br v-if="deliveryNote.form.branch.phone">{{ deliveryNote.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">
                {{ $t('customer') | uppercase }}
              </h6>
              {{ deliveryNote.customer_name | uppercase }}
              <div style="font-size:12px">
                {{ deliveryNote.customer_address | uppercase }}
                <br v-if="deliveryNote.customer_phone">{{ deliveryNote.customer_phone }}
                <br v-if="deliveryNote.customer.email">{{ deliveryNote.customer.email | uppercase }}
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
                Quantity Remaining
              </th>
              <th class="text-right">
                Quantity
              </th>
            </tr>
            <template v-for="(row, index) in items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.label }}</td>
                <td class="text-right">
                  {{ row.quantity_remaining | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
              </tr>
            </template>
          </point-table>
          <div class="row mt-50">
            <div class="col-sm-9">
              <h6 class="mb-0">
                {{ $t('notes') | uppercase }}
              </h6>
              <div style="white-space: pre-wrap;">
                {{ deliveryNote.form.notes }}
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
                {{ deliveryNote.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ deliveryNote.form.created_by.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10" />
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-form-request-delete
      ref="formRequestDelete"
      @delete="onDelete($event)"
    />
    <m-form-send-email
      ref="formSendEmail"
      :email-to="deliveryNote.customer.email"
      @submit="onSendEmail($event)"
    />
    <m-print-preview
      ref="printPreview"
      :delivery-note="deliveryNote"
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
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      isProccessApproval: false,
      isProccessCancellationApproval: false,
      isSendingEmail: false
    }
  },
  computed: {
    ...mapGetters('salesDeliveryNote', ['deliveryNote']),
    ...mapGetters('auth', ['authUser']),
    actions () {
      const { form } = this.deliveryNote
      const wherePending = form.done == 0
      const whereNotArchived = !!form.number
      const whereNotClosed = form.close_status == null || form.close_status != 1
      const whereNotCancelled = form.cancellation_status == null || form.cancellation_status != 1
      return {
        edit: wherePending && whereNotClosed && this.$permission.has('update sales delivery note'),
        delete: wherePending && whereNotArchived && whereNotClosed && whereNotCancelled && this.$permission.has('delete sales delivery note')
      }
    },
    items () {
      var items = []
      this.deliveryNote.items.forEach(function (element) {
        const i = Object.keys(items).length

        if (i && items[i - 1].id === element.item_id) {
          items[i - 1].quantity += element.quantity
        } else {
          items.push({
            id: element.item_id,
            unit: element.unit,
            label: element.item.label,
            quantity: element.quantity,
            quantity_remaining: element.quantity_remaining
          })
        }
      })
      return items
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.deliveryNoteRequest()
      }
    }
  },
  created () {
    this.deliveryNoteRequest()
  },
  methods: {
    ...mapActions('salesDeliveryNote', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    toggleMore () {
      const isMoreActive = this.deliveryNote.items.some(function (el, index) {
        return el.more === false
      })
      this.deliveryNote.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    deliveryNoteRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'customer;' +
            'warehouse;' +
            'deliveryOrder.form;' +
            'deliveryOrder.form.createdBy;' +
            'deliveryOrder.form.requestApprovalTo;' +
            'items.item;' +
            'items.allocation;' +
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
      this.deliveryNote.items.forEach(function (element) {
        if (element.discount_percent > 0) {
          element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        } else if (element.discount_value > 0) {
          element.total = element.quantity * (element.price - element.discount_value)
        } else {
          element.total = element.quantity * element.price
        }
        subtotal += parseFloat(element.total)
      })
      this.deliveryNote.subtotal = subtotal
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
        this.deliveryNoteRequest()
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    },
    onApprove () {
      this.isProccessApproval = true

      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.deliveryNoteRequest()
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessApproval = false
      })
    },
    onReject (reason) {
      this.isProccessApproval = true

      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.deliveryNoteRequest()
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessApproval = false
      })
    },
    onCancellationApprove () {
      this.isProccessCancellationApproval = true

      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/sales/delivery-note')
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessCancellationApproval = false
      })
    },
    onCancellationReject (reason) {
      this.isProccessCancellationApproval = true

      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.deliveryNoteRequest()
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessCancellationApproval = false
      })
    },
    async onSendEmail (form) {
      this.isSendingEmail = true

      try {
        const params = {
          ...form,
          subject: 'Delivery Note Receipt',
          attachments: [
            {
              filename: 'Delivery Note Receipt ' + this.deliveryNote.form.number + '.pdf',
              type: 'pdf',
              view: 'sales.delivery-note.delivery-note-receipt',
              view_data: { deliveryNote: this.deliveryNote }
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
    }
  }
}
</script>
