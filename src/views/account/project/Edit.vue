<template>
  <div>
    <breadcrumb>
      <router-link
        to="/account/project"
        class="breadcrumb-item">Project
      </router-link>
      <router-link
        :to="{ path: '/account/project/' + project.id, params: { id: project.id }}"
        class="breadcrumb-item">
        {{ project.code | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <div class="row">
      <p-block
        :header="true"
        :is-loading="loading"
        title="Project">
        <form @submit.prevent="onSubmit">
          <p-form-row
            id="group"
            name="group"
            v-model="form.group"
            :disabled="loadingSaveButton"
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
            :disabled="loadingSaveButton"
            :label="$t('company name')"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)">
          </p-form-row>

          <p-form-row
            id="address"
            name="address"
            v-model="form.address"
            :disabled="loadingSaveButton"
            :label="$t('company address')">
          </p-form-row>

          <p-form-row
            id="phone"
            name="phone"
            v-model="form.phone"
            :disabled="loadingSaveButton"
            :label="$t('company phone')">
          </p-form-row>

          <p-form-row
            id="vat-id-number"
            name="vat_id_number"
            v-model="form.vat_id_number"
            :disabled="loadingSaveButton"
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
                :disabled="loadingSaveButton"
                type="submit"
                class="btn btn-sm btn-primary mr-5">
                <i
                  v-show="loadingSaveButton"
                  class="fa fa-asterisk fa-spin"/> Update
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
      loading: false,
      loadingSaveButton: false,
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
    this.loading = true
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
        this.form.vat_id_number = this.project.vat_id_number
        this.form.invitation_code = this.project.invitation_code
        this.form.invitation_code_enabled = this.project.invitation_code_enabled
        this.loading = false
      }, (error) => {
        this.$notification.error(error.message)
        this.loading = false
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
      this.loadingSaveButton = true
      this.update(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.form.reset()
            this.$notification.success('Update success')
            this.$router.push('/account/project/' + this.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Update failed')
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
