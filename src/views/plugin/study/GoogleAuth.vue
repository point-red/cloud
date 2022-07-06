<template>
  <p-form-row label="">
    <div
      slot="body"
      class="col-lg-9"
    >
      <div
        v-if="isLoading"
        class="font-size-lg badge badge-warning"
      >
        {{ $t('checking google drive connection') | titlecase }}
      </div>

      <div
        v-else-if="hasToken"
        class="font-size-lg badge badge-primary"
      >
        {{ $t('google drive authorized') | titlecase }}
      </div>

      <a
        v-else
        type="button"
        class="btn btn-sm btn-primary mr-2"
        href=""
        target="_blank"
      >
        {{ $t('authorize google drive') | titlecase }}
      </a>
    </div>
  </p-form-row>
</template>

<script>
import axios from '@/axios'
export default {
  name: 'PluginStudyGoogleAuth',
  data () {
    return {
      isLoading: false,
      hasToken: true
    }
  },
  created () {
    // this.getOauthToken()
  },
  methods: {
    getOauthToken () {
      axios.get('')
        .then(response => {
          if (response.data.access_token) {
            this.hasToken = true
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>
