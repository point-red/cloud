<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read service')"
      class="nav-item"
    >
      <router-link
        to="/master/service"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('service') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read service')"
      class="nav-item"
    >
      <router-link
        to="/master/service-group"
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
