<template>
  <div>
    <div class="input-group">
      <p-form-number
        ref="formDiscount"
        v-if="isPercent"
        :readonly="readonly"
        :value="discountPercent"
        :options="options"
        :is-text-right="isTextRight"
        :max="100"
        @input="discountPercentChanged"/>
      <p-form-number
        ref="formDiscount"
        v-else
        :readonly="readonly"
        :value="discountValue"
        :options="options"
        :is-text-right="isTextRight"
        :max="baseValue"
        @input="discountValueChanged"/>
      <div class="input-group-append">
        <button type="button" class="btn btn-outline-dark py-0 px-5" @click="togglePercent">
          <div class="d-flex align-items-center">
            <div class="mr-2">
              <span :class="{'text-black-50': isPercent}">123</span><br>
              <span :class="{'text-black-50': !isPercent}">%</span>
            </div>
            <div>
              <i class="fa fa-sort-down"></i>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      number: this.value,
      isPercent: true,
      options: {
        numeral: true,
        numeralDecimalScale: 15,
        numeralPositiveOnly: this.unsigned
      }
    }
  },
  watch: {
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
    isTextRight: {
      type: Boolean,
      default: true
    },
    discountPercent: {
      type: Number,
      default: 0
    },
    discountValue: {
      type: Number,
      default: 0
    },
    baseValue: {
      type: Number,
      required: true
    }
  },
  methods: {
    togglePercent () {
      this.isPercent = !this.isPercent
      this.discountPercentChanged(0)
      this.$nextTick(() => {
        this.$refs.formDiscount.setFocus()
      })
    },
    discountPercentChanged (value) {
      this.$emit('update:discountPercent', value * 1)
      this.discountValueChanged(this.baseValue * value / 100)
    },
    discountValueChanged (value) {
      this.$emit('update:discountValue', value * 1)
    }
  }
}
</script>

<style scoped>
.form-number {
  min-width: 150px;
}
</style>
