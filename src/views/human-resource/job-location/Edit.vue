<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/job-location"
        class="breadcrumb-item">{{ $t('job location') | titlecase }}</router-link>
      <router-link
        :to="'/human-resource/job-location/' + jobLocation.id"
        class="breadcrumb-item">{{ jobLocation.name | titlecase }}</router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('job location')"
        column="col-sm-12">
        <div class="row">
          <div class="col-sm-6">
            <p-form-row
              id="name"
              name="name"
              :label="$t('name')"
              :disabled="loadingSaveButton"
              v-model="form.name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)">
            </p-form-row>
          </div>
          <div class="col-sm-6">
          </div>
          <div class="col-sm-6">
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
          <div class="col-sm-6">
          </div>
          <div class="col-sm-6">
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
            <hr>
            <button
              type="submit"
              :disabled="loadingSaveButton"
              class="btn btn-sm btn-primary mr-5">
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Update
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="$router.push('/human-resource/job-location/' + id)">
              Close
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
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      id: this.$route.params.id,
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        name: '',
        base_salary: null,
        multiplier_kpi: null
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocation'])
  },
  created () {
    this.loading = true
    this.findJobLocation({
      id: this.id
    }).then((response) => {
      this.loading = false
      for (let field in this.form) {
        console.log(JSON.stringify(field))
        if (response.data[field]) this.form[field] = response.data[field]
      }
      this.form.id = response.data.id
      console.log(response.data)
    }, (error) => {
      this.loading = false
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', { findJobLocation: 'find', updateJobLocation: 'update' }),
    onSubmit () {
      this.loadingSaveButton = true
      this.updateJobLocation(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.$notification.success('Update success')
            this.$router.replace('/human-resource/job-location/' + this.jobLocation.id)
          },
          (error) => {
            this.loadingSaveButton = false
            this.$notification.error('Update failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
