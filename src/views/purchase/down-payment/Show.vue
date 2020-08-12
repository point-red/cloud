<template>
  <div>
    <breadcrumb v-if="downPayment">
      <breadcrumb-purchase />
      <router-link
        to="/purchase/down-payment"
        class="breadcrumb-item"
      >
        {{ $t('down payment') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ downPayment.form.number | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="downPayment.form.request_approval_to.full_name"
      :cancellation-status="downPayment.form.cancellation_status"
      :approval-status="downPayment.form.approval_status"
      :approval-reason="downPayment.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="downPayment.form.cancellation_status"
      :cancellation-approval-reason="downPayment.form.cancellation_approval_reason"
      :request-cancellation-reason="downPayment.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />

    <div
      v-if="downPayment"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link
                  :to="{ name: 'purchase.down-payment.create' }"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link
                  :to="{ name: 'purchase.down-payment.edit', params: { id: downPayment.id }}"
                  class="btn btn-sm btn-outline-secondary mr-5"
                >
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="downPayment.form.cancellation_status == null || downPayment.form.cancellation_status == -1"
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
              <h4>{{ $t('down payment') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    width="150px"
                    class="font-weight-bold"
                  >
                    {{ $t('form number') | uppercase }}
                  </td>
                  <td>{{ downPayment.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('date') | uppercase }}
                  </td>
                  <td>{{ downPayment.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="downPayment.downpaymentable">
                  <td class="font-weight-bold">
                    {{ $t('reference') | uppercase }}
                  </td>
                  <td>{{ downPayment.downpaymentable.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('amount') | uppercase }}
                  </td>
                  <td>{{ downPayment.amount | numberFormat }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-0">
                {{ authUser.tenant_name | uppercase }}
              </h6>
              <template v-if="downPayment.form.branch">
                {{ downPayment.form.branch.address | uppercase }} <br v-if="downPayment.form.branch.address">
                {{ downPayment.form.branch.phone | uppercase }} <br v-if="downPayment.form.branch.phone">
              </template>
              <h6 class="mt-30 mb-0">
                {{ $t('to') | uppercase }}: {{ downPayment.supplier_name | uppercase }}
              </h6>
              <div v-if="downPayment.supplier_address">
                <i class="fa fa-home fa-fw" /> {{ downPayment.supplier_address | uppercase }}
              </div>
              <div v-if="downPayment.supplier_phone">
                <i class="fa fa-phone fa-fw" /> {{ downPayment.supplier_phone | uppercase }}
              </div>
            </div>
          </div>

          <hr>

          <div class="row">
            <div class="col-sm-12">
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
                  <th width="50px" />
                </tr>
                <template v-for="(row, index) in downPayment.downpaymentable.items">
                  <tr
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
                    <td />
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
                    <b>{{ downPayment.downpaymentable.subtotal | numberFormat }}</b>
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
                    <b>{{ downPayment.downpaymentable.discount_value | numberFormat }}</b>
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
                    <b>{{ downPayment.downpaymentable.amount - downPayment.downpaymentable.tax | numberFormat }}</b>
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
                    <b>{{ downPayment.downpaymentable.tax | numberFormat }}</b>
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
                    <b>{{ downPayment.downpaymentable.amount | numberFormat }}</b>
                  </td>
                  <td />
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
                {{ downPayment.form.notes }}
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
                {{ downPayment.form.date | dateFormat('DD MMMM YYYY') }}
              </div>
              {{ downPayment.form.created_by.full_name | uppercase }}
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
                <template v-if="downPayment.form.approval_at">
                  {{ downPayment.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ downPayment.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">
                {{ downPayment.form.request_approval_to.email | lowercase }}
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
    ...mapGetters('purchaseDownPayment', { downPayment: 'downPayment' }),
    ...mapGetters('auth', ['authUser'])
  },
  watch: {
    '$route' (to, from) {
      if (to.params.id != from.params.id) {
        this.id = to.params.id
        this.purchaseDownPaymentRequest()
      }
    }
  },
  created () {
    this.purchaseDownPaymentRequest()
  },
  methods: {
    ...mapActions('purchaseDownPayment', {
      find: 'find',
      delete: 'delete',
      approve: 'approve',
      reject: 'reject',
      cancellationApprove: 'cancellationApprove',
      cancellationReject: 'cancellationReject'
    }),
    purchaseDownPaymentRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          with_archives: true,
          with_origin: true,
          includes: 'supplier;' +
            'downpaymentable.form;' +
            'downpaymentable.items.item;' +
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        var subtotal = 0
        this.downPayment.downpaymentable.items.forEach(function (element) {
          if (element.discount_percent > 0) {
            element.total = element.quantity * (element.price - (element.price * element.discount_percent / 100))
          } else if (element.discount_value > 0) {
            element.total = element.quantity * (element.price - element.discount_value)
          } else {
            element.total = element.quantity * element.price
          }
          subtotal += parseFloat(element.total)
        })
        this.downPayment.downpaymentable.subtotal = subtotal
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
        this.purchaseDownPaymentRequest()
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
        this.purchaseDownPaymentRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.purchaseDownPaymentRequest()
      })
    },
    onCancellationApprove () {
      this.cancellationApprove({
        id: this.id
      }).then(response => {
        this.$notification.success('cancellation approved')
        this.$router.push('/purchase/down-payment')
      })
    },
    onCancellationReject (reason) {
      this.cancellationReject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('cancellation rejected')
        this.purchaseDownPaymentRequest()
      }).catch(error => {
        console.log(error.message)
      })
    }
  }
}
</script>
