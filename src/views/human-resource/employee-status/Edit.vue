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
      <router-link
        :to="'/human-resource/employee-status/' + status.id"
        class="breadcrumb-item"
      >
        {{ status.name | uppercase }}
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
        :title="$t('employment contract')"
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
              @click="$router.push('/human-resource/employee-status/' + id)"
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
        name: ''
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeStatus', ['status'])
  },
  created () {
    this.isLoading = true
    this.findStatus({
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
    ...mapActions('humanResourceEmployeeStatus', { findStatus: 'find', updateStatus: 'update' }),
    onSubmit () {
      this.isSaving = true
      this.updateStatus(this.form)
        .then(
          (response) => {
            this.isSaving = false
            this.$notification.success('Update success')
            this.$router.replace('/human-resource/employee-status/' + this.status.id)
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
