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
        <div class="row">
          <div class="col-sm-4 col-md-3 col-lg-3 mb-1 mr-sm-4 mr-md-0 mr-lg-0 select-date">
            <p-date-range-picker
              v-model="reminderDate"
              name="reminder-date"
            />
          </div>
          <div class="col-sm-1 col-md-2 col-lg-1 mb-1 p-1 pl-sm-2 pl-md-1 pl-lg-1 reminder">
            <button
              :disabled="isSending"
              class="btn btn-square btn-secondary"
              @click="kpiReminder"
            >
              <i
                v-if="isSending"
                class="fa fa-asterisk fa-spin"
              /> {{ $t('Reminder') | uppercase }}
            </button>
          </div>

          <div class="col-sm-7 col-md-7 col-lg-8 mb-1 text-right filter">
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
        </div>

        <hr>
        <p-block-inner :is-loading="isLoading">
          <p-table>
            <tr slot="p-head">
              <th>{{ $t('date') }}</th>
              <th>{{ $t('kpi template') }}</th>
              <th class="text-center">
                {{ $t('weight') }}
              </th>
              <th class="text-center">
                {{ $t('max score') }}
              </th>
              <th class="text-center">
                {{ $t('score') }}
              </th>
              <th class="text-center">
                %
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
              <td>
                {{ assessment.name }}
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

              <!-- status -->
              <td
                v-if="assessment.groups[0].indicators[0].scores[0].status === 'COMPLETED'"
                class="text-center text-success"
              >
                {{ assessment.groups[0].indicators[0].scores[0].status }}
              </td>
              <td
                v-else
                class="text-center text-warning"
              >
                {{ assessment.groups[0].indicators[0].scores[0].status }}
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
      lastPage: 1,
      reminderDate: '',
      isSending: false
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
    ...mapActions('humanResourceEmployee', {
      sendKpiReminder: 'sendKpiReminder'
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
    },
    kpiReminder () {
      this.isSending = true
      const oneDay = (24 * 60 * 60 * 1000)
      // scorers
      const scorers = []
      const scorersDone = []
      this.employee.scorers.map((scorer) => {
        scorers.push(scorer)
      })
      if (this.reminderDate.start && this.reminderDate.end) {
        // start date kpi reminder
        let startReminder = 0
        const startDate = this.reminderDate.start.split('-')
        startReminder += ((Number(startDate[2]) * oneDay) + (Number(startDate[1] * oneDay * 30) + (Number(startDate[0] * oneDay * 365))))
        // end date kpi reminder
        let endReminder = 0
        const endDate = this.reminderDate.end.split('-')
        endReminder += ((Number(endDate[2]) * oneDay) + (Number(endDate[1] * oneDay * 30) + (Number(endDate[0] * oneDay * 365))))
        // check date reminder
        this.assessments.map((assessment) => {
          let assessmentDate = 0
          const date = assessment.date.split(' ')[0].split('-')
          assessmentDate += ((Number(date[2]) * oneDay) + (Number(date[1] * oneDay * 30) + (Number(date[0] * oneDay * 365))))
          if (assessmentDate >= startReminder && assessmentDate <= endReminder) {
            scorersDone.push(assessment.scorer.id)
          }
        })
        // send kpi reminder
        scorers.map((scorer) => {
          if (scorersDone.indexOf(scorer.id) < 0) {
            const data = {
              to: scorer.email,
              name: scorer.full_name,
              employeeName: this.employee.name,
              startDate: this.reminderDate.start,
              endDate: this.reminderDate.end
              // link: 'dev.' + process.env.VUE_APP_DOMAIN + this.$route.path
            }
            this.sendKpiReminder(data).then((res) => {
              console.log(res)
              const Toast = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: toast => {
                  toast.addEventListener('mouseenter', this.$swal.stopTimer)
                  toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: 'send kpi reminder to: ' + scorer.email
              }).then(() => {
                this.isSending = false
              })
            })
          }
        })
      } else {
        this.isSending = false
        const Toast = this.$swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: toast => {
            toast.addEventListener('mouseenter', this.$swal.stopTimer)
            toast.addEventListener('mouseleave', this.$swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'error',
          title: 'Please enter date of periode'
        }).then(() => {
          this.isSending = false
        })
      }
    }
  }
}
</script>
<style scoped>
@media (max-width: 576px) {
  .select-date {
    display: flex;
    flex-direction: column;
    width: 60%;
  }
  .reminder {
    display: flex;
    flex-direction: column;
    width: 30%;
  }
  .filter {
    display: flex;
    flex-direction: row;
    width: 100%;
  }
}
</style>
