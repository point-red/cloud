<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-human-resource-kpi />
      <span class="breadcrumb-item active">{{ 'kpi assessment' | uppercase }}</span>
    </breadcrumb>

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
        <hr />

        <p-block-inner :is-loading="isLoading">
          <point-table>
            <tr slot="p-head">
              <th width="50px">#</th>
              <th>{{ $t('name') }}</th>
              <th>{{ $t('job title') }}</th>
              <th>{{ $t('department') }}</th>
              <th>{{ $t('action') }}</th>
            </tr>
            <template v-for="(employee, index) in employees">
              <tr
                v-if="($permission.has('create employee assessment') && isShow(employee.scorers)) || $permission.has('read employee')"
                :key="employee.id"
                slot="p-body"
              >
                <th>{{ getNumberIndex(index) }}</th>
                <td>
                  <router-link
                    :to="{ name: 'EmployeeShow', params: { id: employee.id }}"
                  >{{ employee.name }}</router-link>
                </td>
                <td>{{ employee.job_title }}</td>
                <td>
                  <template v-if="employee.group">{{ employee.group.name }}</template>
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
        <p-pagination :current-page="page" :last-page="lastPage" @updatePage="updatePage" />
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
