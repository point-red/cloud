<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitPhone"
    >
      <p-modal
        :id="id"
        ref="emailCompanyModalRef"
        :title="title"
      >
        <template slot="content">
          <p-form-row
            id="email-company"
            v-model="emailCompany"
            name="email-company"
            :label="$t('email')"
            :is-focus="isFocus"
          />
        </template>
        <template slot="footer">
          <button class="btn btn-primary">
            Add
          </button>
        </template>
      </p-modal>
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
      required: true
    }
  },
  data () {
    return {
      emailCompany: '',
      isFocus: false
    }
  },
  watch: {
    'emailCompany' () {
      this.$emit('value', this.emailCompany)
    }
  },
  methods: {
    show () {
      this.$refs.emailCompanyModalRef.show()
      this.isFocus = true
    },
    close () {
      this.isFocus = false
      this.$refs.emailCompanyModalRef.close()
    },
    onSubmitPhone () {
      this.$emit('add', { email: this.emailCompany })
      this.emailCompany = ''
      this.$refs.emailCompanyModalRef.close()
    }
  }
}
</script>
