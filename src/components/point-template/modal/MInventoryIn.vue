<template>
  <div>
    <sweet-modal
      :ref="'select-' + id"
      :title="$t('select inventory') | uppercase"
      overlay-theme="dark"
      width="100%"
      @close="onClose()">
      <div class="row">
        <div class="col-sm-12">
          <p-table>
            <tr slot="p-head">
              <th v-if="requireExpiryDate">Expiry Date</th>
              <th v-if="requireProductionNumber">Production No.</th>
              <th>Quantity</th>
              <th width="50px">&nbsp;</th>
            </tr>
            <tr slot="p-body" v-for="(option, index) in options" :key="index">
              <td width="100px">
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
                  :units="units"
                  :unit="unit"
                  @choosen="chooseUnit($event)"
                  @input="quantityChange"/>
              </td>
              <td>
                <button class="btn btn-sm btn-secondary" @click="deleteDna(index)"><i class=" fa fa-times"></i></button>
              </td>
            </tr>
          </p-table>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-3">
          <button type="button" class="btn btn-sm btn-secondary btn-block" @click="addDna">
            ADD
          </button>
        </div>
        <div class="col-sm-9">
          <button type="button" class="btn btn-sm btn-primary btn-block" @click="onSubmit">
            SUBMIT
          </button>
        </div>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      index: null,
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
  props: {
    id: {
      type: String,
      required: false
    }
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
    quantityChange () {
      this.totalQuantity = null
      this.options.map((key, value) => {
        this.totalQuantity += parseFloat(key['quantity'] || 0)
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
    open (row) {
      this.index = row.index
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
