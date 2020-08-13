<template>
  <div>
    <p-modal
      :id="id"
      ref="changeLanguageModalRef"
      :title="title"
    >
      <template slot="content">
        <div class="row gutters-tiny">
          <div class="col-6 col-sm-4 col-md-3 col-xl-2">
            <a
              href="javascript:void(0)"
              class="block text-center"
              @click="setLang('en')"
            >
              <div class="block-content ribbon ribbon-bookmark ribbon-crystal ribbon-left">
                <country-flag
                  country="us"
                  size="big"
                />
                <p class="font-w600">ENGLISH</p>
              </div>
            </a>
          </div>
          <div class="col-6 col-sm-4 col-md-3 col-xl-2">
            <a
              href="javascript:void(0)"
              class="block text-center"
              @click="setLang('id')"
            >
              <div class="block-content ribbon ribbon-bookmark ribbon-crystal ribbon-left">
                <country-flag
                  country="id"
                  size="big"
                />
                <p class="font-w600">INDONESIA</p>
              </div>
            </a>
          </div>
        </div>
      </template>
      <template slot="footer">
        <button
          class="btn btn-danger"
          @click="close"
        >
          {{ $t('cancel') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'

export default {
  components: {
    CountryFlag
  },
  props: {
    title: {
      type: String,
      default: ''
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
    setLang (lang = 'en') {
      this.$store.dispatch('lang/setLang', lang)
      this.close()
    }
  }
}
</script>
