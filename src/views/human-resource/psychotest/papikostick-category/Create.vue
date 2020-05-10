<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/papikostick-category"
        class="breadcrumb-item"
      >
        {{ "papikostick-category" | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('papikostick-category') | titlecase"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="name"
              :name="$t('name') | titlecase"
              label="name"
              v-model="form.name"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="description"
              :name="$t('description') | titlecase"
              label="description"
              v-model="form.description"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('description')"
              @errors="form.errors.set('description', null)"
            >
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button
              :disabled="loadingSaveButton"
              type="submit"
              class="btn btn-sm btn-primary"
            >
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin" />
              Save
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
import BreadcrumbPsychotest from '@/views/human-resource/psychotest/Breadcrumb'
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbPsychotest
  },
  data () {
    return {
      loading: false,
      loadingSaveButton: false,
      form: new Form({
        name: '',
        description: ''
      })
    }
  },
  methods: {
    ...mapActions('humanResourcePsychotestPapikostickCategory', {
      createPapikostickCategory: 'create'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.createPapikostickCategory(this.form).then(
        response => {
          this.loadingSaveButton = false
          this.$notification.success('Create success')
          this.$router.push(
            '/human-resource/psychotest/papikostick-category/' +
              response.data.id
          )
        },
        error => {
          this.loadingSaveButton = false
          this.$notification.error('Create failed', error.message)
          this.form.errors.record(error.errors)
        }
      )
    }
  }
}
</script>
