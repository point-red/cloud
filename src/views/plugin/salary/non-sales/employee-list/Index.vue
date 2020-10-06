<template>
  <div>
    <breadcrumb>
      <breadcrumb-salary />
      <span class="breadcrumb-item active">{{ 'employee' | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <div class="row">
      <p-block>
        <div class="input-group block mb-5">
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
              <th>Name</th>
              <th>Job Location</th>
              <th>Job Value</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
            <template v-for="(employee, index) in employees">
              <tr
                :key="employee.id"
                slot="p-body"
              >
                <th>
                  {{ getNumberIndex(index) }}
                </th>
                <td>
                  {{ employee.name }}
                </td>
                <td>{{ employee.job_location ? employee.job_location.name : '' }}</td>
                <td>
                  {{ employee.job_location ? employee.job_location.name : '' }}
                </td>
                <td>
                  {{ employee.job_location ? (employee.job_location.job_value | numberFormat) : '' }}
                </td>
                <td>
                  <div style="display:flex">
                    <div
                      class="btn-wrapper"
                      style="padding-right: 14px; border-right: 1px solid black"
                    >
                      <button
                        class="btn btn-default"
                        style="margin-right: 3px"
                        @click="$refs.addEmployeeFee.open(employee)"
                      >
                        <i class="fa fa-plus" />
                      </button>
                    </div>
                    <div
                      class="btn-wrapper"
                      style="padding-left: 14px;"
                    >
                      <!-- <router-link
                        class="btn btn-default"
                        :to="{ name: 'EmployeeShow', params: { id: employee.id }}"
                      >
                        <i class="fa fa-history" />
                      </router-link> -->
                      <button
                        class="btn btn-default"
                        @click="$router.push({name: 'nonsales.employee-list.show', params: {id: employee.id}})"
                      >
                        <i class="fa fa-history" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </point-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>
    <m-employee-fee
      ref="addEmployeeFee"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/plugin/salary/non-sales/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbSalary from '@/views/plugin/salary/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
import MEmployeeFee from '@/views/plugin/salary/non-sales/employee-list/MEmployeeFee'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbSalary,
    PointTable,
    MEmployeeFee
  },
  data () {
    return {
      isLoading: false,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1,
      isAdvanceFilter: false,
      checkedRow: [],
      statusId: null,
      statusLabel: null
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('humanResourceEmployee', ['employees', 'pagination'])
  },
  created () {
    this.getEmployeesRequest()
    this.getGroup()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceEmployee', {
      getEmployees: 'get',
      bulkArchive: 'bulkArchive',
      bulkActivate: 'bulkActivate',
      bulkDelete: 'bulkDelete'
    }),
    ...mapActions('pluginSalarySalaryNonSalesGroup', {
      getGroup: 'get'
    }),
    getNumberIndex (index) {
      return (this.page * 10) - 10 + index + 1
    },
    onAdded () {
      this.getEmployeesRequest()
    },
    updatePage (value) {
      this.page = value
      this.getEmployeesRequest()
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getEmployeesRequest()
    }, 300),
    getEmployeesRequest () {
      this.isLoading = true
      this.getEmployees({
        params: {
          filter_like: {
            name: this.searchText,
            job_title: this.searchText
          },
          limit: 10,
          page: this.page,
          is_archived: this.statusId,
          sort_by: 'name',
          includes: 'scorers',
          additional: 'groups'
        }
      }).then((response) => {
        this.isLoading = false
      }, (errors) => {
        this.isLoading = false
        console.log(errors.data)
      })
    }
  }
}
</script>
