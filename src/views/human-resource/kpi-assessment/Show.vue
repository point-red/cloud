<template>
  <div>
    <breadcrumb>
      <breadcrumb-human-resource />
      <breadcrumb-human-resource-kpi />
      <breadcrumb-human-resource-kpi-kpi-assessment />
      <router-link
        :to="'/human-resource/kpi/kpi-assessment/' + id + '/history'"
        class="breadcrumb-item"
      >
        {{ $t("history assessment") | uppercase }}
      </router-link>
      <span class="breadcrumb-item active">{{ $t("show") | uppercase }}</span>
    </breadcrumb>

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
              <span>{{ form.date | dateFormat("DD MMM YYYY") }}</span>
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
              <span>{{ form.template.name }}</span>
            </div>
          </p-form-row>
          <p-table>
            <tr slot="p-head">
              <th class="font-size-h6 font-w700">
                {{ $t("no") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700">
                {{ $t("key performance indicator") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("weight") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("target") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("notes") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("attachment") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("score") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("score percentage") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("description") | uppercase }}
              </th>
              <th class="font-size-h6 font-w700 text-center">
                {{ $t("comment") | uppercase }}
              </th>
            </tr>
            <template
              v-for="(group, indexGroup) in form.template.groups"
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
                <td class="text-center font-w600" />
                <td class="text-center font-w600" />
                <td class="text-center font-w600">
                  {{ group.score | numberFormat }}
                </td>
                <td class="text-center font-w600">
                  {{ group.score_percentage | numberFormat }}
                </td>
                <td class="text-center font-w600" />
                <td class="text-center font-w600" />
                <td />
              </tr>
              <tr
                v-for="(indicator, index) in group.indicators"
                :key="'indicator' + indicator.id"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ indicator.name }}</td>
                <td class="text-center">
                  {{ indicator.weight }}%
                </td>
                <td class="text-center">
                  {{ indicator.target | numberFormat }}
                </td>
                <td class="text-center">
                  <a
                    v-if="
                      indicator.selected &&
                        indicator.selected.notes !== '' &&
                        indicator.selected.notes !== undefined
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    style="text-overflow: ellipsis"
                    @click="$refs.notes.show(indicator, id, 0, true)"
                  >{{
                    indicator.selected.notes.length > 20
                      ? indicator.selected.notes.substring(0, 20) + "..."
                      : indicator.selected.notes
                  }}</a>
                </td>
                <td class="text-center">
                  <a
                    v-if="
                      indicator.selected &&
                        indicator.selected.attachment !== undefined &&
                        indicator.selected.attachment !== ''
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    style="text-overflow: ellipsis"
                    @click="
                      showAttachment(
                        dataAttachmentId.groups[indexGroup].indicators[index]
                      )
                    "
                  >
                    {{
                      indicator.selected.attachment.length > 20
                        ? indicator.selected.attachment.substring(0, 20) + "..."
                        : indicator.selected.attachment
                    }}
                  </a>
                </td>
                <td class="text-center">
                  <span
                    v-if="
                      indicator.selected &&
                        indicator.selected.score !== undefined &&
                        indicator.selected.score !== null
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    style="text-overflow: ellipsis"
                  >{{ indicator.selected.score | numberFormat }}</span>
                </td>
                <td class="text-center">
                  <span
                    v-if="
                      indicator.selected &&
                        indicator.selected.score !== undefined &&
                        indicator.selected.score !== null
                    "
                  >{{
                    indicator.selected.score_percentage | numberFormat
                  }}</span>
                  <span
                    v-else-if="
                      indicator.automated_code && indicator.score_percentage
                    "
                  >{{ indicator.score_percentage | numberFormat }}</span>
                  <span
                    v-else-if="indicator.automated_code && !indicator.score"
                  >{{ 0 }}</span>
                </td>
                <td class="text-center">
                  <span v-if="indicator.selected">{{
                    indicator.selected.description
                  }}</span>
                </td>
                <td class="text-center">
                  <a
                    v-if="
                      indicator.selected &&
                        indicator.selected.comment !== undefined &&
                        indicator.selected.comment !== ''
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    @click="$refs.comment.show(indicator, true)"
                  >{{
                    indicator.selected.comment.length > 20
                      ? indicator.selected.comment.substring(0, 20) + "..."
                      : indicator.selected.comment
                  }}</a>
                </td>
              </tr>
            </template>
            <tr slot="p-body">
              <td />
              <td />
              <td class="text-center font-w700">
                <span class>{{ form.template.weight | numberFormat }}%</span>
              </td>
              <td class="text-center font-w700">
                <span class>{{ form.template.target | numberFormat }}</span>
              </td>
              <td />
              <td />
              <td class="text-center font-w700">
                <span class>{{ form.template.score | numberFormat }}</span>
              </td>
              <td class="text-center font-w700">
                <span class>{{
                  form.template.score_percentage | numberFormat
                }}</span>
              </td>
              <td />
            </tr>
          </p-table>

          <p-form-row
            :is-horizontal="false"
            :label="$t('comment')"
          >
            <div
              slot="body"
              class="col-lg-9 col-form-label"
            >
              <pre>{{ assessment.comment }}</pre>
            </div>
          </p-form-row>
        </p-block-inner>
      </p-block>
    </form>

    <assign-notes-modal ref="notes" />
    <assign-comment-modal ref="comment" />
    <show-attachment-modal ref="showAttachment" />
  </div>
</template>

<script>
import Form from '@/utils/Form'
import AssignNotesModal from './AssignNotesModal'
import AssignCommentModal from './AssignCommentModal'
import ShowAttachmentModal from './ShowAttachmentModal'
import Breadcrumb from '@/views/Breadcrumb'
import BreadcrumbHumanResource from '@/views/human-resource/Breadcrumb'
import BreadcrumbHumanResourceKpi from '@/views/human-resource/kpi/Breadcrumb'
import BreadcrumbHumanResourceKpiKpiAssessment from '@/views/human-resource/kpi-assessment/Breadcrumb'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    AssignNotesModal,
    AssignCommentModal,
    ShowAttachmentModal,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbHumanResourceKpi,
    BreadcrumbHumanResourceKpiKpiAssessment
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      kpiId: this.$route.params.kpiId,
      id: this.$route.params.employeeId,
      form: new Form({
        date: '',
        template: {
          groups: []
        }
      }),
      isLoading: true,
      scoreModalTitle: '',
      indicatorIdAtt: null,
      dataAttachmentId: {
        groups: []
      }
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployee', ['employee']),
    ...mapGetters('humanResourceKpiResult', ['result']),
    ...mapGetters('humanResourceKpiTemplate', ['template']),
    ...mapGetters('humanResourceKpiAutomated', ['automated_codes']),
    ...mapGetters('humanResourceEmployeeAssessment', ['assessment']),
    ...mapGetters('cloudStorage', ['cloudStorage'])
  },
  created () {
    this.isLoading = true
    this.findEmployee({
      id: this.id
    }).then((response) => {
      this.findEmployeeAssessment({
        employeeId: this.id,
        kpiId: this.kpiId
      }).then(
        (response) => {
          this.form.date = this.assessment.date
          this.form.template = this.assessment
          this.assignSelected()
          var dates = this.form.date.split(' ')
          if (localStorage.getItem('userId') != this.employee.user_id) {
            this.getByPeriodeEmployeeAssessment({
              employeeId: this.id,
              date: dates[0]
            })
              .then((response) => {
                this.assignSelected(response.data)
                this.isLoading = false
              })
              .catch((error) => {
                this.isLoading = false
                console.log(error)
              })
          }
          this.isLoading = false
        },
        (error) => {
          console.log(JSON.stringify(error))
          this.isLoading = false
        }
      )
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
      createEmployeeAssessment: 'create',
      findEmployeeAssessment: 'find',
      updateEmployeeAssessment: 'update',
      getByPeriodeEmployeeAssessment: 'getByPeriode'
    }),
    ...mapActions('humanResourceKpiAutomated', {
      getAutomatedData: 'get'
    }),
    ...mapActions('cloudStorage', {
      showByAttachment: 'showBy'
    }),

    cancel () {
      this.$router.go(-1)
    },

    showAttachment (indicator) {
      this.showByAttachment({
        feature: 'assessment',
        feature_id: indicator.id
      })
        .then(
          (response) => {
            console.log(this.cloudStorage)
            this.$refs.showAttachment.show(this.cloudStorage.preview)
          },
          (error) => {
            console.log(JSON.stringify(error))
          }
        )
        .catch((error) => {
          console.log(JSON.stringify(error))
        })
    },

    assignSelected (dataAssessment = null) {
      if (dataAssessment !== null) {
        this.$set(this.dataAttachmentId, 'groups', dataAssessment.groups)
      } else {
        this.$set(this.dataAttachmentId, 'groups', this.form.template.groups)
      }
      for (var groupIndex in this.form.template.groups) {
        var group = this.form.template.groups[groupIndex]

        for (var indicatorIndex in group.indicators) {
          var indicator =
            this.form.template.groups[groupIndex].indicators[indicatorIndex]
          if (!indicator.automated_code && indicator.score !== undefined) {
            var score = indicator.scores.find(
              (o) =>
                o.description === indicator.score_description &&
                o.score === indicator.score &&
                parseInt(o.kpi_indicator_id) === indicator.id
            )
            if (score != undefined) {
              var scorePercentage =
                (score.score / indicator.target) * indicator.weight
              delete score.notes

              this.$set(
                this.form.template.groups[groupIndex].indicators[
                  indicatorIndex
                ],
                'selected',
                score
              )
              this.$set(
                this.form.template.groups[groupIndex].indicators[indicatorIndex]
                  .selected,
                'score_percentage',
                scorePercentage
              )
              this.$set(
                this.form.template.groups[groupIndex].indicators[indicatorIndex]
                  .selected,
                'comment',
                indicator.comment
              )
            } else {
              this.$set(
                this.form.template.groups[groupIndex].indicators[
                  indicatorIndex
                ],
                'selected',
                { comment: indicator.comment }
              )
            }
            this.$set(
              this.form.template.groups[groupIndex].indicators[indicatorIndex]
                .selected,
              'attachment',
              indicator.attachment
            )
            this.$set(
              this.form.template.groups[groupIndex].indicators[indicatorIndex]
                .selected,
              'notes',
              indicator.notes
            )

            if (dataAssessment != null) {
              var dataAssessment2 =
                dataAssessment.groups[groupIndex].indicators[indicatorIndex]
              this.$set(
                this.form.template.groups[groupIndex].indicators[indicatorIndex]
                  .selected,
                'attachment',
                dataAssessment2.attachment
              )
              this.$set(
                this.form.template.groups[groupIndex].indicators[indicatorIndex]
                  .selected,
                'notes',
                dataAssessment2.notes
              )
            }
          }
        }
      }
      this.isSaving = false
    }
  }
}
</script>
