<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitSocialMedia">
      <p-modal
        ref="socialMediaModalRef"
        :id="id"
        :title="title">
        <template slot="content">
          <p-form-row
            id="social-media"
            name="social-media"
            :label="$t('social media')">
            <div slot="body" class="col-lg-9">
              <p-select
                id="social-media-type"
                name="social-media-type"
                v-model="socialMediaType"
                :options="options"/>
            </div>
          </p-form-row>
          <p-form-row
            id="social-media-account"
            name="social-media-account"
            label="account"
            v-model="socialMediaAccount">
          </p-form-row>
        </template>
        <template slot="footer">
          <button class="btn btn-primary">Add</button>
        </template>
      </p-modal>
    </form>
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
  data () {
    return {
      socialMediaType: null,
      socialMediaAccount: '',
      socialMediaTypes: '',
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
    show () {
      this.$refs.socialMediaModalRef.show()
    },
    close () {
      this.$refs.socialMediaModalRef.close()
    },
    onSubmitSocialMedia () {
      this.$emit('add', {
        account: this.socialMediaAccount,
        type: this.socialMediaType
      })
      this.socialMediaAccount = ''
      this.socialMediaType = null
      this.$refs.socialMediaModalRef.close()
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
