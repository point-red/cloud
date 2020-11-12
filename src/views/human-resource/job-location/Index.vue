<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <span class="breadcrumb-item active">{{ $t('job location') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block">
          <a
            v-if="$permission.has('create employee')"
            href="javascript:void(0)"
            to="/human-resource/job-location/create"
            class="input-group-prepend"
            @click="$refs.addJobLocation.open()"
          >
            <span class="input-group-text">
              <i class="fa fa-plus" />
            </span>
          </a>
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
                {{ $t('area value') }}
              </th>
              <th width="33%">
                {{ $t('multiplier kpi') }}
              </th>
            </tr>
            <tr
              v-for="(jobLocation, index) in jobLocations"
              :key="index"
              slot="p-body"
            >
              <th>{{ (page - 1) * limit + index + 1 }}</th>
              <td>
                <router-link :to="{ name: 'job-location.show', params: { id: jobLocation.id }}">
                  {{ jobLocation.name }}
                </router-link>
              </td>
              <td>{{ jobLocation.base_salary | numberFormat }}</td>
              <td>{{ jobLocation.multiplier_kpi | numberFormat }}</td>
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

    <m-add-job-location
      ref="addJobLocation"
      @added="onAdded"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/TabMenu'

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
      this.getJobLocationRequest()
    }
  }
}
</script>
