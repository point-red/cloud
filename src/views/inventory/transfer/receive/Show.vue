<template>
  <div>
    <breadcrumb v-if="inventoryReceiveItem">
      <breadcrumb-inventory />
      <breadcrumb-inventory-transfer />
      <router-link
        to="/inventory/transfer/receive"
        class="breadcrumb-item"
      >
        {{ $t('receive') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">
        <span v-if="inventoryReceiveItem.form.number">
          {{ inventoryReceiveItem.form.number | uppercase }}
        </span>
        <span v-if="inventoryReceiveItem.form.edited_number">
          {{ $t('archive') | uppercase }}
        </span>
      </span>
    </breadcrumb>

    <span v-if="inventoryReceiveItem.form.number">
      <p-show-form-approval-status-custom
        form-name="Transfer Item Receive"
        :is-loading="isLoading"
        :approved-by="inventoryReceiveItem.form.request_approval_to.full_name"
        :cancellation-status="inventoryReceiveItem.form.cancellation_status"
        :approval-status="inventoryReceiveItem.form.approval_status"
        :approval-reason="inventoryReceiveItem.form.approval_reason"
        @onApprove="onApprove"
        @onReject="onReject"
      />
      <p-show-form-cancellation-status-custom
        form-name="Transfer Item Receive"
        :is-loading="isLoading"
        :approved-by="inventoryReceiveItem.form.request_approval_to.full_name"
        :cancellation-status="inventoryReceiveItem.form.cancellation_status"
        :cancellation-approval-reason="inventoryReceiveItem.form.cancellation_approval_reason"
        :request-cancellation-reason="inventoryReceiveItem.form.request_cancellation_reason"
        @onCancellationApprove="onCancellationApprove"
        @onCancellationReject="onCancellationReject"
      />
    </span>

    <div
      v-if="inventoryReceiveItem"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="inventoryReceiveItem.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <span v-if="inventoryReceiveItem.form.number">
                <div class="text-right">
                  <button
                    class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                    title="Print receive item"
                    @click="() => $refs['print-receive-item'].open()"
                  >
                    <i class="si si-printer" />
                  </button>
                  <router-link
                    v-if="$permission.has('create transfer item')"
                    :to="{ name: 'inventory.transfer.receive.create' }"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('create') | uppercase }}
                  </router-link>
                  <router-link
                    v-if="$permission.has('update transfer item')"
                    :to="{ name: 'inventory.transfer.receive.edit', params: { id: inventoryReceiveItem.id }}"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('edit') | uppercase }}
                  </router-link>
                  <button
                    v-if="$permission.has('delete transfer item') && (inventoryReceiveItem.form.cancellation_status == null || inventoryReceiveItem.form.cancellation_status == -1)"
                    class="btn btn-sm btn-outline-secondary mr-5"
                    @click="$refs.formRequestDelete.open()"
                  >
                    {{ $t('delete') | uppercase }}
                  </button>
                </div>
              </span>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('transfer item') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ inventoryReceiveItem.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td v-if="inventoryReceiveItem.form.number">
                    {{ inventoryReceiveItem.form.number }}
                  </td>
                  <td v-if="inventoryReceiveItem.form.edited_number">
                    {{ inventoryReceiveItem.form.edited_number }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ inventoryReceiveItem.transfer_item.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('from warehouse') | uppercase }}
                  </td>
                  <td>{{ inventoryReceiveItem.from_warehouse.name }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="inventoryReceiveItem.form.branch">
                {{ inventoryReceiveItem.form.branch.address | uppercase }} <br v-if="inventoryReceiveItem.form.branch.address">
                {{ inventoryReceiveItem.form.branch.phone | uppercase }} <br v-if="inventoryReceiveItem.form.branch.phone">
              </template>
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
                Stock Warehouse
              </th>
              <th class="text-right">
                Quantity Receive
              </th>
              <th class="text-right">
                Balances
              </th>
              <th class="text-right">
                Notes
              </th>
            </tr>
            <template v-for="(row, index) in inventoryReceiveItem.items">
              <tr
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>
                  {{ row.item.label }}
                  <template v-if="row.production_number">
                    (PID: {{ row.production_number }})
                  </template>
                  <template v-if="row.item.require_expiry_date">
                    (E/D: {{ row.expiry_date | dateFormat('DD MMMM YYYY') }})
                  </template>
                </td>
                <td class="text-right">
                  {{ row.stock | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.balance | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.notes }}
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
                {{ inventoryReceiveItem.form.notes }}
              </div>
              <div class="d-sm-block d-md-none mt-10" />
            </div>
            <div class="col-sm-6 text-center">
              <h6 class="mb-0">
                {{ $t('created by') | uppercase }}
              </h6>
              <div
                class="mb-50"
                style="font-size:11px"
              >
                {{ inventoryReceiveItem.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ inventoryReceiveItem.form.created_by.full_name | uppercase }}
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
    <m-form-approval-reject
      ref="formApprovalReject"
      @reject="onReject($event)"
    />
    <m-form-cancellation-reject
      ref="formCancellationReject"
      @reject="onCancellationReject($event)"
    />
    <print-receive-item
      ref="print-receive-item"
      :receiveitem="inventoryReceiveItem"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import BreadcrumbInventoryTransfer from '@/views/inventory/transfer/Breadcrumb'
import PointTable from 'point-table-vue'
import PrintReceiveItem from './PrintReceiveItem'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    BreadcrumbInventoryTransfer,
    PointTable,
    PrintReceiveItem
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      lines: []
    }
  },
  computed: {
    ...mapGetters('inventoryReceiveItem', ['inventoryReceiveItem']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.findInventoryReceiveItem()
      }
    }
  },
  created () {
    this.findInventoryReceiveItem()
  },
  methods: {
    ...mapActions('inventoryReceiveItem', [
      'find', 'delete', 'approve', 'reject', 'addHistories',
      'cancellationApprove', 'cancellationReject', 'sendEmail'
    ]),
    findInventoryReceiveItem () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'from_warehouse;' +
            'warehouse;' +
            'items.item;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch;' +
            'transfer_item.form;' +
            'transfer_item.items;'
        }
      }).then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    toggleMore () {
      const isMoreActive = this.inventoryReceiveItem.items.some(function (el, index) {
        return el.more === false
      })
      this.inventoryReceiveItem.items.forEach(element => {
        element.more = isMoreActive
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
        this.findInventoryReceiveItem()
        this.addHistories({ id: this.id, activity: 'Deleted' })
          .catch(error => {
            console.log(error.message)
          })
        this.sendEmail({ id: this.id, form_send_done: 0, crud_type: 'delete' })
          .then(response => {
            console.log(response)
          }).catch(error => {
            this.isLoading = false
            this.$notification.error(error.message)
          })
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    },
    onApprove () {
      let formSendDone = 1
      this.inventoryReceiveItem.items.forEach(itemReceive => {
        this.inventoryReceiveItem.transfer_item.items.forEach(itemTransfer => {
          if (itemReceive.item_id == itemTransfer.item_id && itemReceive.production_number == itemTransfer.production_number && itemReceive.expiry_date == itemTransfer.expiry_date) {
            if (itemReceive.quantity < itemTransfer.quantity) {
              formSendDone = 0
            }
          }
        })
      })
      this.approve({
        id: this.id,
        form_send_done: formSendDone
      }).then(response => {
        this.$notification.success('approve success')
        this.findInventoryReceiveItem()
        this.addHistories({ id: response.data.id, activity: 'Approved' })
          .catch(error => {
            console.log(error.message)
          })
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.findInventoryReceiveItem()
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
        this.$router.push('/inventory/transfer/receive/')
        this.addHistories({ id: response.data.id, activity: 'Cancelation Approved' })
          .catch(error => {
            console.log(error.message)
          })
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.findInventoryReceiveItem()
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
