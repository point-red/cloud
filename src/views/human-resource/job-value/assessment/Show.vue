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
      v-if="assessment"
      class="row"
    >
      <p-block>
        <div
          v-if="assessment.status == 'completed' && assessment.approval_status == 'pending'"
          class="alert alert-warning d-flex align-items-center justify-content-between mb-15"
        >
          <div class="flex-fill mr-10">
            <div>
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

        <div
          v-if="assessment.status == 'draft' && assessment.approval_status == 'pending'"
          class="row"
        >
          <div class="col-sm-12">
            <div class="text-right">
              <router-link
                :to="{ name: 'JobValueAssessmentCreate' }"
                class="btn btn-sm btn-outline-secondary mr-5"
              >
                {{ $t('create') | uppercase }}
              </router-link>
              <router-link
                :to="{ name: 'purchase.request.edit', params: { id: id }}"
                class="btn btn-sm btn-outline-secondary mr-5"
              >
                {{ $t('edit') | uppercase }}
              </router-link>
            </div>
          </div>
        </div>
        <hr>

        <p-block-inner :is-loading="isLoading">
          <div class="row">
            <div class="col-sm-8">
              <h4>{{ $t('job value assessment') | uppercase }}</h4>

              <tab-assessment />

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
                    {{ $t('employee') | uppercase }}
                  </td>
                  <td>
                    {{ assessment.employee.name }}
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
              v-for="(row, index) in assessment.scores"
              :key="index"
              slot="p-body"
            >
              <td> {{ row.criteria.criteria_factor }} </td>
              <td> {{ row.score }} </td>
              <td> {{ row.value }} </td>
              <td> {{ row.description }} </td>
              <td> {{ row.note }} </td>
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
                  {{ assessment.total_score }}
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
                  {{ assessment.total_value }}
                </div>
              </p-form-row>
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
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Breadcrumb,
    BreadcrumbHumanResource,
    PointTable,
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
    ...mapGetters('humanResourceJobValueAssessment', ['assessment']),
    ...mapGetters('auth', ['authUser'])
  },
  created () {
    this.assessmentRequest()
  },
  methods: {
    ...mapActions('humanResourceJobValueAssessment', {
      find: 'find',
      approve: 'approve',
      reject: 'reject'
    }),
    ...mapActions('humanResourceJobValueAssessment', ['create']),
    assessmentRequest () {
      this.isLoading = true
      this.find({
        id: this.id,
        params: {
          includes: 'employee;' +
            'employee.scorers;' +
            'scores;' +
            'scores.criteria;'
        }
      }).then((response) => {
        this.isLoading = false
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
      })
    },
    onReject (reason) {
      this.reject({
        id: this.id,
        reason: reason
      }).then(response => {
        this.$notification.success('reject success')
      })
    }
  }
}
</script>
