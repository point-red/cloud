<template>
  <div>
    <div :class="{ 'modal-backdrop show': backdrop }" />
    <div
      :id="id"
      class="modal"
      tabindex="-1"
      role="dialog"
    >
      <div
        class="modal-dialog modal-lg modal-dialog-popout modal-dialog-centered"
        role="document"
      >
        <div
          class="modal-content"
          :class="{'block block-mode-fullscreen': isFullscreen}"
        >
          <div
            class="block block-themed block-transparent mb-0"
            :class="{'block-mode-loading': isLoading}"
          >
            <div class="block-header bg-primary-dark">
              <h3 class="block-title">
                {{ title | uppercase }}
              </h3>
              <div class="block-options">
                <button
                  type="button"
                  class="btn-block-option"
                  @click="toggleFullscreen"
                >
                  <i :class="{ 'si si-size-fullscreen' : !isFullscreen, 'si si-size-actual' : isFullscreen }" />
                </button>
                <button
                  v-if="showClose"
                  type="button"
                  class="btn-block-option"
                  @click="close"
                >
                  <i class="si si-close" />
                </button>
              </div>
            </div>
            <div class="block-content">
              <slot name="content" />
            </div>
          </div>
          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    canClose: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isFullscreen: false,
      backdrop: false,
      showClose: this.canClose
    }
  },
  methods: {
    show () {
      document.getElementById(this.id).style.display = 'block'
      document.getElementById(this.id).classList.add('open')
      document.body.classList.add('modal-open')
      document.addEventListener('keydown', this.onEscListener)
      this.backdrop = true
    },
    close () {
      document.getElementById(this.id).style.display = 'none'
      document.getElementById(this.id).classList.remove('open')
      const elements = document.getElementsByClassName('modal open')
      if (!elements[0]) {
        document.body.classList.remove('modal-open')
      }
      document.removeEventListener('keydown', this.onEscListener)
      this.backdrop = false
    },
    toggleFullscreen () {
      this.isFullscreen = !this.isFullscreen
    },
    onEscListener () {
      if (event.key === 'Escape') {
        this.close()
      }
    }
  }
}
</script>
