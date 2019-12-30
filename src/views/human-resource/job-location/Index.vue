<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <span class="breadcrumb-item active">{{ 'job location' | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('job location')">
        <div class="input-group block mb-5">
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            ref="searchText"
            :value="searchText"
            @input="filterSearch"/>
          <router-link
            to="/human-resource/job-location/create"
            v-if="$permission.has('create employee')"
            class="input-group-append">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
        </div>
        <hr>
        <p-block-inner :is-loading="loading">
          <point-table>
            <tr slot="p-head">
              <th width="33%">{{ $t('name') }}</th>
              <th width="33%">{{ $t('base salary') }}</th>
              <th width="33%">{{ $t('multiplier kpi') }}</th>
            </tr>
            <template v-if="$permission.has('read employee')">
              <tr
                v-for="jobLocation in jobLocations"
                :key="jobLocation.id"
                slot="p-body">
                <td>
                  <router-link :to="{ name: 'JobLocationShow', params: { id: jobLocation.id }}">
                    {{ jobLocation.name }}
                  </router-link>
                </td>
                <td>{{ jobLocation.base_salary | numberFormat }}</td>
                <td>{{ jobLocation.multiplier_kpi | numberFormat }}</td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="currentPage"
          :last-page="lastPage"
          @updatePage="updatePage">
        </p-pagination>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable
  },
  data () {
    return {
      loading: false,
      listJobLocation: this.jobLocations,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocations', 'pagination'])
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', { getJobLocations: 'get' }),
    updatePage (value) {
      this.currentPage = value
      this.getJobLocationsRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getJobLocationsRequest()
    }, 300),
    getJobLocationsRequest () {
      this.loading = true
      this.getJobLocations({
        params: {
          filter_like: {
            'name': this.searchText
          },
          limit: 10,
          page: this.currentPage,
          sort_by: 'name'
        }
      }).then((response) => {
        this.loading = false
      }, (errors) => {
        this.loading = false
        console.log(errors.data)
      })
    }
  },
  created () {
    this.getJobLocationsRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
