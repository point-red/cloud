<template>
  <div
    class="d-flex flex-nowrap"
    style="overflow-x:auto"
  >
    <router-link
      to="/pos/open-bill"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/pos/open-bill')}"
      active-class="btn-primary"
    >
      <span><i class="si si-folder-alt" /> {{ $t('open bill') | uppercase }}</span>
    </router-link>
    <router-link
      to="/pos/closed-bill"
      class="btn mr-5 mb-15"
      :class="{'btn-secondary': !isMatch('/pos/closed-bill')}"
      active-class="btn-primary"
    >
      <span><i class="si si-folder-alt" /> {{ $t('closed bill') | uppercase }}</span>
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
