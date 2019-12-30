<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/employee-status"
        class="breadcrumb-item">{{ $t('employee status') | uppercase }}</router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('employee status')"
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
        name: ''
      })
    }
  },
  methods: {
    ...mapActions('humanResourceEmployeeStatus', {
      createEmployeeStatus: 'create'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.createEmployeeStatus(this.form)
        .then(
          (response) => {
            this.loadingSaveButton = false
            this.$notification.success('Create success')
            this.$router.push('/human-resource/employee-status/' + response.data.id)
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
