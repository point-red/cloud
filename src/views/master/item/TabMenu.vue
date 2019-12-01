<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read item')">
      <router-link
        to="/master/item"
        class="nav-link"
        active-class="active">
        <span>ITEM</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read item')">
      <router-link
        to="/master/item-group"
        class="nav-link"
        active-class="active">
        <span>GROUP</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read item')">
      <router-link
        to="/master/item-price-list"
        class="nav-link"
        active-class="active">
        <span>PRICE LIST</span>
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
