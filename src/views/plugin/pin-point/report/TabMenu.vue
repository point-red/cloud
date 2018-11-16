<template>
  <div class="mb-20">
    <ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" role="tablist">
      <slot></slot>
      <li class="nav-item ml-auto" v-if="$permission.has('read pin point sales visitation form report')">
        <router-link
          to="/plugin/pin-point/report/performance"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-docs"></i> Performance Report</span>
        </router-link>
      </li>
      <!-- <li class="nav-item" v-if="$permission.has('read pin point sales visitation form report')">
        <router-link
          to="/plugin/pin-point/report/accumulation"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-docs"></i> Accumulation Report</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('read pin point sales visitation form report')">
        <router-link
          to="/plugin/pin-point/report/sales"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-docs"></i> Sales Report</span>
        </router-link>
      </li> -->
      <slot name="right"></slot>
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
