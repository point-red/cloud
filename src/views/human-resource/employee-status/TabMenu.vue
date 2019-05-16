<template>
  <div class="mb-20">
    <ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" role="tablist">
      <slot></slot>
      <li class="nav-item ml-auto" v-if="$permission.has('create employee status')">
        <router-link
          to="/human-resource/employee-status/create"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-plus"></i> Add</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('read employee status')">
        <router-link
          to="/human-resource/employee-status"
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
