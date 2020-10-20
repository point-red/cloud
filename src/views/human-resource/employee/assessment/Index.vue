<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/employee"
        class="breadcrumb-item"
      >
        {{ $t('employee') | uppercase }}
      </router-link>
      <router-link
        :to="'/human-resource/employee/' + employee.id"
        class="breadcrumb-item"
      >
        {{ employee.name | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ title | uppercase }}</span>
    </breadcrumb>

    <employee-widget :id="id" />

    <tab-menu />

    <div
      v-show="!hideChart"
      class="row"
    >
      <p-block
        :title="$t('kpi graph')"
        :header="true"
        column="col-lg-12"
      >
        <line-chart
          ref="linechart"
          :chart-title="$t('kpi') | uppercase"
          :chart-label="chartLabel"
          :chart-data="chartData"
        />
      </p-block>
    </div>

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
            :class="{ 'active': reportType == 'daily' }"
            @click="chooseType('daily')"
          >Daily</a>
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
          <a
            href="javascript:void(0)"
            class="btn btn-square btn-outline-secondary"
            :class="{ 'active': reportType == 'yearly' }"
            @click="chooseType('yearly')"
          >Yearly</a>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-table>
            <tr slot="p-head">
              <th>{{ $t('date') }}</th>
              <th class="text-center">
                {{ $t('weight') }}
              </th>
              <th class="text-center">
                {{ $t('target') }}
              </th>
              <th class="text-center">
                {{ $t('score') }}
              </th>
              <th class="text-center">
                {{ $t('value') }}
              </th>
            </tr>
            <tr
              v-for="assessment in assessments"
              :key="assessment.id"
              slot="p-body"
            >
              <td>
                <template v-if="reportType == 'all'">
                  <router-link :to="{ name: 'humanResourceEmployeeAssessmentShow', params: { id: id, kpiId: assessment.id }}">
                    {{ assessment.date | dateFormat('DD MMMM YYYY') }}
                    <template v-if="$permission.has('read employee kpi')">
                      - {{ assessment.scorer.first_name + ' ' + assessment.scorer.last_name | titlecase }}
                    </template>
                  </router-link>
                </template>
                <template v-else>
                  <template v-if="reportType == 'weekly'">
                    <template v-if="$permission.has('read employee assessment')">
                      <router-link :to="{ name: 'humanResourceEmployeeAssessmentShowBy', params: { id: id, type: 'weekly', value: assessment.id }}">
                        {{ assessment.date | dateFormat('MMMM YYYY [(][Week] WW[)]') }}
                      </router-link>
                    </template>
                    <template v-else>
                      {{ assessment.date | dateFormat('MMMM YYYY [(][Week] WW[)]') }}
                    </template>
                  </template>
                  <template v-if="reportType == 'monthly'">
                    <template v-if="$permission.has('read employee assessment')">
                      <router-link :to="{ name: 'humanResourceEmployeeAssessmentShowBy', params: { id: id, type: 'monthly', value: assessment.id }}">
                        {{ assessment.date | dateFormat('MMMM YYYY') }}
                      </router-link>
                    </template>
                    <template v-else>
                      {{ assessment.date | dateFormat('MMMM YYYY') }}
                    </template>
                  </template>
                  <template v-if="reportType == 'yearly'">
                    {{ assessment.date | dateFormat('YYYY') }} - {{ assessment.scorer.first_name + ' ' + assessment.scorer.last_name | titlecase }}
                  </template>
                  <template v-if="reportType == 'daily'">
                    {{ assessment.date | dateFormat('DD MMMM YYYY') }}
                  </template>
                </template>
              </td>
              <td class="text-center">
                {{ assessment.weight | numberFormat }}
              </td>
              <td class="text-center">
                {{ assessment.target | numberFormat }}
              </td>
              <td class="text-center">
                {{ assessment.score | numberFormat }}
              </td>
              <td class="text-center">
                {{ assessment.score_percentage | numberFormat }}
              </td>
              <td class="text-right">
                <router-link
                  v-if="authUser.id == assessment.scorer.id && $permission.has('update employee assessment') && reportType == 'all'"
                  :to="{ path: '/human-resource/employee/' + employee.id + '/assessment/' + assessment.id + '/edit', params: { id: employee.id, kpiId: assessment.id }}"
                  class="btn btn-sm btn-secondary mr-5"
                >
                  <i class="si si-note" /> {{ $t('edit') | uppercase }}
                </router-link>
                &nbsp;
                <template
                  v-if="authUser.id == assessment.scorer.id && $permission.has('delete employee assessment') && reportType == 'all'"
                >
                  <div
                    class="btn btn-sm btn-danger"
                    @click="deleteAssessment(assessment.id)"
                  >
                    <i
                      class="fa fa-trash"
                    /> DELETE
                  </div>
                </template>
              </td>
            </tr>
          </p-table>
        </p-block-inner>
        <p-pagination
          :current-page="page"
          :last-page="lastPage"
          @updatePage="updatePage"
        />
      </p-block>
    </div>

    <p-modal
      id="modal-delete"
      ref="delete"
      title="Confirmation"
    >
      <div slot="content">
        <p>Are you sure want to delete the KPI?</p>
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
          v-if="$permission.has('delete employee assessment')"
          type="button"
          :disabled="isSaving"
          class="btn btn-danger"
          @click="onDelete()"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('confirm') | uppercase }}
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
import LineChart from '@/components/point-chart/LineChart'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    LineChart,
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    EmployeeWidget
  },
  data () {
    return {
      id: this.$route.params.id,
      title: 'Assessment',
      isLoading: true,
      chartLabel: [],
      chartData: [],
      isScorer: false,
      hideChart: false,
      reportType: 'all',
      isSaving: false,
      selectedAsessementId: '',
      page: this.$route.query.page * 1 || 1,
      lastPage: 1
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessments', 'dataSet', 'pagination'])
  },
  watch: {
    dataSet: function (val) {
      if (val.scores.length >= 2) {
        this.hideChart = false
        this.chartLabel.splice(0, this.chartLabel.length)
        this.chartData.splice(0, this.chartData.length)
        Array.prototype.push.apply(this.chartLabel, val.dates.reverse())
        Array.prototype.push.apply(this.chartData, val.scores.reverse())
        this.$refs.linechart.updateData()
      } else {
        this.hideChart = true
      }
    }
  },
  created () {
    this.getEmployeeAssessmentRequest()
  },
  updated () {
    this.lastPage = this.pagination.last_page
  },
  methods: {
    ...mapActions('humanResourceEmployeeAssessment', {
      getEmployeeAssessment: 'get',
      deleteEmployeeAssessment: 'delete'
    }),
    chooseType (type) {
      this.reportType = type
      this.page = 1
      this.getEmployeeAssessmentRequest()
    },
    getEmployeeAssessmentRequest () {
      this.isLoading = true
      this.getEmployeeAssessment({
        employeeId: this.id,
        params: {
          page: this.page,
          type: this.reportType
        }
      }).then((response) => {
        this.isLoading = false
      }, (error) => {
        this.isLoading = false
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
    updatePage (value) {
      this.page = value
      this.getEmployeeAssessmentRequest()
    },
    onDelete () {
      this.isSaving = true
      this.deleteEmployeeAssessment({ id: this.selectedAsessementId, employeeId: this.id })
        .then((response) => {
          this.isSaving = false
          this.getEmployeeAssessmentRequest()
          this.$refs.delete.close()
        }, (error) => {
          this.isSaving = false
          this.$notification.error('Delete failed', error.message)
          console.log(JSON.stringify(error))
        })
    }
  }
}
</script>
