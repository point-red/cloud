<template>
  <div class="mb-20">
    <ul class="nav nav-tabs nav-tabs-alt" data-toggle="tabs" role="tablist">
      <slot></slot>
      <li class="nav-item ml-auto" v-if="$permission.has('create chart of account')">
        <router-link
          to="/accounting/chart-of-account/create"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-plus"></i> Add</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('read chart of account')">
        <router-link
          to="/accounting/chart-of-account"
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
