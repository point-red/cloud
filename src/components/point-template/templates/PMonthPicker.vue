<template>
  <div>
    <date-picker
      :lang="lang"
      :name="name"
      format="YYYY-MM"
      type="month"
      value-type="YYYY-MM"
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
      emptyTime: '',
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        placeholder: {
          date: 'Select Period'
        }
      }
    }
  },
  watch: {
    'time' () {
      this.$emit('input', this.time)
    },
    'value' () {
      this.time = this.$moment(this.value).format('YYYY-MM')
    }
  },
  mounted () {
    this.time = this.value
  }
}
</script>
