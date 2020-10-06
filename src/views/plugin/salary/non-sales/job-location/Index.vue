<template>
  <div>
    <breadcrumb>
      <breadcrumb-salary />
      <span class="breadcrumb-item active">{{ $t('job location') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
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
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                #
              </th>
              <th width="33%">
                {{ $t('name') }}
              </th>
              <th width="33%">
                {{ $t('UMK') }}
              </th>
              <th width="33%">
                {{ $t('UMK Job Value') }}
              </th>
              <th width="33%">
                {{ $t('action') }}
              </th>
            </tr>
            <tr
              v-for="(jobLocation, index) in jobLocations"
              :key="index"
              slot="p-body"
            >
              <th>{{ (page - 1) * limit + index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'nonsales.job-location.show', params: { id: jobLocation.id }}">
                  {{ jobLocation.name }}
                </router-link>
              </td>
              <td>{{ jobLocation.base_salary | numberFormat }}</td>
              <td>{{ jobLocation.job_value | numberFormat }}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-default btn-lg"
                  @click="$refs.editJobLocation.open(jobLocation)"
                >
                  <i class="si si-pencil" />
                </button>
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

    <m-add
      ref="addJobLocation"
      @added="onAdded"
    />
    <m-edit
      ref="editJobLocation"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/plugin/salary/non-sales/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSalary from '@/views/plugin/salary/Breadcrumb'
import MAdd from '@/views/plugin/salary/non-sales/job-location/MAdd'
import MEdit from '@/views/plugin/salary/non-sales/job-location/MEdit'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbSalary,
    PointTable,
    MAdd,
    MEdit
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
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocations', 'pagination'])
  },
  created () {
    this.getJobLocationRequest()
    this.$nextTick(() => {
      this.$refs.searchText.setFocus()
    })
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', {
      getJobLocation: 'get'
    }),
    updatePage (value) {
      this.page = value
      this.getJobLocationRequest()
    },
    getJobLocationRequest () {
      this.isLoading = true
      this.getJobLocation({
        params: {
          sort_by: 'name',
          filter_like: {
            name: this.searchText
          },
          limit: this.limit,
          page: this.page
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
      this.getJobLocationRequest()
    }, 300),
    onAdded (jobLocation) {
      this.searchText = jobLocation.name
      this.getJobLocationRequest()
    }
  }
}
</script>
