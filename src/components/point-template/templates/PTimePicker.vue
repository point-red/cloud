<template>
  <div>
    <date-picker
      v-model="time"
      v-mask="mask"
      format="HH:mm"
      type="time"
      value-type="HH:mm"
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
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  components: {
    DatePicker
  },
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: [Date, String],
      default: new Date()
    },
    help: {
      type: String,
      default: ''
    },
    errors: {
      type: Array,
      default: null
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
