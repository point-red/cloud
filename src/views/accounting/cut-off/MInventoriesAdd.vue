<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('add item') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <hr>
      <div v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </div>
      <div
        v-else
        class="list-group push"
      >
        <point-table>
          <tr slot="p-head">
            <th>{{ $t('item group') }}</th>
            <th>{{ $t('warehouse') }}</th>
            <th>{{ $t('item') }}</th>
            <th>{{ $t('quantity') }}</th>
            <th>{{ $t('amount') }}</th>
          </tr>
          <template slot="p-body">
            <tr
              v-for="(row, i) in items"
              slot="p-body"
              :key="i"
            >
              <td class="align-top">
                <span
                  class="select-link"
                  @click="$refs.itemGroupRef.open(i)"
                >
                  {{ row.group_name || $t('select') | uppercase }}
                </span>
              </td>
              <td class="align-top">
                <span
                  class="select-link"
                  :disabled="!row.object_id"
                  @click="$refs.warehouse.open(i)"
                >{{ row.warehouse_name || $t('select') | uppercase }}</span>
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.quantity']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <span
                  class="select-link"
                  @click="openItemRef(row, i)"
                >
                  {{ row.item_name || $t('select') | uppercase }}
                </span>
              </td>
              <td class="align-top">
                <p-quantity
                  v-if="row.object_id"
                  :id="'quantity' + i"
                  v-model="row.quantity"
                  :name="'quantity' + i"
                  :units="row.units"
                  :unit="{
                    name: row.unit,
                    label: row.unit,
                    converter: row.converter
                  }"
                  :disabled="!row.object_id"
                  :value="row.quantity"
                  :readonly="onClickUnit(row)"
                  :disable-unit-selection="true"
                  @choosen="chooseUnit($event)"
                  @click.native="onClickQuantity(row, i)"
                  @keyup.native="calculate(row, i)"
                />
                <p-form-number
                  v-if="!row.object_id"
                  :id="'quantity-' + i"
                  v-model="row.quantity"
                  :name="'quantity-' + i"
                  :disabled="!row.object_id"
                  @keyup.native="calculate(row, i)"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.quantity']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
              <td class="align-top">
                <p-form-number
                  :id="'amount-' + i"
                  v-model="row.total"
                  :name="'amount-' + i"
                  :disabled="!row.object_id"
                  @keyup.native="calculate(row, i)"
                />
                <span
                  v-if="errors && errors['details.'+index+'.items.'+i+'.total']"
                  class="text-danger"
                >
                  {{ $t('check again') }}
                </span>
              </td>
            </tr>
          </template>
        </point-table>

        <div class="col-sm-12">
          <hr>
          <button
            type="submit"
            class="btn btn-block btn-sm btn-primary"
            :disabled="items.length === 1 || items.find((item) => item.object_id !== null && (!item.warehouse_id || !item.quantity || item.total <= 0))"
            @click="choose"
          >
            {{ $t('submit') | uppercase }}
          </button>
        </div>
      </div>
    </sweet-modal>
    <m-item
      ref="itemRef"
      @choosen="chooseItem"
    />

    <m-item-group
      ref="itemGroupRef"
      @choosen="onChoosenItemGroup"
    />

    <m-warehouse
      id="warehouse_id"
      ref="warehouse"
      @choosen="chooseWarehouse"
    />
    <m-inventory-in
      :id="'inventory'"
      ref="inventory"
      :disable-unit-selection="true"
      @submit="updateDna"
    />
  </div>
</template>

<script>
import PointTable from 'point-table-vue'

export default {
  components: {
    PointTable
  },
  data () {
    return {
      errors: [],
      chartOfAccountId: null,
      groupId: null,
      index: null,
      items: [],
      mutableId: this.value,
      mutableLabel: this.label,
      isSaving: false,
      isLoading: false,
      position: null,
      type: null
    }
  },
  computed: {
  },
  watch: {
    label () {
      this.mutableLabel = this.label
    }
  },
  created () {
    this.addItemRow()
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    chooseUnit (unit) {
      console.log(unit)
      this.unit = unit
    },
    openItemRef (row, index) {
      this.$refs.itemRef.groupId = row.group_id
      this.$refs.itemRef.chartOfAccountId = this.chartOfAccountId
      this.$refs.itemRef.open(index, row.group_id)
    },
    addItemRow () {
      let isNeedNewRow = true
      this.items.forEach(element => {
        if (element.object_id == null) {
          isNeedNewRow = false
        }
      })
      if (!isNeedNewRow) return true
      this.items.push({
        object_id: null,
        item_name: null,
        group_name: null,
        warehouse_name: null,
        warehouse_id: null,
        quantity: null,
        unit: null,
        converter: null,
        price: null,
        expiry_date: null,
        production_number: null,
        total: null
      })
    },
    calculate (row, index) {
      console.log(parseInt(row.total, 10), parseInt(row.quantity, 10), parseInt(row.converter, 10))
      this.items[index].price = parseInt(row.total, 10) / (parseInt(row.quantity, 10) * parseInt(row.converter, 10))
    },
    chooseItem (item) {
      if (item.id == null) {
        return
      }
      let minConverter = Number.MAX_SAFE_INTEGER

      const row = this.items[item.index]
      row.item = item
      row.object_id = item.id
      row.item_id = item.id
      row.item_name = item.name
      row.item_label = item.label
      row.require_production_number = item.require_production_number
      row.require_expiry_date = item.require_expiry_date
      row.units = item.units
      row.units.forEach((unit, keyUnit) => {
        if (unit.converter < minConverter) {
          minConverter = unit.converter
          row.unit = unit.label
          row.converter = unit.converter
        }
      })
      this.addItemRow()
    },
    onChoosenItemGroup (group) {
      this.items[group.index].group_id = group.id
      this.items[group.index].group_name = group.name
    },
    chooseWarehouse (option) {
      this.items[option.index].warehouse_name = option.name
      this.items[option.index].warehouse_id = option.id
    },
    onClickUnit (row) {
      if (row.item || row.item_id == null || row.require_expiry_date === 1 || row.require_production_number === 1) {
        return true
      }
      return false
    },
    onClickQuantity (row, index) {
      if (row.require_expiry_date == 1 || row.require_production_number == 1) {
        row.index = index
        this.$refs.inventory.open(row)
      }
    },
    updateDna (e) {
      this.items[e.index].dna = e.dna
      this.items[e.index].quantity = e.quantity
      this.items[e.index].unit = e.unit
      this.items[e.index].converter = e.converter
    },
    onChoose (value) {
      this.items[value.index].object_id = value.id
      this.items[value.index].name = value.name
      this.addItemRow()
    },
    choose (option) {
      option.index = this.index
      option.items = this.items.filter(item => item.object_id !== null)
      this.mutableId = option.id
      this.mutableLabel = option.label

      this.$emit('input', option.id)
      this.$emit('choosen', option)
      this.close()
    },
    open (index, row) {
      this.index = index
      this.position = row.chart_of_account_position
      this.type = row.chart_of_account_sub_ledger.trim().toLowerCase()
      this.chartOfAccountId = row.chart_of_account_id
      this.items = row.items
      this.addItemRow()
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
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
