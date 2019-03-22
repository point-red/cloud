<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-15" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item ml-auto" v-if="$permission.has('create customer')">
      <router-link
        to="/master/customer/create"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-plus"></i> Add</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read customer')">
      <router-link
        to="/master/customer"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-docs"></i> List</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read customer')">
      <router-link
        to="/master/customer/priority"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-star"></i> Priority</span>
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
