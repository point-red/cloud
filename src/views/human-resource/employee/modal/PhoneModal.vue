<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitPhone"
    >
      <p-modal
        :id="id"
        ref="phoneModalRef"
        :title="title"
      >
        <template slot="content">
          <p-form-row
            id="phone"
            v-model="phone"
            name="phone"
            :label="$t('phone')"
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
      phone: '',
      isFocus: false
    }
  },
  watch: {
    'phone' () {
      this.$emit('value', this.phone)
    }
  },
  methods: {
    show () {
      this.$refs.phoneModalRef.show()
      this.isFocus = true
    },
    close () {
      this.isFocus = false
      this.$refs.phoneModalRef.close()
    },
    onSubmitPhone () {
      this.$emit('add', { phone: this.phone })
      this.phone = ''
      this.$refs.phoneModalRef.close()
    }
  }
}
</script>
