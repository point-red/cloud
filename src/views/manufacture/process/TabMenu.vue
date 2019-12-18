<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-15" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read manufacture process')">
      <router-link
        to="/manufacture/process"
        exact
        class="nav-link"
        active-class="active">
        <span>{{ $t('process') | titlecase }}</span>
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
