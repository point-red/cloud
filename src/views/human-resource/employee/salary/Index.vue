<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource/>
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item">{{ $t('employee') | titlecase }}</router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id"
        class="breadcrumb-item">{{ employee.name | titlecase }}</router-link>
      <span class="breadcrumb-item active">{{ title | titlecase }}</span>
    </breadcrumb>

    <employee-widget :id="id"></employee-widget>

    <tab-menu/>

    <div class="row">
      <p-block :title="title" :header="true">
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>{{ $t('date') }}</th>
              <th class="text-center">{{ $t('salary') }}</th>
            </tr>
            <tr
              v-for="(salary, salaryIndex) in salaries"
              :key="salary.id"
              slot="p-body">
              <td>
                <router-link :to="{ name: 'humanResourceEmployeeSalaryShow', params: { id: employee.id, salaryId: salary.id }}">
                  {{ dataSet.startDates[salaryIndex] | dateFormat('DD MMMM YYYY') }} - {{ dataSet.endDates[salaryIndex] | dateFormat('DD MMMM YYYY') }}
                </router-link>
              </td>
              <td class="text-center">Rp {{ dataSet.scores[salaryIndex] | numberFormat }}</td>
              <td class="text-right">
                <router-link
                  :to="{ path: '/human-resource/employee/' + employee.id + '/salary/' + salary.id + '/edit', params: { id: employee.id, kpiId: salary.id }}"
                  v-if="$permission.has('update employee salary')"
                  class="btn btn-sm btn-secondary">
                  <i class="si si-note"></i> Edit
                </router-link>
                <button :disabled="isExporting.includes(salary.id)" type="submit" class="btn btn-sm btn-primary" @click="exportData(salary.id)" style="margin-left:12px">
                  <i v-show="isExporting.includes(salary.id)" class="fa fa-asterisk fa-spin" /> Export
                </button>
                &nbsp;
                <i class="fa fa-close" v-show="$permission.has('delete employee salary')" @click="deleteSalary(salary.id)"/>
              </td>
            </tr>
          </p-table>
        </p-block-inner>
      </p-block>
    </div>

    <p-modal
      id="modal-delete"
      title="Confirmation"
      ref="delete">
      <div slot="content"><p>Are you sure want to delete the Salary Form?</p></div>
      <div slot="footer">
        <button
          type="button"
          class="btn btn-alt-secondary"
          @click="$refs.delete.close()"
          data-dismiss="modal">Cancel</button>
        &nbsp;
        <button
          type="button"
          @click="onDelete()"
          v-if="$permission.has('delete employee salary')"
          :disabled="loadingSaveButton"
          class="btn btn-danger">
          <i v-show="loadingSaveButton" class="fa fa-asterisk fa-spin"/> Delete
        </button>
      </div>
    </p-modal>
  </div>
</template>

<script>
import TabMenu from '../TabMenu'
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
      loading: true,
      loadingSaveButton: false,
      selectedSalaryId: '',
      isExporting: []
    }
  },
  created () {
    this.loading = true
    this.getEmployeeSalary({
      employeeId: this.id
    }).then((response) => {
      this.loading = false
    }, (error) => {
      console.log(JSON.stringify(error))
    })
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeSalary', ['salaries', 'dataSet'])
  },
  methods: {
    ...mapActions('humanResourceEmployeeSalary', {
      getEmployeeSalary: 'get',
      deleteEmployeeSalary: 'delete',
      export: 'export'
    }),
    deleteSalary (salaryId) {
      this.selectedSalaryId = salaryId
      this.$refs.delete.show()
    },
    onDelete () {
      this.loadingSaveButton = true
      this.deleteEmployeeSalary({ id: this.selectedSalaryId, employeeId: this.id })
        .then((response) => {
          this.loadingSaveButton = false
          this.$refs.delete.close()
        }, (error) => {
          this.loadingSaveButton = false
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
