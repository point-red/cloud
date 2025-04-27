<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{
        $t("job value assessment") | uppercase
      }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div
          class="text-right"
        >
          <router-link
            v-if="$permission.has('create employee job value assessment')"
            to="/human-resource/job-value/assessment/create"
          >
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary mr-5"
              @click="$refs.updateJobValueScoreSetting.open()"
            >
              <span>
                Create
              </span>
            </button>
          </router-link>
        </div>

        <div class="input-group block mt-10">
          <p-form-input
            id="search-text"
            ref="searchText"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            :value="searchText"
            @input="filterSearch"
          />
        </div>

        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th>Person</th>
              <th>Period</th>
              <th>Score Job Value</th>
              <th class="text-center">
                Status
              </th>
              <th class="text-center">
                Approval Status
              </th>
            </tr>
            <tr
              v-for="(assessment, index) in assessments"
              :key="index"
              slot="p-body"
            >
              <th>{{ (page - 1) * limit + index + 1 }}</th>
              <td>
                <router-link
                  :to="{ name: 'JobValueAssessmentShow', params: { id: assessment.id }}"
                >
                  {{ assessment.employee.name }}
                </router-link>
              </td>
              <td>
                {{ $moment(assessment.period_from).format('yyyy-MM-DD') }}
                -
                {{ $moment(assessment.period_to).format('yyyy-MM-DD') }}
              </td>
              <td>{{ assessment.total_value }}</td>
              <td class="text-center">
                <div
                  v-if="assessment.status == 'draft'"
                  class="badge badge-primary"
                >
                  {{ $t(assessment.status) | uppercase }}
                </div>
                <div
                  v-if="assessment.status == 'completed'"
                  class="badge badge-success"
                >
                  {{ $t(assessment.status) | uppercase }}
                </div>
              </td>
              <td class="text-center">
                <div
                  v-if="assessment.approval_status == 'pending'"
                  class="badge badge-primary"
                >
                  {{ $t(assessment.approval_status) | uppercase }}
                </div>
                <div
                  v-if="assessment.approval_status == 'rejected'"
                  class="badge badge-danger"
                >
                  {{ $t(assessment.approval_status) | uppercase }}
                </div>
                <div
                  v-if="assessment.approval_status == 'approved'"
                  class="badge badge-success"
                >
                  {{ $t(assessment.approval_status) | uppercase }}
                </div>
              </td>
            </tr>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/job-value/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable,
    TabMenu
  },
  data () {
    return {
      isLoading: true,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      limit: 10,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueAssessment', ['assessments', 'pagination'])
  },
  created () {
    if (this.$permission.has('read employee job value assessment')) {
      this.getAssessmentRequest()
      this.$nextTick(() => {
        this.$refs.searchText.setFocus()
      })
    } else {
      this.$router.push('/403')
    }
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceJobValueAssessment', {
      getAssessment: 'get'
    }),
    updatePage (value) {
      this.page = value
      this.getAssessmentRequest()
    },
    getAssessmentRequest () {
      this.isLoading = true
      this.getAssessment({
        params: {
          sort_by: 'created_at',
          // filter_like: {
          //   criteria_factor: this.searchText,
          //   category: this.searchText
          // },
          limit: this.limit,
          page: this.page,
          includes: 'employee'
        }
      }).then((response) => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getAssessmentRequest()
    }, 300),
    onAdded (assessment) {
      this.getAssessmentRequest()
    }
  }
}
</script>
