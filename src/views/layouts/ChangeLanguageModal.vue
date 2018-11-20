<template>
  <div>
    <p-modal
      ref="changeLanguageModalRef"
      :id="id"
      :title="title">
      <template slot="content">
        <div class="row gutters-tiny">
          <p-box
            :name="$t('english') | titlecase"
            @click.native="setLang('en')"
            background-color="bg-gray-lighter"
            icon="flag-icon flag-icon-us"/>
          <p-box
            :name="$t('indonesia') | titlecase"
            @click.native="setLang('id')"
            background-color="bg-gray-lighter"
            icon="flag-icon flag-icon-id"/>
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
