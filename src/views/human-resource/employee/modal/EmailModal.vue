<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitPhone"
    >
      <p-modal
        :id="id"
        ref="emailModalRef"
        :title="title | uppercase"
      >
        <template slot="content">
          <p-form-row
            id="email"
            v-model="email"
            name="email"
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
      email: '',
      isFocus: false
    }
  },
  watch: {
    'email' () {
      this.$emit('value', this.email)
    }
  },
  methods: {
    show () {
      this.$refs.emailModalRef.show()
      this.isFocus = true
    },
    close () {
      this.isFocus = false
      this.$refs.emailModalRef.close()
    },
    onSubmitPhone () {
      this.$emit('add', { email: this.email })
      this.email = ''
      this.$refs.emailModalRef.close()
    }
  }
}
</script>
