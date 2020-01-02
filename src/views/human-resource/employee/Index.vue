<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <span class="breadcrumb-item active">{{ 'employee' | uppercase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block>
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
            to="/human-resource/employee/create"
            v-if="$permission.has('create employee')"
            class="input-group-append">
            <span class="input-group-text">
              <i class="fa fa-plus"></i>
            </span>
          </router-link>
        </div>
        <hr>
        <div class="text-center font-size-sm mb-10">
          <a href="javascript:void(0)" @click="isAdvanceFilter = !isAdvanceFilter">
            {{ $t('advance filter') | uppercase }} <i class="fa fa-caret-down"></i>
          </a>
        </div>
        <div class="card" :class="{ 'fadeIn': isAdvanceFilter }" v-show="isAdvanceFilter">
          <div class="row">
            <div class="col-sm-3 text-center">
              <p-form-row id="status" name="status" :label="$t('status')" :is-horizontal="false">
                <div slot="body">
                  <m-status
                    :id="'status-id'"
                    v-model="status.id"
                    :label="status.label"
                    @choosen="chooseStatus($event)"
                    @clear="clearStatus()"/>
                </div>
              </p-form-row>
            </div>
          </div>
        </div>
        <hr>
        <div class="mr-15 animated fadeIn" v-show="checkedRow.length > 0">
          <button type="button" class="btn btn-secondary mr-5" @click="bulkArchiveEmployee()">
            {{ $t('archive') | uppercase }}
          </button>
          <button type="button" class="btn btn-secondary mr-5" @click="bulkActivateEmployee()">
            {{ $t('activate') | uppercase }}
          </button>
          <button type="button" class="btn btn-secondary" @click="bulkDeleteEmployee()">
            {{ $t('delete') | uppercase }}
          </button>
        </div>
        <p-block-inner :is-loading="loading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th width="50px">
                <p-form-check-box
                  id="subscibe"
                  name="subscibe"
                  :is-form="false"
                  @click.native="toggleCheckRows()"
                  :checked="isRowsChecked(employees, checkedRow)"
                  class="text-center"/>
              </th>
              <th>{{ $t('name') }}</th>
              <th>{{ $t('job title') }}</th>
              <th>{{ $t('employee group') }}</th>
            </tr>
            <template v-for="(employee, index) in employees">
            <tr :key="employee.id"
              v-if="($permission.has('create employee assessment') && isShow(employee.scorers)) || $permission.has('read employee')"
              :class="{
                'bg-gray': employee.archived_at != null,
                'bg-primary-lighter': isRowChecked(employee.id)
              }"
              slot="p-body">
              <th :class="{
                'bg-gray': employee.archived_at != null,
                'bg-primary-lighter': isRowChecked(employee.id)
              }">
                {{ index + 1}}
              </th>
              <td>
                <p-form-check-box
                  :is-form="false"
                  id="subscibe"
                  name="subscibe"
                  @click.native="toggleCheckRow(employee.id)"
                  :checked="isRowChecked(employee.id)"
                  class="text-center"/>
              </td>
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
      listEmployee: this.employees,
      searchText: this.$route.query.search,
      currentPage: this.$route.query.page * 1 || 1,
      lastPage: 1,
      isAdvanceFilter: false,
      checkedRow: [],
      status: {
        id: 0,
        label: null
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('humanResourceEmployee', ['employees', 'pagination']),
    ...mapGetters('humanResourceEmployeeGroup', ['groupList'])
  },
  methods: {
    ...mapActions('humanResourceEmployee', {
      getEmployees: 'get',
      bulkArchive: 'bulkArchive',
      bulkActivate: 'bulkActivate',
      bulkDelete: 'bulkDelete'
    }),
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
            let id = element.id
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
        let found = needles.some(element => {
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
        params: {
          filter_like: {
            'name': this.searchText,
            'job_title': this.searchText
          },
          limit: 10,
          page: this.currentPage,
          sort_by: 'name',
          includes: 'scorers',
          additional: 'groups'
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
    this.getEmployeesRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  }
}
</script>
