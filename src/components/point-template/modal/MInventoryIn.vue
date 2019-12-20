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
            <th v-if="requireExpiryDate">Expiry Date</th>
            <th v-if="requireProductionNumber">Production No.</th>
            <th>Quantity</th>
            <th>&nbsp;</th>
          </tr>
          <tr slot="p-body" v-for="(option, index) in options" :key="index">
            <td>
              <p-date-picker
                id="expiry-date"
                name="expiry-date"
                v-model="option.expiry_date"
                v-if="requireExpiryDate"/>
            </td>
            <td>
              <p-form-input
                id="production-number"
                v-model="option.production_number"
                name="production-number"
                v-if="requireProductionNumber"/>
            </td>
            <td>
              <p-quantity
                :id="'quantity' + index"
                :name="'quantity' + index"
                v-model="option.quantity"
                :unit="option.unit"
                @input="quantityChange"/>
            </td>
            <td>
              <i class="btn btn-sm fa fa-times" @click="deleteInventory(index)"></i>
            </td>
          </tr>
        </p-table>
        <button type="button" class="btn btn-sm btn-secondary mb-10" @click="addInventory">
          <i class="fa fa-plus"/> Add
        </button>
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
    inventories: {
      type: Array,
      default: function () { return [] }
    },
    requireExpiryDate: {
      type: [Boolean, Number],
      default: false
    },
    requireProductionNumber: {
      type: [Boolean, Number],
      default: false
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
    addInventory () {
      this.options.push({
        expiry_date: this.$moment().format('YYYY-MM-DD'),
        production_number: null,
        quantity: null,
        unit: this.unit
      })
    },
    deleteInventory (index) {
      if (this.options.length > 1) {
        this.$delete(this.options, index)
      }
    },
    quantityChange () {
      this.totalQuantity = null
      this.options.map((key, value) => {
        this.totalQuantity += parseFloat(key['quantity'] || 0)
      })
    },
    show () {
      if (this.inventories.length > 0) {
        this.options = []
        this.inventories.map((key, value) => {
          this.options.push({
            expiry_date: key['expiry_date'],
            production_number: key['production_number'],
            quantity: key['quantity'],
            unit: this.unit
          })
        })
      }
      this.$refs['select-' + this.id].show()
    },
    close () {
      this.quantityChange()
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
