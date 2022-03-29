<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select inventory') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <input
        v-model="searchText"
        type="text"
        class="form-control"
        placeholder="Search..."
        @keydown.enter.prevent=""
      >
      <hr>
      <button
        type="button"
        class="btn btn-sm btn-block btn-primary"
        @click="update()"
      >
        {{ $t('update') | uppercase }}
      </button>
      <hr>
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div v-else>
        <p-table>
          <tr slot="p-head">
            <th v-if="mutableRequireExpiryDate">
              Expiry Date
            </th>
            <th v-if="mutableRequireProductionNumber">
              Production No.
            </th>
            <th class="text-right">
              Quantity
            </th>
            <!-- <th class="text-right">
              Stock
            </th> -->
          </tr>
          <tr
            v-for="(option, inventoryIndex) in inventories"
            slot="p-body"
            :key="inventoryIndex"
          >
            <td v-if="mutableRequireExpiryDate">
              {{ option.expiry_date | dateFormat('DD MMMM YYYY') }}
            </td>
            <td v-if="mutableRequireProductionNumber">
              {{ option.production_number }}
            </td>
            <td class="text-right">
              <p-quantity
                :id="'inventory-out-' + inventoryIndex"
                v-model="option.quantity"
                :name="'inventory-out-' + inventoryIndex"
                :units="mutableItemUnits"
                :unit="mutableItemUnit"
                :disable-unit-selection="disableUnitSelection"
                @input="calculate"
                @choosen="updateUnit"
              />
            </td>
            <!-- <td class="text-right">
              {{ option.remainingInUnit | numberFormat }}
              {{ mutableItemUnit.label | uppercase }}
            </td> -->
          </tr>
          <tr slot="p-body">
            <td v-if="mutableRequireExpiryDate" /><td v-if="mutableRequireProductionNumber" /><td class="text-right">
              {{ mutableTotalQuantity | numberFormat }} {{ mutableItemUnit.label }}
            </td>
            <td class="text-right" />
          </tr>
        </p-table>
      </div>
      <div
        v-if="searchText && options.length == 0 && !isLoading"
        class="alert alert-info text-center"
      >
        {{ $t('searching not found', [searchText]) | capitalize }}
      </div>
      <button
        type="button"
        class="btn btn-sm btn-block btn-primary"
        @click="update()"
      >
        {{ $t('update') | uppercase }}
      </button>
    </sweet-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: null
    },
    disableUnitSelection: {
      type: Boolean,
      default: false
    },
    onlySmallestUnit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      index: null,
      searchText: '',
      options: [],
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
    ...mapGetters('inventoryInventoryDna', ['inventories'])
  },
  watch: {
    searchText: debounce(function () {
      this.search()
    }, 300)
  },
  created () {
    this.search()
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('inventoryInventoryDna', ['get', 'pagination']),
    init () {
      this.isLoading = true
      this.get({
        itemId: this.mutableItemId,
        params: {
          warehouse_id: this.mutableWarehouseId
        }
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
    open (row) {
      this.index = row.index
      if (!row.warehouse_id) {
        this.$alert.info('INPUT REQUIRED', this.$t('please select warehouse'))
        return
      }

      if (!row.item_id) {
        this.$alert.info('ITEM REQUIRED', this.$t('please select item'))
      }

      this.mutableRowId = row.row_id
      this.mutableItemId = row.item.id
      this.mutableItemName = row.item.name
      this.mutableWarehouseId = row.warehouse_id
      this.mutableRequireExpiryDate = row.item.require_expiry_date
      this.mutableRequireProductionNumber = row.item.require_production_number

      if (this.onlySmallestUnit) {
        const smallestUnit = row.item.units.find(unit => unit.converter === 1)
        this.mutableItemUnits = [smallestUnit]
        this.mutableItemUnit = smallestUnit
      } else {
        this.mutableItemUnits = row.item.units
        this.mutableItemUnit = row.item.unit
      }

      if (row.dna) {
        this.mutableInventories = row.dna
      }
      this.init()
      this.$refs['select-' + this.id].open()
    },
    update () {
      this.calculate()
      this.$emit('updated', {
        index: this.index,
        rowId: this.mutableRowId,
        unit: this.mutableItemUnit.name,
        converter: this.mutableItemUnit.converter,
        dna: this.inventories,
        quantity: this.mutableTotalQuantity
      })
      this.close()
    },
    close () {
      this.$refs['select-' + this.id].close()
    },
    onClose () {
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
