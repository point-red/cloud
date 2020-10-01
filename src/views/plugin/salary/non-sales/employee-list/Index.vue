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
              <th>{{ $t('name') }}</th>
              <th>{{ $t('job location') }}</th>
              <th>{{ $t('job value') }}</th>
              <th>{{ $t('salary') }}</th>
              <th>{{ $t('action') }}</th>
            </tr>
            <template v-for="(employee, index) in employees">
              <tr
                v-if="($permission.has('create employee assessment') && isShow(employee.scorers)) || $permission.has('read employee')"
                :key="employee.id"
                slot="p-body"
                :class="{
                  'bg-gray': employee.archived_at != null,
                  'bg-primary-lighter': isRowChecked(employee.id)
                }"
              >
                <th
                  :class="{
                    'bg-gray': employee.archived_at != null,
                    'bg-primary-lighter': isRowChecked(employee.id)
                  }"
                >
                  {{ getNumberIndex(index) }}
                </th>
                <td>
                  <router-link :to="{ name: 'EmployeeShow', params: { id: employee.id }}">
                    {{ employee.name }}
                  </router-link>
                </td>
                <td>{{ employee.job_location.name }}</td>
                <td>
                  {{ employee.job_location.name }}
                </td>
                <td>
                  {{ employee.job_location.job_value }}
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
                      <button class="btn btn-default">
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
    <m-status
      ref="status"
      @choosen="onChoosenStatus"
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
    ...mapGetters('humanResourceEmployee', ['employees', 'pagination']),
    ...mapGetters('humanResourceEmployeeGroup', ['groupList'])
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
    toggleCheckRow (id) {
      if (!this.isRowChecked(id)) {
        this.checkedRow.push({ id })
      } else {
        this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(id), 1)
      }
    },
    toggleCheckRows () {
      if (!this.isRowsChecked(this.employees, this.checkedRow)) {
        this.employees.forEach(element => {
          if (!this.isRowChecked(element.id)) {
            const id = element.id
            this.checkedRow.push({ id })
          }
        })
      } else {
        this.employees.forEach(element => {
          this.checkedRow.splice(this.checkedRow.map((o) => o.id).indexOf(element.id), 1)
        })
      }
    },
    isRowChecked (id) {
      return this.checkedRow.some(element => {
        return element.id == id
      })
    },
    isRowsChecked (haystack, needles) {
      if (needles.length == 0) {
        return false
      }
      for (let i = 0; i < haystack.length; i++) {
        const found = needles.some(element => {
          return element.id == haystack[i].id
        })
        if (!found) {
          return false
        }
      }
      return true
    },
    bulkArchiveEmployee () {
      this.bulkArchive({
        employees: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getEmployeesRequest()
      })
    },
    bulkActivateEmployee () {
      this.bulkActivate({
        employees: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getEmployeesRequest()
      })
    },
    bulkDeleteEmployee () {
      this.bulkDelete({
        employees: this.checkedRow
      }).then(response => {
        this.checkedRow = []
        this.getEmployeesRequest()
      })
    },
    isShow (scorers) {
      return scorers.some(element => {
        return element.id == this.authUser.id
      })
    },
    updatePage (value) {
      this.page = value
      this.getEmployeesRequest()
    },
    onChoosenStatus (option) {
      this.statusId = option.id
      this.statusLabel = option.label
      this.$router.push({
        query: {
          search: this.searchText,
          statusId: this.statusId
        }
      })
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
