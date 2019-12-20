<template>
  <div>
    <button
      type="button"
      @click="show"
      class="btn btn-primary btn-sm">
      <span class="fa fa-shopping-cart"></span>
    </button>
    <p-modal :ref="'select-' + id" :id="'select-' + id" title="inventory">
      <template slot="content">
        <p-table>
          <tr slot="p-head">
            <th v-if="requireExpiryDate">Expiry Date</th>
            <th v-if="requireProductionNumber">Production No.</th>
            <th>Quantity</th>
          </tr>
          <tr slot="p-body" v-for="(inventory, index) in inventories" :key="index">
            <td v-if="inventory.expiry_date && requireExpiryDate">{{ inventory.expiry_date | dateFormat('DD MMMM YYYY') }}</td>
            <td v-else-if="!inventory.expiry_date && requireExpiryDate">&nbsp;</td>
            <td v-if="requireProductionNumber">{{ inventory.production_number }}</td>
            <td>{{ inventory.quantity }}</td>
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

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    inventories: {
      type: Array,
      required: true
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
    show () {
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
