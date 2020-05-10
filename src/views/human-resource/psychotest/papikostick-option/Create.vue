<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/papikostick-option"
        class="breadcrumb-item"
      >
        {{ "papikostick option" | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('papikostick option') | titlecase"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="content"
              :name="$t('content') | titlecase"
              label="content"
              v-model="form.content"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('content')"
              @errors="form.errors.set('content', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="question_id"
              :name="$t('question') | titlecase"
              label="question"
              v-model="form.question_id"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('question_id')"
              @errors="form.errors.set('question_id', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="question_id"
                  name="question_id"
                  key-field="id"
                  label-field="number"
                  :disabled="isSaving"
                  v-model="form.question_id"
                  :options="papikostickQuestions"
                  :errors="form.errors.get('question_id')"
                  @errors="form.errors.set('question_id', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="category_id"
              :name="$t('category') | titlecase"
              label="category"
              v-model="form.category_id"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('category_id')"
              @errors="form.errors.set('category_id', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="category_id"
                  name="category_id"
                  key-field="id"
                  label-field="name"
                  :disabled="isSaving"
                  v-model="form.category_id"
                  :options="papikostickCategories"
                  :errors="form.errors.get('category_id')"
                  @errors="form.errors.set('category_id', null)"
                />
              </div>
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
import { mapState, mapActions } from 'vuex'

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
        content: '',
        question_id: null,
        category_id: null
      })
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestPapikostickQuestion', [
      'papikostickQuestions'
    ]),
    ...mapState('humanResourcePsychotestPapikostickCategory', [
      'papikostickCategories'
    ])
  },
  mounted () {
    this.init()
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidate', {
      createCandidate: 'create'
    }),
    ...mapActions('humanResourcePsychotestPapikostickQuestion', {
      getPapikostickQuestions: 'get'
    }),
    ...mapActions('humanResourcePsychotestPapikostickCategory', {
      getPapikostickCategories: 'get'
    }),
    async init () {
      await Promise.all([
        this.getPapikostickQuestionsRequest(),
        this.getPapikostickCategoriesRequest()
      ])
    },
    onSubmit () {
      this.loadingSaveButton = true
      this.createCandidate(this.form).then(
        response => {
          this.loadingSaveButton = false
          this.$notification.success('Create success')
          this.$router.push(
            '/human-resource/psychotest/papikostick-option/' + response.data.id
          )
        },
        error => {
          this.loadingSaveButton = false
          this.$notification.error('Create failed', error.message)
          this.form.errors.record(error.errors)
        }
      )
    },
    getPapikostickQuestionsRequest () {
      this.loading = true
      this.getPapikostickQuestions({
        params: {
          limit: 99,
          sort_by: 'number'
        }
      }).then(
        response => {
          this.loading = false
        },
        errors => {
          this.loading = false
          console.log(errors.data)
        }
      )
    },
    getPapikostickCategoriesRequest () {
      this.loading = true
      this.getPapikostickCategories({
        params: {
          limit: 10,
          sort_by: 'name'
        }
      }).then(
        response => {
          this.loading = false
        },
        errors => {
          this.loading = false
          console.log(errors.data)
        }
      )
    }
  }
}
</script>
