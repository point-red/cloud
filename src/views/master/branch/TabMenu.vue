<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read user')"
      class="nav-item"
    >
      <router-link
        to="/master/user"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('user') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read role')"
      class="nav-item"
    >
      <router-link
        to="/master/role"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('role & permission') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read branch')"
      class="nav-item"
    >
      <router-link
        to="/master/branch"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('branch') | uppercase }}</span>
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
