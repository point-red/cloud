<template>
  <div>
    <date-picker
      format="DD-MM-YYYY"
      type="date"
      v-model="date"
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
      type: Date,
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
      mask: '##-##-####',
      date: this.value
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
