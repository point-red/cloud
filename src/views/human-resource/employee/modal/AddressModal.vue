<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitAddress"
    >
      <p-modal
        :id="id"
        ref="addressModal"
        :title="title"
      >
        <template slot="content">
          <p-form-row
            id="name"
            v-model="address"
            name="name"
            :label="$t('address')"
            :is-focus="true"
          />
        </template>
        <template slot="footer">
          <button class="btn btn-primary">
            Add
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="close"
          >
            {{ $t('close') | uppercase }}
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
      address: ''
    }
  },
  watch: {
    'address' () {
      this.$emit('value', this.address)
    }
  },
  created () {
    console.log('address created')
  },
  updated () {
    console.log('address updated')
  },
  mounted () {
    console.log('address mounted')
  },
  beforeDestroy () {
    console.log('address before destroy')
  },
  methods: {
    show () {
      this.$refs.addressModal.show()
    },
    close () {
      this.$refs.addressModal.close()
    },
    onSubmitAddress () {
      this.$emit('add', { address: this.address })
      this.address = ''
      this.close()
    }
  }
}
</script>
