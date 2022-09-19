<template>
  <div>
    <breadcrumb>
      <breadcrumb-purchase />
      <router-link
        to="/purchase/payment-order"
        class="breadcrumb-item"
      >
        {{ $t('payment order') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <purchase-menu />

    <p-show-form-approval-status
      :is-loading="isLoading"
      :approved-by="purchasePaymentOrder.form.request_approval_to.full_name"
      :cancellation-status="purchasePaymentOrder.form.cancellation_status"
      :approval-status="0"
      :approval-reason="purchasePaymentOrder.form.approval_reason"
      @onApprove="onApprove"
      @onReject="onReject"
    />

    <p-show-form-cancellation-status
      :is-loading="isLoading"
      :cancellation-status="purchasePaymentOrder.form.cancellation_status"
      :cancellation-approval-reason="purchasePaymentOrder.form.cancellation_approval_reason"
      :request-cancellation-reason="purchasePaymentOrder.form.request_cancellation_reason"
      @onCancellationApprove="onCancellationApprove"
      @onCancellationReject="onCancellationReject"
    />
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbPurchase from '@/views/purchase/Breadcrumb'
import PurchaseMenu from '../Menu'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbPurchase,
    PurchaseMenu
  },
  data () {
    return {
      id: this.$route.params.id,
      rows: [],
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('purchasePaymentOrder', ['purchasePaymentOrder'])
  },
  methods: {
    ...mapActions('purchasePaymentOrder', ['approve', 'reject']),
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        // this.addHistories({ id: response.data.id, activity: 'Approved' })
        //   .catch(error => {
        //     console.log(error.message)
        //   })
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    onReject (reason) {
      if (!reason) {
        this.$notification.error('reason cannot empty')
      }
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
      }).catch(error => {
        this.$notification.error(error.message)
      })
    },
    onCancellationApprove () {
      console.log('reject')
    },
    onCancellationReject () {
      console.log('reject')
    }
  }
}
</script>
