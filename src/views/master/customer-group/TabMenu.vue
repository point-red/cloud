<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read customer')"
      class="nav-item"
    >
      <router-link
        to="/master/customer"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('customer') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read customer')"
      class="nav-item"
    >
      <router-link
        to="/master/customer-group"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('group') | uppercase }}</span>
      </router-link>
    </li>
    <slot name="right" />
  </ul>
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
