<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select inventory') | uppercase"
      overlay-theme="dark"
      width="100%"
      @close="onClose()"
    >
      <div class="row">
        <div class="col-sm-12">
          <p-table>
            <tr slot="p-head">
              <th v-if="requireExpiryDate">
                Expiry Date
              </th>
              <th v-if="requireProductionNumber">
                Production No.
              </th>
              <th>Quantity</th>
              <th width="50px">
                &nbsp;
              </th>
            </tr>
            <tr
              v-for="(option, optionIndex) in options"
              slot="p-body"
              :key="optionIndex"
            >
              <td
                v-if="requireExpiryDate"
                width="100px"
              >
                <p-date-picker
                  id="expiry-date"
                  v-model="option.expiry_date"
                  name="expiry-date"
                />
              </td>
              <td
                v-if="requireProductionNumber"
              >
                <p-form-input
                  id="production-number"
                  v-model="option.production_number"
                  name="production-number"
                />
              </td>
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  v-model="option.quantity"
                  :name="'quantity' + index"
                  :units="units"
                  :unit="unit"
                  :max="max ? max : Number.MAX_SAFE_INTEGER"
                  :disable-unit-selection="disableUnitSelection"
                  @choosen="chooseUnit($event)"
                  @input="updateTotalQuantity()"
                />
              </td>
              <td>
                <button
                  class="btn btn-sm btn-secondary"
                  @click="deleteDna(index)"
                >
                  <i class=" fa fa-times" />
                </button>
              </td>
            </tr>
            <tr slot="p-body">
              <td />
              <td />
              <td>
                <p-quantity
                  :id="'quantity' + index"
                  v-model="totalQuantity"
                  :name="'quantity' + index"
                  :units="units"
                  :unit="unit"
                  :disabled="true"
                  :disable-unit-selection="disableUnitSelection"
                  @choosen="chooseUnit($event)"
                />
              </td>
              <td />
            </tr>
          </p-table>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-3">
          <button
            type="button"
            class="btn btn-sm btn-secondary btn-block"
            @click="addDna"
          >
            ADD
          </button>
        </div>
        <div class="col-sm-9">
          <button
            type="button"
            class="btn btn-sm btn-primary btn-block"
            @click="onSubmit"
          >
            SUBMIT
          </button>
        </div>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: null
    },
    disableUnitSelection: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      index: null,
      max: null,
      options: [],
      dna: [],
      totalQuantity: 0,
      requireExpiryDate: false,
      requireProductionNumber: false,
      units: [],
      unit: {
        name: null,
        label: null,
        converter: null
      }
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    chooseUnit (unit) {
      this.unit = unit
    },
    addDna () {
      this.options.push({
        expiry_date: this.$moment().format('YYYY-MM-DD'),
        production_number: null,
        quantity: 0,
        unit: this.unit
      })
    },
    deleteDna (index) {
      if (this.options.length > 1) {
        this.$delete(this.options, index)
      }
    },
    updateTotalQuantity () {
      this.totalQuantity = null
      this.options.map((key, value) => {
        this.totalQuantity += parseFloat(key.quantity || 0)
      })
    },
    onSubmit () {
      this.$emit('submit', {
        dna: this.options,
        unit: this.unit.name,
        converter: this.unit.converter,
        quantity: this.totalQuantity,
        index: this.index
      })
      this.$refs['select-' + this.id].close()
    },
    open (row, max = null) {
      this.index = row.index
      if (max != null) {
        this.max = max
      }
      this.options = []
      this.requireExpiryDate = row.item.require_expiry_date
      this.requireProductionNumber = row.item.require_production_number
      this.unit = {
        name: row.unit,
        label: row.unit,
        converter: row.converter
      }
      this.units = row.item.units
      if (row.dna && row.dna.length > 0) {
        this.options = row.dna
      } else {
        this.addDna()
      }
      this.$refs['select-' + this.id].open()
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
