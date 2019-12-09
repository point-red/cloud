<template>
  <div class="d-flex flex-nowrap" style="overflow-x:auto">
    <router-link
      to="/manufacture/machine"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/manufacture/machine')}"
      active-class="btn-primary"
      v-if="$permission.has('read manufacture machine')">
      <span><i class="si si-folder-alt"></i> {{ $t('machine') | titlecase }}</span>
    </router-link>
    <router-link
      to="/manufacture/process"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/manufacture/process')}"
      active-class="btn-primary"
      v-if="$permission.has('read manufacture process')">      
      <span><i class="si si-folder-alt"></i> {{ $t('process') | titlecase }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      path: this.$route.path
    }
  },
  methods: {
    isMatch (value) {
      return this.path.substring(0, value.length) == value
    }
  }
}
</script>
