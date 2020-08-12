<template>
  <div :class="col">
    <div
      :class="{
        'block-mode-fullscreen' : fullscreen,
        'block-mode-loading' : loading,
        'block-mode-pinned' : pinned,
        'block-mode-hidden' : hidden
      }"
      class="block"
    >
      <div
        v-show="header"
        class="block-header bg-gray-lighter"
      >
        <h3 class="block-title">
          {{ title | uppercase }}
        </h3>
        <div
          v-show="showOptions"
          class="block-options"
        >
          <slot name="header" />
          <button
            v-show="showFullscreenButton"
            type="button"
            class="btn-block-option"
            @click="toggleFullscreen"
          >
            <i :class="{ 'si si-size-fullscreen' : !fullscreen, 'si si-size-actual' : fullscreen }" />
          </button>
          <button
            v-show="showPrinterButton && fullscreen"
            type="button"
            class="btn-block-option"
            @click="printBlock"
          >
            <i class="si si-printer" /> {{ $t('print') | uppercase }}
          </button>
          <button
            v-show="showPinnedButton"
            type="button"
            class="btn-block-option"
            @click="togglePinned"
          >
            <i class="si si-pin" />
          </button>
          <button
            v-show="showHiddenButton"
            type="button"
            class="btn-block-option"
            @click="toggleHidden"
          >
            <i :class="{ 'si si-arrow-up' : !hidden, 'si si-arrow-down' : hidden }" />
          </button>
        </div>
      </div>
      <div class="block-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    column: {
      type: String,
      default: 'col-sm-12'
    },
    header: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isFullscreen: {
      type: Boolean,
      default: false
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isHidden: {
      type: Boolean,
      default: false
    },
    showOptions: {
      type: Boolean,
      default: true
    },
    showFullscreenButton: {
      type: Boolean,
      default: true
    },
    showPinnedButton: {
      type: Boolean,
      default: false
    },
    showHiddenButton: {
      type: Boolean,
      default: false
    },
    showPrinterButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fullscreen: this.isFullscreen,
      loading: this.isLoading,
      pinned: this.isPinned,
      hidden: this.isHidden,
      col: this.column
    }
  },
  watch: {
    isLoading () {
      this.loading = this.isLoading
    }
  },
  methods: {
    toggleFullscreen () {
      this.fullscreen = !this.fullscreen
      this.pinned = false
    },
    togglePinned () {
      this.pinned = !this.pinned

      if (this.pinned) {
        this.fullscreen = false
      }
    },
    toggleHidden () {
      this.hidden = !this.hidden
    },
    printBlock () {
      window.print()
    }
  }
}
</script>

<style scoped>
  .block-header-default {
    background-color: #efefef;
  }
</style>
