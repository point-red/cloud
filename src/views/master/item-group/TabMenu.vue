<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read item')">
      <router-link
        to="/master/item"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-docs"></i> Item</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read item')">
      <router-link
        to="/master/item-group"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-tag"></i> Group</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read item')">
      <router-link
        to="/master/item/price-list"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-docs"></i> Price List</span>
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
