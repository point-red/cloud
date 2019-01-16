<template>
  <div>
    <date-picker
      :lang="lang"
      :name="name"
      :type="type"
      :format="format"
      :editable="false"
      v-model="time">
      <i class="fa fa-calendar" slot="calendar-icon"></i>
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
import DatePicker from 'vue2-datepicker'

export default {
  components: {
    DatePicker
  },
  props: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    value: {
      type: [Date, String]
    },
    placeholder: {
      type: String
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
  data () {
    return {
      time: new Date(),
      range: [new Date(), new Date()],
      emptyTime: '',
      emptyRange: [],
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        pickers: ['next 7 days', 'next 30 days', 'previous 7 days', 'previous 30 days'],
        placeholder: {
          date: 'Select Date',
          dateRange: 'Select Date Range'
        }
      }
    }
  },
  watch: {
    'time' () {
      this.time = this.$moment(this.time).format(this.format)
      this.$emit('input', this.time)
    },
    'value' () {
      this.value = this.$moment(this.value).format(this.format)
      this.time = this.value
    }
  },
  mounted () {
    this.time = this.value
  }
}
</script>
