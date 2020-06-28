<template>
  <div class="table-responsive">
    <table
      class="table table-sm table-hover"
      :class="{'table-bordered': isBordered}"
    >
      <thead>
        <slot name="p-head" />
        <slot name="p-filter" />
      </thead>
      <tbody>
        <slot name="p-body" />
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    isBordered: {
      type: Boolean,
      default: false
    }
  }
}
</script>
