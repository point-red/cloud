<template>
  <div>
    <v-selectmenu
      :data="options"
      :key-field="keyField"
      :show-field="labelField"
      position="left"
      ref="select"
      :multiple="multiple"
      :max-selected="maxSelected"
      :key="options.length"
      v-model="selectedValue">
    </v-selectmenu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      selectedValue: ''
    }
  },
  props: {
    keyField: {
      type: String,
      default: 'id'
    },
    labelField: {
      type: String,
      default: 'label'
    },
    options: {
      type: Array
    },
    placeholder: {
      type: String,
      default: 'SELECT'
    },
    value: {
      type: [String, Number, Boolean]
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSelected: {
      type: Number,
      default: 0 // 0 = unlimited
    }
  },
  created () {
    if (this.value !== undefined && this.value !== null) {
      this.selectedValue = this.value.toString()
    }
  },
  watch: {
    'selectedValue' () {
      this.$emit('input', this.selectedValue)
    },
    'value' () {
      if (this.value) {
        this.selectedValue = this.value.toString()
      } else {
        this.$refs.select.clear()
      }
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
</style>
<style>
.v-dropdown-container {
  z-index: 10950 !important;
}
</style>
