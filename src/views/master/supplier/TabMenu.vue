<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read supplier')">
      <router-link
        to="/master/supplier"
        class="nav-link"
        active-class="active">
        <span>{{ $t('supplier') | uppercase }}</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read supplier')">
      <router-link
        to="/master/supplier-group"
        class="nav-link"
        active-class="active">
        <span>{{ $t('group') | uppercase }}</span>
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
