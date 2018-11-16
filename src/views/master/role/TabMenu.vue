<template>
  <ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item ml-auto" v-if="$permission.has('create role')">
      <router-link
        to="/master/role/create"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-plus"></i> Add</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read role')">
      <router-link
        to="/master/role"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-docs"></i> List</span>
      </router-link>
    </li>
    <slot name="right"></slot>
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
