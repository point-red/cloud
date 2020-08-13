<template>
  <div>
    <date-picker
      v-model="time"
      :lang="lang"
      :name="name"
      format="YYYY-MM"
      type="month"
      value-type="YYYY-MM"
      :editable="false"
    >
      <i
        slot="calendar-icon"
        class="fa fa-calendar"
      />
    </date-picker>

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
      type: [Date, String],
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    readonly: {
      type: Boolean,
      default: false
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
