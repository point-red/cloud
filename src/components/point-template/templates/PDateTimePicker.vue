<template>
  <div>
    <date-picker
      v-model="datetime"
      v-mask="mask"
      format="DD-MM-YYYY HH:mm"
      type="datetime"
      value-type="YYYY-MM-DD HH:mm:ss"
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
