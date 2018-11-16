<template>
  <div>
    <div
      class="block"
      style="min-height: 100px"
      :class="{
        'block-mode-loading' : loading,
        'block-mode-hidden' : hidden
      }">
      <div class="block-content block-content-inner">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: false,
    isHidden: false
  },
  data () {
    return {
      loading: this.isLoading,
      hidden: this.isHidden
    }
  },
  watch: {
    isLoading () {
      this.loading = this.isLoading
    }
  }
}
</script>
