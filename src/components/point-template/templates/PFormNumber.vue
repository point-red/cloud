<template>
  <div>
    <cleave :readonly="readonly" v-model="number" :options="options" :disabled="disabled" class="form-control form-number"
      :class="{
        'text-right' : isTextRight
      }"></cleave>
    <div
      v-for="(error, index) in errors"
      :key="index"
      class="invalid-input"><i class="fa fa-warning"></i> {{ error }}</div>
    <div
      v-show="help"
      class="form-text text-muted">{{ help }}</div>
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
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: 0
    },
    help: {
      type: String
    },
    errors: {
      type: Array,
      default: null
    }
  }
}
</script>

<style scoped>
.form-number {
  min-width: 150px;
}
</style>
