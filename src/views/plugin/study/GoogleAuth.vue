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

      <template v-else-if="hasToken">
        <div class="font-size-lg badge badge-primary">
          {{ $t('google drive authorized') | titlecase }}
        </div>
        <button
          class="btn btn-sm btn-secondary ml-2"
          style="padding-top: 0; padding-bottom: 0; height: 22px;"
          type="button"
          :disabled="isSaving"
          @click="unlinkGoogleDrive"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          />
          {{ $t('unlink') }}
        </button>
      </template>

      <a
        v-else
        :href="authUrl"
        class="btn btn-sm btn-primary mr-2"
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
      isLoading: true,
      isSaving: false,
      hasToken: false,
      authUrl: ''
    }
  },
  created () {
    this.getOauthToken()
  },
  methods: {
    getOauthToken () {
      axios.get('oauth/login/google/drive')
        .then(response => {
          if (response.data.authenticated) {
            this.hasToken = true
          } else {
            this.authUrl = response.data.auth_url
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    unlinkGoogleDrive () {
      this.isSaving = true
      axios.delete('oauth/login/google/drive')
        .then(() => {
          this.hasToken = false
        })
        .finally(() => {
          this.isSaving = false
        })
    }
  }
}
</script>

<style lang="postcss" scoped>
</style>
