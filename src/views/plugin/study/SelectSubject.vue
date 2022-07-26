<template>
  <p-select
    id="subject"
    v-model="modelValue"
    name="subject"
    :options="subjects"
    label-field="name"
    :errors="errors"
    @errors="$emit('errors')"
  />
</template>

<script>
import axios from '@/axios'
export default {
  name: 'PluginStudySelectSubject',
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    errors: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      subjects: []
    }
  },
  computed: {
    modelValue: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  created () {
    this.getSubjects()
  },
  methods: {
    getSubjects () {
      const apiParams = {
        sort_by: 'name'
      }
      axios.get('/plugin/study/subject', { params: apiParams })
        .then(response => {
          this.subjects = response.data.data
        })
        .catch(error => {
          this.$notification.error(error.data.message)
        })
    }
  }
}
</script>
