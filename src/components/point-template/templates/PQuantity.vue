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
      required: true
    },
    value: null
  }
}
</script>

<style scoped>
.form-number {
  min-width: 150px;
}
</style>
