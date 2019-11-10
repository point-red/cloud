<template>
  <div>
    <div class="input-group">
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
          <template v-if="mutableMode == 'percent'">
            %
          </template>
          <template v-else>

          </template>
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
      mutableMode: this.mode,
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
      if (this.number > 100) {
        this.number = 100
      } else if (this.number < 0) {
        this.number = 0
      }
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
    mode: {
      type: String,
      default: 'percent'
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
