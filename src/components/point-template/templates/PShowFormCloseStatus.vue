<template>
  <div>
    <div
      v-if="closeStatus == 0 && isLoading == false"
      class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
      role="alert"
    >
      <div class="flex-fill mr-10">
        <p class="mb-0">
          <i class="fa fa-fw fa-exclamation-triangle" />
          {{ $t('pending close warning', { form: formName, approvedBy: approvedBy }) | uppercase }}
        </p>
        <p
          class="mb-0"
          style="font-size: 10px"
        >
          <b>{{ $t('reason') | uppercase }}</b> : <pre>{{ requestCloseReason | uppercase }}</pre>
        </p>
        <hr>
        <div v-if="$permission.has('approve purchase request')">
          <button
            type="button"
            class="btn btn-sm btn-primary mr-5"
            @click="onCloseApprove"
          >
            {{ $t('approve') | uppercase }}
          </button>
          <!-- <button
            type="button"
            class="btn btn-sm btn-danger"
            @click="$refs.formCancellationReject.open()"
          >
            {{ $t('reject') | uppercase }}
          </button> -->
        </div>
      </div>
    </div>
    <m-form-cancellation-reject
      ref="formCloseReject"
      @reject="onCloseReject($event)"
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
    closeApprovalReason: {
      type: String,
      default: ''
    },
    requestCloseReason: {
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
    formName: {
      type: String,
      default: ''
    }
  },
  methods: {
    onCloseApprove (event) {
      this.$emit('onCloseApprove', event)
    },
    onCloseReject (event) {
      this.$emit('onCloseReject', event)
    }
  }
}
</script>
