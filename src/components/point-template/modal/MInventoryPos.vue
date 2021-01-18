<template>
  <div>
    <p-modal
      :id="'select-' + id"
      :ref="'select-' + id"
      title="select inventory"
    >
      <template slot="content">
        <input
          v-model="searchText"
          type="text"
          class="form-control"
          placeholder="Search..."
          @keydown.enter.prevent=""
        >
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
              <th class="text-right">
                Stock
              </th>
            </tr>
            <tr
              v-for="(option, index) in inventories"
              slot="p-body"
              :key="index"
            >
              <td v-if="mutableRequireExpiryDate">
                {{ option.expiry_date | dateFormat('DD MMMM YYYY') }}
              </td>
              <td v-if="mutableRequireProductionNumber">
                {{ option.production_number }}
              </td>
              <td class="text-right">
                <p-form-number
                  :id="'quantity' + index"
                  v-model="option.quantity"
                  :name="'quantity' + index"
                  @input="calculate"
                />
              </td>
              <td class="text-right">
                {{ option.remaining | numberFormat }}
              </td>
            </tr>
            <tr slot="p-body">
              <td />
              <td />
              <td class="text-right">
                <p-form-number
                  id="total-quantity"
                  v-model="mutableTotalQuantity"
                  name="total-quantity"
                  :readonly="true"
                />
              </td>
              <td class="text-right" />
            </tr>
          </p-table>
          <hr>
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
                v-model="mutableNotes"
                rows="5"
                class="form-control"
                placeholder="Notes"
              />
            </div>
          </p-form-row>
        </div>
        <div
          v-if="searchText && options.length == 0 && !isLoading"
          class="alert alert-info text-center"
        >
          {{ $t('searching not found', [searchText]) | capitalize }}
        </div>
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-primary"
          @click="update()"
        >
          {{ $t('update') | uppercase }}
        </button>
      </template>
    </p-modal>
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
    }
  },
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
        label: null,
        name: null,
        converter: 0
      },
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
        itemId: this.mutableItemId
      }).then(response => {
        this.inventories.forEach(inventory => {
          inventory.quantity = 0
        })
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
      })
    },
    search () {
      //
    },
    calculate () {
      this.mutableTotalQuantity = 0
      this.inventories.forEach(inventory => {
        this.mutableTotalQuantity += parseFloat(inventory.quantity)
      })
    },
    show (item, warehouseId) {
      if (!warehouseId) {
        this.$alert.info('INPUT REQUIRED', this.$t('please select warehouse'))
      } else if (!item) {
        this.$alert.info('ITEM REQUIRED', this.$t('please select item'))
      } else {
        this.mutableWarehouseId = warehouseId
        this.mutableItemId = item.id
        this.mutableItemName = item.name
        this.mutableItemPrice = item.price
        this.mutableItemUnit = item.unit
        this.mutableItemUnits = item.units
        this.mutableRequireExpiryDate = item.require_expiry_date
        this.mutableRequireProductionNumber = item.require_production_number
        this.mutableNotes = item.notes
        this.mutableInventories = item.inventories
        this.mutableDiscountPercent = item.discount_percent
        this.init()
        this.$refs['select-' + this.id].show()
      }
    },
    update () {
      this.calculate()
      this.$emit('add', {
        inventories: this.inventories,
        quantity: this.mutableTotalQuantity,
        notes: this.mutableNotes,
        discountPercent: this.mutableDiscountPercent
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
