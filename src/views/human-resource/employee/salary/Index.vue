<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item"
      >
        {{ $t('employee') | titlecase }}
      </router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id"
        class="breadcrumb-item"
      >
        {{ employee.name | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{ title | titlecase }}</span>
    </breadcrumb>

    <employee-widget :id="id" />

    <tab-menu />

    <div class="row">
      <p-block
        :title="title"
        :header="true"
      >
        <div class="text-right">
          <a
            href="javascript:void(0)"
            class="btn btn-square btn-outline-secondary"
            :class="{ 'active': reportType == 'all' }"
            @click="chooseType('all')"
          >All</a>
          <a
            href="javascript:void(0)"
            class="btn btn-square btn-outline-secondary"
            :class="{ 'active': reportType == 'weekly' }"
            @click="chooseType('weekly')"
          >Weekly</a>
          <a
            href="javascript:void(0)"
            class="btn btn-square btn-outline-secondary"
            :class="{ 'active': reportType == 'monthly' }"
            @click="chooseType('monthly')"
          >Monthly</a>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-table>
            <tr slot="p-head">
              <th>{{ $t('date') }}</th>
              <th class="text-center">
                {{ $t('salary') }}
              </th>
            </tr>
            <tr
              v-for="salary in salaries"
              :key="salary.id"
              slot="p-body"
            >
              <td>
                <template v-if="reportType == 'all'">
                  <router-link
                    v-if="$permission.has('read employee salary')"
                    :to="{ name: 'humanResourceEmployeeSalaryShow', params: { id: employee.id, salaryId: salary.id }}"
                  >
                    {{ salary.start_date | dateFormat('DD MMMM YYYY') }} - {{ salary.end_date | dateFormat('DD MMMM YYYY') }}
                  </router-link>
                  <template v-else>
                    {{ salary.start_date | dateFormat('DD MMMM YYYY') }} - {{ salary.end_date | dateFormat('DD MMMM YYYY') }}
                  </template>
                </template>
                <template v-else>
                  <template v-if="reportType == 'weekly'">
                    <template v-if="$permission.has('read employee salary')">
                      <router-link :to="{ name: 'humanResourceEmployeeSalaryShowBy', params: { id: employee.id, type: 'weekly', value: salary.id }}">
                        {{ salary.end_date | dateFormat('MMMM YYYY') }} (Week {{ getWeekOfMonth(salary.end_date) }})
                      </router-link>
                    </template>
                    <template v-else>
                      {{ salary.end_date | dateFormat('MMMM YYYY [(][Week] WW[)]') }}
                    </template>
                  </template>
                  <template v-if="reportType == 'monthly'">
                    <template v-if="$permission.has('read employee salary')">
                      <router-link :to="{ name: 'humanResourceEmployeeSalaryShowBy', params: { id: employee.id, type: 'monthly', value: salary.id }}">
                        {{ salary.end_date | dateFormat('MMMM YYYY') }}
                      </router-link>
                    </template>
                    <template v-else>
                      {{ salary.end_date | dateFormat('MMMM YYYY') }}
                    </template>
                  </template>
                </template>
              </td>
              <td class="text-center">
                {{ salary.amount_received | numberFormat }}
              </td>
              <td class="text-right">
                <router-link
                  v-if="$permission.has('update employee salary') && reportType == 'all'"
                  :to="{ path: '/human-resource/employee/' + employee.id + '/salary/' + salary.id + '/edit', params: { id: employee.id, kpiId: salary.id }}"
                  class="btn btn-sm btn-secondary"
                >
                  <i class="si si-note" /> {{ $t('edit') | uppercase }}
                </router-link>
                <button
                  v-if="$permission.has('print employee salary') && reportType == 'all'"
                  :disabled="isExporting.includes(salary.id)"
                  type="submit"
                  class="btn btn-sm btn-primary"
                  style="margin-left:12px"
                  @click="exportData(salary.id)"
                >
                  <i
                    v-show="isExporting.includes(salary.id)"
                    class="fa fa-asterisk fa-spin"
                  /> Export
                </button>
                &nbsp;
                <i
                  v-show="$permission.has('delete employee salary') && reportType == 'all'"
                  class="fa fa-close"
                  @click="deleteSalary(salary.id)"
                />
              </td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </div>

    <p-modal
      id="modal-delete"
      ref="delete"
      title="Confirmation"
    >
      <div slot="content">
        <p>Are you sure want to delete the Salary Form?</p>
      </div>
      <div slot="footer">
        <button
          type="button"
          class="btn btn-alt-secondary"
          data-dismiss="modal"
          @click="$refs.delete.close()"
        >
          {{ $t('cancel') | uppercase }}
        </button>
        &nbsp;
        <button
          v-if="$permission.has('delete employee salary')"
          type="button"
          :disabled="isSaving"
          class="btn btn-danger"
          @click="onDelete()"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('delete') | uppercase }}
        </button>
      </div>
    </p-modal>
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import EmployeeWidget from '../EmployeeWidget'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    EmployeeWidget
  },
  data () {
    return {
      id: this.$route.params.id,
      title: 'Salary',
      isLoading: true,
      isExporting: [],
      reportType: 'all',
      isSaving: false,
      selectedSalaryId: '',
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeSalary', ['salaries', 'pagination'])
  },
  created () {
    this.getEmployeeSalaryRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceEmployeeSalary', {
      getEmployeeSalary: 'get',
      deleteEmployeeSalary: 'delete',
      export: 'export'
    }),
    getWeekOfMonth (date) {
      const dateObject = new Date(date)
      const adjustedDate = dateObject.getDate() + dateObject.getDay()
      const prefixes = ['0', '1', '2', '3', '4', '5']
      return (parseInt(prefixes[0 | adjustedDate / 7]) + 1)
    },
    chooseType (type) {
      this.reportType = type
      this.page = 1
      this.getEmployeeSalaryRequest()
    },
    getEmployeeSalaryRequest () {
      this.isLoading = true
      this.getEmployeeSalary({
        employeeId: this.id,
        params: {
          page: this.page,
          type: this.reportType
        }
      }).then((response) => {
        this.isLoading = false
      }, (error) => {
        console.log(JSON.stringify(error))
      })
    },
    updatePage (value) {
      this.page = value
      this.getEmployeeSalaryRequest()
    },
    deleteSalary (salaryId) {
      this.selectedSalaryId = salaryId
      this.$refs.delete.show()
    },
    onDelete () {
      this.isSaving = true
      this.deleteEmployeeSalary({ id: this.selectedSalaryId, employeeId: this.id })
        .then((response) => {
          this.isSaving = false
          this.$refs.delete.close()
          this.getEmployeeSalaryRequest()
        }, (error) => {
          this.isSaving = false
          this.$notification.error('Delete failed', error.message)
          console.log(JSON.stringify(error))
        })
    },
    exportData (value) {
      this.isExporting.push(value)
      this.export({
        id: value,
        employeeId: this.id
      }).then((response) => {
        this.isExporting.splice(this.isExporting.indexOf(value), 1)
        this.downloadLink = response.data.url
        window.open(response.data.url, '_blank')
      }, (error) => {
        this.isExporting.splice(this.isExporting.indexOf(value), 1)
        console.log(error)
      })
    }
  }
}
</script>
