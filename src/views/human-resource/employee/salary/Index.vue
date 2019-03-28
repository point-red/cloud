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

    <tab-menu>
      <li class="nav-item" v-if="$permission.has('read employee salary')" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/salary'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-wallet"></i> {{ $t('salary') | titlecase }}</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create employee salary')" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/salary/create'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-wallet"></i> {{ $t('employee salary') | titlecase }}</span>
        </router-link>
      </li>
    </tab-menu>

    <div class="row" v-show="!hideChart">
      <p-block
        :title="$t('salary graph')"
        :header="true"
        column="col-lg-12">
        <line-chart
          ref="linechart"
          :chart-title="$t('salary') | uppercase"
          :chart-label="chartLabel"
          :chart-data="chartData"/>
      </p-block>
    </div>

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
                <router-link :to="{ name: 'EmployeeSalaryShow', params: { id: employee.id, salaryId: salary.id }}">
                  {{ salary.date | dateFormat('MMMM YYYY') }}
                  <template v-if="$permission.has('read employee salary')"> - {{ employee.name | titlecase }}</template>
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
import LineChart from '@/components/point-chart/LineChart'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    LineChart,
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
  },
  data () {
    return {
      id: this.$route.params.id,
      title: 'Salary',
      loading: true,
      chartLabel: [],
      chartData: [],
      hideChart: false,
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
    ...mapGetters('Employee', ['employee']),
    ...mapGetters('EmployeeSalary', ['salaries', 'dataSet'])
  },
  watch: {
    dataSet: function (val) {
      console.log('data set updated')
      if (val.scores.length >= 2) {
        this.hideChart = false
        this.chartLabel.splice(0, this.chartLabel.length)
        this.chartData.splice(0, this.chartData.length)
        Array.prototype.push.apply(this.chartLabel, val.dates)
        Array.prototype.push.apply(this.chartData, val.scores)
        console.log(JSON.stringify(this.chartData))
        this.$refs.linechart.updateData()
      } else {
        this.hideChart = true
      }
    }
  },
  methods: {
    ...mapActions('EmployeeSalary', {
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
