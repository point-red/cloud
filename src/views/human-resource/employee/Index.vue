<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <span class="breadcrumb-item active">{{ 'employee' | titlecase }}</span>
    </breadcrumb>

    <tab-menu/>

    <div class="row">
      <p-block :title="$t('employee')" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th width="33%">{{ $t('name') }}</th>
              <th width="33%">{{ $t('job title') }}</th>
              <th width="33%">{{ $t('employee group') }}</th>
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
          </p-table>
          <nav v-show="pagination.last_page > 1">
            <ul class="pagination justify-content-center">
              <li class="page-item" v-show="pagination.current_page > 1">
                <a class="page-link" href="javascript:void(0)" tabindex="-1" aria-label="Previous" @click="paginate(1)">
                  <span aria-hidden="true">
                    <i class="fa fa-angle-double-left"></i>
                  </span>
                  <span class="sr-only">Previous</span>
                </a>
              </li>
              <li
                class="page-item"
                :class="{ 'active': pagination.current_page === n }"
                v-for="n in pagination.last_page"
                :key="n">
                <a class="page-link" href="javascript:void(0)" @click="paginate(n)">{{ n }}</a>
              </li>
              <li class="page-item" v-show="pagination.current_page < pagination.last_page">
                <a class="page-link" href="javascript:void(0)" aria-label="Next" @click="paginate(pagination.last_page)">
                  <span aria-hidden="true">
                    <i class="fa fa-angle-double-right"></i>
                  </span>
                  <span class="sr-only">Next</span>
                </a>
              </li>
            </ul>
          </nav>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import TabMenu from './TabMenu'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      loading: false,
      listEmployee: this.employees,
      filter: {
        group: null,
        name: '',
        jobTitle: ''
      }
    }
  },
  computed: {
    ...mapGetters('Auth', ['authUser']),
    ...mapGetters('Employee', ['employees', 'pagination']),
    ...mapGetters('EmployeeGroup', ['groupList'])
  },
  methods: {
    ...mapActions('Employee', { getEmployees: 'get' }),
    isShow (scorers) {
      return scorers.some(element => {
        return element.id == this.authUser.id
      })
    },
    paginate (page) {
      this.getEmployees({
        filter_like: [{ 'name': this.filter.name }],
        or_filter_like: [{ 'job_title': this.filter.jobTitle }],
        sort_by: 'name',
        includes: 'scorers',
        additional: 'groups',
        paginate: 20,
        page: page
      }).then((response) => {
      }, (errors) => {
        console.log(errors.data)
      })
    },
    filterTable () {
      this.filterColumn()
    },
    filterColumn: debounce(function () {
      this.loading = true
      this.getEmployees({
        filter_like: [{ 'name': this.filter.name }],
        or_filter_like: [{ 'job_title': this.filter.jobTitle }],
        sort_by: 'name',
        includes: 'scorers',
        additional: 'groups',
        paginate: 20
      }).then((response) => {
        this.loading = false
      }, (errors) => {
        console.log(errors.data)
      })
    }, 500)
  },
  created () {
    this.listEmployee = this.employees
    if (this.listEmployee.length === 0) {
      this.loading = true
    }
    this.getEmployees({
      sort_by: 'name',
      includes: 'scorers',
      additional: 'groups',
      paginate: 20,
      page: 1
    }).then((response) => {
      this.loading = false
    })
  }
}
</script>
