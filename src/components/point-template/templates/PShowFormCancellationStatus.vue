<template>
  <div>
    <div
      v-if="cancellationStatus == -1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('cancellation request rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ cancellationApprovalReason }}</pre>
        </div>
      </div>
    </div>
    <div
      v-if="closeStatus == null && cancellationStatus == 1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('canceled') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ requestCancellationReason }}</pre>
        </div>
      </div>
    </div>
    <div
      v-if="closeStatus == null && cancellationStatus == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending cancellation warning', { form: form, approvedBy: approvedBy }) | uppercase }}
        </p>
        <p
          class="mb-0"
          style="font-size: 10px"
        >
          <b>{{ $t('reason') | uppercase }}</b> : <pre>{{ requestCancellationReason | uppercase }}</pre>
        </p>
        <hr>
        <div v-if="$permission.has('approve ' + form)">
          <button
            type="button"
            class="btn btn-sm btn-primary mr-5"
            :disabled="isProccessApproval || isProccessApprove"
            @click="onCancellationApprove"
          >
            <i
              v-show="isProccessApprove"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('approve') | uppercase }}
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            :disabled="isProccessApproval || isProccessReject"
            @click="$refs.formCancellationReject.open()"
          >
            <i
              v-show="isProccessReject"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('reject') | uppercase }}
          </button>
        </div>
      </div>
    </div>
    <m-form-cancellation-reject
      ref="formCancellationReject"
      @reject="onCancellationReject($event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    closeStatus: {
      type: Number,
      default: null
    },
    cancellationStatus: {
      type: Number,
      default: null
    },
    cancellationApprovalReason: {
      type: String,
      default: ''
    },
    requestCancellationReason: {
      type: String,
      default: ''
    },
    approvedBy: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isProccessApproval: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: 'purchase request'
    }
  },
  data () {
    return {
      isProccessApprove: false,
      isProccessReject: false
    }
  },
  watch: {
    isProccessApproval (newValue) {
      if (!newValue) {
        this.isProccessApprove = false
        this.isProccessReject = false
      }
    }
  },
  methods: {
    onCancellationApprove (event) {
      this.isProccessApprove = true
      this.$emit('onCancellationApprove', event)
    },
    onCancellationReject (event) {
      this.isProccessReject = true
      this.$emit('onCancellationReject', event)
    }
  }
}
</script>
