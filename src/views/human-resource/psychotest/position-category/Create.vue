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
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu />

    <form class="row" @submit.prevent="onSubmit">
      <p-block
        :is-loading="loading"
        :header="true"
        :title="$t('position category') | titlecase"
        column="col-sm-12"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="position_id"
              :name="$t('position') | titlecase"
              label="position"
              v-model.number="form.position_id"
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
                  v-model.number="form.position_id"
                  :options="candidatePositions"
                  :errors="form.errors.get('position_id')"
                  @errors="form.errors.set('position_id', null)"
                />
              </div>
            </p-form-row>
          </div>
          <div class="col-sm-12">
            <div
              v-for="category in form.categories"
              :key="category.category_id"
              class="row"
            >
              <div class="col-sm-4">
                <p-form-row
                  id="category_id"
                  name="category_id"
                  :label="$t('category') | titlecase"
                  v-model="category.category.name"
                  disabled=""
                >
                </p-form-row>
              </div>
              <div class="col-sm-4">
                <p-form-row
                  id="category_max"
                  name="category_max"
                  :label="$t('max') | titlecase"
                  v-model.number="category.category_max"
                  :disabled="loadingSaveButton"
                >
                </p-form-row>
              </div>
              <div class="col-sm-4">
                <p-form-row
                  id="category_min"
                  name="category_min"
                  :label="$t('min') | titlecase"
                  v-model.number="category.category_min"
                  :disabled="loadingSaveButton"
                >
                </p-form-row>
              </div>
            </div>
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
      isCreating: true,
      form: new Form({
        position_id: null,
        categories: []
      })
    }
  },
  watch: {
    'form.position_id': async function (positionId) {
      if (positionId !== null && typeof positionId !== 'undefined') {
        await this.getPositionCategoriesRequest(positionId)
      }
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidatePosition', [
      'candidatePositions'
    ]),
    ...mapState('humanResourcePsychotestPapikostickCategory', [
      'papikostickCategories'
    ])
  },
  async mounted () {
    await Promise.all([
      this.getCandidatePositions(),
      this.getPositionCategoriesRequest()
    ])
  },
  methods: {
    ...mapActions('humanResourcePsychotestPositionCategory', {
      getPositionCategories: 'get'
    }),
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      getCandidatePositions: 'get'
    }),
    ...mapActions('humanResourcePsychotestPapikostickCategory', {
      getPapikostickCategories: 'get'
    }),
    ...mapActions('humanResourcePsychotestPositionCategory', {
      bulkCreatePositionCategory: 'bulkCreate',
      bulkUpdatePositionCategory: 'bulkUpdate'
    }),
    async getPositionCategoriesRequest (positionId) {
      if (positionId) {
        const { data } = await this.getPositionCategories({
          params: {
            // 'filter_equal[position_id]': positionId,
            filter_equal: {
              position_id: positionId
            },
            expand: 1,
            includes: 'position;category'
          }
        })
        if (data.length > 0) {
          this.isCreating = false
          this.form.categories = data
        } else {
          this.isCreating = true
          await this.getPapikostickCategoriesRequest()
        }
      }
    },
    async getPapikostickCategoriesRequest () {
      const { data } = await this.getPapikostickCategories({
        params: { expand: 1, includes: 'position_category' }
      })
      if (data) {
        if (data !== null && typeof data !== 'undefined') {
          this.form.categories = [...data].map(({ id, name }) => ({
            category: {
              name
            },
            category_id: id,
            category_max: 0,
            category_min: 0
          }))
        }
      }
    },
    onSubmit () {
      if (this.isCreating) {
        this.loadingSaveButton = true
        this.bulkCreatePositionCategory(this.form).then(
          response => {
            this.loadingSaveButton = false
            this.$notification.success('Create success')
            this.$router.push('/human-resource/psychotest/position-category')
          },
          error => {
            this.loadingSaveButton = false
            this.$notification.error('Create failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
      } else {
        this.loadingSaveButton = true
        this.bulkUpdatePositionCategory(this.form).then(
          response => {
            this.loadingSaveButton = false
            this.$notification.success('Update success')
            this.$router.push('/human-resource/psychotest/position-category')
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
}
</script>
