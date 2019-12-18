<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read manufacture machine')">
      <router-link
        to="/manufacture/machine"
        exact
        class="nav-link"
        active-class="active">
        <span>{{ $t('machine') | titlecase }}</span>
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
