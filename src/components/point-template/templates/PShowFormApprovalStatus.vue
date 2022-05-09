<template>
  <div>
    <div
      v-if="approvalStatus == -1 && isLoading == false"
      class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('approval rejected') | uppercase }}
        </p>
        <div style="white-space: pre-wrap;">
          <b>{{ $t('reason') | uppercase }}:</b> <pre>{{ approvalReason }}</pre>
        </div>
      </div>
    </div>
    <div
      v-if="cancellationStatus == null && approvalStatus == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending approval warning', { form: form, approvedBy: approvedBy }) | uppercase }}
        </p>
        <hr>
        <div v-if="$permission.has('approve ' + form)">
          <button
            type="button"
            class="btn btn-sm btn-primary mr-5"
            :disabled="isProccessApproval || isProccessApprove"
            @click="onApprove"
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
            @click="$refs.formApprovalReject.open()"
          >
            <i
              v-show="isProccessReject"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('reject') | uppercase }}
          </button>
        </div>
      </div>
    </div>
    <m-form-approval-reject
      ref="formApprovalReject"
      @reject="onReject($event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    cancellationStatus: {
      type: Number,
      default: null
    },
    approvalStatus: {
      type: Number,
      default: null
    },
    approvalReason: {
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
    onApprove (event) {
      this.isProccessApprove = true
      this.$emit('onApprove', event)
    },
    onReject (event) {
      this.isProccessReject = true
      this.$emit('onReject', event)
    }
  }
}
</script>
