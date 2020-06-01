<template>
  <div>
    <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="approvalStatus == -1 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('approval rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;"><b>{{ $t('reason') | uppercase }}:</b> <pre>{{ approvalReason }}</pre></div>
      </div>
    </div>
    <div class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="cancellationStatus == null && approvalStatus == 0 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
          {{ $t('pending approval warning', { form: 'purchase request', approvedBy: approvedBy }) | uppercase }}
        </p>
        <hr>
        <div v-if="$permission.has('approve purchase request')">
          <button type="button" @click="onApprove" class="btn btn-sm btn-primary mr-5">{{ $t('approve') | uppercase }}</button>
          <button type="button" @click="$refs.formApprovalReject.open()" class="btn btn-sm btn-danger">{{ $t('reject') | uppercase }}</button>
        </div>
      </div>
    </div>
    <m-form-approval-reject ref="formApprovalReject" @reject="onReject($event)"></m-form-approval-reject>
  </div>
</template>

<script>
export default {
  props: {
    cancellationStatus: {
      default: null
    },
    approvalStatus: {
      default: null
    },
    approvalReason: {
      default: ''
    },
    approvedBy: {
      default: ''
    },
    isLoading: {
      default: false
    }
  },
  methods: {
    onApprove (event) {
      this.$emit('onApprove', event)
    },
    onReject (event) {
      this.$emit('onReject', event)
    }
  }
}
</script>
