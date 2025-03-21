<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <router-link
        to="/human-resource/job-value/assessment"
        class="breadcrumb-item"
      >
        {{ $t('job value assessment') | titlecase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t('create') | uppercase }}</span>
    </breadcrumb>

    <tab-menu />

    <form @submit.prevent="onSubmit">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <div class="row">
              <div class="col-sm-8">
                <h4>{{ $t('job value assessment') | uppercase }}</h4>
                <table class="table table-sm table-bordered">
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('period') | uppercase }}
                    </td>
                    <td>
                      <table style="border:none; border-collapse:collapse;">
                        <tr>
                          <td style="border:none">
                            <p-date-picker
                              id="period_from"
                              v-model="form.period_from"
                              name="period_from"
                              :label="$t('daperiod_fromte')"
                              :errors="form.errors.get('period_from')"
                              @errors="form.errors.set('period_from', null)"
                            />
                          </td>
                          <td style="border:none">
                            -
                          </td>
                          <td style="border:none">
                            <p-date-picker
                              id="period_to"
                              v-model="form.period_to"
                              name="period_to"
                              :label="$t('period_to')"
                              :errors="form.errors.get('period_to')"
                              @errors="form.errors.set('period_to', null)"
                            />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('created at') | uppercase }}
                    </td>
                    <td>
                      {{ createdAt }}
                    </td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">
                      {{ $t('employee') | uppercase }}
                    </td>
                    <td>
                      {{ authUser.employee.name | uppercase }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <hr>
            <point-table>
              <tr slot="p-head">
                <th>Kriteria Factor</th>
                <th>Score</th>
                <th>Value</th>
                <th>Score Description</th>
                <th>Notes</th>
              </tr>
              <tr
                v-for="(row, index) in form.scores"
                :key="index"
                slot="p-body"
              >
                <td>{{ row.criteria.criteria_factor }}</td>
                <td>
                  <p-form-number
                    :id="'score-' + index"
                    v-model="row.score"
                    :name="'score-' + index"
                    :is-text-right="false"
                    :errors="form.errors.get(`scores.${index}.score`)"
                    @errors="form.errors.set(`scores.${index}.score`, null)"
                    @input="handleScore(row)"
                  />
                </td>
                <td> {{ row.value }} </td>
                <td> {{ row.description }} </td>
                <td>
                  <p-form-input
                    :id="'note-' + index"
                    v-model="row.note"
                    :name="'note-' + index"
                    :disabled="isSaving"
                  />
                </td>
              </tr>
            </point-table>

            <div class="row">
              <div class="col-sm-6" />
              <div class="col-sm-6">
                <p-form-row
                  id="total-score"
                  name="total-score"
                  :label="$t('total score')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'total_score'"
                      :name="'total_score'"
                      :readonly="true"
                      :value="total_score"
                    />
                  </div>
                </p-form-row>
                <p-form-row
                  id="total-value"
                  name="total-value"
                  :label="$t('total value')"
                >
                  <div
                    slot="body"
                    class="col-lg-9 mt-5"
                  >
                    <p-form-number
                      :id="'total_value'"
                      :name="'total_value'"
                      :readonly="true"
                      :value="total_value"
                    />
                  </div>
                </p-form-row>
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
          </p-block-inner>
        </p-block>
      </div>
    </form>
  </div>
</template>

<script>
import TabMenu from '@/views/human-resource/job-value/TabMenu'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'
import Form from '@/utils/Form'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable,
    TabMenu
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      requestedBy: localStorage.getItem('fullName'),
      salesQuotation: null,
      form: new Form({
        scores: [],
        period_from: this.$moment().format('YYYY-MM-01 00:00:00'),
        period_to: this.$moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
        status: 'draft',
        employee_id: null
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
    this.getCriteriaRequest()
  },
  methods: {
    ...mapActions('humanResourceJobValueCriteria', {
      getCriteria: 'get'
    }),
    ...mapActions('humanResourceJobValueAssessment', ['create']),
    handleScore (row) {
      const scales = row.criteria.scales
      const maxScore = scales.reduce((max, scale) => (scale.value > max.value ? scale : max), scales[0])
      const minScore = scales.reduce((min, scale) => (scale.value < min.value ? scale : min), scales[0])

      const targetValue = (row.score / 100) * maxScore?.value

      if (targetValue < minScore.value) {
        row.value = 0
        row.description = '-'
        return
      }

      const targetScore = scales.reduce((closest, current) =>
        Math.abs(current.value - targetValue) < Math.abs(closest.value - targetValue) ? current : closest
      )
      row.value = targetScore?.value
      row.description = targetScore?.description
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
          this.$emit('updated', response.data)
          this.close()
        })
        .catch((error) => {
          console.log(error)
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    getCriteriaRequest () {
      this.isLoading = true
      this.getCriteria({
        params: {
          sort_by: 'criteria_factor',
          filter_like: {
            criteria_factor: this.searchText,
            category: this.searchText
          },
          limit: 100,
          page: this.page,
          includes: 'scales'
        }
      }).then((response) => {
        this.isLoading = false
        for (const criteria of response.data) {
          this.form.scores.push({
            criteria_id: criteria.id,
            criteria: criteria,
            description: null,
            score: 0,
            value: 0,
            note: null
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
