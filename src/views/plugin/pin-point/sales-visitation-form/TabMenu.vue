<template>
  <div class="mb-10">
    <ul
      class="nav nav-tabs nav-tabs-alt"
      data-toggle="tabs"
      role="tablist"
    >
      <slot />
      <li
        v-if="$permission.has('create pin point sales visitation form') || $permission.has('read pin point sales visitation form')"
        class="nav-item"
      >
        <router-link
          to="/plugin/pin-point/sales-visitation-form"
          class="nav-link"
          active-class="active"
        >
          <span>{{ $t('sales visitation') | uppercase }}</span>
        </router-link>
      </li>
      <slot name="right" />
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: this.$route.params.id
    }
  }
}
</script>
