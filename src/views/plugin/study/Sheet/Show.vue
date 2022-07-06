<template>
  <div>
    {{ sheet }}
  </div>
</template>

<script>
import axios from '@/axios'
export default {
  name: 'PluginStudySheetShow',
  data () {
    return {
      isLoading: true,
      sheet: null
    }
  },
  created () {
    this.$emit('updateSheetName', 'Math - 24 Apr 2022')
    this.getStudySheet()
  },
  methods: {
    getStudySheet () {
      axios.get('/plugin/study/sheet/' + this.$route.params.id)
        .then(response => {
          this.sheet = response.data
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>
