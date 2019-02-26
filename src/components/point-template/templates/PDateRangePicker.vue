<template>
  <div>
    <date-picker
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
import DatePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

export default {
  components: {
    DatePicker
  },
  props: {
    name: {
      type: String,
      required: false
    },
    value: {
      type: [Object, String]
    },
    readonly: {
      type: Boolean,
      default: false
    },
    help: {
      type: String
    },
    errors: {
      type: Array
    }
  },
  computed: {
    onlyDate () {
      if (this.type === 'date') {
        this.format = 'YYYY-MM-DD'
        this.formatted = 'DD MMM YYYY'
        return true
      }

      return false
    }
  },
  data () {
    return {
      time: null,
      format: 'YYYY-MM-DD',
      formatted: 'DD MMM YYYY',
      minDate: this.$moment('2000-01-01').format('YYYY-MM-DD'),
      maxDate: this.$moment().format('YYYY-MM-DD'),
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
