<template>
  <div class="input-group">
    <p-form-number
      v-if="isPercent"
      ref="formDiscount"
      width="100%"
      style="width:100%"
      :readonly="readonly"
      :value="discountPercent"
      :options="options"
      :is-text-right="isTextRight"
      :max="100"
      @input="discountPercentChanged"
    />
    <p-form-number
      v-else
      ref="formDiscount"
      width="100%"
      style="width:100%"
      :readonly="readonly"
      :value="discountValue"
      :options="options"
      :is-text-right="isTextRight"
      :max="baseValue"
      @input="discountValueChanged"
    />
    <div
      class="input-group-append"
      @click="togglePercent"
    >
      <div
        v-if="isPercent"
        class="input-group-text"
      >
        %
      </div>
      <div
        v-else
        class="input-group-text"
      />
    </div>
  </div>
</template>

<script>
export default {
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
  data () {
    return {
      number: this.value,
      isPercent: false,
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
    },
    discountPercent () {
      if (this.discountPercent != 0) {
        this.isPercent = true
      } else if (this.discountPercent == 0 && this.discountValue != 0) {
        this.isPercent = false
      }
    },
    discountValue () {
      if (this.discountPercent != 0) {
        this.isPercent = true
      } else if (this.discountPercent == 0 && this.discountValue != 0) {
        this.isPercent = false
      }
    }
  },
  methods: {
    togglePercent () {
      if (!this.readonly) {
        this.isPercent = !this.isPercent
        this.discountPercentChanged(0)
        this.$nextTick(() => {
          this.$refs.formDiscount.setFocus()
        })
      }
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
