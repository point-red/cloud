<template>
  <div>
    <p-loading-block v-show="isLoading" />
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item"
      >
        {{ $t('project') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ project.code | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <project-widget :project="project" />

    <hr>

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :title="$t('preferences')"
        :header="true"
      >
        <p-block-inner :is-loading="isLoading">
          <h5 class="content-heading">
            Mail
          </h5>
          <p-form-row
            id="mail-driver"
            v-model="form.mail_driver"
            :disabled="isSaving"
            :label="$t('driver')"
            name="mail_driver"
            :errors="form.errors.get('mail_driver')"
            @errors="form.errors.set('mail_driver', null)"
          />

          <p-form-row
            id="mail-host"
            v-model="form.mail_host"
            :disabled="isSaving"
            :label="$t('host')"
            name="mail_host"
            :errors="form.errors.get('mail_host')"
            @errors="form.errors.set('mail_host', null)"
          />

          <p-form-row
            id="mail-username"
            v-model="form.mail_username"
            :disabled="isSaving"
            :label="$t('username')"
            name="mail_username"
            :errors="form.errors.get('mail_username')"
            @errors="form.errors.set('mail_username', null)"
          />

          <p-form-row
            id="mail-password"
            v-model="form.mail_password"
            type="password"
            :disabled="isSaving"
            :label="$t('password')"
            name="mail_password"
            :errors="form.errors.get('mail_password')"
            @errors="form.errors.set('mail_password', null)"
          />

          <p-form-row
            id="mail-from-name"
            v-model="form.mail_from_name"
            :disabled="isSaving"
            :label="$t('from name')"
            name="mail_from_name"
            :errors="form.errors.get('mail_from_name')"
            @errors="form.errors.set('mail_from_name', null)"
          />

          <p-form-row
            id="mail-from-address"
            v-model="form.mail_from_address"
            :disabled="isSaving"
            :label="$t('from address')"
            name="mail_from_address"
            :errors="form.errors.get('mail_from_address')"
            @errors="form.errors.set('mail_from_address', null)"
          />

          <p-form-row
            id="mail-port"
            v-model="form.mail_port"
            :disabled="isSaving"
            :label="$t('port')"
            name="mail_port"
            :errors="form.errors.get('mail_port')"
            @errors="form.errors.set('mail_port', null)"
          />

          <p-form-row
            id="mail-encryption"
            v-model="form.mail_encryption"
            :disabled="isSaving"
            :label="$t('encryption')"
            name="mail_encryption"
            :errors="form.errors.get('mail_encryption')"
            @errors="form.errors.set('mail_encryption', null)"
          />

          <p-form-row
            id="mail-domain"
            v-model="form.mail_domain"
            :disabled="isSaving"
            :label="$t('domain')"
            name="mail_domain"
            :errors="form.errors.get('mail_domain')"
            @errors="form.errors.set('mail_domain', null)"
          />

          <p-form-row
            id="mail-secret"
            v-model="form.mail_secret"
            type="password"
            :disabled="isSaving"
            :label="$t('secret')"
            name="mail_secret"
            :errors="form.errors.get('mail_secret')"
            @errors="form.errors.set('mail_secret', null)"
          />

          <hr>

          <button
            type="submit"
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('update') | uppercase }}
          </button>
        </p-block-inner>
      </p-block>
    </form>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import ProjectWidget from './Widget'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    TabMenu,
    ProjectWidget
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isSaving: false,
      form: new Form({
        id: this.$route.params.id,
        project_id: this.$route.params.id,
        mail_driver: null,
        mail_host: null,
        mail_username: null,
        mail_password: null,
        mail_from_name: null,
        mail_from_address: null,
        mail_port: null,
        mail_encryption: null,
        mail_domain: null,
        mail_secret: null
      })
    }
  },
  computed: {
    ...mapGetters('accountProject', ['project']),
    ...mapGetters('accountProjectPreference', ['preferences'])
  },
  created () {
    this.isLoading = true

    this.findProject({ id: this.id })
      .then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })

    this.findPreference({ id: this.id })
      .then(response => {
        this.isLoading = false
        if (response.data) {
          this.form.mail_driver = response.data.mail_driver
          this.form.mail_host = response.data.mail_host
          this.form.mail_username = response.data.mail_username
          this.form.mail_password = response.data.mail_password
          this.form.mail_from_name = response.data.mail_from_name
          this.form.mail_from_address = response.data.mail_from_address
          this.form.mail_port = response.data.mail_port
          this.form.mail_encryption = response.data.mail_encryption
          this.form.mail_domain = response.data.mail_domain
          this.form.mail_secret = response.data.mail_secret
        }
      }).catch(error => {
        this.isLoading = false
        // this.$notification.error(error.message)
      })
  },
  methods: {
    ...mapActions('accountProject', {
      findProject: 'find'
    }),
    ...mapActions('accountProjectPreference', {
      findPreference: 'find',
      updatePreference: 'update'
    }),
    onSubmit () {
      this.isSaving = true
      this.updatePreference(this.form).then(response => {
        this.isSaving = false
        this.$notification.success('Update success')
        this.$router.push('/account/project/' + this.id + '/preferences')
      }).catch(error => {
        this.isSaving = false
        this.$notification.error('Update failed')
        this.form.errors.record(error.errors)
      })
    }
  }
}
</script>
