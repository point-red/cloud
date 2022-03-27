<template>
  <div>
    <p-modal id="show-attachment" ref="showAttachment">
      <template slot="content">
        <iframe :src="url" frameborder="0" style="min-height:400px; width:100%"></iframe>
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: ""
    };
  },
  methods: {
    show(url) {
      this.url = url;
      this.$refs.showAttachment.show();
    },
    close() {
      this.url = "";
      this.$refs.showAttachment.close();
    }
  }
};
</script>
