<template>
  <div>
    <date-picker
      v-model="date"
      v-mask="mask"
      format="DD-MM-YYYY"
      type="date"
      :shortcuts="shortcuts"
      :disabled="disabled"
      value-type="YYYY-MM-DD"
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
    disabled: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: null
    },
    value: {
      type: [Date, String],
      default: new Date()
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
      mask: '##-##-####',
      date: this.value,
      shortcuts: [
        {
          text: 'Today',
          onClick () {
            const date = new Date()
            return date
          }
        },
        {
          text: 'First',
          onClick () {
            const date = new Date()
            date.setDate(1)
            return date
          }
        },
        {
          text: 'Last',
          onClick () {
            const date = new Date()
            date.setMonth(date.getMonth() + 1)
            date.setDate(0)
            return date
          }
        },
        {
          text: 'Yesterday',
          onClick () {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          }
        },
        {
          text: 'Last Week',
          onClick () {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          }
        },
        {
          text: 'Last Month',
          onClick () {
            const date = new Date()
            date.setMonth(date.getMonth() - 1)
            return date
          }
        },
        {
          text: 'Last Year',
          onClick () {
            const date = new Date()
            date.setYear(date.getFullYear() - 1)
            return date
          }
        }
      ]
    }
  },
  watch: {
    value () {
      if (this.date != this.value) {
        this.date = this.value
      }
    },
    date () {
      this.$emit('input', this.date)
    }
  }
}
</script>

<style>
.mx-datepicker-popup {
  z-index: 9050 !important;
}
.mx-input {
  min-width: 160px !important;
}
.mx-datepicker {
  width: 170px !important;
}
</style>
