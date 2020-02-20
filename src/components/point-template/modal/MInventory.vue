<template>
  <div>
    <button
      v-if="!isPos"
      type="button"
      @click="show"
      class="btn btn-primary btn-sm">
      <span class="fa fa-shopping-cart"></span>
    </button>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="inventory">
      <template slot="content">
        <p-table>
          <tr slot="p-head">
            <th v-if="mutableRequireExpiryDate">Expiry Date</th>
            <th v-if="mutableRequireProductionNumber">Production No.</th>
            <th>Quantity</th>
          </tr>
          <tr slot="p-body" v-for="(inventory, index) in mutableInventories" :key="index">
            <td v-if="inventory.expiry_date && mutableRequireExpiryDate">{{ inventory.expiry_date | dateFormat('DD MMMM YYYY') }}</td>
            <td v-else-if="!inventory.expiry_date && mutableRequireExpiryDate">&nbsp;</td>
            <td v-if="mutableRequireProductionNumber">{{ inventory.production_number }}</td>
            <td>{{ inventory.quantity }} {{ mutableItemUnit }}</td>
          </tr>
        </p-table>
      </template>
      <template slot="footer">
        <button type="button" @click="close()" class="btn btn-sm btn-outline-danger">{{ $t('close') | uppercase }}</button>
      </template>
    </p-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'

export default {
  data () {
    return {
      mutableItemUnit: null,
      mutableInventories: [],
      mutableRequireExpiryDate: false,
      mutableRequireProductionNumber: false
    }
  },
  props: {
    id: {
      type: String,
      required: true
    },
    isPos: {
      type: Boolean,
      default: false
    },
    itemUnit: {
      type: String,
      default: null
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
    }
  },
  methods: {
    show (item) {
      if (item.item_id) {
        this.mutableItemUnit = item.unit
        this.mutableInventories = item.inventories
        this.mutableRequireExpiryDate = item.require_expiry_date
        this.mutableRequireProductionNumber = item.require_production_number
      } else {
        this.mutableItemUnit = this.itemUnit
        this.mutableInventories = this.inventories
        this.mutableRequireExpiryDate = this.requireExpiryDate
        this.mutableRequireProductionNumber = this.requireProductionNumber
      }
      this.$refs['select-' + this.id].show()
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
