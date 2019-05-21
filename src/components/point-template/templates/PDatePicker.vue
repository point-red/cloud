<template>
  <div>
    <date-picker
      :name="name"
      :overlay="true"
      :format="format"
      :formatted="formatted"
      :auto-close="autoClose"
      :min-date="minDate"
      :max-date="maxDate"
      :only-date="onlyDate"
      color="#343A40"
      button-color="#343A40"
      v-model="time">
    </date-picker>

    <div
      v-for="(error, index) in errors"
      :key="index"
      class="invalid-feedback">{{ error }}</div>
    <div
      v-show="help"
      class="form-text text-muted">{{ help }}</div>
  </div>
</template>

<script>
import DatePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  components: {
    DatePicker
  },
  props: {
    name: {
      type: String,
      required: false
    },
    type: {
      type: String,
      default: 'date'
    },
    value: {
      type: [Object, String]
    },
    readonly: {
      type: Boolean,
      default: false
    },
    minDate: {
      type: String,
      default: null
    },
    maxDate: {
      type: String,
      default: null
    },
    onlyDate: {
      type: Boolean,
      default: true
    },
    help: {
      type: String
    },
    errors: {
      type: Array
    }
  },
  data () {
    return {
      time: this.value,
      format: 'YYYY-MM-DD HH:mm:ss',
      formatted: 'DD MMM YYYY HH:mm',
      defaultMinDate: this.$moment('2000-01-01').format('YYYY-MM-DD'),
      defaultMaxDate: this.$moment().format('YYYY-MM-DD'),
      autoClose: true
    }
  },
  watch: {
    time () {
      this.$emit('input', this.time)
    },
    value () {
      this.time = this.value
    }
  },
  mounted () {
    if (this.type === 'date') {
      this.format = 'YYYY-MM-DD HH:mm:ss'
      this.formatted = 'DD MMM YYYY'
      this.autoClose = true
    } else {
      this.format = 'YYYY-MM-DD HH:mm:ss'
      this.formatted = 'DD MMM YYYY HH:mm'
      this.autoClose = false
    }
  }
}
</script>
