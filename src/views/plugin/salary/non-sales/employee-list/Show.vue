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
        <line-chart :chart-data="chartData" />
        <hr>
        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">
                No
              </th>
              <th style="min-width: 100px">
                Nama
              </th>
              <th>Tanggal Periode</th>
              <th>Gaji</th>
              <th width="50px">
                Action
              </th>
            </tr>
            <template v-for="(employeeFee, index) in employeeFees">
              <tr
                :key="employeeFee.id"
                slot="p-body"
              >
                <th>
                  {{ getNumberIndex(index) }}
                </th>
                <td>
                  <!-- <router-link :to="{ name: 'EmployeeShow', params: { id: employee.id }}"> -->
                  {{ employeeFee.employee.name }}
                  <!-- </router-link> -->
                </td>
                <td>{{ employeeFee.start_period }} - {{ employeeFee.end_period }}</td>
                <td>
                  {{ employeeFee.fee | numberFormat }}
                </td>
                <td>
                  <button
                    class="btn btn-default"
                    style="margin-right: 3px"
                    @click="$refs.editEmployeeFee.open(employeeFee, true)"
                  >
                    <i class="fa fa-pencil" />
                  </button>
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
      ref="editEmployeeFee"
      @updated="handleUpdatedEmployeeFee"
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
import LineChart from '@/components/point-chart/LineChart'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbSalary,
    PointTable,
    MEmployeeFee,
    LineChart
  },
  data () {
    return {
      employee_id: this.$route.params.id,
      isLoading: false,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1,
      isAdvanceFilter: false,
      checkedRow: [],
      statusId: null,
      chartData: null,
      statusLabel: []
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('pluginSalarySalaryNonSalesEmployeeFee', ['employeeFees'])
  },
  created () {
    // this.getEmployeesRequest()
    // this.getGroup()
    this.getEmployeeFeeRequest()
  },
  mounted () {
    this.chartData = [{
      labels: [this.getRandomInt(), this.getRandomInt()],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [this.getRandomInt(), this.getRandomInt()]
        }, {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [this.getRandomInt(), this.getRandomInt()]
        }
      ]
    }]
    console.log('mounted -> this.chartData', this.chartData)
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('pluginSalarySalaryNonSalesEmployeeFee', {
      getEmployeeFee: 'get'
    }),
    getEmployeeFeeRequest () {
      this.isLoading = true
      this.getEmployeeFee({ employee_id: this.employee_id })
        .then(() => {
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    handleUpdatedEmployeeFee () {
      this.getEmployeeFeeRequest()
    },
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
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>
