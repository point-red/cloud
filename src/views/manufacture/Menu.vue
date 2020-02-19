<template>
  <div class="d-flex flex-nowrap" style="overflow-x:auto">
    <router-link
      to="/manufacture"
      class="btn btn-sm mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/manufacture')}"
      active-class="btn-primary"
      v-if="$permission.has('read manufacture')">
      <span>{{ $t('manufacture') | uppercase }}</span>
    </router-link>
    <router-link
      to="/manufacture/machine"
      class="btn btn-sm mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/manufacture/machine')}"
      active-class="btn-primary"
      v-if="$permission.has('read manufacture machine')">
      <span>{{ $t('machine') | uppercase }}</span>
    </router-link>
    <router-link
      to="/manufacture/process"
      class="btn btn-sm mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/manufacture/process')}"
      active-class="btn-primary"
      v-if="$permission.has('read manufacture process')">
      <span>{{ $t('process') | uppercase }}</span>
    </router-link>
    <router-link
      to="/manufacture/formula"
      class="btn btn-sm mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/manufacture/formula')}"
      active-class="btn-primary"
      v-if="$permission.has('read manufacture formula')">
      <span>{{ $t('formula') | uppercase }}</span>
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
      return this.path == value
    }
  }
}
</script>
