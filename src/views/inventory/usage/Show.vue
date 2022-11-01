<template>
  <div>
    <breadcrumb v-if="inventoryUsage">
      <breadcrumb-inventory />
      <router-link
        to="/inventory/usage"
        class="breadcrumb-item"
      >
        {{ $t('inventory usage') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ inventoryUsage.form.number | uppercase }}</span>
    </breadcrumb>

    <div v-if="inventoryUsage.form.number">
      <p-show-form-approval-status
        form="inventory usage"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessApproval"
        :approval-status="inventoryUsage.form.approval_status"
        :approval-reason="inventoryUsage.form.approval_reason"
        :approved-by="inventoryUsage.form.request_approval_to.full_name"
        :cancellation-status="inventoryUsage.form.cancellation_status"
        :close-status="inventoryUsage.form.close_status"
        @onApprove="onApprove"
        @onReject="onReject"
      />

      <p-show-form-cancellation-status
        form="inventory usage"
        :is-loading="isLoading"
        :is-proccess-approval="isProccessCancellationApproval"
        :approved-by="inventoryUsage.form.request_approval_to.full_name"
        :cancellation-status="inventoryUsage.form.cancellation_status"
        :close-status="inventoryUsage.form.close_status"
        :cancellation-approval-reason="inventoryUsage.form.cancellation_approval_reason"
        :request-cancellation-reason="inventoryUsage.form.request_cancellation_reason"
        @onCancellationApprove="onCancellationApprove"
        @onCancellationReject="onCancellationReject"
      />
    </div>

    <div
      v-if="inventoryUsage"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="inventoryUsage.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <div
                v-if="inventoryUsage.form.number"
                class="text-right"
              >
                <button
                  class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                  title="Send Receipt Inventory Usage"
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
                  title="Preview Receipt Inventory Usage"
                  @click="() => $refs.printPreview.open()"
                >
                  <i class="si si-printer" />
                </button>
                <router-link
                  :to="{ name: 'inventory.usage.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  v-if="actions.edit"
                  :to="{ name: 'inventory.usage.edit', params: { id: inventoryUsage.id }}"
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
              <hr>
              <div class="row">
                <div class="col-sm-6">
                  <h4>{{ $t('inventory usage') | uppercase }}</h4>
                  <table class="table table-sm table-bordered">
                    <tr>
                      <td class="font-weight-bold">
                        {{ $t('date') | uppercase }}
                      </td>
                      <td>{{ inventoryUsage.date | dateFormat('DD MMMM YYYY') }}</td>
                    </tr>
                    <tr>
                      <td
                        width="150px"
                        class="font-weight-bold"
                      >
                        {{ $t('form number') | uppercase }}
                      </td>
                      <td>{{ inventoryUsage.form.number || inventoryUsage.form.edited_number }}</td>
                    </tr>
                    <tr v-if="inventoryUsage">
                      <td class="font-weight-bold">
                        {{ $t('warehouse') | uppercase }}
                      </td>
                      <td>{{ inventoryUsage.warehouse.name }}</td>
                    </tr>
                  </table>
                </div>
                <div class="col-sm-6 text-right">
                  <h6 class="mb-5">
                    {{ authUser.tenant_name | uppercase }}
                  </h6>
                  <template v-if="inventoryUsage.form.branch">
                    {{ inventoryUsage.form.branch.address | uppercase }}
                    <br v-if="inventoryUsage.form.branch.phone">{{ inventoryUsage.form.branch.phone | uppercase }}
                  </template>
                  <h6 class="mt-30 mb-5">
                    {{ $t('employee') | uppercase }}
                  </h6>
                  {{ inventoryUsage.employee.name | uppercase }}
                </div>
              </div>
            </div>
          </div>
          <hr>
          <point-table class="mt-20">
            <tr slot="p-head">
              <th>Item</th>
              <th>Account</th>
              <th>Quantity</th>
              <th>Notes</th>
              <th>Allocation</th>
            </tr>
            <template v-for="(row, index) in inventoryUsage.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <td>
                  {{ row.item.label }}
                  <template v-if="row.item.require_production_number">
                    (PID: {{ row.production_number }})
                  </template>
                  <template v-if="row.item.require_expiry_date">
                    (E/D: {{ row.expiry_date | dateFormat('DD MMMM YYYY') }})
                  </template>
                </td>
                <td>{{ row.account.label }}</td>
                <td>
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td>{{ row.notes }}</td>
                <td>
                  <template v-if="row.allocation">
                    {{ row.allocation.name }}
                  </template>
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
                {{ inventoryUsage.form.notes }}
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
                {{ inventoryUsage.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ inventoryUsage.form.created_by.full_name | uppercase }}
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
                <template v-if="inventoryUsage.form.request_approval_at">
                  {{ inventoryUsage.form.request_approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ inventoryUsage.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ inventoryUsage.form.request_approval_to.email | lowercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
    <m-form-send-email
      ref="formSendEmail"
      @submit="onSendEmail($event)"
    />
    <m-print-preview
      ref="printPreview"
      :inventory-usage="inventoryUsage"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '../Breadcrumb'
import MPrintPreview from './MPrintPreview'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    MPrintPreview,
    PointTable
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isProccessApproval: false,
      isProccessCancellationApproval: false,
      isProccessCloseApproval: false,
      isDeleting: false,
      isSendingEmail: false
    }
  },
  computed: {
    ...mapGetters('inventoryUsage', ['inventoryUsage']),
    ...mapGetters('auth', ['authUser']),
    actions () {
      const { form } = this.inventoryUsage

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
        this.id = to.params.id
        this.findInventoryUsage()
      }
    }
  },
  created () {
    this.findInventoryUsage()
  },
  methods: {
    ...mapActions('inventoryUsage', ['find', 'delete', 'approve', 'reject']),
    findInventoryUsage () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'warehouse;' +
            'items.account;' +
            'items.item;' +
            'items.allocation;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.requestCancellationTo;' +
            'employee'
        }
      }).then(response => {
        this.isLoading = false
        this.inventoryUsage.items.forEach((element, index) => {
          this.$set(this.inventoryUsage.items[index], 'more', false)
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    toggleMore () {
      const isMoreActive = this.inventoryUsage.items.some(function (el, index) {
        return el.more === false
      })
      this.inventoryUsage.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    async onSendEmail (form) {
      this.isSendingEmail = true

      try {
        const params = {
          ...form,
          subject: 'Inventory Usage Receipt',
          attachments: [
            {
              filename: 'Inventory Usage Receipt ' + this.inventoryUsage.form.number + '.pdf',
              type: 'pdf',
              view: 'inventory.inventory-usage.inventory-usage-receipt',
              view_data: { inventoryUsage: this.inventoryUsage }
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
    onDelete () {
      this.isDeleting = true
      this.delete({
        id: this.id
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('cancel success')
        this.$router.push('/inventory/usage')
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.inventoryUsage.errors.record(error.errors)
      })
    },
    onApprove () {
      this.isProccessApproval = true

      this.approve({ id: this.$route.params.id })
        .then(response => {
          this.$notification.success('approve success')
          this.findInventoryUsage()
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
        this.findInventoryUsage()
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
        this.$router.push('/inventory/usage')
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
        this.findInventoryUsage()
      }).catch(error => {
        this.$notification.error(error?.message)
      }).finally(() => {
        this.isProccessCancellationApproval = false
      })
    }
  }
}
</script>
