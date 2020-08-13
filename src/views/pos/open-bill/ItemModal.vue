<template>
  <div>
    <form
      class="row"
    >
      <p-modal
        :id="id"
        ref="itemModal"
        :is-loading="isLoading"
        :title="title | uppercase"
      >
        <template slot="content">
          <p-form-row
            id="item-name"
            v-model="item_name"
            name="item-name"
            label="name"
            :disabled="true"
          />
          <p-form-row
            id="price"
            name="price"
            :label="$t('price')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                v-model="price"
                :disabled="true"
                :is-text-right="false"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="quantity"
            name="quantity"
            :label="$t('quantity')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-quantity
                v-model="quantity"
                :readonly="isSaving"
                :is-text-right="false"
                :unsigned="true"
                :unit="unit.label"
                :show-add-reduce-buttons="true"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="discount-percent"
            name="discount-percent"
            :label="$t('discount')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-quantity
                v-model="discount_percent"
                :readonly="isSaving"
                :is-text-right="false"
                :unsigned="true"
                unit="%"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="notes"
            name="notes"
            :label="$t('notes')"
          >
            <div
              slot="body"
              class="col-lg-12 mt-5"
            >
              <textarea
                v-model="notes"
                rows="5"
                class="form-control"
                placeholder="Notes"
                :readonly="isSaving"
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
      title: 'Item',
      isSaving: false,
      index: null,
      item_name: null,
      unit: '',
      quantity: null,
      price: null,
      discount_percent: null,
      notes: null,
      production_number: null,
      expiry_date: this.$moment().format('YYYY-MM-DD')
    }
  },
  methods: {
    show (index, item) {
      this.index = index
      this.item_name = item.item_name
      this.unit = item.item_unit
      this.quantity = item.quantity
      this.price = item.price
      this.discount_percent = item.discount_percent
      this.notes = item.notes
      this.production_number = item.production_number
      this.expiry_date = this.$options.filters.dateFormat(item.expiry_date, 'DD MMMM YYYY')
      this.$refs.itemModal.show()
    },
    close () {
      if (this.discount_percent > 100) {
        this.discount_percent = 100
      } else if (this.discount_percent < 0) {
        this.discount_percent = 0
      }
      this.$emit('updateItem', {
        item: {
          index: this.index,
          quantity: parseFloat(this.quantity),
          discount_percent: parseFloat(this.discount_percent),
          notes: this.notes
        }
      })
      this.index = null
      this.item_name = null
      this.unit = ''
      this.quantity = null
      this.price = null
      this.discount_percent = null
      this.notes = null
      this.production_number = null
      this.expiry_date = null
      this.$refs.itemModal.close()
    }
  }
}
</script>
