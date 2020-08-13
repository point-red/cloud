<template>
  <div>
    <cleave
      ref="formNumber"
      v-model="number"
      :readonly="readonly"
      :options="options"
      :disabled="disabled"
      class="form-control form-number"
      :class="{
        'text-right' : isTextRight
      }"
    />
    <div
      v-for="(error, index) in errors"
      :key="index"
      class="invalid-input"
    >
      <i class="fa fa-warning" /> {{ error }}
    </div>
    <div
      v-show="help"
      class="form-text text-muted"
    >
      {{ help }}
    </div>
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
      type: String,
      default: null
    },
    errors: {
      type: Array,
      default: null
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
    setFocus () {
      this.$refs.formNumber.$el.select()
    }
  }
}
</script>

<style scoped>
.form-number {
  min-width: 150px;
}
</style>
