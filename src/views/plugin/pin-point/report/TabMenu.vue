<template>
  <div class="mb-20">
    <ul
      class="nav nav-tabs nav-tabs-alt"
      data-toggle="tabs"
      role="tablist"
    >
      <slot />
      <li
        v-if="$permission.has('read pin point sales visitation form report')"
        class="nav-item ml-auto"
      >
        <router-link
          to="/plugin/pin-point/report/performance"
          exact
          class="nav-link"
          active-class="active"
        >
          <span><i class="si si-docs" /> Performance Report</span>
        </router-link>
      </li>
      <li
        v-if="$permission.has('read pin point sales visitation form report')"
        class="nav-item"
      >
        <router-link
          to="/plugin/pin-point/report/accumulation/interest-reason"
          exact
          class="nav-link"
          active-class="active"
        >
          <span><i class="si si-docs" /> Accumulation Report</span>
        </router-link>
      </li>
      <!-- <li class="nav-item" v-if="$permission.has('read pin point sales visitation form report')">
        <router-link
          to="/plugin/pin-point/report/sales"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-docs"></i> Sales Report</span>
        </router-link>
      </li> -->
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
