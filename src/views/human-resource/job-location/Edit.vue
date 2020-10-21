<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/job-location"
        class="breadcrumb-item"
      >
        {{ $t('job location') | uppercase }}
      </router-link>
      <router-link
        :to="'/human-resource/job-location/' + jobLocation.id"
        class="breadcrumb-item"
      >
        {{ jobLocation.name | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :is-loading="isLoading"
        :header="true"
        :title="$t('job location')"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-6">
            <p-form-row
              id="name"
              v-model="form.name"
              name="name"
              :label="$t('name')"
              :disabled="isSaving"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />
          </div>
          <div class="col-sm-6" />
          <div class="col-sm-6">
            <p-form-row
              id="base_salary"
              name="base_salary"
              :label="$t('area value')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.base_salary"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('base_salary')"
                  @errors="form.errors.set('base_salary', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-6" />
          <div class="col-sm-6">
            <p-form-row
              id="multiplier_kpi"
              name="multiplier_kpi"
              :label="$t('multiplier kpi')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  v-model="form.multiplier_kpi"
                  :disabled="isSaving"
                  :is-text-right="false"
                  :errors="form.errors.get('multiplier_kpi')"
                  @errors="form.errors.set('multiplier_kpi', null)"
                />
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <hr>
            <button
              type="submit"
              :disabled="isSaving"
              class="btn btn-sm btn-primary mr-5"
            >
              <i
                v-show="isSaving"
                class="fa fa-asterisk fa-spin"
              /> {{ $t('update') | uppercase }}
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="$router.push('/human-resource/job-location/' + id)"
            >
              {{ $t('close') | uppercase }}
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
      isLoading: false,
      isSaving: false,
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
    this.isLoading = true
    this.findJobLocation({
      id: this.id
    }).then((response) => {
      this.isLoading = false
      for (const field in this.form) {
        console.log(JSON.stringify(field))
        if (response.data[field]) this.form[field] = response.data[field]
      }
      this.form.id = response.data.id
      console.log(response.data)
    }, (error) => {
      this.isLoading = false
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', { findJobLocation: 'find', updateJobLocation: 'update' }),
    onSubmit () {
      this.isSaving = true
      this.updateJobLocation(this.form)
        .then(
          (response) => {
            this.isSaving = false
            this.$notification.success('Update success')
            this.$router.replace('/human-resource/job-location/' + this.jobLocation.id)
          },
          (error) => {
            this.isSaving = false
            this.$notification.error('Update failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
