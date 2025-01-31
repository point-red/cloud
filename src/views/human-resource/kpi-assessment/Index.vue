<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-human-resource-kpi />
      <span class="breadcrumb-item active">{{ 'kpi assessment' | uppercase }}</span>
    </breadcrumb>

    <div class="row">
      <p-block>
        <div class="row mb-5" style="margin-left: 0px" v-if="$permission.has('export employee assessment')">
          <div class="">
            <p-select
              id="employee_id"
              v-model="employeeId"
              :options="employeeList"
              name="employee_id"
              label="employee"
            />
          </div>
          <div style="margin-left: 4px">
            <p-date-picker
              id="date"
              v-model="date.start"
              name="date"
              label="date from"
            />
          </div>
          <div style="margin-left: 4px">
            <p-date-picker
              id="date"
              v-model="date.end"
              name="date"
              label="date to"
            />
          </div>
          <div style="margin-left: 4px">
            <button
              type="button"
              class="btn btn-alt-secondary"
              @click="exportData"
            >
              {{ $t('export') }}
            </button>
          </div>
        </div>
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
              <th>{{ $t('job title') }}</th>
              <th>{{ $t('department') }}</th>
              <th>{{ $t('action') }}</th>
            </tr>
            <template v-for="(employee, index) in employees">
              <tr
                v-if="$permission.has('read employee assessment') && ($permission.has('create employee assessment') || $permission.has('read employee'))"
                :key="employee.id"
                slot="p-body"
              >
                <th>{{ getNumberIndex(index) }}</th>
                <td>
                  {{ employee.name }}
                </td>
                <td>{{ employee.job_title }}</td>
                <td>
                  <template v-if="employee.group">
                    {{ employee.group.name }}
                  </template>
                </td>
                <td>
                  <div class="row">
                    <a
                      v-if="$permission.has('create employee assessment')"
                      :href="'kpi-assessment/'+ employee.id"
                      title="create"
                      class="input-group-prepend mr-2"
                    >
                      <span class="input-group-text">
                        <i class="fa fa-pencil" />
                      </span>
                    </a>
                    <a
                      v-if="$permission.has('read employee assessment')"
                      :href="'kpi-assessment/' + employee.id + '/history'"
                      title="history"
                      class="input-group-prepend"
                    >
                      <span class="input-group-text">
                        <i class="fa fa-clock-o" />
                      </span>
                    </a>
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
  </div>
</template>

<script>
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import BreadcrumbHumanResourceKpi from '@/views/human-resource/kpi/Breadcrumb'
import PointTable from 'point-table-vue'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbHumanResourceKpi,
    PointTable
  },
  data () {
    return {
      isLoading: false,
      searchText: this.$route.query.search,
      page: this.$route.query.page * 1 || 1,
      lastPage: 1,
      employeeId: 0,
      isAdvanceFilter: false,
      downloadLink: '',
      checkedRow: [],
      date: {
        start: this.$moment().subtract(1, 'months').format('YYYY-MM-01 00:00:00'),
        end: this.$moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59:59')
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('humanResourceEmployee', ['employeeList', 'employees', 'pagination']),
    ...mapGetters('humanResourceEmployeeGroup', ['groupList'])
  },
  created () {
    this.getEmployeesRequest()
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
    ...mapActions('humanResourceEmployeeAssessment', {
      export: 'export'
    }),
    getNumberIndex (index) {
      return (this.page * 10) - 10 + index + 1
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
    isUser (employeeUserid) {
      return localStorage.getItem('userId') == employeeUserid
    },
    filterSearch: debounce(function (value) {
      this.$router.push({ query: { search: value } })
      this.searchText = value
      this.page = 1
      this.getEmployeesRequest()
    }, 300),
    exportData () {
      this.export({
        employee_id: this.employeeId,
        date_start: this.date.start,
        date_end: this.date.end
      }).then((response) => {
        this.downloadLink = response.data.url
        window.open(response.data.url, '_blank')
      }, (errors) => {
        console.log(errors.data)
      })
    },
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
          is_archived: 0,
          sort_by: 'name',
          includes: 'scorers',
          additional: 'groups',
          scorer_id: this.authUser.id
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
