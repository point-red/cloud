<template>
  <div>
    <template v-if="error">
      {{ error }}
    </template>
    <template v-else>
      Please wait, don't close this tab
    </template>
  </div>
</template>

<script>
import axios from '@/axios'
export default {
  name: 'OauthGoogleCallback',
  data () {
    return {
      error: '',
      isSaved: false
    }
  },
  created () {
    if (this.$route.query.code) {
      this.submitAuthCode()
    }
  },
  methods: {
    submitAuthCode () {
      axios.post('oauth/login/google/drive', { code: this.$route.query.code })
        .then(() => {
          window.close()
        })
        .catch(error => {
          if (error.response?.status === 422) {
            this.error = error.response.data.errors.code[0]
          }
        })
    }
  }
}
</script>
