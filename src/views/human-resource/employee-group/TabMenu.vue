<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read employee')"
      class="nav-item"
    >
      <router-link
        to="/human-resource/employee"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('employee') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read employee')"
      class="nav-item"
    >
      <router-link
        to="/human-resource/employee-group"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('group') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read employee')"
      class="nav-item"
    >
      <router-link
        to="/human-resource/job-location"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('job location') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read employee')"
      class="nav-item"
    >
      <router-link
        to="/human-resource/employee-status"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('employment contract') | uppercase }}</span>
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
