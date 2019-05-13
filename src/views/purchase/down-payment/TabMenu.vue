<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-15" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item ml-auto" v-if="$permission.has('create purchase down payment')">
      <router-link
        to="/purchase/order/pending"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-plus"></i> Add</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read purchase down payment')">
      <router-link
        to="/purchase/down-payment"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-docs"></i> List</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read purchase down payment')">
      <router-link
        to="/purchase/down-payment/pending"
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
