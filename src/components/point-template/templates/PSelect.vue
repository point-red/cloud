<template>
  <div>
    <v-selectmenu
      ref="select"
      :key="options.length"
      v-model="selectedValue"
      :data="options"
      :key-field="keyField"
      :show-field="labelField"
      position="left"
      :disabled="disabled"
      :multiple="multiple"
      :max-selected="maxSelected"
      :required="required"
    />

    <div
      v-for="(error, index) in errors"
      :key="index"
      class="invalid-input"
    >
      <i class="fa fa-warning" /> {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    keyField: {
      type: String,
      default: 'id'
    },
    labelField: {
      type: String,
      default: 'label'
    },
    options: {
      type: Array,
      default: null
    },
    placeholder: {
      type: String,
      default: 'SELECT'
    },
    value: {
      type: [String, Number, Boolean],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSelected: {
      type: Number,
      default: 0 // 0 = unlimited
    },
    errors: {
      type: Array,
      default: () => []
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedValue: ''
    }
  },
  watch: {
    'selectedValue' () {
      this.$emit('input', this.selectedValue)
    },
    'value' () {
      if (this.value == 0 || this.value) {
        this.selectedValue = this.value.toString()
      } else {
        this.$refs.select.clear()
      }
    }
  },
  created () {
    if (this.value !== undefined && this.value !== null) {
      this.selectedValue = this.value.toString()
    }
  }
}
</script>

<style scoped>
.sm-default-btn {
  width: 100%;
  text-align: left;
}
.caller-container {
  width: 100%;
  min-width: 200px;
}
.sm-item-text {
  white-space: pre-wrap;
}
.v-dropdown-container {
  max-width: 75%;
}
.invalid-input {
  display: block;
  margin-top: .25rem;
  font-size: .875rem;
  color: #ef5350;
}
</style>
<style>
.v-dropdown-container {
  z-index: 10950 !important;
}
.sm-default-btn.sm-default-btn--disabled {
  color: #606061;
}
</style>
