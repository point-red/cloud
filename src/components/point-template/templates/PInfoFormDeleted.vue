<template>
  <div
    class="alert alert-danger d-flex align-items-center justify-content-between mb-15"
    role="alert"
  >
    <div class="flex-fill mr-10">
      <p class="mb-0">
        <i class="fa fa-fw fa-exclamation-triangle" /> {{ $t('deleted') | uppercase }}
      </p>
    </div>
  </div>
</template>
