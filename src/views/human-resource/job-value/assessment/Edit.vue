<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/job-value/assessment"
        class="breadcrumb-item"
      >
        {{ 'job value assessment' | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ 'edit' | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block
          :title="'employee assessment'"
          :header="true"
        >
          <p-block-inner :is-loading="isLoading">
            <p-form-row
              id="name"
              :label="'name'"
            >
              <div
                slot="body"
                class="col-lg-9 col-form-label"
              >
                {{ form.employee?.name ?? '-' }}
              </div>
            </p-form-row>
            <p-form-row
              id="assessment-date"
              :label="'assessment period'"
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
                    :errors="form.errors.get('period_from')"
                    @errors="form.errors.set('period_from', null)"
                  />
                </div>
                <div class="col-lg-3">
                  <p-date-picker
                    id="period_to"
                    v-model="form.period_to"
                    name="period_to"
                    :label="'period_to'"
                    :errors="form.errors.get('period_to')"
                    @errors="form.errors.set('period_to', null)"
                  />
                </div>
              </div>
            </p-form-row>
            <p-form-row
              id="created-at"
              :label="'created at'"
            >
              <div
                slot="body"
                class="col-lg-9 col-form-label"
              >
                {{ createdAt }}
              </div>
            </p-form-row>
            <hr>
            <div
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
                        v-show="(!row.score || row.score === 0)"
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
                        v-if="(row.score > 0)"
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
                /> {{ 'save' | uppercase }}
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
                /> {{ 'save as draft' | uppercase }}
              </button>
            </div>
          </p-block-inner>
        </p-block>
      </div>
    </form>

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

    <m-user
      ref="approver"
      :permission="'approve employee job value assessment'"
      @choosen="chooseApprover($event)"
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
      id: this.$route.params.id,
      isSaving: false,
      isLoading: false,
      form: new Form({
        id: this.$route.params.id,
        scores: [],
        existing_scores: [],
        period_from: this.$moment().format('YYYY-MM-01 00:00:00'),
        period_to: this.$moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
        status: 'draft',
        employee_id: null,
        employee: null,
        request_approval_to: null,
        approver_name: null,
        approver_email: null
      }),
      createdAt: this.$moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueAssessment', ['assessment']),
    ...mapGetters('humanResourceJobValueCriteria', ['criterias']),
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
  created () {
    if (this.$permission.has('update employee job value assessment')) {
      this.find({
        id: this.id,
        params: {
          includes: 'employee;' +
            'employee.scorers;' +
            'scores;' +
            'scores.criteria;' +
            'scores.criteria.category;' +
            'requestApprover;' +
            'approvedBy;'
        }
      }).then(response => {
        this.isLoading = false
        this.form.existing_scores = response.data.scores
        this.form.period_from = response.data.period_from
        this.form.period_to = response.data.period_to
        this.form.status = response.data.status
        this.form.employee_id = response.data.employee_id
        this.form.employee = response.data.employee
        this.form.request_approval_to = response.data.request_approval_to
        this.form.approver_name = response.data.request_approver.name
        this.form.approver_email = response.data.request_approver.email
        this.getCriteriaRequest()
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    } else {
      this.$router.push('/403')
    }
  },
  methods: {
    ...mapActions('humanResourceJobValueCriteria', {
      getCriteria: 'get'
    }),
    ...mapActions('humanResourceJobValueAssessment', ['find', 'update', 'approve']),
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
      let canFinalize = true
      if (this.form.status === 'completed') {
        for (const score of this.form.scores) {
          if (score.value === null || score.value === 0) {
            canFinalize = false
          }
        }
      }

      if (!canFinalize) {
        this.$notification.error('Please fill all the score')
        return
      }

      this.isSaving = true
      this.form.total_score = this.total_score
      this.form.total_value = this.total_value
      this.update(this.form)
        .then(response => {
          if (this.form.request_approval_to === this.authUser.id) {
            this.approve({
              id: this.id
            }).then(response => {
              this.isSaving = false
              this.form.reset()
              this.$notification.success('Update success')
              Object.assign(this.$data, this.$options.data.call(this))
              this.$router.push('/human-resource/job-value/assessment')
            })
          } else {
            this.isSaving = false
            this.form.reset()
            this.$notification.success('Update success')
            Object.assign(this.$data, this.$options.data.call(this))
            this.$router.push('/human-resource/job-value/assessment')
          }
        }).catch(error => {
          this.isSaving = false
          this.form.errors.record(error.errors)
          let json = ''
          if (error.errors) {
            json = '<pre class="text-left">' + JSON.stringify(error.errors, null, 2) + '</pre>'
          }
          this.$alert.error('Error Message', error.message + json)
        })
    },
    getCriteriaRequest () {
      this.isLoading = true
      this.getCriteria({
        params: {
          sort_by: 'category.id',
          limit: 100,
          page: this.page,
          includes: 'scales;category'
        }
      }).then((response) => {
        this.isLoading = false
        let lastCategory = null
        for (const criteria of response.data) {
          const index = this.form.existing_scores.findIndex((o) =>
            o.criteria.id === criteria.id
          )

          const currentCategory = criteria.category.category

          let isCategoryRow = false
          if (lastCategory !== currentCategory) {
            lastCategory = currentCategory
            isCategoryRow = true
          }

          if (index !== -1) {
            this.form.scores.push({
              id: this.form.existing_scores[index].id,
              criteria_id: criteria.id,
              criteria: criteria,
              description: this.form.existing_scores[index].description,
              score: this.form.existing_scores[index].score,
              value: this.form.existing_scores[index].value,
              note: this.form.existing_scores[index].note,
              isCategoryRow
            })
          } else {
            this.form.scores.push({
              criteria_id: criteria.id,
              criteria: criteria,
              description: null,
              score: 0,
              value: 0,
              note: null,
              isCategoryRow
            })
          }
        }
      }).catch(error => {
        this.isLoading = false
        this.$notifications.error(error.message)
      })
    }
  }
}
</script>
