<template>
  <div>
    <div
      class="input-group"
      style="min-width: 180px"
    >
      <cleave
        v-model="number"
        :readonly="readonly"
        :options="options"
        class="form-control form-number"
        :class="{
          'text-right' : isTextRight,
          'bg-gray-light' : disabled,
          'bg-white' : !disabled
        }"
      />
      <div
        class="input-group-append"
        @click="onClickUnit"
      >
        <span class="input-group-text">
          {{ mutableUnit.label | uppercase }}
        </span>
        <button
          v-show="showAddReduceButtons"
          class="btn btn-sm btn-outline-secondary"
          type="button"
          @click="add"
        >
          +
        </button>
        <button
          v-show="showAddReduceButtons"
          class="btn btn-sm btn-outline-secondary"
          type="button"
          @click="reduce"
        >
          -
        </button>
      </div>
    </div>
    <m-quantity-unit
      :id="'quantity-unit-'+itemId+'-'+Math.random()"
      ref="quantityUnit"
      @choosen="chooseUnit($event)"
    />
  </div>
</template>

<script>
import Cleave from 'vue-cleave-component'

export default {
  components: {
    Cleave
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    unsigned: {
      type: Boolean,
      default: false
    },
    disableUnitSelection: {
      type: Boolean,
      default: false
    },
    isTextRight: {
      type: Boolean,
      default: true
    },
    unit: {
      type: Object,
      default: null
    },
    value: {
      type: [Number, String],
      default: null
    },
    itemId: {
      type: Number,
      default: null
    },
    units: {
      type: Array,
      default: null
    },
    showAddReduceButtons: {
      type: Boolean,
      default: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Number.MAX_SAFE_INTEGER
    }
  },
  data () {
    return {
      id: this.itemId,
      number: this.value,
      mutableUnit: {
        id: this.unit.id,
        name: this.unit.name,
        converter: this.unit.converter,
        label: this.unit.label
      },
      options: {
        numeral: true,
        numeralDecimalScale: 15,
        numeralPositiveOnly: this.unsigned
      }
    }
  },
  watch: {
    unit: {
      handler: function (newValue) {
        this.mutableUnit.name = this.unit.name
        this.mutableUnit.label = this.unit.label
        this.mutableUnit.converter = this.unit.converter
      },
      deep: true
    },
    value () {
      this.number = this.value
    },
    number () {
      this.$emit('input', this.number)

      this.$nextTick(() => {
        if (this.number < this.min) {
          this.$emit('input', this.min)
        } else if (this.number > this.max) {
          this.$emit('input', this.max)
        }
      })
    }
  },
  methods: {
    add () {
      this.number++
    },
    reduce () {
      if (this.number >= 1) {
        this.number--
      }
    },
    onClickUnit () {
      if (this.disableUnitSelection == true || this.disabled == true) {
        return
      }
      this.$refs.quantityUnit.open(this.units)
    },
    chooseUnit (unit) {
      this.mutableUnit.label = unit.label
      this.mutableUnit.name = unit.name
      this.mutableUnit.id = unit.id
      this.mutableUnit.converter = unit.converter
      this.mutableUnit.prices = unit.prices
      this.$emit('choosen', this.mutableUnit)
    }
  }
}
</script>

<style scoped>
.form-number {
  min-width: 150px;
}
</style>
