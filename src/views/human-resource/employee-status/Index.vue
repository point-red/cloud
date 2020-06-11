<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <span class="breadcrumb-item active">{{ 'employee status' | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('employee status')">
        <div class="input-group block mb-5">
          <router-link
            to="/human-resource/employee-status/create"
            v-if="$permission.has('create employee')"
            class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
          <p-form-input
            id="search-text"
            name="search-text"
            placeholder="Search"
            class="btn-block"
            ref="searchText"
            :value="searchText"
            @input="filterSearch"/>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="100%">{{ $t('name') }}</th>
            </tr>
            <template v-if="$permission.has('read employee')">
              <tr
                v-for="status in statuses"
                :key="status.id"
                slot="p-body">
                <td>
                  <router-link :to="{ name: 'EmployeeStatusShow', params: { id: status.id }}">
                    {{ status.name }}
                  </router-link>
                </td>
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
      isLoading: false,
      listStatus: this.statuses,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeStatus', ['statuses', 'pagination'])
  },
  methods: {
    ...mapActions('humanResourceEmployeeStatus', { getStatuses: 'get' }),
    updatePage (value) {
      this.currentPage = value
      this.getStatusesRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getStatusesRequest()
    }, 300),
    getStatusesRequest () {
      this.isLoading = true
      this.getStatuses({
        params: {
          filter_like: {
            name: this.searchText
          },
          limit: 10,
          page: this.currentPage,
          sort_by: 'name'
        }
      }).then((response) => {
        this.isLoading = false
      }, (errors) => {
        this.isLoading = false
        console.log(errors.data)
      })
    }
  },
  created () {
    this.getStatusesRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
