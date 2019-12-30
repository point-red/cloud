<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link to="/human-resource/job-location" class="breadcrumb-item">{{ $t('job location') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('job location')"
        column="col-sm-12">

        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="name"
              name="name"
              :label="$t('name')"
              v-model="form.name"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)">
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="base_salary"
              name="base_salary"
              :label="$t('base salary')">
              <div slot="body" class="col-lg-9">
                <p-form-number
                  v-model="form.base_salary"
                  :disabled="loadingSaveButton"
                  :is-text-right="false"
                  :errors="form.errors.get('base_salary')"
                  @errors="form.errors.set('base_salary', null)"/>
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="multiplier_kpi"
              name="multiplier_kpi"
              :label="$t('multiplier kpi')">
              <div slot="body" class="col-lg-9">
                <p-form-number
                  v-model="form.multiplier_kpi"
                  :disabled="loadingSaveButton"
                  :is-text-right="false"
                  :errors="form.errors.get('multiplier_kpi')"
                  @errors="form.errors.set('multiplier_kpi', null)"/>
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button :disabled="loadingSaveButton" type="submit" class="btn btn-sm btn-primary">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Save
            </button>
          </div>
        </div>
      </p-block>
    </form>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        name: '',
        base_salary: null,
        multiplier_kpi: null
      })
    }
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', {
      createEmployeeJobLocation: 'create'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.createEmployeeJobLocation(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.$notification.success('Create success')
            this.$router.push('/human-resource/job-location/' + response.data.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Create failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
