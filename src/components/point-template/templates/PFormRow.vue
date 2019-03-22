<template>
  <div class="form-group" :class="{ 'row' : isHorizontal }">
    <slot name="label">
      <label class="col-form-label" :class="{'col-lg-3' : isHorizontal}" :for="id">{{ label | titlecase(transformTitle) }}</label>
    </slot>
    <slot name="body">
      <div :class="{'col-lg-9' : isHorizontal}">
        <p-form-input
          :id="id"
          :name="name"
          :type="type"
          :disabled="disabled"
          :value="value"
          :placeholder="placeholder"
          :readonly="readonly"
          :maskedTimeFormat="maskedTimeFormat"
          :mask="mask"
          :is-focus="isFocus"
          :is-text-right="isTextRight"
          :help="help"
          :errors="errors"
          ref="input"
          @input="updateValue"/>
      </div>
    </slot>
  </div>
</template>

<script>
import PFormInput from './PFormInput'

export default {
  components: {
    PFormInput
  },
  props: {
    id: {
      type: String
    },
    name: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number]
    },
    placeholder: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maskedTimeFormat: {
      type: Boolean,
      default: false
    },
    mask: {
      type: String
    },
    isFocus: {
      tyle: Boolean,
      default: false
    },
    isTextRight: {
      type: Boolean,
      default: false
    },
    isHorizontal: {
      type: Boolean,
      default: true
    },
    transformTitle: {
      type: Boolean,
      default: true
    },
    help: null,
    errors: null
  },
  watch: {
    value () {
      this.$emit('errors', null)
    }
  },
  methods: {
    updateValue (value) {
      this.$emit('input', value)
    },
    setFocus () {
      this.$refs.input.setFocus()
    }
  }
}
</script>
