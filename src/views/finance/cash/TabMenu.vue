<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-15" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item ml-auto" v-if="$permission.has('create cash')">
      <router-link
        to="/finance/cash/create"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-plus"></i> Cash In</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('create cash')">
      <router-link
        to="/finance/cash/create"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-plus"></i> Cash Out</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read cash')">
      <router-link
        to="/finance/cash"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-docs"></i> List</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read cash')">
      <router-link
        to="/finance/cash/pending"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-magnifier"></i> Pending</span>
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
