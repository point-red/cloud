<template>
  <ul
    class="nav nav-tabs nav-tabs-alt mb-10"
    data-toggle="tabs"
    role="tablist"
  >
    <li
      v-if="$permission.has('read employee job value assessment')"
      class="nav-item"
    >
      <router-link
        :to="{ name: 'JobValueAssessmentShow', params: { id: id } }"
        class="btn btn-sm btn-outline-secondary mr-5"
      >
        Assessment
      </router-link>
    </li>
    <li
      v-if="$permission.has('read employee job value assessment')"
      class="nav-item"
    >
      <router-link
        :to="{ name: 'JobValueAssessmentCalculation', params: { id: id } }"
        class="btn btn-sm btn-outline-secondary mr-5"
      >
        Fee Calculation
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
