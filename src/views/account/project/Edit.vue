<template>
  <div>
    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">{{ $t('project') | uppercase }}
      </router-link>
      <router-link
        :to="{ path: '/account/project/' + project.id, params: { id: project.id }}"
        class="breadcrumb-item">
        {{ project.code | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :header="true"
        :is-loading="isLoading"
        title="Project">
        <form @submit.prevent="onSubmit">
          <p-form-row
            id="group"
            name="group"
            v-model="form.group"
            :disabled="isSaving"
            :label="$t('company group')"
            :errors="form.errors.get('group')"
            @errors="form.errors.set('group', null)">
          </p-form-row>

          <p-form-row
            id="code"
            name="code"
            v-model="form.code"
            :disabled="true"
            :label="$t('company identifier')"
            :errors="form.errors.get('code')"
            @errors="form.errors.set('code', null)">
          </p-form-row>

          <p-form-row
            id="name"
            name="name"
            v-model="form.name"
            :disabled="isSaving"
            :label="$t('company name')"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)">
          </p-form-row>

          <p-form-row
            id="address"
            name="address"
            v-model="form.address"
            :disabled="isSaving"
            :label="$t('company address')">
          </p-form-row>

          <p-form-row
            id="phone"
            name="phone"
            v-model="form.phone"
            :disabled="isSaving"
            :label="$t('company phone')">
          </p-form-row>

          <p-form-row
            id="whatsapp"
            name="whatsapp"
            v-model="form.whatsapp"
            :disabled="isSaving"
            :label="$t('company whatsapp')">
          </p-form-row>

          <p-form-row
            id="website"
            name="website"
            v-model="form.website"
            :disabled="isSaving"
            :label="$t('company website')">
          </p-form-row>

          <p-form-row
            id="marketplace-notes"
            name="marketplace-notes"
            v-model="form.marketplace_notes"
            :disabled="isSaving"
            :label="$t('marketplace notes')">
          </p-form-row>

          <p-form-row
            id="vat-id-number"
            name="vat_id_number"
            v-model="form.vat_id_number"
            :disabled="isSaving"
            :label="$t('vat identification number')">
          </p-form-row>

          <p-form-row
            id="timezone"
            name="timezone"
            :label="$t('timezone')">
            <div slot="body" class="col-lg-9">
              <p-select-modal
                id="timezone"
                :title="'select timezone'"
                :value="form.timezone"
                :options="timezoneOptions"
                @choosen="chooseTimezone"
                @search="searchTimezone"/>
            </div>
          </p-form-row>

          <div class="form-group row">
            <div class="col-md-9 offset-3">
              <button
                :disabled="isSaving"
                type="submit"
                class="btn btn-sm btn-primary mr-5">
                <i
                  v-show="isSaving"
                  class="fa fa-asterisk fa-spin"/> {{ $t('update') | uppercase }}
              </button>
              <router-link
                :to="{path: '/account/project/' + this.id}"
                class="btn btn-sm btn-danger">
                Cancel
              </router-link>
            </div>
          </div>
        </form>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      id: this.$route.params.id,
      form: new Form({
        id: this.$route.params.id,
        name: null,
        group: null,
        address: null,
        phone: null,
        code: null,
        vat_id_number: null,
        invitation_code: null,
        invitation_code_enabled: null,
        timezone: null
      }),
      isLoading: false,
      isSaving: false,
      timezoneOptions: []
    }
  },
  components: {
    Breadcrumb
  },
  computed: {
    ...mapGetters('accountProject', ['project'])
  },
  created () {
    this.isLoading = true
    this.getAvailableTimezone()
    this.findProject({ id: this.id })
      .then((response) => {
        this.form.id = this.project.id
        this.form.code = this.project.code
        this.form.name = this.project.name
        this.form.group = this.project.group
        this.form.timezone = this.project.timezone
        this.form.address = this.project.address
        this.form.phone = this.project.phone
        this.form.whatsapp = this.project.whatsapp
        this.form.website = this.project.website
        this.form.marketplace_notes = this.project.marketplace_notes
        this.form.vat_id_number = this.project.vat_id_number
        this.form.invitation_code = this.project.invitation_code
        this.form.invitation_code_enabled = this.project.invitation_code_enabled
        this.isLoading = false
      }, (error) => {
        this.$notification.error(error.message)
        this.isLoading = false
      })
  },
  methods: {
    ...mapActions('accountProject', {
      update: 'update',
      findProject: 'find'
    }),
    getAvailableTimezone () {
      var tzNames = this.$moment.tz.names()
      this.timezoneOptions = []
      for (var i in tzNames) {
        let tz = '(GMT' + this.$moment.tz(tzNames[i]).format('Z') + ') ' + tzNames[i]
        this.timezoneOptions.push({
          id: tzNames[i],
          label: tz
        })
      }
    },
    searchTimezone (value) {
      this.getAvailableTimezone()

      var filtered = this.timezoneOptions.filter((str) => {
        return str.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
      })

      this.timezoneOptions = []
      for (var i = 0; i < filtered.length; i++) {
        this.timezoneOptions.push({
          id: filtered[i].id,
          label: filtered[i].label
        })
      }
    },
    chooseTimezone (value) {
      this.form.timezone = value.id
    },
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(
          (response) => {
            this.isSaving = false
            this.form.reset()
            this.$notification.success('Update success')
            this.$router.push('/account/project/' + this.id)
          },
          (error) => {
            this.isSaving = false
            this.$notification.error('Update failed')
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
