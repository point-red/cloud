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
        <input type="text" class="form-control" v-model="searchText" placeholder="Search..." @keydown.enter.prevent="">
        <hr>
        <div v-if="isLoading">
          <h3 class="text-center">Loading ...</h3>
        </div>
        <div v-else>
          <p-table>
            <tr slot="p-head">
              <th v-if="requireExpiryDate">Expiry Date</th>
              <th v-if="requireProductionNumber">Production No.</th>
              <th>Quantity</th>
              <th>Stock</th>
            </tr>
            <tr slot="p-body" v-for="(option, index) in options" :key="index">
              <td v-if="option.expiry_date && requireExpiryDate">{{ option.expiry_date | dateFormat('DD MMMM YYYY') }}</td>
              <td v-else-if="!option.expiry_date && requireExpiryDate">&nbsp;</td>
              <td v-if="requireProductionNumber">{{ option.production_number }}</td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  :name="'quantity' + index"
                  v-model="option.quantity"
                  :unit="option.item.units[0].label"
                  @input="quantityChange"/>
              </td>
              <td>
                {{ option.total_quantity | numberFormat }} {{ option.item.units[0].label }}
              </td>
            </tr>
          </p-table>
        </div>
        <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
          {{ $t('searching not found', [searchText]) | capitalize }}
        </div>
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
      searchText: '',
      options: [],
      optionsQuantity: [],
      totalQuantity: 0,
      isSaving: false,
      isLoading: false,
      mutableShouldChange: true
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
    warehouseId: {
      type: Number,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    },
    shouldChange: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300),
    shouldChange: function () {
      this.mutableShouldChange = true
      this.search()
    }
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('inventoryInventory', ['get', 'pagination']),
    search () {
      this.isLoading = true
      this.recordQuantity()
      this.get({
        itemId: this.itemId,
        params: {
          warehouse_id: this.warehouseId,
          includes: 'form;warehouse;item.units',
          sort_by: 'inventories.expiry_date,inventories.production_number',
          group_by: 'inventories.expiry_date,inventories.production_number,inventories.warehouse_id',
          filter_like: {
            expiry_date: this.searchText,
            production_number: this.searchText
          }
        }
      }).then(response => {
        this.options = []
        response.data.map((key, value) => {
          let item = key['item']
          let optionQuantityIndex = -1
          var quantity = null

          if (item.require_expiry_date && item.require_production_number) {
            optionQuantityIndex = this.optionsQuantity.findIndex(o => o.expiry_date === key['expiry_date'] && o.production_number === key['production_number'])
          } else if (item.require_expiry_date) {
            optionQuantityIndex = this.optionsQuantity.findIndex(o => o.expiry_date === key['expiry_date'])
          } else if (item.require_production_number) {
            optionQuantityIndex = this.optionsQuantity.findIndex(o => o.production_number === key['production_number'])
          }

          if (optionQuantityIndex >= 0) {
            quantity = this.optionsQuantity[optionQuantityIndex].quantity
          } else {
            this.optionsQuantity.push({
              'expiry_date': key['expiry_date'],
              'production_number': key['production_number'],
              'quantity': 0
            })
          }

          this.options.push({
            'id': key['id'],
            'expiry_date': key['expiry_date'],
            'production_number': key['production_number'],
            'quantity': quantity,
            'total_quantity': key['total_quantity'],
            'item': item
          })
        })
        if (this.mutableShouldChange) {
          for (let index in this.options) {
            this.options[index].quantity = null
            if (index == 0) {
              this.options[index].quantity = this.value
            }
          }
          this.recordQuantity()
          this.quantityChange()
          this.mutableShouldChange = false
        }
        this.$emit('add', {
          inventories: this.options,
          quantity: this.totalQuantity
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    recordQuantity () {
      this.options.map((key, value) => {
        let item = key['item']
        let optionQuantityIndex = -1
        var quantity = null

        if (item.require_expiry_date && item.require_production_number) {
          optionQuantityIndex = this.optionsQuantity.findIndex(o => o.expiry_date === key['expiry_date'] && o.production_number === key['production_number'])
        } else if (item.require_expiry_date) {
          optionQuantityIndex = this.optionsQuantity.findIndex(o => o.expiry_date === key['expiry_date'])
        } else if (item.require_production_number) {
          optionQuantityIndex = this.optionsQuantity.findIndex(o => o.production_number === key['production_number'])
        }

        if (optionQuantityIndex >= 0) {
          this.optionsQuantity[optionQuantityIndex].quantity = key['quantity']
        } else {
          quantity = null
          this.optionsQuantity.push({
            'expiry_date': key['expiry_date'],
            'production_number': key['production_number'],
            'quantity': key['quantity']
          })
        }
      })
    },
    quantityChange () {
      this.totalQuantity = null
      this.options.map((key, value) => {
        this.totalQuantity += parseFloat(key['quantity'] || 0)
      })
    },
    show () {
      this.mutableShouldChange = this.shouldChange
      this.search()
      if (this.inventories.length > 0) {
        this.optionsQuantity = this.inventories
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
