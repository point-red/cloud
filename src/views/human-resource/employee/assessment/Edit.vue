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
      <router-link
        :to="'/human-resource/employee/' + employee.id + '/assessment'"
        class="breadcrumb-item"
      >
        Assessment
      </router-link>
      <span class="breadcrumb-item active">{{ $t('edit') | uppercase }}</span>
    </breadcrumb>

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
              <p-date-picker
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
              {{ form.template.name }}
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
                <span class="">{{ form.template.weight | numberFormat }}%</span>
              </td>
              <td class="text-center font-w700">
                <span class="">{{ form.template.target | numberFormat }}</span>
              </td>
              <td class="text-center font-w700">
                <span class="">{{ form.template.score | numberFormat }}</span>
              </td>
              <td class="text-center font-w700">
                <span class="">{{ form.template.score_percentage | numberFormat }}</span>
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
                v-model="form.comment"
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
import TabMenu from '@/views/human-resource/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AssignScoreModal,
    TabMenu,
    Breadcrumb,
    BreadcrumbHumanResource
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
      kpiId: this.$route.params.kpiId,
      form: new Form({
        date: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
        comment: null,
        template: {
          groups: []
        }
      }),
      title: 'Kpi',
      isLoading: false,
      isSaving: false,
      scoreModalTitle: ''
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessment']),
    ...mapGetters('humanResourceKpiResult', ['result']),
    ...mapGetters('humanResourceKpiTemplate', ['template']),
    ...mapGetters('humanResourceKpiAutomated', ['template'])
  },
  created () {
    this.isLoading = true

    this.findEmployeeAssessment({
      employeeId: this.id,
      kpiId: this.kpiId
    }).then(
      (response) => {
        this.form.date = this.assessment.date
        this.form.template = this.assessment
        this.form.comment = this.assessment.comment
        this.assignSelected()
        this.isLoading = false
      },
      (error) => {
        console.log(JSON.stringify(error))
        this.isLoading = false
      }
    )
  },
  methods: {
    ...mapActions('humanResourceEmployeeAssessment', {
      findEmployeeAssessment: 'find', updateEmployeeAssessment: 'update'
    }),
    ...mapActions('humanResourceKpiTemplate', {
      findKpiTemplate: 'find'
    }),
    ...mapActions('humanResourceKpiResult', {
      findKpiResult: 'findByScorePercentage'
    }),
    cancel () {
      this.$router.go(-1)
    },
    assignSelected () {
      for (var groupIndex in this.form.template.groups) {
        var group = this.form.template.groups[groupIndex]

        for (var indicatorIndex in group.indicators) {
          var indicator = this.form.template.groups[groupIndex].indicators[indicatorIndex]

          if (!indicator.automated_code && indicator.score !== 0) {
            var score = indicator.scores.find(o => o.description === indicator.score_description && o.score === indicator.score && o.kpi_indicator_id === indicator.id)
            var scorePercentage = score.score / indicator.target * indicator.weight

            this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex], 'selected', score)
            this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex].selected, 'score_percentage', scorePercentage)
            this.$set(this.form.template.groups[groupIndex].indicators[indicatorIndex].selected, 'notes', '')
          }
        }
      }
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
      this.isSaving = true
      this.updateEmployeeAssessment({ employeeId: this.id, kpiId: this.kpiId, form: this.form })
        .then(
          (response) => {
            this.isSaving = false
            this.$notification.success('Update success')
            this.$router.replace('/human-resource/employee/' + this.id + '/assessment/' + this.kpiId + '/edit')
          },
          (error) => {
            this.isSaving = false
            this.$notification.error('Update failed', error.message)
            this.form.errors.record(error.errors)
          }
        )
    }
  }
}
</script>
