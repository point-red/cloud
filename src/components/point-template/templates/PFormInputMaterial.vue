<template>
  <div
    :class="{ 'is-invalid' : errors }"
    class="form-group row"
  >
    <div class="col-12">
      <div
        :class="{ 'open' : value }"
        class="form-material"
      >
        <input
          :id="id"
          :type="type"
          :value="value"
          :class="{ 'js-masked-time' : maskedTimeFormat }"
          :name="name"
          :placeholder="placeholder"
          :readonly="readonly"
          class="form-control"
          @input="updateValue($event.target.value)"
        >
        <label
          v-show="label"
          :for="name"
        >{{ label }}</label>
      </div>

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
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maskedTimeFormat: {
      type: Boolean,
      default: false
    },
    isMaterial: {
      type: Boolean,
      default: true
    },
    help: {
      type: String,
      default: null
    },
    errors: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
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
    }
  }
}
</script>
