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
      <span class="breadcrumb-item active">Create</span>
    </breadcrumb>

    <tab-menu />

    <div
      v-if="calculation"
      class="row"
    >
      <p-block>
        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-8">
              <h4>{{ $t('job value assessment') | uppercase }}</h4>

              <tab-assessment />

              <table class="table table-sm table-bordered">
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Employee Name
                  </td>
                  <td>{{ calculation.assessment.employee.name }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Period
                  </td>
                  <td>
                    {{ $moment(calculation.assessment.period_from).format('yyyy-MM-DD') }}
                    -
                    {{ $moment(calculation.assessment.period_to).format('yyyy-MM-DD') }}
                  </td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Employee JV Current Period
                  </td>
                  <td>{{ calculation.prevAssessment?.total_score ?? 0 }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Employee JV Next Period
                  </td>
                  <td>{{ calculation.assessment.total_score }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Difference JV
                  </td>
                  <td>{{ calculation.score_diff }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Percentage Difference
                  </td>
                  <td>{{ calculation.score_diff_pct }}%</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    City Minimum Wage Current Period
                  </td>
                  <td>{{ calculation.prev_area_value }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    City Minimum Wage Next Period
                  </td>
                  <td>{{ calculation.area_value }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Difference City Minimum Wage
                  </td>
                  <td>{{ calculation.area_value_diff }}</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Percentage Difference
                  </td>
                  <td>{{ calculation.area_value_pct }}%</td>
                </tr>
                <tr>
                  <td
                    class="font-weight-bold"
                  >
                    Minimum JV Standard
                  </td>
                  <td>376.19</td>
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
import TabAssessment from '@/views/human-resource/job-value/assessment/TabAssessment'

import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource,
    TabMenu,
    TabAssessment
  },
  data () {
    return {
      id: this.$route.params.id,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueAssessment', ['calculation']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.assessmentRequest()
  },
  methods: {
    ...mapActions('humanResourceJobValueAssessment', {
      findCalculation: 'findCalculation'
    }),
    assessmentRequest () {
      this.isLoading = true
      this.findCalculation({
        id: this.id,
        params: {
          includes: 'assessment;' +
            'assessment.employee;' +
            'prevAssessment;'
        }
      }).then((response) => {
        this.isLoading = false
      }).catch(error => {
        this.$notification.error(error.message)
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
