<template>
  <div>
    <p-loading-block message="generate new database, please wait and do not close this page" v-show="isSaving"/>

    <breadcrumb>
      <router-link to="/account/project" class="breadcrumb-item">{{ $t('project') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu></tab-menu>

    <div class="row">
      <p-block :header="true" title="Project">
        <form @submit.prevent="onSubmit">
          <p-form-row
            id="code"
            name="code"
            v-model="form.code"
            :disabled="isSaving"
            :label="$t('company identifier')"
            :help="'WEB URL : ' + form.code + '.cloud.point.red'"
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

          <div class="form-group row">
            <div class="col-md-9 offset-3">
              <button
                :disabled="isSaving"
                type="submit"
                class="btn btn-sm btn-primary">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/>{{ $t('save') | uppercase }}
              </button>
            </div>
          </div>

          <p-separator></p-separator>

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
            <div slot="body" class="col-form-label col-lg-9">
              <p-select-modal
                id="timezone"
                :title="'select timezone'"
                :value="form.timezone"
                :choosen="form.timezone"
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
                class="btn btn-sm btn-primary">
                <i v-show="isSaving" class="fa fa-asterisk fa-spin"/>{{ $t('save') | uppercase }}
              </button>
            </div>
          </div>
        </form>
      </p-block>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/views/account/Breadcrumb'
import TabMenu from './TabMenu'
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: new Form({
        name: null,
        group: null,
        address: null,
        phone: null,
        whatsapp: null,
        website: null,
        marketplace_notes: null,
        code: '',
        vat_id_number: null,
        timezone: null
      }),
      localTimezone: '',
      timezoneOptions: [],
      isSaving: false
    }
  },
  components: {
    Breadcrumb,
    TabMenu
  },
  methods: {
    ...mapActions('accountProject', ['create']),
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
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.form.reset()
          this.$notification.success('create success')
          this.$router.push('/account/project/' + response.data.id)
        }).catch(error => {
          this.isSaving = false
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    }
  },
  created () {
    this.getAvailableTimezone()
    this.localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (this.localTimezone) {
      this.form.timezone = this.localTimezone
    }
  }
}
</script>
