<template>
  <div>
    <input
      v-if="mask"
      :id="id"
      v-focus="isFocus"
      v-mask="mask"
      :name="name"
      :type="type"
      :disabled="disabled"
      :value="value"
      :class="{
        'js-masked-time' : maskedTimeFormat,
        'text-right' : isTextRight
      }"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      autocomplete="off"
      class="form-control"
      @input="updateValue($event.target.value)"
    >
    <!--
      Duplicated input with condition if statement because mask directive
      cannot receive empty param https://github.com/vuejs-tips/vue-the-mask
    -->
    <input
      v-if="!mask"
      :id="id"
      ref="input"
      v-focus="isFocus"
      :name="name"
      :type="type"
      :disabled="disabled"
      :value="value"
      :class="{
        'js-masked-time' : maskedTimeFormat,
        'text-right' : isTextRight
      }"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      autocomplete="off"
      class="form-control"
      @input="updateValue($event.target.value)"
    >
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
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
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
      type: String,
      default: ''
    },
    isFocus: {
      type: Boolean,
      default: false
    },
    isTextRight: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: ''
    },
    errors: {
      type: Array,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    }
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
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  }
}
</script>

<style scoped>
.invalid-input {
  display: block;
  margin-top: .25rem;
  font-size: .875rem;
  color: #ef5350;
}
input {
  min-width: 200px;
}
</style>
