<template>
  <div>
    <form
      class="row"
    >
      <p-modal
        :id="id"
        ref="discountModal"
        :is-loading="isLoading"
        :title="title | uppercase"
      >
        <template slot="content">
          <p-form-row
            id="discount"
            name="discount"
            :label="$t('discount')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                v-model="discount_percent"
                :is-text-right="false"
              />
            </div>
          </p-form-row>
        </template>
        <template slot="footer">
          <button
            :disabled="isSaving"
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="close"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('close') | uppercase }}
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      title: 'Discount',
      isSaving: false,
      discount_percent: 0
    }
  },
  methods: {
    show (discountPercent) {
      this.discount_percent = discountPercent
      this.$refs.discountModal.show()
    },
    close () {
      if (this.discount_percent > 100) {
        this.discount_percent = 100
      } else if (this.discount_percent < 0) {
        this.discount_percent = 0
      }
      this.$emit('updateDiscount', {
        discount_percent: this.discount_percent
      })
      this.discount_percent = 0
      this.$refs.discountModal.close()
    }
  }
}
</script>
