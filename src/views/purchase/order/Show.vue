<template>
  <div>
    <breadcrumb v-if="purchaseOrder">
      <breadcrumb-purchase />
      <router-link
        to="/purchase/order"
        class="breadcrumb-item"
      >
        {{ $t('purchase order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ purchaseOrder.form.number | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="purchaseOrder.form.request_approval_to.full_name"
      :cancellation-status="purchaseOrder.form.cancellation_status"
      :approval-status="purchaseOrder.form.approval_status"
      :approval-reason="purchaseOrder.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchaseOrder.form.cancellation_status"
      :cancellation-approval-reason="purchaseOrder.form.cancellation_approval_reason"
      :request-cancellation-reason="purchaseOrder.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="purchaseOrder"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'purchase.order.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'purchase.order.edit', params: { id: purchaseOrder.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="purchaseOrder.form.cancellation_status == null || purchaseOrder.form.cancellation_status == -1"
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
              <h4>{{ $t('purchase order') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ purchaseOrder.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ purchaseOrder.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="purchaseOrder.purchase_request">
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ purchaseOrder.purchase_request.form.number }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="purchaseOrder.form.branch">
                {{ purchaseOrder.form.branch.address | uppercase }} <br v-if="purchaseOrder.form.branch.address">
                {{ purchaseOrder.form.branch.phone | uppercase }} <br v-if="purchaseOrder.form.branch.phone">
              </template>
              <h6 class="mt-30 mb-0">
                {{ $t('to') | uppercase }}: {{ purchaseOrder.supplier_name | uppercase }}
              </h6>
              <div v-if="purchaseOrder.form.supplier_address">
                <i class="fa fa-home fa-fw" /> {{ purchaseOrder.form.supplier_address | uppercase }}
              </div>
              <div v-if="purchaseOrder.form.supplier_phone">
                <i class="fa fa-phone fa-fw" /> {{ purchaseOrder.form.supplier_phone | uppercase }}
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
              <th width="50px">
                <button
                  type="button"
                  class="btn btn-sm btn-outline-secondary"
                  @click="toggleMore()"
                >
                  <i class="fa fa-ellipsis-h" />
                </button>
              </th>
            </tr>
            <template v-for="(row, index) in purchaseOrder.items">
              <tr
                v-if="row.quantity !== 0"
                slot="p-body"
                :key="index"
              >
                <th class="text-center">
                  {{ index + 1 }}
                </th>
                <td>{{ row.item.label }}</td>
                <td class="text-right">
                  {{ row.quantity | numberFormat }} {{ row.unit }}
                </td>
                <td class="text-right">
                  {{ row.price | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.discount_value | numberFormat }}
                </td>
                <td class="text-right">
                  {{ row.quantity * (row.price - row.discount_value) | numberFormat }}
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                    @click="row.more = !row.more"
                  >
                    <i class="fa fa-ellipsis-h" />
                  </button>
                </td>
              </tr>
              <template v-if="row.more">
                <tr
                  slot="p-body"
                  :key="'ext-'+index"
                  class="bg-gray-light"
                >
                  <th class="bg-gray-light" />
                  <td colspan="6">
                    <p-form-row
                      :id="'allocation-' + index"
                      :name="'allocation-' + index"
                      class="mb-0"
                      :label="$t('allocation')"
                    >
                      <div
                        slot="body"
                        class="mt-5"
                      >
                        <template v-if="row.allocation">
                          {{ row.allocation.name }}
                        </template>
                      </div>
                    </p-form-row>
                  </td>
                </tr>
                <tr
                  slot="p-body"
                  :key="'ext2-'+index"
                  class="bg-gray-light"
                >
                  <th class="bg-gray-light" />
                  <td colspan="6">
                    <p-form-row
                      :id="'notes-' + index"
                      :name="'notes-' + index"
                      class="mb-0"
                      :label="$t('notes')"
                    >
                      <div
                        slot="body"
                        class="mt-5"
                      >
                        {{ row.notes }}
                      </div>
                    </p-form-row>
                  </td>
                </tr>
              </template>
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
                <b>{{ purchaseOrder.subtotal | numberFormat }}</b>
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
                <b>{{ purchaseOrder.discount_value | numberFormat }}</b>
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
                <b>{{ purchaseOrder.amount - purchaseOrder.tax | numberFormat }}</b>
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
                <b>{{ purchaseOrder.tax | numberFormat }}</b>
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
                <b>{{ purchaseOrder.amount | numberFormat }}</b>
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
                {{ purchaseOrder.form.notes }}
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
                {{ purchaseOrder.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ purchaseOrder.form.created_by.full_name | uppercase }}
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
                <template v-if="purchaseOrder.form.approval_at">
                  {{ purchaseOrder.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ purchaseOrder.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ purchaseOrder.form.request_approval_to.email | lowercase }}
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
  </div>
</template>

<script>
import PurchaseMenu from '../Menu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '../Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PurchaseMenu,
    Breadcrumb,
    BreadcrumbPurchase,
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
    ...mapGetters('purchaseOrder', ['purchaseOrder']),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseOrderRequest()
      }
    }
  },
  created () {
    this.purchaseOrderRequest()
  },
  methods: {
    ...mapActions('purchaseOrder', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    toggleMore () {
      const isMoreActive = this.purchaseOrder.items.some(function (el, index) {
        return el.more === false
      })
      this.purchaseOrder.items.forEach(element => {
        element.more = isMoreActive
      })
    },
    purchaseOrderRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'supplier;' +
            'items.item;' +
            'items.allocation;' +
            'purchaseRequest.form;' +
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
      this.purchaseOrder.items.forEach(function (element) {
        if (element.discount_percent > 0) {
          element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
        } else if (element.discount_value > 0) {
          element.total = element.quantity * (element.price - element.discount_value)
        } else {
          element.total = element.quantity * element.price
        }
        subtotal += parseFloat(element.total)
      })
      this.purchaseOrder.subtotal = subtotal
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
        this.purchaseOrderRequest()
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
        this.purchaseOrderRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.purchaseOrderRequest()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/purchase/order')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.purchaseOrderRequest()
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
