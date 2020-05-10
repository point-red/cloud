<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/candidate-position"
        class="breadcrumb-item"
      >
        {{ "candidate position" | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('candidate position') | titlecase"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="position"
              :name="$t('position') | titlecase"
              label="position"
              v-model="form.position"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('position')"
              @errors="form.errors.set('position', null)"
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
        position: ''
      })
    }
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      createCandidatePosition: 'create'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.createCandidatePosition(this.form).then(
        response => {
          this.loadingSaveButton = false
          this.$notification.success('Create success')
          this.$router.push(
            '/human-resource/psychotest/candidate-position/' + response.data.id
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
