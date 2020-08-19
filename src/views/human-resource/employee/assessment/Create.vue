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
      <router-link
        :to="'/human-resource/employee/' + employee.id + '/assessment'"
        class="breadcrumb-item"
      >
        {{ $t('assessment') | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <employee-widget :id="id" />

    <tab-menu />

    <form
      class="row"
      @submit.prevent="onSubmit"
    >
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
              {{ employee.name }}
            </div>
          </p-form-row>
          <p-form-row
            id="assessment-date"
            :label="$t('assessment period')"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-date-range-picker
                v-model="form.date"
                name="assessment-date"
                :help="$t('assessment date help')"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="assessment-category"
            :label="$t('assessment category')"
          >
            <div
              v-if="form.template.name"
              slot="body"
              class="col-lg-9 col-form-label"
            >
              <a
                href="javascript:void(0)"
                @click="$refs.assignKpiTemplate.show(id)"
              >{{ form.template.name }}</a>
            </div>
            <div
              v-else
              slot="body"
              class="col-lg-9"
              @click="$refs.assignKpiTemplate.show(id)"
            >
              <button
                type="button"
                class="btn btn-sm btn-primary"
              >
                Assign Kpi
              </button>
            </div>
          </p-form-row>
          <p-table>
            <tr slot="p-head">
              <th class="font-size-h6 font-w700">
                {{ $t('no') | uppercase }}
              </th>
              <th class="font-size-h6 font-w700">
                {{ $t('key performance indicator') | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t('weight') | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t('target') | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t('score') | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t('score percentage') | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t('description') | uppercase }}
              </th>
              <th />
            </tr>
            <template
              v-for="group in form.template.groups"
              slot="p-body"
            >
              <tr
                :key="'group' + group.id"
                class="bg-info-light"
              >
                <td
                  class="text-center font-w600"
                  colspan="2"
                >
                  {{ group.name }}
                </td>
                <td class="text-center font-w600">
                  {{ group.weight | numberFormat }}%
                </td>
                <td class="text-center font-w600">
                  {{ group.target | numberFormat }}
                </td>
                <td class="text-center font-w600">
                  {{ group.score | numberFormat }}
                </td>
                <td class="text-center font-w600">
                  {{ group.score_percentage | numberFormat }}
                </td>
                <td class="text-center font-w600" />
                <td />
              </tr>
              <tr
                v-for="(indicator, index) in group.indicators"
                :key="'indicator' + indicator.id"
              >
                <td>{{ index+1 }}</td>
                <td>{{ indicator.name }}</td>
                <td class="text-center">
                  {{ indicator.weight }}%
                </td>
                <td class="text-center">
                  {{ indicator.target | numberFormat }}
                </td>
                <td class="text-center">
                  <a
                    v-show="!indicator.selected && !indicator.automated_code"
                    href="javascript:void(0)"
                    class="btn btn-sm btn-primary"
                    @click="$refs.score.show(indicator)"
                  >
                    <i class="si si-note" />
                  </a>
                  <span v-if="indicator.selected">
                    {{ indicator.selected.score | numberFormat }}
                  </span>
                  <span v-else-if="indicator.automated_code && indicator.score">
                    {{ indicator.score | numberFormat }}
                  </span>
                  <span v-else-if="indicator.automated_code && !indicator.score">
                    {{ 0 }}
                  </span>
                </td>
                <td class="text-center">
                  <span v-if="indicator.selected">
                    {{ indicator.selected.score_percentage | numberFormat }}
                  </span>
                  <span v-else-if="indicator.automated_code && indicator.score_percentage">
                    {{ indicator.score_percentage | numberFormat }}
                  </span>
                  <span v-else-if="indicator.automated_code && !indicator.score">
                    {{ 0 }}
                  </span>
                </td>
                <td class="text-center">
                  <span v-if="indicator.selected && indicator.selected.notes !== ''">
                    {{ indicator.selected.notes }}
                  </span>
                  <span v-else-if="indicator.selected">
                    {{ indicator.selected.description }}
                  </span>
                </td>
                <td class="text-center">
                  <span>
                    <button
                      v-show="indicator.selected && !indicator.automated_code"
                      type="button"
                      class="btn btn-sm btn-danger"
                      @click="removeScore(indicator.kpi_template_group_id, indicator.id)"
                    >
                      <i class="fa fa-times" />
                    </button>
                  </span>
                </td>
              </tr>
            </template>
            <tr slot="p-body">
              <td />
              <td />
              <td class="text-center font-w700">
                <span class="">{{ template.weight | numberFormat }}%</span>
              </td>
              <td class="text-center font-w700">
                <span class="">{{ template.target | numberFormat }}</span>
              </td>
              <td class="text-center font-w700">
                <span class="">{{ template.score | numberFormat }}</span>
              </td>
              <td class="text-center font-w700">
                <span class="">{{ template.score_percentage | numberFormat }}</span>
              </td>
              <td />
            </tr>
          </p-table>
          <p-form-row
            :label="$t('comment')"
          >
            <div
              slot="body"
              class="col-lg-9 col-form-label"
            >
              <textarea
                v-model="form.template.comment"
                class="form-control"
                rows="3"
              />
            </div>
          </p-form-row>

          <div class="form-group row">
            <div class="col-md-12">
              <hr>
              <button
                v-if="form.template.weight > 0"
                :disabled="isSaving"
                type="submit"
                class="btn btn-sm btn-primary mr-5"
              >
                <i
                  v-show="isSaving"
                  class="fa fa-asterisk fa-spin"
                /> {{ $t('save') | uppercase }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="cancel"
              >
                {{ $t('cancel') | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>

    <assign-kpi-template-modal
      ref="assignKpiTemplate"
      @assigned="getKpiTemplate"
    />

    <assign-score-modal
      id="employee-assessment"
      ref="score"
      :title="$t('employee assessment')"
      @add="addedScore"
    />
  </div>
</template>

<script>
import Form from '@/utils/Form'
import AssignScoreModal from './AssignScoreModal'
import AssignKpiTemplateModal from './AssignKpiTemplateModal'
import TabMenu from '@/views/human-resource/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import EmployeeWidget from '../EmployeeWidget'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AssignScoreModal,
    AssignKpiTemplateModal,
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource,
    EmployeeWidget
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      form: new Form({
        date: {
          start: this.$moment().format('YYYY-MM-DD 00:00:00'),
          end: this.$moment().format('YYYY-MM-DD 23:59:59')
        },
        template: {
          groups: [],
          comment: null
        }

      }),
      title: 'Kpi',
      isLoading: true,
      isSaving: false,
      scoreModalTitle: ''
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceKpiResult', ['result']),
    ...mapGetters('humanResourceKpiTemplate', ['template']),
    ...mapGetters('humanResourceKpiAutomated', ['automated_codes'])
  },
  watch: {
    'form.date' () {
      this.isLoading = true
      this.getAutomatedScore()
    }
  },
  created () {
    this.isLoading = true
    this.findEmployee({
      id: this.id
    }).then(response => {
      this.isLoading = false
      if (this.employee.kpi_template_id === null) {
        this.$refs.assignKpiTemplate.show(this.id)
      } else {
        this.getKpiTemplate(this.employee.kpi_template_id)
      }
    }).catch(error => {
      this.isLoading = false
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('humanResourceEmployee', {
      findEmployee: 'find'
    }),
    ...mapActions('humanResourceKpiTemplate', {
      findKpiTemplate: 'find'
    }),
    ...mapActions('humanResourceKpiResult', {
      findKpiResult: 'findByScorePercentage'
    }),
    ...mapActions('humanResourceEmployeeAssessment', {
      createEmployeeAssessment: 'create'
    }),
    ...mapActions('humanResourceKpiAutomated', {
      getAutomatedData: 'get'
    }),
    getKpiTemplate (kpiTemplateId) {
      this.isLoading = true
      this.findKpiTemplate({ id: kpiTemplateId })
        .then(response => {
          this.form.template = response.data
          this.getAutomatedScore()
        }).catch(error => {
          this.isLoading = false
          console.log(JSON.stringify(error))
        })
    },
    cancel () {
      this.$router.go(-1)
    },
    removeScore (groupId, indicatorId) {
      // find index of template group
      const groupIndex = this.form.template.groups
        .findIndex(o => o.indicators
          .find(o => o.id === indicatorId)
        )
      // find index of template indicator
      const indicatorIndex = this.form.template.groups[groupIndex].indicators.findIndex(o => o.id === indicatorId)
      var indicator = this.form.template.groups[groupIndex].indicators[indicatorIndex].selected
      var group = this.form.template.groups[groupIndex]
      var template = this.form.template
      // update
      this.$set(this.form.template, 'score', template.score - indicator.score)
      this.$set(this.form.template, 'score_percentage', template.score_percentage - indicator.score_percentage)
      this.$set(this.form.template.groups[groupIndex], 'score', group.score - indicator.score)
      this.$set(this.form.template.groups[groupIndex], 'score_percentage', group.score_percentage - indicator.score_percentage)
      // remove selected score to template indicator
      this.$delete(this.form.template.groups[groupIndex].indicators[indicatorIndex], 'selected')
    },
    addedScore ({ indicatorId, score, notes }) {
      // find index of template group
      const groupIndex = this.form.template.groups
        .findIndex(o => o.indicators
          .find(o => o.id === indicatorId)
        )
      // find index of template indicator
      const indicatorIndex = this.form.template.groups[groupIndex].indicators.findIndex(o => o.id === indicatorId)
      // add selected score to template indicator
      var indicator = this.form.template.groups[groupIndex].indicators[indicatorIndex]
      var group = this.form.template.groups[groupIndex]
      var template = this.form.template
      var scorePercentage = score.score / indicator.target * indicator.weight
      // update data
      this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex], 'selected', score)
      this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex].selected, 'score_percentage', scorePercentage)
      this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex].selected, 'notes', notes)
      this.$set(this.form.template.groups[groupIndex], 'score', score.score + (group.score || 0))
      this.$set(this.form.template.groups[groupIndex], 'score_percentage', scorePercentage + (group.score_percentage || 0))
      this.$set(this.form.template, 'score', score.score + (template.score || 0))
      this.$set(this.form.template, 'score_percentage', scorePercentage + (template.score_percentage || 0))
    },
    onSubmit () {
      this.$set(this.form.template, 'comment', this.form.template.comment)
      if (!this.form.date.start || !this.form.date.end) {
        this.$notification.error('Please select a valid date range')
        return
      }
      this.isSaving = true
      this.form.date.start = this.serverDateTime(this.form.date.start, 'start')
      this.form.date.end = this.serverDateTime(this.form.date.end, 'end')
      this.createEmployeeAssessment({ employeeId: this.employee.id, form: this.form })
        .then(response => {
          this.isSaving = false
          this.$notification.success('Create success')
          this.findKpiResult(this.form.template.score_percentage)
            .then(response => {
              this.$alert.success(response.data.criteria, response.data.notes)
                .then(() => {
                  this.$router.push('/human-resource/employee/' + this.id + '/assessment')
                })
            }).catch(error => {
              this.$router.push('/human-resource/employee/' + this.id + '/assessment')
            })
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('Create failed', error.message)
        })
    },
    getAutomatedScore () {
      var automatedIDs = []

      this.form.template.groups.forEach(function (group, key) {
        group.indicators.forEach(function (indicator, key) {
          if (indicator.automated_code) {
            automatedIDs.push(indicator.automated_code)
          }
        })
      })

      automatedIDs = [...new Set(automatedIDs)]

      if (automatedIDs.length > 0 && this.form.date.start && this.form.date.end) {
        this.getAutomatedData({ startDate: this.serverDateTime(this.form.date.start, 'start'), endDate: this.serverDateTime(this.form.date.end, 'end'), automated_codes: automatedIDs, employeeId: this.id })
          .then((response) => {
            this.isLoading = false

            var templateTarget = 0
            var templateScore = 0
            var templateScorePercentage = 0

            this.form.template.groups.forEach((group, groupIndex) => {
              var groupTarget = 0
              var groupScore = 0
              var groupScorePercentage = 0

              group.indicators.forEach((indicator, indicatorIndex) => {
                var target = this.form.template.groups[groupIndex].indicators[indicatorIndex].target || 0
                var score = 0
                var scorePercentage = 0

                if (response[indicator.automated_code]) {
                  target = response[indicator.automated_code].target || 0
                  score = response[indicator.automated_code].score || 0

                  scorePercentage = score / target * indicator.weight || 0

                  if (scorePercentage > indicator.weight) {
                    scorePercentage = parseFloat(indicator.weight) || 0
                  }

                  this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex], 'automated_code', indicator.automated_code)
                } else if (indicator.selected) {
                  score = this.form.template.groups[groupIndex].indicators[indicatorIndex].selected.score || 0
                  scorePercentage = score / target * indicator.weight || 0
                }

                this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex], 'target', target)
                this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex], 'score', score)
                this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex], 'score_percentage', scorePercentage)

                groupTarget += target
                groupScore += score
                groupScorePercentage += scorePercentage

                templateTarget += target
                templateScore += score
                templateScorePercentage += scorePercentage
              })

              this.$set(this.form.template.groups[groupIndex], 'target', groupTarget)
              this.$set(this.form.template.groups[groupIndex], 'score', groupScore)
              this.$set(this.form.template.groups[groupIndex], 'score_percentage', groupScorePercentage)
            })

            this.$set(this.form.template, 'target', templateTarget)
            this.$set(this.form.template, 'score', templateScore)
            this.$set(this.form.template, 'score_percentage', templateScorePercentage)
          }, (error) => {
            this.isLoading = false
            console.log(JSON.stringify(error))
          })
      } else {
        this.isLoading = false
      }
    }
  }
}
</script>
