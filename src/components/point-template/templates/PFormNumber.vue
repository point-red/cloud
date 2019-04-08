<template>
  <div>
    <cleave :readonly="readonly" v-model="number" :options="options" class="form-control form-number"
      :class="{
        'text-right' : isTextRight
      }"></cleave>
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
    value: 0
  }
}
</script>

<style scoped>
.form-number {
  min-width: 150px;
}
</style>
