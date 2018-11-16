<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitPhone">
      <p-modal
        ref="emailCompanyModalRef"
        :id="id"
        :title="title">
        <template slot="content">
          <p-form-row
            id="email-company"
            name="email-company"
            :label="$t('email')"
            :isFocus="isFocus"
            v-model="emailCompany">
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
