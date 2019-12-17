<template>
  <ul class="nav nav-tabs nav-tabs-alt mb-10" data-toggle="tabs" role="tablist">
    <slot></slot>
    <li class="nav-item" v-if="$permission.has('read manufacture input')">
      <router-link
        :to="'/manufacture/process-io/' + id + '/input'"
        exact
        class="nav-link"
        active-class="active">
        <span>{{ $t('input') | titlecase }}</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read manufacture input')">
      <router-link
        :to="'/manufacture/process-io/' + id + '/input/pending'"
        exact
        class="nav-link"
        active-class="active">
        <span><i class="si si-magnifier"></i> Pending</span>
      </router-link>
    </li>
    <li class="nav-item" v-if="$permission.has('read manufacture formula')">
      <router-link
        :to="'/manufacture/process-io/' + id + '/input/choose-formula'"
        exact
        class="nav-link"
        active-class="active">
        <span>Choose Formula</span>
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
