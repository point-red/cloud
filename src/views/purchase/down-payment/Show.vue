<template>
  <div>
    <breadcrumb v-if="purchaseDownPayment">
      <breadcrumb-purchase/>
      <router-link to="/purchase/down-payment" class="breadcrumb-item">{{ $t('down payment') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ purchaseDownPayment.form.number | uppercase }}</span>
    </breadcrumb>

    <purchase-menu/>

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="purchaseDownPayment.form.request_approval_to.full_name"
      :cancellation-status="purchaseDownPayment.form.cancellation_status"
      :approval-status="purchaseDownPayment.form.approval_status"
      :approval-reason="purchaseDownPayment.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"/>

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchaseDownPayment.form.cancellation_status"
      :cancellation-approval-reason="purchaseDownPayment.form.cancellation_approval_reason"
      :request-cancellation-reason="purchaseDownPayment.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"/>

    <div class="row" v-if="purchaseDownPayment">
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-12">
              <div class="text-right">
                <router-link :to="{ name: 'purchase.down-payment.create' }" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('create') | uppercase }}
                </router-link>
                <router-link :to="{ name: 'purchase.down-payment.edit', params: { id: purchaseDownPayment.id }}" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="purchaseDownPayment.form.cancellation_status == null || purchaseDownPayment.form.cancellation_status == -1"
                  @click="$refs.formRequestDelete.open()" class="btn btn-sm btn-outline-secondary mr-5">
                  {{ $t('delete') | uppercase }}
                </button>
                <m-form-request-delete ref="formRequestDelete" @delete="onDelete($event)"></m-form-request-delete>
              </div>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="col-sm-6">
              <h4>{{ $t('down payment') | uppercase }}</h4>
              <table class="table table-sm table-bordered">
                <tr>
                  <td width="150px" class="font-weight-bold">{{ $t('form number') | uppercase }}</td>
                  <td>{{ purchaseDownPayment.form.number }}</td>
                </tr>
                <tr>
                  <td class="font-weight-bold">{{ $t('date') | uppercase }}</td>
                  <td>{{ purchaseDownPayment.date | dateFormat('DD MMMM YYYY') }}</td>
                </tr>
                <tr v-if="purchaseDownPayment.purchase_request">
                  <td class="font-weight-bold">{{ $t('reference') | uppercase }}</td>
                  <td>{{ purchaseDownPayment.purchase_request.form.number }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-6 text-right">
              <h6 class="mb-5">{{ authUser.tenant_name | uppercase }}</h6>
              <template v-if="purchaseDownPayment.form.branch">
                {{ purchaseDownPayment.form.branch.address | uppercase }}
                <br v-if="purchaseDownPayment.form.branch.phone">{{ purchaseDownPayment.form.branch.phone | uppercase }}
              </template>
              <h6 class="mt-30 mb-5">{{ $t('supplier') | uppercase }}</h6>
              {{ purchaseDownPayment.supplier_name | uppercase }}
              <div style="font-size:12px">
                {{ purchaseDownPayment.supplier_address | uppercase }}
                <br v-if="purchaseDownPayment.supplier_phone">{{ purchaseDownPayment.supplier_phone }}
                <br v-if="purchaseDownPayment.supplier_email">{{ purchaseDownPayment.supplier_email | uppercase }}
              </div>
            </div>
          </div>
          <hr>

          <div class="row mt-50">
            <div class="col-sm-6">
              <h6 class="mb-0">{{ $t('notes') | uppercase }}</h6>
              <div style="white-space: pre-wrap;">{{ purchaseDownPayment.form.notes }}</div>
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('requested by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">{{ purchaseDownPayment.form.date | dateFormat('DD MMMM YYYY') }}</div>
              {{ purchaseDownPayment.form.created_by.full_name | uppercase }}
              <div class="d-sm-block d-md-none mt-10"></div>
            </div>
            <div class="col-sm-3 text-center">
              <h6 class="mb-0">{{ $t('approved by') | uppercase }}</h6>
              <div class="mb-50" style="font-size:11px">
                <template v-if="purchaseDownPayment.form.approval_at">
                  {{ purchaseDownPayment.form.approval_at | dateFormat('DD MMMM YYYY') }}
                </template>
                <template v-else>
                  _______________
                </template>
              </div>
              {{ purchaseDownPayment.form.request_approval_to.full_name | uppercase }}
              <div style="font-size:11px">{{ purchaseDownPayment.form.request_approval_to.email | lowercase }}</div>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>

    <m-form-request-delete ref="formRequestDelete" @delete="onDelete($event)"></m-form-request-delete>
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
    ...mapGetters('purchaseDownPayment', { purchaseDownPayment: 'downPayment' }),
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
            'form.createdBy;' +
            'form.requestApprovalTo;' +
            'form.branch'
        }
      }).then(response => {
        //
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
  },
  created () {
    this.purchaseDownPaymentRequest()
  }
}
</script>
