<template>
  <div>
    <p-modal
      :id="'select-' + id"
      :ref="'select-' + id"
      title="inventory"
    >
      <template slot="content">
        <p-table>
          <tr slot="p-head">
            <th v-if="mutableRequireExpiryDate">
              Expiry Date
            </th>
            <th v-if="mutableRequireProductionNumber">
              Production No.
            </th>
            <th>Quantity</th>
          </tr>
          <tr
            v-for="(inventory, index) in mutableInventories"
            slot="p-body"
            :key="'inventory-dna-' + index"
          >
            <td v-if="mutableRequireExpiryDate">
              {{ inventory.expiry_date | dateFormat('DD MMMM YYYY') }}
            </td>
            <td v-if="mutableRequireProductionNumber">
              {{ inventory.production_number }}
            </td>
            <td>{{ inventory.quantity }} {{ mutableItemUnit }}</td>
          </tr>
        </p-table>
      </template>
      <template slot="footer">
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </template>
    </p-modal>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    inventories: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      mutableItemUnit: null,
      mutableInventories: [],
      mutableRequireExpiryDate: false,
      mutableRequireProductionNumber: false
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    show (inventories) {
      this.mutableInventories = inventories
      this.mutableRequireExpiryDate = true
      this.mutableRequireProductionNumber = true
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
