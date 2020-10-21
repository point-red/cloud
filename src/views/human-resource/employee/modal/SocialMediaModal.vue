<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitSocialMedia"
    >
      <sweet-modal
        ref="modal"
        :title="$t('add social media') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <p-form-row
          id="social-media"
          name="social-media"
          :label="$t('social media')"
        >
          <div
            slot="body"
            class="col-lg-9"
          >
            <p-select
              id="social-media-type"
              v-model="socialMediaType"
              name="social-media-type"
              :options="options"
            />
          </div>
        </p-form-row>
        <p-form-row
          id="social-media-account"
          ref="account"
          v-model="socialMediaAccount"
          name="social-media-account"
          label="account"
        />
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
          >
            {{ $t('save') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      socialMediaType: null,
      socialMediaAccount: '',
      options: [
        { label: 'Facebook', id: 'Facebook' },
        { label: 'Twitter', id: 'Twitter' },
        { label: 'Instagram', id: 'Instagram' },
        { label: 'Linked In', id: 'Linked In' },
        { label: 'Line', id: 'Line' },
        { label: 'Whatsapp', id: 'Whatsapp' }
      ]
    }
  },
  watch: {
    'socialMedia' () {
      this.$emit('value', this.socialMedia)
    }
  },
  methods: {
    open () {
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    onClose () {
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmitSocialMedia () {
      this.$emit('add', {
        account: this.socialMediaAccount,
        type: this.socialMediaType
      })
      this.socialMediaAccount = ''
      this.socialMediaType = null
      this.$refs.modal.close()
    },
    socialMediaName (value) {
      var obj = this.options.filter(function (el) {
        if (el.id === value) {
          return el.label
        }
      })
      return obj[0].label
    }
  }
}
</script>
