<template>
  <div class="mb-20">
    <ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" role="tablist">
      <slot></slot>
      <li class="nav-item ml-auto" v-if="$permission.has('create pin point sales visitation form')">
        <router-link
          to="/plugin/pin-point/sales-visitation-form/create"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-plus"></i> Add</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create pin point sales visitation form') || $permission.has('read pin point sales visitation form')">
        <router-link
          to="/plugin/pin-point/sales-visitation-form"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-docs"></i> List</span>
        </router-link>
      </li>
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
