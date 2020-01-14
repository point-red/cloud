<template>
  <div>
    <div class="input-group" style="min-width: 180px">
      <cleave
        :readonly="readonly"
        v-model="number"
        :options="options"
        class="form-control form-number"
        :class="{ 'text-right' : isTextRight }"/>
      <div class="input-group-append" @click="() => $refs.quantityUnit.show(units)">
        <span class="input-group-text">
          {{ mutableUnit.label }}
        </span>
        <button v-show="showAddReduceButtons" class="btn btn-outline-secondary" type="button" @click="add">+</button>
        <button v-show="showAddReduceButtons" class="btn btn-outline-secondary" type="button" @click="reduce">-</button>
      </div>
    </div>
    <m-quantity-unit
      :id="'quantity-unit-'+itemId+'-'+Math.random()"
      ref="quantityUnit"
      @choosen="chooseUnit($event)"/>
  </div>
</template>

<script>
import Cleave from 'vue-cleave-component'

export default {
  components: {
    Cleave
  },
  data () {
    return {
      id: this.itemId,
      number: null,
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
    unit () {
      this.mutableUnit.name = this.unit.label
      this.mutableUnit.label = this.unit.label
    },
    number () {
      this.$emit('input', this.number)
    }
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    unsigned: {
      type: Boolean,
      default: false
    },
    isTextRight: {
      type: Boolean,
      default: true
    },
    unit: {
      type: Object
    },
    itemId: {
      type: Number
    },
    units: {
      type: Array
    },
    showAddReduceButtons: {
      type: Boolean,
      default: false
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
    chooseUnit (unit) {
      this.mutableUnit.label = unit.label
      this.mutableUnit.name = unit.name
      this.mutableUnit.id = unit.id
      this.mutableUnit.converter = unit.converter
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
