<template>
  <div>
    <breadcrumb v-if="inventoryTransferItem">
      <breadcrumb-inventory />
      <breadcrumb-inventory-transfer />
      <router-link
        to="/inventory/transfer/send"
        class="breadcrumb-item"
      >
        {{ $t('send') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">
        <span v-if="inventoryTransferItem.form.number">
          {{ inventoryTransferItem.form.number | uppercase }}
        </span>
        <span v-if="inventoryTransferItem.form.edited_number">
          {{ $t('archive') | uppercase }}
        </span>
      </span>
    </breadcrumb>

    <span v-if="inventoryTransferItem.form.number">
      <p-show-form-approval-status-custom
        form-name="Transfer Item Send"
        :is-loading="isLoading"
        :approved-by="inventoryTransferItem.form.request_approval_to.full_name"
        :cancellation-status="inventoryTransferItem.form.cancellation_status"
        :approval-status="inventoryTransferItem.form.approval_status"
        :approval-reason="inventoryTransferItem.form.approval_reason"
        @onApprove="onApprove"
        @onReject="onReject"
      />
      <p-show-form-cancellation-status-custom
        form-name="Transfer Item Send"
        :is-loading="isLoading"
        :approved-by="inventoryTransferItem.form.request_approval_to.full_name"
        :cancellation-status="inventoryTransferItem.form.cancellation_status"
        :cancellation-approval-reason="inventoryTransferItem.form.cancellation_approval_reason"
        :request-cancellation-reason="inventoryTransferItem.form.request_cancellation_reason"
        @onCancellationApprove="onCancellationApprove"
        @onCancellationReject="onCancellationReject"
      />
      <p-show-form-close-status
        form-name="Transfer Item Send"
        :is-loading="isLoading"
        :approved-by="inventoryTransferItem.form.request_approval_to.full_name"
        :close-status="inventoryTransferItem.form.close_status"
        :close-approval-reason="inventoryTransferItem.form.close_approval_reason"
        :request-close-reason="inventoryTransferItem.form.request_close_reason"
        @onCloseApprove="onCloseApprove"
        @onCloseReject="onCloseReject"
      />
    </span>

    <div
      v-if="inventoryTransferItem"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <h3 v-if="inventoryTransferItem.form.edited_number">
                {{ $t('archive') | uppercase }}
              </h3>
              <span v-if="inventoryTransferItem.form.number">
                <div class="text-right">
                  <button
                    class="mr-3 btn btn-sm btn-outline-secondary mr-5"
                    title="Print transfer item"
                    @click="() => $refs['print-transfer-item'].open()"
                  >
                    <i class="si si-printer" />
                  </button>
                  <router-link
                    v-if="$permission.has('create transfer item')"
                    :to="{ name: 'inventory.transfer.send.create' }"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('create') | uppercase }}
                  </router-link>
                  <router-link
                    v-if="$permission.has('update transfer item')"
                    :to="{ name: 'inventory.transfer.send.edit', params: { id: inventoryTransferItem.id }}"
                    class="btn btn-sm btn-outline-secondary mr-5"
                  >
                    {{ $t('edit') | uppercase }}
                  </router-link>
                  <button
                    v-if="$permission.has('delete transfer item') && (inventoryTransferItem.form.cancellation_status == null || inventoryTransferItem.form.cancellation_status == -1)"
                    class="btn btn-sm btn-outline-secondary mr-5"
                    @click="$refs.formRequestDelete.open()"
                  >
                    {{ $t('delete') | uppercase }}
                  </button>
                  <button
                    v-if="inventoryTransferItem.receive_item != null && inventoryTransferItem.form.done == 0 && (inventoryTransferItem.form.close_status == null || inventoryTransferItem.form.close_status == -1)"
                    class="btn btn-sm btn-outline-secondary mr-5"
                    @click="$refs.formRequestClose.open()"
                  >
                    {{ $t('close form') | uppercase }}
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
                  <td>{{ inventoryTransferItem.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td v-if="inventoryTransferItem.form.number">
                    {{ inventoryTransferItem.form.number }}
                  </td>
                  <td v-if="inventoryTransferItem.form.edited_number">
                    {{ inventoryTransferItem.form.edited_number }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('from warehouse') | uppercase }}
                  </td>
                  <td>{{ inventoryTransferItem.warehouse.name }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('to warehouse') | uppercase }}
                  </td>
                  <td>{{ inventoryTransferItem.to_warehouse.name }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('driver') | uppercase }}
                  </td>
                  <td>{{ inventoryTransferItem.driver }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="inventoryTransferItem.form.branch">
                {{ inventoryTransferItem.form.branch.address | uppercase }} <br v-if="inventoryTransferItem.form.branch.address">
                {{ inventoryTransferItem.form.branch.phone | uppercase }} <br v-if="inventoryTransferItem.form.branch.phone">
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
                Quantity Send
              </th>
              <th class="text-right">
                Balances
              </th>
              <th class="text-right">
                Quantity Receive
              </th>
              <th class="text-right">
                Notes
              </th>
            </tr>
            <template v-for="(row, index) in inventoryTransferItem.items">
              <tr
                v-if="row.quantity !== 0"
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
                  <span v-if="inventoryTransferItem.receive_item != null">
                    <template v-if="inventoryTransferItem.receive_item.form.approval_status == 1">
                      <template v-for="(inventoryReceiveItemItem) in inventoryTransferItem.receive_item.items">
                        <template v-if="row.item_id == inventoryReceiveItemItem.item_id && row.production_number == inventoryReceiveItemItem.production_number && row.expiry_date == inventoryReceiveItemItem.expiry_date">
                          {{ inventoryReceiveItemItem.quantity | numberFormat }} {{ inventoryReceiveItemItem.unit }}
                        </template>
                      </template>
                    </template>
                    <template v-else>
                      {{ 0 | numberFormat }} {{ row.unit }}
                    </template>
                  </span>
                  <span v-else>
                    {{ 0 | numberFormat }} {{ row.unit }}
                  </span>
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
                {{ inventoryTransferItem.form.notes }}
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
                {{ inventoryTransferItem.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ inventoryTransferItem.form.created_by.full_name | uppercase }}
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
                <template v-if="inventoryTransferItem.form.approval_at">
                  {{ inventoryTransferItem.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ inventoryTransferItem.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ inventoryTransferItem.form.request_approval_to.email | lowercase }}
              </div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
    <m-form-request-close
      ref="formRequestClose"
      @close-form="onCloseForm($event)"
    />
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
    <print-transfer-item
      ref="print-transfer-item"
      :transferitem="inventoryTransferItem"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbInventory from '@/views/inventory/Breadcrumb'
import BreadcrumbInventoryTransfer from '@/views/inventory/transfer/Breadcrumb'
import PointTable from 'point-table-vue'
import PrintTransferItem from './PrintTransferItem'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbInventory,
    BreadcrumbInventoryTransfer,
    PointTable,
    PrintTransferItem
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
    ...mapGetters('inventoryTransferItem', ['inventoryTransferItem']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.inventoryTransferItemRequest()
      }
    }
  },
  created () {
    this.inventoryTransferItemRequest()
  },
  methods: {
    ...mapActions('inventoryTransferItem', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      close: 'close',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject',
      closeApprove: 'closeApprove',
      addHistories: 'addHistories'
    }),
    toggleMore () {
      const isMoreActive = this.inventoryTransferItem.items.some(function (el, index) {
        return el.more === false
      })
      this.inventoryTransferItem.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    inventoryTransferItemRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'warehouse;' +
            'to_warehouse;' +
            'items.item;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch;' +
            'receiveItem;receiveItem.form;receiveItem.items;'
        }
      }).then(response => {
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
        this.inventoryTransferItemRequest()
        this.addHistories({ id: this.id, activity: 'Deleted' })
          .catch(error => {
            console.log(error.message)
          })
      }).catch(error => {
        this.isDeleting = false
        this.$notification.error(error.message)
        this.form.errors.record(error.errors)
      })
    },
    onCloseForm (reason) {
      this.close({
        id: this.id,
        data: {
          reason: reason
        }
      }).then(response => {
        this.isDeleting = false
        this.$notification.success('close form success')
        this.inventoryTransferItemRequest()
        this.addHistories({ id: this.id, activity: 'Close Form' })
          .catch(error => {
            console.log(error.message)
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
        this.inventoryTransferItemRequest()
        this.addHistories({ id: response.data.id, activity: 'Approved' })
          .catch(error => {
            console.log(error.message)
          })
      }).catch(error => {
        this.$notification.error(error.message + ', please edit the document')
        console.log(error.message)
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.inventoryTransferItemRequest()
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
        this.$router.push('/inventory/transfer/send/')
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
        this.inventoryTransferItemRequest()
        this.addHistories({ id: response.data.id, activity: 'Cancelation Rejected' })
          .catch(error => {
            console.log(error.message)
          })
      }).catch(error => {
        console.log(error.message)
      })
    },
    onCloseApprove () {
      const items = []
      this.inventoryTransferItem.items.forEach(itemTransfer => {
        this.inventoryTransferItem.receive_item.items.forEach(itemReceive => {
          if (itemReceive.item_id == itemTransfer.item_id && itemReceive.production_number == itemTransfer.production_number && itemReceive.expiry_date == itemTransfer.expiry_date) {
            if (itemReceive.quantity < itemTransfer.quantity) {
              items.push({
                item_id: itemTransfer.item_id,
                difference: itemTransfer.quantity - itemReceive.quantity
              })
            }
          }
        })
      })
      this.closeApprove({
        id: this.id,
        items: items
      }).then(response => {
        this.$notification.success('close form approved')
        this.inventoryTransferItemRequest()
        this.addHistories({ id: response.data.id, activity: 'Close Form Approved' })
          .catch(error => {
            console.log(error.message)
          })
      })
    }
  }
}
</script>
