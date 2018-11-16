<template>
  <div>
    <p-modal
      ref="changeLanguageModalRef"
      :id="id"
      :title="title">
      <template slot="content">
        <div class="row text-center">
          <div class="col-sm-12">
            <div class="block">
              <button
                class="btn btn-hero btn-outline-secondary btn-block"
                @click="setLang('en')">English</button>
            </div>
          </div>
          <div class="col-sm-12">
            <div class="block">
              <button
                class="btn btn-hero btn-outline-secondary btn-block"
                @click="setLang('id')">Indonesian</button>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button
          class="btn btn-danger"
          @click="close">Cancel</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    show () {
      this.$refs.changeLanguageModalRef.show()
    },
    close () {
      this.$refs.changeLanguageModalRef.close()
    },
    setLang (lang) {
      this.$store.dispatch('Lang/setLang', lang)
      this.close()
    }
  }
}
</script>
