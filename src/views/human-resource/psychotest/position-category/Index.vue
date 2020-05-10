<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <span class="breadcrumb-item active">{{
        "position category" | titlecase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('position category')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"
        />
        <div class="mb-10"></div>
        <div class="row">
          <div class="col-sm-10 mb-10">
            <p-select
              id="position_id"
              name="position_id"
              key-field="id"
              label-field="position"
              v-model.number="positionId"
              :options="candidatePositions"
            />
          </div>
          <div class="col-sm-2 mb-10">
            <button
              type="button"
              @click="onDelete"
              v-if="$permission.has('delete employee')"
              :disabled="loading || !positionId"
              class="btn btn-sm btn-danger"
            >
              <i v-show="loading" class="fa fa-asterisk fa-spin" /> Delete
            </button>
          </div>
        </div>
        <hr />
        <p-block-inner :is-loading="loading">
          <point-table>
            <tr slot="p-head">
              <th>Position</th>
              <th>Category</th>
              <th>Max</th>
              <th>Min</th>
            </tr>
            <template v-if="$permission.has('read employee')">
              <tr
                v-for="positionCategory in positionCategories"
                :key="positionCategory.id"
                slot="p-body"
              >
                <td>
                  {{ positionCategory.position.position }}
                  <!-- <router-link :to="{ name: 'PositionCategoryShow', params: { id: positionCategory.id }}">
                    {{ positionCategory.position.position }}
                  </router-link> -->
                </td>
                <td>{{ positionCategory.category.name }}</td>
                <td>{{ positionCategory.category_max }}</td>
                <td>{{ positionCategory.category_min }}</td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage"
        >
        </p-pagination>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import BreadcrumbPsychotest from '@/views/human-resource/psychotest/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import Form from '@/utils/Form'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbPsychotest,
    PointTable
  },
  data () {
    return {
      loading: false,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      positionId: null,
      pagination: {
        current_page: null,
        from: null,
        to: null,
        path: null,
        last_page: null,
        per_page: null,
        total: null
      },
      form: new Form({
        position_id: null,
        categories: []
      })
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidatePosition', [
      'candidatePositions'
    ]),
    ...mapState('humanResourcePsychotestPositionCategory', [
      'positionCategories'
    ])
  },
  watch: {
    async positionId (positionId) {
      if (positionId !== null && typeof positionId !== 'undefined') {
        await this.getPositionCategoriesRequest(positionId)
      }
    }
  },
  async mounted () {
    await Promise.all([
      this.getCandidatePositions(),
      this.getPositionCategoriesRequest()
    ])
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidatePosition', {
      getCandidatePositions: 'get'
    }),
    ...mapActions('humanResourcePsychotestPositionCategory', {
      getPositionCategories: 'get',
      deleteBulkPositionCategories: 'bulkDelete'
    }),
    ...mapActions('humanResourcePsychotestPapikostickCategory', {
      getPapikostickCategories: 'get'
    }),
    updatePage (value) {
      this.currentPage = value
      this.getPositionCategoriesRequest(this.positionId)
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getPositionCategoriesRequest(this.positionId)
    }, 300),
    async getPositionCategoriesRequest (positionId) {
      if (positionId) {
        try {
          this.loading = true
          const { data } = await this.getPositionCategories({
            params: {
              // 'filter_equal[position_id]': positionId,
              filter_like: {
                'category.name': this.searchText
              },
              filter_equal: {
                position_id: positionId
              },
              expand: 1,
              includes: 'position;category',
              page: this.currentPage,
              sort_by: 'id'
            }
          })
          if (data.length > 0) {
            this.form.categories = data
          }
        } catch (error) {
          this.$notification.error(error.message)
          console.log(error)
        } finally {
          this.loading = false
        }
      }
    },
    async onDelete () {
      try {
        this.loading = true
        const payload = {
          position_id: this.positionId,
          categories: this.positionCategories.map(({ id }) => ({ id }))
        }
        await this.deleteBulkPositionCategories(payload)
        await this.getPositionCategoriesRequest(this.positionId)
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
