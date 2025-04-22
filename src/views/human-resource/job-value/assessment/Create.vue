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
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block
          :title="$t('employee assessment')"
          :header="true"
        >
          <p-block-inner :is-loading="isLoading">
            <p-form-row
              id="name"
              :label="$t('name')"
            >
              <div
                slot="body"
                class="col-lg-9 col-form-label"
              >
                {{ authUser.employee.name }}
              </div>
            </p-form-row>
            <p-form-row
              id="assessment-date"
              :label="$t('assessment period')"
            >
              <div
                slot="body"
                class="row col-lg-9"
              >
                <div class="col-lg-3">
                  <p-date-picker
                    id="period_from"
                    v-model="form.period_from"
                    name="period_from"
                    :label="$t('daperiod_fromte')"
                    :errors="form.errors.get('period_from')"
                    @errors="form.errors.set('period_from', null)"
                  />
                </div>
                <div class="col-lg-3">
                  <p-date-picker
                    id="period_to"
                    v-model="form.period_to"
                    name="period_to"
                    :label="$t('period_to')"
                    :errors="form.errors.get('period_to')"
                    @errors="form.errors.set('period_to', null)"
                  />
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="created-at"
              :label="$t('created at')"
            >
              <div
                slot="body"
                class="col-lg-9 col-form-label"
              >
                {{ createdAt }}
              </div>
            </p-form-row>
            <hr>
            <div v-if="(assessments && assessments.length > 0) && setting.minimum_coc > coc.score_percentage || contractMonthDiff < 6">
              <p
                v-if="setting.minimum_coc > coc.score_percentage"
                class="text-center font-w700"
              >
                {{ `cant create job value because your coc score is ${coc.score_percentage}. minimum score needed is ${setting.minimum_coc}` }}
              </p>
              <p
                v-if="contractMonthDiff < 6"
                class="text-center font-w700"
              >
                {{ `cant create job value. minimum contract is 6 months, your current contract is ${contractMonthDiff} months` }}
              </p>
            </div>
            <div
              v-else
              class="list-group push"
            >
              <p-table>
                <tr slot="p-head">
                  <th
                    class="font-size-h6 font-w700"
                    width="25%"
                  >
                    {{ 'Kriteria Factor' | uppercase }}
                  </th>
                  <th
                    class="font-size-h6 font-w700 text-center"
                    width="10%"
                  >
                    {{ 'Score' | uppercase }}
                  </th>
                  <th
                    class="font-size-h6 font-w700 text-center"
                    width="10%"
                  >
                    {{ 'Value' | uppercase }}
                  </th>
                  <th
                    class="font-size-h6 font-w700"
                    width="25%"
                  >
                    {{ 'Score Description' | uppercase }}
                  </th>
                  <th
                    class="font-size-h6 font-w700"
                    width="25%"
                  >
                    {{ 'Notes' | uppercase }}
                  </th>
                </tr>
                <template
                  v-for="(row, index) in form.scores"
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
                    <td>{{ row.criteria.criteria_factor }}</td>
                    <td class="text-center">
                      <a
                        v-show="(!row.value || row.value === 0)"
                        href="javascript:void(0)"
                        class="btn btn-sm btn-primary"
                        @click="!isSaving ? $refs.score.show(row) : null"
                      >
                        <i
                          v-show="!isSaving"
                          class="si si-note"
                        />
                      </a>
                      <a
                        v-if="(row.value || row.value > 0)"
                        href="javascript:void(0)"
                        class="text-decoration-none"
                        style="text-overflow: ellipsis"
                        @click="!isSaving ? $refs.score.show(row) : null"
                      >{{ row.score | numberFormat }}</a>
                    </td>
                    <td> {{ row.value }} </td>
                    <td> {{ row.description }} </td>
                    <td>
                      <a
                        v-show="
                          !row.note ||
                            row.note === undefined ||
                            row.note === '' ||
                            row.note === null
                        "
                        href="javascript:void(0)"
                        class="btn btn-sm btn-primary"
                        @click="$refs.notes.show(row)"
                      >
                        <i
                          v-show="!isSaving"
                          class="si si-note"
                        />
                      </a>
                      <a
                        v-if="
                          row.note &&
                            row.note !== undefined &&
                            row.note !== '' &&
                            row.note !== null
                        "
                        href="javascript:void(0)"
                        class="text-decoration-none"
                        @click="$refs.notes.show(row)"
                      >
                        {{ row.note }}
                      </a>
                    </td>
                  </tr>
                </template>
                <tr slot="p-body">
                  <td />
                  <td class="text-center font-w700">
                    <span class>{{ total_score | numberFormat }}</span>
                  </td>
                  <td class="text-center font-w700">
                    <span class>{{ total_value | numberFormat }}</span>
                  </td>
                  <td />
                  <td />
                </tr>
              </p-table>

              <div class="row my-50">
                <div class="col-sm-6" />
                <div class="col-sm-3 text-center" />
                <div class="col-sm-3 text-center">
                  <h6 class="mb-0">
                    {{ $t('approved by') | uppercase }}
                  </h6>
                  <div
                    class="mb-50"
                    style="font-size:11px"
                  >
                    _______________
                  </div>
                  <span
                    class="select-link"
                    @click="$refs.approver.open()"
                  >{{ form.approver_name || $t('select') | uppercase }}</span><br>
                  <span style="font-size:9px">{{ form.approver_email | uppercase }}</span>
                </div>
              </div>

              <div class="col-sm-12">
                <button
                  type="submit"
                  class="btn btn-block btn-sm btn-primary"
                  :disabled="isSaving"
                  @click="form.status = 'completed'"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save') | uppercase }}
                </button>
              </div>

              <div class="col-sm-12">
                <hr>
                <button
                  type="submit"
                  class="btn btn-block btn-sm btn-danger"
                  :disabled="isSaving"
                  @click="form.status = 'draft'"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save as draft') | uppercase }}
                </button>
              </div>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>

    <m-user
      ref="approver"
      :permission="'approve employee job value assessment'"
      @choosen="chooseApprover($event)"
    />

    <assign-score-modal
      id="employee-assessment"
      ref="score"
      :title="$t('employee assessment')"
      @add="addedScore"
    />

    <assign-notes-modal
      ref="notes"
      @saveNotes="addedNotes"
    />
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/job-value/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'
import Form from '@/utils/Form'
import AssignScoreModal from './AssignScoreModal'
import AssignNotesModal from './AssignNotesModal'

export default {
  components: {
    AssignScoreModal,
    AssignNotesModal,
    Breadcrumb,
    BreadcrumbHumanResource,
    TabMenu
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      contractMonthDiff: 0,
      requestedBy: localStorage.getItem('fullName'),
      salesQuotation: null,
      setting: {},
      coc: {
        score_percentage: 0
      },
      form: new Form({
        scores: [],
        period_from: this.$moment().format('YYYY-MM-01 00:00:00'),
        period_to: this.$moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
        status: 'draft',
        employee_id: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      }),
      createdAt: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueAssessment', ['assessment', 'coc']),
    ...mapGetters('humanResourceJobValueCriteria', ['criterias']),
    ...mapGetters('humanResourceJobValueScoreSetting', ['setting']),
    ...mapGetters('auth', ['authUser']),
    total_score () {
      let totalScore = 0
      for (const score of this.form.scores) {
        totalScore += Number(score.score)
      }
      return totalScore
    },
    total_value () {
      let totalValue = 0
      for (const score of this.form.scores) {
        totalValue += Number(score.value)
      }
      return totalValue
    }
  },
  watch: {
    'form.period_from': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getCocRequest()
      }
    },
    'form.period_to': function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getCocRequest()
      }
    }
  },
  created () {
    if (!this.authUser.employee) {
      this.$notification.error('user does not have employee data')
      this.$router.push('/human-resource/job-value/assessment')
    }
    if (this.$permission.has('create employee job value assessment')) {
      this.getAssessmentRequest()
      this.findEmployeeRequest()
      this.getCriteriaRequest()
      this.getSetting()
    } else {
      this.$router.push('/403')
    }
  },
  methods: {
    ...mapActions('humanResourceJobValueCriteria', {
      getCriteria: 'get'
    }),
    ...mapActions('humanResourceEmployee', {
      findEmployee: 'find'
    }),
    ...mapActions('humanResourceJobValueScoreSetting', ['get']),
    ...mapActions('humanResourceJobValueAssessment', {
      create: 'create',
      getAssessment: 'get',
      getCoc: 'getCoc'
    }),
    getAssessmentRequest () {
      this.isLoading = true
      this.getAssessment({
        params: {
          sort_by: 'created_at',
          filter_equal: {
            employee_id: this.authUser.employee.id
          },
          limit: this.limit,
          page: this.page
        }
      }).then((response) => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    addedScore ({ indicatorId, score, index }) {
      const groupIndex = this.form.scores.findIndex((o) =>
        o.criteria_id === indicatorId
      )

      if (groupIndex !== -1) {
        this.form.scores[groupIndex].score = index + 1
        this.form.scores[groupIndex].value = score.value
        this.form.scores[groupIndex].description = score.description
      }
    },
    addedNotes ({ indicatorId, notes }) {
      const groupIndex = this.form.scores.findIndex((o) =>
        o.criteria_id === indicatorId
      )

      if (groupIndex !== -1) {
        this.form.scores[groupIndex].note = notes
      }
    },
    chooseApprover (value) {
      this.form.request_approval_to = value.id
      this.form.approver_name = value.fullName
      this.form.approver_email = value.email
    },
    onSubmit () {
      this.isSaving = true
      this.form.employee_id = this.authUser.employee.id
      this.form.total_score = this.total_score
      this.form.total_value = this.total_value
      this.create(this.form)
        .then((response) => {
          this.isSaving = false
          this.$notification.success('success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$router.push('/human-resource/job-value/assessment')
        })
        .catch((error) => {
          console.log(error)
          this.isSaving = false
          this.isFailed = true
          this.$notification.error(error.message)
          this.form.errors.record(error.errors)
        })
    },
    getSetting () {
      this.isLoading = true
      this.get()
        .then((response) => {
          this.setting = response.data
          this.getCocRequest()
        })
        .catch((error) => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    },
    findEmployeeRequest () {
      this.findEmployee({
        id: this.authUser.employee.id
      }).then(response => {
        const contracts = response.data.contracts
        if (contracts && contracts.length > 0) {
          const startDates = contracts.map(c => new Date(c.contract_begin))
          const endDates = contracts.map(c => new Date(c.contract_end))

          const earliestStart = new Date(Math.min(...startDates.map(d => d.getTime())))
          const latestEnd = new Date(Math.max(...endDates.map(d => d.getTime())))

          this.contractMonthDiff =
              (latestEnd.getFullYear() - earliestStart.getFullYear()) * 12 +
              (latestEnd.getMonth() - earliestStart.getMonth())
        }
      })
    },
    getCocRequest () {
      this.isLoading = true
      this.getCoc({
        params: {
          employee_id: this.authUser.employee.id,
          start_date: this.form.period_from,
          end_date: this.form.period_to
        }
      }).then((response) => {
        this.isLoading = false
        this.coc = response.data
        if (!this.coc.score_percentage) {
          this.coc = {
            score_percentage: 0
          }
        }
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    },
    getCriteriaRequest () {
      this.getCriteria({
        params: {
          sort_by: 'category.id',
          limit: 100,
          page: this.page,
          includes: 'scales;category'
        }
      }).then((response) => {
        let lastCategory = null
        for (const criteria of response.data) {
          const currentCategory = criteria.category.category

          let isCategoryRow = false
          if (lastCategory !== currentCategory) {
            lastCategory = currentCategory
            isCategoryRow = true
          }

          this.form.scores.push({
            criteria_id: criteria.id,
            criteria: criteria,
            description: null,
            score: 0,
            value: null,
            note: null,
            isCategoryRow
          })
        }
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    }
  }
}
</script>
