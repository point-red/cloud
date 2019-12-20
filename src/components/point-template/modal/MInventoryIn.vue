<template>
  <div>
    <button
      type="button"
      @click="show"
      class="btn btn-primary btn-sm">
      <span class="fa fa-shopping-cart"></span>
    </button>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="select inventory">
      <template slot="content">
        <p-table>
          <tr slot="p-head">
            <th>Expiry Date</th>
            <th>Production No.</th>
            <th>Quantity</th>
          </tr>
          <tr slot="p-body" v-for="(option, index) in options" :key="index">
            <td>
              <p-date-picker
                id="expiry-date"
                name="expiry-date"
                v-model="option.expiry_date"/>
            </td>
            <td>
              <p-form-input
                id="production-number"
                v-model="option.production_number"
                :disabled="isSaving"
                name="production-number"/>
            </td>
            <td>
              <p-quantity
                :id="'quantity' + index"
                :name="'quantity' + index"
                v-model="option.quantity"
                :unit="option.unit"
                @input="quantityChange"/>
            </td>
          </tr>
        </p-table>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-outline-danger">Close</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      options: [{
        expiry_date: this.$moment().format('YYYY-MM-DD'),
        production_number: null,
        quantity: this.value,
        unit: this.unit
      }],
      totalQuantity: 0
    }
  },
  computed: {
    ...mapGetters('inventoryInventory', ['inventory'])
  },
  props: {
    id: {
      type: String,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    }
  },
  methods: {
    quantityChange () {
      this.totalQuantity = null
      this.options.map((key, value) => {
        this.totalQuantity += parseFloat(key['quantity'] || 0)
      })
    },
    show () {
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.$emit('add', {
        inventories: this.options,
        quantity: this.totalQuantity
      })
      this.$refs['select-' + this.id].close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
