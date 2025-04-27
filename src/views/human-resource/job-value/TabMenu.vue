<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      v-if="$permission.has('read employee job value assessment')"
      class="nav-item"
    >
      <router-link
        to="/human-resource/job-value/assessment"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('job value assessment') | uppercase }}</span>
      </router-link>
    </li>
    <li
      v-if="$permission.has('read employee master job value')"
      class="nav-item"
    >
      <router-link
        to="/human-resource/job-value/master"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('job value Master') | uppercase }}</span>
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
