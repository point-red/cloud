<template>
  <div>
    <date-picker
      v-model="time"
      :name="name"
      :range="true"
      :overlay="true"
      :format="format"
      :formatted="formatted"
      :auto-close="true"
      :min-date="minDate"
      :max-date="maxDate"
      color="#343A40"
      button-color="#343A40"
    />

    <div
      v-for="(error, index) in errors"
      :key="index"
      class="invalid-feedback"
    >
      {{ error }}
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
import DatePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

export default {
  components: {
    DatePicker
  },
  props: {
    name: {
      type: String,
      default: null
    },
    value: {
      type: [Object, String],
      default: null
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
      time: null,
      format: 'YYYY-MM-DD',
      formatted: 'DD MMM YYYY',
      defaultMinDate: this.$moment('2000-01-01').format('YYYY-MM-DD'),
      defaultMaxDate: this.$moment().format('YYYY-MM-DD'),
      autoClose: true
    }
  },
  watch: {
    'time' () {
      this.$emit('input', this.time)
    }
  },
  mounted () {
    this.time = this.value
  }
}
</script>
