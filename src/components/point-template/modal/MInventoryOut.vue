<template>
  <div>
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
              <th v-if="mutableRequireExpiryDate">Expiry Date</th>
              <th v-if="mutableRequireProductionNumber">Production No.</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Stock</th>
            </tr>
            <tr slot="p-body" v-for="(option, index) in inventories" :key="index">
              <td v-if="mutableRequireExpiryDate">{{ option.expiry_date | dateFormat('DD MMMM YYYY') }}</td>
              <td v-if="mutableRequireProductionNumber">{{ option.production_number }}</td>
              <td class="text-right">
                <p-quantity
                  :id="'inventory-out-' + index"
                  :name="'inventory-out-' + index"
                  @input="calculate"
                  @choosen="updateUnit"
                  v-model="option.quantity"
                  :units="mutableItemUnits"
                  :unit="mutableItemUnit"/>
              </td>
              <td class="text-right">
                {{ option.remainingInUnit | numberFormat }}
                {{ mutableItemUnit.label | uppercase }}
              </td>
            </tr>
            <tr slot="p-body">
              <td v-if="mutableRequireExpiryDate">
              <td v-if="mutableRequireProductionNumber">
              <td class="text-right">
                {{ mutableTotalQuantity | numberFormat }} {{ mutableItemUnit.label }}
              </td>
              <td class="text-right"></td>
            </tr>
          </p-table>
        </div>
        <div class="alert alert-info text-center" v-if="searchText && options.length == 0 && !isLoading">
          {{ $t('searching not found', [searchText]) | capitalize }}
        </div>
      </template>
      <template slot="footer">
        <button type="button" @click="update()" class="btn btn-sm btn-outline-primary">{{ $t('update') | uppercase }}</button>
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
      isSaving: false,
      isLoading: false,
      mutableWarehouseId: null,
      mutableItemId: null,
      mutableItemName: null,
      mutableItemPrice: null,
      mutableItemUnit: {
        id: 0,
        label: '',
        name: '',
        converter: 0
      },
      mutableRowId: null,
      mutableItemUnits: [],
      mutableInventories: [],
      mutableRequireExpiryDate: false,
      mutableRequireProductionNumber: false,
      mutableDiscountPercent: null,
      mutableTotalQuantity: 0,
      mutableNotes: null
    }
  },
  computed: {
    ...mapGetters('inventoryDna', ['inventories'])
  },
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    }
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  created () {
    this.search()
  },
  methods: {
    ...mapActions('inventoryDna', ['get', 'pagination']),
    init () {
      this.isLoading = true
      this.get({
        itemId: this.mutableItemId
      }).then(response => {
        this.inventories.forEach(inventory => {
          inventory.quantity = 0
          this.mutableInventories.forEach(el => {
            if (inventory.item_id == el.item_id &&
              inventory.expiry_date == el.expiry_date &&
              inventory.production_number == el.production_number) {
              inventory.quantity = el.quantity
            }
          })
        })
        this.calculate()
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    search () {
      //
    },
    calculate () {
      this.inventories.forEach(element => {
        element.remainingInUnit = element.remaining / this.mutableItemUnit.converter
      })
      this.mutableTotalQuantity = 0
      this.inventories.forEach(inventory => {
        this.mutableTotalQuantity += parseFloat(inventory.quantity)
      })
    },
    updateUnit (mutableItemUnit) {
      this.mutableItemUnit.converter = mutableItemUnit.converter
      this.mutableItemUnit.name = mutableItemUnit.name
      this.mutableItemUnit.label = mutableItemUnit.label
      this.calculate()
    },
    show (row) {
      if (!row.warehouse_id) {
        this.$alert.info('INPUT REQURED', this.$t('please select warehouse'))
      } else if (!row.item) {
        this.$alert.info('ITEM REQUIRED', this.$t('please select item'))
      } else {
        this.mutableRowId = row.row_id
        this.mutableItemId = row.item.id
        this.mutableItemName = row.item.name
        this.mutableItemUnit = row.item.unit
        this.mutableItemUnits = row.item.units
        this.mutableWarehouseId = row.warehouse_id
        this.mutableRequireExpiryDate = row.require_expiry_date
        this.mutableRequireProductionNumber = row.require_production_number
        if (row.dna) {
          this.mutableInventories = row.dna
        }
        this.init()
        this.$refs['select-' + this.id].show()
      }
    },
    update () {
      this.calculate()
      this.$emit('updated', {
        rowId: this.mutableRowId,
        unit: this.mutableItemUnit,
        dna: this.inventories,
        totalQuantity: this.mutableTotalQuantity
      })
      this.close()
    },
    close () {
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
