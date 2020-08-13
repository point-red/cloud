<template>
  <div
    class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
    role="alert"
  >
    <div class="flex-fill mr-10">
      <p class="mb-0">
        <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('rejected') | uppercase }}
      </p>
      <div style="white-space: pre-wrap;">
        <b>{{ $t('reason') | uppercase }}:</b> {{ reason }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    reason: {
      type: String,
      default: ''
    }
  }
}
</script>
