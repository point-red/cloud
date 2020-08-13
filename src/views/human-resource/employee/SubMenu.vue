<template>
  <div class="btn-group btn-group-sm mr-15 mb-30 float-right">
    <router-link
      to="/human-resource/employee/create"
      class="btn btn-sm btn-secondary float-right"
      exact-active-class="active"
    >
      <i class="fa fa-plus mr-5" /> Create
    </router-link>
    <router-link
      to="/human-resource/employee"
      class="btn btn-sm btn-secondary float-right"
      exact-active-class="active"
    >
      <i class="fa fa-list mr-5" /> List
    </router-link>
    <div
      :class="{ 'd-none': !showDropdown }"
      class="btn-group btn-group-sm"
      role="group"
    >
      <button
        type="button"
        class="btn btn-secondary"
        data-toggle="dropdown"
      >
        <i class="fa fa-angle-down" />
      </button>
      <div class="dropdown-menu dropdown-menu-right">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showDropdown: {
      type: Boolean,
      default: false
    }
  }
}
</script>
