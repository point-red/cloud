<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <router-link
        to="/human-resource/psychotest/position-category"
        class="breadcrumb-item"
      >
        {{ "position category" | titlecase }}
      </router-link>
      <router-link
        :to="
          '/human-resource/psychotest/position-category/' + positionCategory.id
        "
        class="breadcrumb-item"
      >
        {{ positionCategory.position.position | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">Edit</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('position category')"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="position_id"
              :name="$t('position') | titlecase"
              label="position"
              v-model="form.position_id"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('position_id')"
              @errors="form.errors.set('position_id', null)"
            >
              <div slot="body" class="col-lg-9">
                <p-select
                  id="position_id"
                  name="position_id"
                  key-field="id"
                  label-field="position"
                  v-model="form.position_id"
                  :options="candidatePositions"
                  :errors="form.errors.get('position_id')"
                  @errors="form.errors.set('position_id', null)"
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
                  v-model="form.category_id"
                  :options="papikostickCategories"
                  :errors="form.errors.get('category_id')"
                  @errors="form.errors.set('category_id', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="category_max"
              name="category_max"
              :label="$t('category max') | titlecase"
              v-model="form.category_max"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('category_max')"
              @errors="form.errors.set('category_max', null)"
            >
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <p-form-row
              id="category_min"
              name="category_min"
              :label="$t('category min') | titlecase"
              v-model="form.category_min"
              :disabled="loadingSaveButton"
              :errors="form.errors.get('category_min')"
              @errors="form.errors.set('category_min', null)"
            >
            </p-form-row>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <button
              type="submit"
              :disabled="loadingSaveButton"
              class="btn btn-sm btn-primary mr-5"
            >
              <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin" />
              Update
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              @click="
                $router.push(
                  '/human-resource/psychotest/position-category/' + id
                )
              "
            >
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
import { mapState, mapActions } from 'vuex'

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
        category_max: '',
        category_min: '',
        position_id: '',
        category_id: ''
      })
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestPositionCategory', [
      'positionCategory'
    ]),
    ...mapState('humanResourcePsychotestCandidatePosition', [
      'candidatePositions'
    ]),
    ...mapState('humanResourcePsychotestPapikostickCategory', [
      'papikostickCategories'
    ])
  },
  async mounted () {
    await Promise.all([
      this.getPapikostickCategories(),
      this.getCandidatePositions()
    ])
  },
  created () {
    this.loading = true
    this.findPositionCategory({
      id: this.id,
      params: {
        expand: 1,
        includes: 'position;category'
      }
    }).then(
      response => {
        this.loading = false
        setTimeout(() => {
          this.form.category_max = response.data.category_max
          this.form.category_min = response.data.category_min
          this.form.position_id = response.data.position_id
          this.form.category_id = response.data.category_id
          this.form.id = response.data.id
        }, 500)
      },
      error => {
        this.loading = false
        console.log(JSON.stringify(error))
      }
    )
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      getCandidatePositions: 'get'
    }),
    ...mapActions('humanResourcePsychotestPapikostickCategory', {
      getPapikostickCategories: 'get'
    }),
    ...mapActions('humanResourcePsychotestPositionCategory', {
      findPositionCategory: 'find',
      updatePositionCategory: 'update'
    }),
    onSubmit () {
      this.loadingSaveButton = true
      this.updatePositionCategory(this.form).then(
        response => {
          this.loadingSaveButton = false
          this.$notification.success('Update success')
          this.$router.replace(
            '/human-resource/psychotest/position-category/' +
              this.positionCategory.id
          )
        },
        error => {
          this.loadingSaveButton = false
          this.$notification.error('Update failed', error.message)
          this.form.errors.record(error.errors)
        }
      )
    }
  }
}
</script>
