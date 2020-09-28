<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <slot />
    <li
      class="nav-item"
    >
      <router-link
        to="/plugin/salary/salary-non-sales/employee-list"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('employee list') | uppercase }}</span>
      </router-link>
    </li>
    <li
      class="nav-item"
    >
      <router-link
        to="/plugin/salary/salary-non-sales/job-location"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('job location') | uppercase }}</span>
      </router-link>
    </li>
    <li
      class="nav-item"
    >
      <router-link
        to="/plugin/salary/salary-non-sales/job-value"
        class="nav-link"
        active-class="active"
      >
        <span>{{ $t('job value') | uppercase }}</span>
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
