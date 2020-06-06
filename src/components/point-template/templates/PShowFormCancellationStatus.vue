<template>
  <div>
    <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="cancellationStatus == -1 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('cancellation request rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;"><b>{{ $t('reason') | uppercase }}:</b> <pre>{{ cancellationApprovalReason }}</pre></div>
      </div>
    </div>
    <div class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="cancellationStatus == 1 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i> {{ $t('canceled') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;"><b>{{ $t('reason') | uppercase }}:</b> <pre>{{ requestCancellationReason }}</pre></div>
      </div>
    </div>
    <div class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
      v-if="cancellationStatus == 0 && isLoading == false">
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle"></i>
          {{ $t('pending cancellation warning', { form: 'purchase requisition', approvedBy: approvedBy }) | uppercase }}
        </p>
        <p class="mb-0" style="font-size: 10px">
          <b>{{ $t('reason') | uppercase }}</b> : <pre>{{ requestCancellationReason | uppercase }}</pre>
        </p>
        <hr>
        <div v-if="$permission.has('approve purchase request')">
          <button type="button" @click="onCancellationApprove" class="btn btn-sm btn-primary mr-5">{{ $t('approve') | uppercase }}</button>
          <button type="button" @click="$refs.formCancellationReject.open()" class="btn btn-sm btn-danger">{{ $t('reject') | uppercase }}</button>
        </div>
      </div>
    </div>
    <m-form-cancellation-reject ref="formCancellationReject" @reject="onCancellationReject($event)"></m-form-cancellation-reject>
  </div>
</template>

<script>
export default {
  props: {
    cancellationStatus: {
      default: null
    },
    cancellationApprovalReason: {
      default: ''
    },
    requestCancellationReason: {
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
    onCancellationApprove (event) {
      this.$emit('onCancellationApprove', event)
    },
    onCancellationReject (event) {
      this.$emit('onCancellationReject', event)
    }
  }
}
</script>
