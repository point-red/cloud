<template>
  <div>
    <date-picker
      format="DD-MM-YYYY HH:mm"
      type="datetime"
      v-model="datetime"
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
      mask: '##-##-#### ##:##',
      datetime: this.value
    }
  },
  watch: {
    value () {
      if (this.datetime != this.value) {
        this.datetime = this.value
      }
    },
    datetime () {
      this.$emit('input', this.datetime)
    }
  }
}
</script>
