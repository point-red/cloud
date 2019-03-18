<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <span class="breadcrumb-item active">{{ 'employee' | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('employee')" :header="true">
        <p-form-input
          id="search-text"
          name="search-text"
          placeholder="Search"
          :value="searchText"
          @input="filterSearch"/>
        <hr>
        <p-block-inner :is-loading="loading">
          <point-table>
            <tr slot="p-head">
              <th>{{ $t('name') }}</th>
              <th>{{ $t('job title') }}</th>
              <th>{{ $t('employee group') }}</th>
            </tr>
            <template v-for="employee in employees">
            <tr :key="employee.id"
              v-if="($permission.has('create employee assessment') && isShow(employee.scorers)) || $permission.has('read employee')"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'EmployeeShow', params: { id: employee.id }}">
                  {{ employee.name }}
                </router-link>
              </td>
              <td>{{ employee.job_title }}</td>
              <td><template v-if="employee.group">{{ employee.group.name }}</template></td>
            </tr>
            </template>
          </point-table>
          <p-pagination
            :current-page="currentPage"
            :last-page="lastPage"
            @updatePage="updatePage">
          </p-pagination>
        </p-block-inner>
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
      listEmployee: this.employees,
      searchText: '',
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('Auth', ['authUser']),
    ...mapGetters('Employee', ['employees', 'employeePagination']),
    ...mapGetters('EmployeeGroup', ['groupList'])
  },
  methods: {
    ...mapActions('Employee', { getEmployees: 'get' }),
    isShow (scorers) {
      return scorers.some(element => {
        return element.id == this.authUser.id
      })
    },
    updatePage (value) {
      this.currentPage = value
      this.getEmployeesRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.currentPage = 1
      this.getEmployeesRequest()
    }, 300),
    getEmployeesRequest () {
      this.loading = true
      this.getEmployees({
        filter_like: {
          'name': this.searchText,
          'job_title': this.searchText
        },
        limit: 10,
        page: this.currentPage,
        sort_by: 'name',
        includes: 'scorers',
        additional: 'groups'
      }).then((response) => {
        this.loading = false
      }, (errors) => {
        this.loading = false
        console.log(errors.data)
      })
    }
  },
  created () {
    this.getEmployeesRequest()
  },
  updated () {
    this.lastPage = this.employeePagination.last_page
  }
}
</script>
