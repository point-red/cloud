<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/employee-status"
        class="breadcrumb-item"
      >
        {{ $t('employment contract') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-block
        :is-loading="isLoading"
        :header="true"
        :title="$t('employment contract')"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
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
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button
              :disabled="isSaving"
              type="submit"
              class="btn btn-sm btn-primary"
            >
              <i
                v-show="isSaving"
                class="fa fa-asterisk fa-spin"
              /> {{ $t('save') | uppercase }}
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
      isLoading: false,
      isSaving: false,
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
      this.isSaving = true
      this.createEmployeeStatus(this.form)
        .then(
          (response) => {
            this.isSaving = false
            this.$notification.success('Create success')
            this.$router.push('/human-resource/employee-status/' + response.data.id)
          },
          (error) => {
            this.isSaving = false
            this.$notification.error('Create failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
