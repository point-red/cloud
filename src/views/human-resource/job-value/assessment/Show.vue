<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/job-value/assessment"
        class="breadcrumb-item"
      >
        {{ $t('job value assessment') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">ASSESSMENT</span>
    </breadcrumb>

    <tab-menu />

    <div
      v-if="assessment"
      class="row"
    >
      <p-block>
        <div
          v-if="assessment.status == 'completed' && assessment.approval_status == 'pending'"
          class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
        >
          <div class="flex-fill mr-10">
            <p class="mb-0">
              <i class="fa fa-fw fa-exclamation-triangle" />
              {{ $t('pending approval warning', { form: 'assessment', approvedBy: assessment.request_approver?.full_name }) | uppercase }}
            </p>
            <hr>
            <div v-if="canApprove">
              <button
                type="button"
                class="btn btn-sm btn-primary mr-5"
                @click="onApprove"
              >
                <i
                  class="fa fa-asterisk fa-spin"
                  style="display: none;"
                />
                APPROVE
              </button>
              <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="onReject"
              >
                <i
                  class="fa fa-asterisk fa-spin"
                  style="display: none;"
                />
                REJECT
              </button>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <div
              v-if="authUser.employee?.id === assessment.employee_id || (assessment.request_approval_to === authUser.id && assessment.approval_status === 'rejected')"
              class="text-right mb-5"
            >
              <router-link
                v-if="$permission.has('create employee job value assessment')"
                :to="{ name: 'JobValueAssessmentCreate' }"
                class="btn btn-sm btn-outline-secondary mr-5"
              >
                {{ $t('create') | uppercase }}
              </router-link>
              <router-link
                v-if="($permission.has('update employee job value assessment')) && assessment.approval_status != 'approved'"
                :to="{ name: 'JobValueAssessmentEdit', params: { id: id }}"
                class="btn btn-sm btn-outline-secondary mr-5"
              >
                {{ $t('edit') | uppercase }}
              </router-link>
              <button
                v-if="$permission.has('delete employee job value assessment') && assessment.approval_status != 'approved'"
                type="button"
                :disabled="isDeleting"
                class="btn btn-sm btn-outline-secondary"
                @click="onDelete()"
              >
                <i
                  v-show="isDeleting"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('delete') | uppercase }}
              </button>
            </div>
          </div>

          <hr>
        </div>

        <p-block-inner :is-loading="isLoading">
          <ul
            class="nav nav-tabs nav-tabs-alt mb-10"
            data-toggle="tabs"
            role="tablist"
          >
            <slot />
            <li
              v-if="$permission.has('read employee job value assessment') && $permission.has('approve employee job value assessment')"
              class="nav-item"
            >
              <a
                href="#"
                class="nav-link"
                active-class="active"
                :class="{ active: tab == 1 }"
                @click="tab = 1"
              >
                Assessment
              </a>
            </li>
            <li
              v-if="$permission.has('approve employee job value assessment')"
              class="nav-item"
            >
              <a
                href="#"
                class="nav-link"
                active-class="active"
                :class="{ active: tab == 2 }"
                @click="tab = 2"
              >
                Fee Calculation
              </a>
            </li>
            <slot name="right" />
          </ul>

          <div
            v-if="tab == 1"
            class="row"
          >
            <div class="col-sm-8">
              <h4>{{ $t('job value assessment') | uppercase }}</h4>

              <table class="table table-sm table-bordered">
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('period') | uppercase }}
                  </td>
                  <td>
                    {{ $moment(assessment.period_from).format('yyyy-MM-DD') }}
                    -
                    {{ $moment(assessment.period_to).format('yyyy-MM-DD') }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('created at') | uppercase }}
                  </td>
                  <td>
                    {{ $moment(assessment.created_at).format('yyyy-MM-DD') }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ $t('created by') | uppercase }}
                  </td>
                  <td>
                    {{ assessment.employee.name }}
                  </td>
                </tr>
                <tr>
                  <td class="font-weight-bold">
                    {{ assessment.approval_status == 'approved' ? $t('approved by') : assessment.approval_status == 'rejected' ? $t('rejected by') : $t('approval to') | uppercase }}
                  </td>
                  <td>
                    {{ assessment.approval_status != 'approved' ? assessment.request_approver?.full_name : (assessment.approved_by?.first_name + ' ' + assessment.approved_by?.last_name) | uppercase }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <hr v-if="tab == 1">
          <point-table v-if="tab == 1">
            <tr slot="p-head">
              <th
                width="25%"
              >
                Kriteria Factor
              </th>
              <th
                class="text-center"
                width="10%"
              >
                Score
              </th>
              <th
                class="text-center"
                width="10%"
              >
                Value
              </th>
              <th
                width="25%"
              >
                Score Description
              </th>
              <th
                width="25%"
              >
                Notes
              </th>
            </tr>
            <template
              v-for="(row, index) in assessment.scores"
              slot="p-body"
            >
              <tr
                v-if="row.isCategoryRow"
                :key="'group' + row.criteria.category.id"
                class="bg-info-light"
              >
                <td colspan="5">
                  <strong>{{ row.criteria.category.category }}</strong>
                </td>
              </tr>
              <tr
                :key="index"
                slot="p-body"
              >
                <td> {{ row.criteria ? row.criteria?.criteria_factor : '-' }} </td>
                <td
                  class="text-center"
                >
                  {{ row.score }}
                </td>
                <td
                  class="text-center"
                >
                  {{ row.value }}
                </td>
                <td> {{ row.description }} </td>
                <td> {{ row.note ?? '-' }} </td>
              </tr>
            </template>
            <tr slot="p-body">
              <td />
              <td class="text-center font-w700">
                <span class>{{ assessment.total_score | numberFormat }}</span>
              </td>
              <td class="text-center font-w700">
                <span class>{{ assessment.total_value | numberFormat }}</span>
              </td>
              <td />
              <td />
            </tr>
          </point-table>

          <div
            v-if="tab == 2"
            class="row"
          >
            <div
              v-if="assessment.prev_assessment"
              class="col-sm-8"
            >
              <h4>{{ $t('job value assessment') | uppercase }}</h4>

              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Employee Name
                  </td>
                  <td>{{ assessment.employee.name }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Period
                  </td>
                  <td>
                    {{ $moment(assessment.period_from).format('yyyy-MM-DD') }}
                    -
                    {{ $moment(assessment.period_to).format('yyyy-MM-DD') }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Employee JV Current Period
                  </td>
                  <td>{{ assessment.prev_assessment?.total_value ?? 0 }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Employee JV Next Period
                  </td>
                  <td>{{ assessment.total_value }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Difference JV
                  </td>
                  <td>{{ assessment.score_diff }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Percentage Difference
                  </td>
                  <td>{{ assessment.score_diff_pct }}%</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    City Minimum Wage Current Period
                  </td>
                  <td>{{ assessment.prev_area_value | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    City Minimum Wage Next Period
                  </td>
                  <td>{{ assessment.area_value | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Difference City Minimum Wage
                  </td>
                  <td>{{ assessment.area_value_diff | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Percentage Difference
                  </td>
                  <td>{{ assessment.area_value_pct }}%</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Average KPI
                  </td>
                  <td>{{ assessment.kpi_avg | numberFormat }}%</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Minimum JV Standard
                  </td>
                  <td>376.19</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Pay Points Unit Current Period
                  </td>
                  <td>{{ assessment.current_point | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Pay Points Next Period
                  </td>
                  <td>{{ assessment.next_year_point | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Basic Fee
                  </td>
                  <td>{{ assessment.basic_fee | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Employee JV Last Year
                  </td>
                  <td>{{ assessment.prev_assessment?.net_fee ?? 0 | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Difference Percentage KPI
                  </td>
                  <td>{{ assessment.fee_add_pct | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Percent Additional Fee
                  </td>
                  <td>{{ assessment.fee_add_pct | numberFormat }}%</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Additional Fee
                  </td>
                  <td>{{ assessment.additional_fee | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Basic Fee Next Period
                  </td>
                  <td>{{ assessment.net_fee | numberFormat }}</td>
                </tr>
              </table>

              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Increased Job Value High KPI
                  </td>
                  <td>{{ assessment.jv_up_high | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Increased Job Value Normal KPI
                  </td>
                  <td>{{ assessment.jv_up_normal | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Static Job Value High KPI
                  </td>
                  <td>{{ assessment.jv_static_high | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Static Job Value Normal KPI
                  </td>
                  <td>{{ assessment.jv_static_normal | numberFormat }}</td>
                </tr>
              </table>
            </div>

            <div
              v-else
              class="col-sm-8"
            >
              <h4>{{ $t('job value assessment') | uppercase }}</h4>

              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Employee Name
                  </td>
                  <td>{{ assessment.employee.name }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Period
                  </td>
                  <td>
                    {{ $moment(assessment.period_from).format('yyyy-MM-DD') }}
                    -
                    {{ $moment(assessment.period_to).format('yyyy-MM-DD') }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Employee JV Current Year
                  </td>
                  <td>{{ assessment.total_value }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Minimum JV Standard
                  </td>
                  <td>376.19</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Current Pay Points Unit
                  </td>
                  <td>{{ assessment.next_year_point | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Basic Fee
                  </td>
                  <td>{{ assessment.basic_fee | numberFormat }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                    width="50%"
                  >
                    Net Fee This Year
                  </td>
                  <td>{{ assessment.net_fee | numberFormat }}</td>
                </tr>
              </table>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </div>
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/job-value/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable,
    TabMenu
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false,
      isDeleting: false,
      tab: 1,
      scores: []
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueAssessment', ['assessment']),
    ...mapGetters('auth', ['authUser']),
    canApprove () {
      if (this.assessment.request_approval_to === this.authUser.id) {
        return true
      }

      return false
    }
  },
  created () {
    if (this.$permission.has('read employee job value assessment')) {
      this.assessmentRequest()
    } else {
      this.$router.push('/403')
    }
  },
  methods: {
    ...mapActions('humanResourceJobValueAssessment', {
      find: 'find',
      approve: 'approve',
      reject: 'reject'
    }),
    ...mapActions('humanResourceJobValueAssessment', ['create', 'delete']),
    assessmentRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'employee;' +
            'employee.scorers;' +
            'scores;' +
            'scores.criteria;' +
            'scores.criteria.category;' +
            'prevAssessment;' +
            'requestApprover;'
        }
      }).then((response) => {
        this.isLoading = false
        let lastCategory = null
        for (const score of response.data.scores) {
          const currentCategory = score.criteria.category.category

          let isCategoryRow = false
          if (lastCategory !== currentCategory) {
            lastCategory = currentCategory
            isCategoryRow = true
          }

          score.isCategoryRow = isCategoryRow
        }
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    },
    onApprove () {
      this.approve({
        id: this.id
      }).then(response => {
        this.$notification.success('approve success')
        this.assessmentRequest()
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
        this.assessmentRequest()
      })
    },
    onDelete () {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isDeleting = true
        this.delete({
          id: this.id
        }).then(response => {
          this.isDeleting = false
          this.$router.push('/human-resource/job-value/assessment')
        }).catch(response => {
          this.isDeleting = false
          this.$notification.error('cannot delete this assessment')
        })
      })
    }
  }
}
</script>
