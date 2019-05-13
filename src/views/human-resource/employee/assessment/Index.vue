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
      <li class="nav-item" v-if="$permission.has('read employee assessment')" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/assessment'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-bar-chart"></i> {{ $t('kpi') | titlecase }}</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="$permission.has('create employee assessment') && isScorer" slot="right">
        <router-link
          :to="'/human-resource/employee/' + employee.id + '/assessment/create'"
          exact
          class="nav-link"
          active-class="active">
          <span><i class="si si-note"></i> {{ $t('employee assessment') | titlecase }}</span>
        </router-link>
      </li>
    </tab-menu>

    <div class="row" v-show="!hideChart">
      <p-block
        :title="$t('kpi graph')"
        :header="true"
        column="col-lg-12">
        <line-chart
          ref="linechart"
          :chart-title="$t('kpi') | uppercase"
          :chart-label="chartLabel"
          :chart-data="chartData"/>
      </p-block>
    </div>

    <div class="row">
      <p-block :title="title" :header="true">
        <div class="text-right">
          <a href="javascript:void(0)" class="btn btn-square btn-outline-secondary" :class="{ 'active': reportType == 'all' }" @click="chooseType('all')">All</a>
          <a href="javascript:void(0)" class="btn btn-square btn-outline-secondary" :class="{ 'active': reportType == 'daily' }" @click="chooseType('daily')">Daily</a>
          <a href="javascript:void(0)" class="btn btn-square btn-outline-secondary" :class="{ 'active': reportType == 'weekly' }" @click="chooseType('weekly')">Weekly</a>
          <a href="javascript:void(0)" class="btn btn-square btn-outline-secondary" :class="{ 'active': reportType == 'monthly' }" @click="chooseType('monthly')">Monthly</a>
          <a href="javascript:void(0)" class="btn btn-square btn-outline-secondary" :class="{ 'active': reportType == 'yearly' }" @click="chooseType('yearly')">Yearly</a>
        </div>
        <hr>
        <p-block-inner :is-loading="loading">
          <p-table>
            <tr slot="p-head">
              <th>{{ $t('date') }}</th>
              <th class="text-center">{{ $t('weight') }}</th>
              <th class="text-center">{{ $t('target') }}</th>
              <th class="text-center">{{ $t('score') }}</th>
              <th class="text-center">{{ $t('value') }}</th>
            </tr>
            <tr
              v-for="assessment in assessments"
              :key="assessment.id"
              slot="p-body">
              <td>
                <template v-if="reportType == 'all'">
                  <router-link :to="{ name: 'humanResourceEmployeeAssessmentShow', params: { id: id, kpiId: assessment.id }}">
                    {{ assessment.date | dateFormat('DD MMMM YYYY') }}
                    <template v-if="$permission.has('read employee kpi')"> - {{ assessment.scorer.first_name + ' ' + assessment.scorer.last_name | titlecase }}</template>
                  </router-link>
                </template>
                <template v-else>
                  <template v-if="reportType == 'weekly'">
                    {{ assessment.date | dateFormat('MMMM YYYY [(][Week] WW[)]') }}
                  </template>
                  <template v-if="reportType == 'monthly'">
                    {{ assessment.date | dateFormat('MMMM YYYY') }}
                  </template>
                  <template v-if="reportType == 'yearly'">
                    {{ assessment.date | dateFormat('YYYY') }}
                  </template>
                  <template v-if="reportType == 'daily'">
                    {{ assessment.date | dateFormat('DD MMMM YYYY') }}
                  </template>
                </template>
              </td>
              <td class="text-center">{{ assessment.weight | numberFormat }}</td>
              <td class="text-center">{{ assessment.target | numberFormat }}</td>
              <td class="text-center">{{ assessment.score | numberFormat }}</td>
              <td class="text-center">{{ assessment.score_percentage | numberFormat }}</td>
              <td class="text-right">
                <router-link
                  :to="{ path: '/human-resource/employee/' + employee.id + '/assessment/' + assessment.id + '/edit', params: { id: employee.id, kpiId: assessment.id }}"
                  v-if="authUser.id == assessment.scorer.id && $permission.has('update employee assessment') && reportType == 'all'"
                  class="btn btn-sm btn-secondary mr-5">
                  <i class="si si-note"></i> Edit
                </router-link>
                &nbsp;
                <i class="fa fa-close" v-show="authUser.id == assessment.scorer.id && $permission.has('delete employee assessment') && reportType == 'all'" @click="deleteAssessment(assessment.id)"/>
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
      <div slot="content"><p>Are you sure want to delete the KPI?</p></div>
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
          v-if="$permission.has('delete employee assessment')"
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
      title: 'Assessment',
      loading: true,
      chartLabel: [],
      chartData: [],
      isScorer: false,
      hideChart: false,
      reportType: 'all',
      loadingSaveButton: false,
      selectedAsessementId: ''
    }
  },
  created () {
    this.loading = true
    this.getEmployeeAssessment({
      employeeId: this.id,
      params: {
        type: this.reportType
      }
    }).then(response => {
      this.loading = false
    }).catch(error => {
      this.loading = false
      console.log(JSON.stringify(error))
    })
    if (this.employee.scorers) {
      this.employee.scorers.find((element) => {
        if (element.id == this.authUser.id) {
          this.isScorer = true
        }
      })
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessments', 'dataSet'])
  },
  watch: {
    dataSet: function (val) {
      if (val.scores.length >= 2) {
        this.hideChart = false
        this.chartLabel.splice(0, this.chartLabel.length)
        this.chartData.splice(0, this.chartData.length)
        Array.prototype.push.apply(this.chartLabel, val.dates)
        Array.prototype.push.apply(this.chartData, val.scores)
        this.$refs.linechart.updateData()
      } else {
        this.hideChart = true
      }
    }
  },
  methods: {
    ...mapActions('humanResourceEmployeeAssessment', {
      getEmployeeAssessment: 'get',
      deleteEmployeeAssessment: 'delete'
    }),
    chooseType (type) {
      this.loading = true
      this.reportType = type
      this.getEmployeeAssessment({
        employeeId: this.id,
        params: {
          type: type
        }
      }).then((response) => {
        this.loading = false
      }, (error) => {
        this.loading = false
        console.log(JSON.stringify(error))
      })
      if (this.employee.scorers) {
        this.employee.scorers.find((element) => {
          if (element.id == this.authUser.id) {
            this.isScorer = true
          }
        })
      }
    },
    deleteAssessment (assessmentId) {
      this.selectedAsessementId = assessmentId
      this.$refs.delete.show()
    },
    onDelete () {
      this.loadingSaveButton = true
      this.deleteEmployeeAssessment({ id: this.selectedAsessementId, employeeId: this.id })
        .then((response) => {
          this.loadingSaveButton = false
          this.$refs.delete.close()
        }, (error) => {
          this.loadingSaveButton = false
          this.$notification.error('Delete failed', error.message)
          console.log(JSON.stringify(error))
        })
    }
  }
}
</script>
