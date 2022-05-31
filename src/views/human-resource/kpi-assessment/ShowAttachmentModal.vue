<template>
  <div>
    <p-modal
      id="show-attachment"
      ref="showAttachment"
      @onClose="onClose"
      @toggleFullscreen="onFullscreen"
    >
      <template slot="content">
        <iframe
          :src="url"
          frameborder="0"
          :style="iframeStyle"
        />
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url: '',
      iframeStyle: {
        height: '400px',
        width: '100%'
      }
    }
  },
  methods: {
    show (url) {
      this.url = url
      this.$refs.showAttachment.show()
    },
    close () {
      this.url = ''
      this.$refs.showAttachment.close()
    },
    onClose () {
      this.url = ''
    },
    onFullscreen ({ isfullscreen }) {
      if (isfullscreen) {
        this.iframeStyle.height = '100%'
      } else {
        this.iframeStyle.height = '400px'
      }
    }
  }
}
</script>
