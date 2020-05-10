<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-psychotest />
      <span class="breadcrumb-item active">{{ "candidate" | titlecase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block :title="$t('candidate')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"
        />
        <hr />
        <p-block-inner :is-loading="loading">
          <point-table>
            <tr slot="p-head">
              <th width="25%">Name</th>
              <th width="25%">Phone</th>
              <th width="25%">Password</th>
              <th width="25%">Is Password Used</th>
            </tr>
            <template v-if="$permission.has('read employee')">
              <tr
                v-for="candidate in candidates"
                :key="candidate.id"
                slot="p-body"
              >
                <td>
                  <router-link
                    :to="{
                      name: 'CandidateShow',
                      params: { id: candidate.id }
                    }"
                  >
                    {{ candidate.name }}
                  </router-link>
                </td>
                <td>{{ candidate.phone }}</td>
                <td>{{ candidate.password }}</td>
                <td>{{ candidate.is_password_used }}</td>
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
      pagination: {
        current_page: null,
        from: null,
        to: null,
        path: null,
        last_page: null,
        per_page: null,
        total: null
      }
    }
  },
  computed: {
    ...mapState('humanResourcePsychotestCandidate', ['candidates'])
  },
  methods: {
    ...mapActions('humanResourcePsychotestCandidate', { getCandidates: 'get' }),
    updatePage (value) {
      this.currentPage = value
      this.getCandidatesRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getCandidatesRequest()
    }, 300),
    getCandidatesRequest () {
      this.loading = true
      this.getCandidates({
        params: {
          filter_like: {
            name: this.searchText
          },
          limit: 10,
          page: this.currentPage,
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
  },
  created () {
    this.getCandidatesRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
