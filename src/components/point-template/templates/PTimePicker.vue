<template>
  <div>
    <date-picker
      format="HH:mm"
      type="time"
      v-model="time"
      value-type="HH:mm"
      v-mask="mask"/>

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
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

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
      type: [Date, String],
      default: new Date()
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
      mask: '##:##',
      time: this.value
    }
  },
  watch: {
    value () {
      if (this.time != this.value) {
        this.time = this.value
      }
    },
    time () {
      this.$emit('input', this.time)
    }
  }
}
</script>
