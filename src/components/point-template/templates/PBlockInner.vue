<template>
  <div>
    <div
      class="block"
      style="min-height: 100px"
      :class="{
        'block-mode-loading' : loading,
        'block-mode-hidden' : hidden
      }"
      :style="{
        'background-color' : background
      }"
    >
      <div class="block-content block-content-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'white'
    }
  },
  data () {
    return {
      loading: this.isLoading,
      hidden: this.isHidden,
      background: this.backgroundColor
    }
  },
  watch: {
    isLoading () {
      this.loading = this.isLoading
    }
  }
}
</script>
