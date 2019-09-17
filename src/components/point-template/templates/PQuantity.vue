<template>
  <div>
    <div class="input-group" style="min-width: 180px">
      <cleave
        :readonly="readonly"
        v-model="number"
        :options="options"
        class="form-control form-number"
        :class="{
          'text-right' : isTextRight
        }"></cleave>
      <div class="input-group-append">
        <span class="input-group-text">
          {{ unit }}
        </span>
        <button v-show="showAddReduceButtons" class="btn btn-outline-secondary" type="button" @click="add">+</button>
        <button v-show="showAddReduceButtons" class="btn btn-outline-secondary" type="button" @click="reduce">-</button>
      </div>
    </div>
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
      number: this.value,
      options: {
        numeral: true,
        numeralDecimalScale: 15,
        numeralPositiveOnly: this.unsigned
      }
    }
  },
  watch: {
    value () {
      this.number = this.value
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
      type: String,
      default: ''
    },
    value: null,
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
    }
  }
}
</script>

<style scoped>
.form-number {
  min-width: 150px;
}
</style>
