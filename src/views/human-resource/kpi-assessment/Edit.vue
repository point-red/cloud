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
      <span class="breadcrumb-item active">{{ $t("edit") | uppercase }}</span>
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
                    v-show="
                      (!indicator.selected ||
                        indicator.selected.notes === '' ||
                        indicator.selected.notes === undefined) &&
                        isUser(employee.user_id)
                    "
                    href="javascript:void(0)"
                    class="btn btn-sm btn-primary"
                    @click="
                      !isSaving
                        ? $refs.notes.show(indicator, id, employee.user_id)
                        : null
                    "
                  >
                    <i
                      v-show="isSaving"
                      class="fa fa-asterisk fa-spin"
                    />
                    <i
                      v-show="!isSaving"
                      class="si si-note"
                    />
                  </a>
                  <a
                    v-if="
                      indicator.selected &&
                      indicator.selected.notes !== '' &&
                      indicator.selected.notes !== undefined &&
                      indicator.selected.notes !== null
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    style="text-overflow: ellipsis"
                    @click="$refs.notes.show(indicator, id, employee.user_id)"
                  >{{
                    indicator.selected.notes.length > 15
                      ? indicator.selected.notes.substring(0, 15) + "..."
                      : indicator.selected.notes
                  }}</a>
                </td>
                <td class="text-center">
                  <label
                    v-show="
                      (!indicator.selected ||
                        indicator.selected.attachment === '' ||
                        indicator.selected.attachment === undefined) &&
                        isUser(employee.user_id)
                    "
                    :for="!isSaving ? 'file-' + indicator.id : ''"
                    class="btn btn-sm btn-primary mt-1"
                    @click="!isSaving ? setIndicatorIdAtt(indicator.id) : null"
                  >
                    <i
                      v-show="isSaving"
                      class="fa fa-asterisk fa-spin"
                    />
                    <i
                      v-show="!isSaving"
                      class="si si-paper-clip"
                    />
                  </label>
                  <label
                    v-if="
                      indicator.selected &&
                      indicator.selected.attachment !== undefined &&
                      indicator.selected.attachment !== '' &&
                      indicator.selected.attachment !== null &&
                      isUser(employee.user_id)
                    "
                    :for="!isSaving ? 'file-' + indicator.id : ''"
                    style="font-weight: 200; color: #3f9ce8"
                    @click="!isSaving ? setIndicatorIdAtt(indicator.id) : null"
                  >
                    {{
                      indicator.selected.attachment.length > 15
                        ? indicator.selected.attachment.substring(0, 15) + "..."
                        : indicator.selected.attachment
                    }}
                  </label>
                  <input
                    :id="'file-' + indicator.id"
                    ref="file"
                    type="file"
                    style="display: none"
                    accept=".doc, .docx, .pdf, .png, .jpg, .jpeg"
                    @change="onFileChange"
                  >
                  <a
                    v-if="
                      indicator.selected &&
                      indicator.selected.attachment !== undefined &&
                      indicator.selected.attachment !== '' &&
                      indicator.selected.attachment !== null &&
                      !isUser(employee.user_id)
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    style="text-overflow: ellipsis"
                    @click="
                      !isSaving
                        ? showAttachment(
                          dataAttachmentId.groups[indexGroup].indicators[
                            index
                          ]
                        )
                        : null
                    "
                  >
                    {{
                      indicator.selected.attachment.length > 15
                        ? indicator.selected.attachment.substring(0, 15) + "..."
                        : indicator.selected.attachment
                    }}
                  </a>
                </td>
                <td class="text-center">
                  <a
                    v-show="
                      (!indicator.selected ||
                        indicator.selected.score === undefined ||
                        indicator.selected.score === null) &&
                        !indicator.automated_code
                    "
                    href="javascript:void(0)"
                    class="btn btn-sm btn-primary"
                    @click="!isSaving ? $refs.score.show(indicator) : null"
                  >
                    <i
                      v-show="isSaving"
                      class="fa fa-asterisk fa-spin"
                    />
                    <i
                      v-show="!isSaving"
                      class="si si-note"
                    />
                  </a>
                  <a
                    v-if="
                      indicator.selected &&
                        indicator.selected.score !== undefined &&
                        indicator.selected.score !== null
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    style="text-overflow: ellipsis"
                    @click="!isSaving ? $refs.score.show(indicator) : null"
                  >{{ indicator.selected.score | numberFormat }}</a>
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
                    v-show="
                      !indicator.selected ||
                        indicator.selected.comment === '' ||
                        indicator.selected.comment === undefined
                    "
                    href="javascript:void(0)"
                    class="btn btn-sm btn-primary"
                    @click="$refs.comment.show(indicator)"
                  >
                    <i
                      v-show="isSaving"
                      class="fa fa-asterisk fa-spin"
                    />
                    <i
                      v-show="!isSaving"
                      class="si si-note"
                    />
                  </a>
                  <a
                    v-if="
                      indicator.selected &&
                      indicator.selected.comment !== undefined &&
                      indicator.selected.comment !== '' &&
                      indicator.selected.comment !== null
                    "
                    href="javascript:void(0)"
                    class="text-decoration-none"
                    @click="$refs.comment.show(indicator)"
                  >{{
                    indicator.selected.comment.length > 15
                      ? indicator.selected.comment.substring(0, 15) + "..."
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

          <p-form-row :label="$t('comment')">
            <div
              slot="body"
              class="col-lg-9 col-form-label"
            >
              <textarea
                v-model="form.comment"
                class="form-control"
                rows="3"
                @change="changeCommentTemplate"
              />
            </div>
          </p-form-row>

          <div class="form-group row">
            <div class="col-md-12">
              <hr>
              <button
                v-if="form.template.weight > 0"
                :disabled="isSaving || isSubmit"
                type="submit"
                class="btn btn-sm btn-primary mr-5"
              >
                <i
                  v-show="isSubmit"
                  class="fa fa-asterisk fa-spin"
                />
                {{ $t("save") | uppercase }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="cancel"
              >
                {{ $t("cancel") | uppercase }}
              </button>
            </div>
          </div>
        </p-block-inner>
      </p-block>
    </form>

    <assign-notes-modal
      ref="notes"
      @saveNotes="addedNotes"
    />
    <assign-comment-modal
      ref="comment"
      @saveComment="addedComment"
    />
    <show-attachment-modal ref="showAttachment" />

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
    AssignScoreModal,
    AssignNotesModal,
    AssignCommentModal,
    Breadcrumb,
    BreadcrumbHumanResource,
    BreadcrumbHumanResourceKpi,
    BreadcrumbHumanResourceKpiKpiAssessment,
    ShowAttachmentModal
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
        comment: null,
        template: {
          groups: []
        }
      }),
      title: 'Kpi',
      isLoading: true,
      isSaving: false,
      isSubmit: false,
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
    }).then((response) => {
      this.findEmployeeAssessment({
        employeeId: this.id,
        kpiId: this.kpiId
      }).then(
        (response) => {
          this.form.comment = this.assessment.comment
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
      showByAttachment: 'showBy',
      replaceAttachment: 'replace'
    }),

    cancel () {
      this.$router.go(-1)
    },
    isUser (employeeUserid) {
      return localStorage.getItem('userId') == employeeUserid
    },
    changeCommentTemplate () {
      this.onSave()
      console.log(this.form)
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
    addedComment ({ indicatorId, comment }) {
      const groupIndex = this.form.template.groups.findIndex((o) =>
        o.indicators.find((o) => o.id === indicatorId)
      )
      // find index of template indicator
      const indicatorIndex = this.form.template.groups[
        groupIndex
      ].indicators.findIndex((o) => o.id === indicatorId)
      if (
        this.form.template.groups[groupIndex].indicators[indicatorIndex]
          .selected !== undefined
      ) {
        this.$set(
          this.form.template.groups[groupIndex].indicators[indicatorIndex]
            .selected,
          'comment',
          comment
        )
      } else {
        this.$set(
          this.form.template.groups[groupIndex].indicators[indicatorIndex],
          'selected',
          { comment: comment }
        )
      }
      this.onSave()
      console.log(this.form)
    },
    addedNotes ({ indicatorId, notes }) {
      const groupIndex = this.form.template.groups.findIndex((o) =>
        o.indicators.find((o) => o.id === indicatorId)
      )
      // find index of template indicator
      const indicatorIndex = this.form.template.groups[
        groupIndex
      ].indicators.findIndex((o) => o.id === indicatorId)
      if (
        this.form.template.groups[groupIndex].indicators[indicatorIndex]
          .selected !== undefined
      ) {
        this.$set(
          this.form.template.groups[groupIndex].indicators[indicatorIndex]
            .selected,
          'notes',
          notes
        )
      } else {
        this.$set(
          this.form.template.groups[groupIndex].indicators[indicatorIndex],
          'selected',
          { notes: notes }
        )
      }
      this.onSave()
      console.log(this.form)
    },
    setIndicatorIdAtt (indicatorId) {
      this.indicatorIdAtt = indicatorId
    },
    onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        console.log('no files')
        this.$notification.error('No Files', e.message)
      } else {
        if (files[0].size > 1597152) {
          this.$notification.error('File limit 2 Mb', e.message)
          console.log('size limit')
        } else {
          console.log(this.form)
          console.log(files[0].name)
          var indicatorId = this.indicatorIdAtt
          const groupIndex = this.form.template.groups.findIndex((o) =>
            o.indicators.find((o) => o.id === indicatorId)
          )
          // find index of template indicator
          const indicatorIndex = this.form.template.groups[
            groupIndex
          ].indicators.findIndex((o) => o.id === indicatorId)
          if (
            this.form.template.groups[groupIndex].indicators[indicatorIndex]
              .selected !== undefined
          ) {
            this.$set(
              this.form.template.groups[groupIndex].indicators[indicatorIndex]
                .selected,
              'attachment',
              files[0].name
            )
          } else {
            this.$set(
              this.form.template.groups[groupIndex].indicators[indicatorIndex],
              'selected',
              { attachment: files[0].name }
            )
          }
          this.onSave(indicatorId, files[0])
          console.log(this.form)
        }
      }
    },
    addedScore ({ indicatorId, score, notes }) {
      // find index of template group
      const groupIndex = this.form.template.groups.findIndex((o) =>
        o.indicators.find((o) => o.id === indicatorId)
      )
      // find index of template indicator
      const indicatorIndex = this.form.template.groups[
        groupIndex
      ].indicators.findIndex((o) => o.id === indicatorId)
      // add selected score to template indicator
      var indicator =
        this.form.template.groups[groupIndex].indicators[indicatorIndex]
      var group = this.form.template.groups[groupIndex]
      var template = this.form.template
      var scorePercentage = (score.score / indicator.target) * indicator.weight
      delete score.notes
      // update data
      if (
        this.form.template.groups[groupIndex].indicators[indicatorIndex]
          .selected !== undefined
      ) {
        var selected =
          this.form.template.groups[groupIndex].indicators[indicatorIndex]
            .selected
        selected = { ...selected, ...score }
        this.$set(
          this.form.template.groups[groupIndex].indicators[indicatorIndex],
          'selected',
          selected
        )
      } else {
        this.$set(
          this.form.template.groups[groupIndex].indicators[indicatorIndex],
          'selected',
          score
        )
      }
      this.$set(
        this.form.template.groups[groupIndex].indicators[indicatorIndex]
          .selected,
        'score_percentage',
        scorePercentage
      )
      this.$set(
        this.form.template.groups[groupIndex],
        'score',
        parseFloat(score.score) + (parseFloat(group.score) || 0)
      )
      this.$set(
        this.form.template.groups[groupIndex],
        'score_percentage',
        parseFloat(scorePercentage) + (parseFloat(group.score_percentage) || 0)
      )
      this.$set(
        this.form.template,
        'score',
        parseFloat(score.score) + (parseFloat(template.score) || 0)
      )
      this.$set(
        this.form.template,
        'score_percentage',
        parseFloat(scorePercentage) +
          (parseFloat(template.score_percentage) || 0)
      )
      this.onSave()
      console.log(score)
    },
    onSave (indicatorId = null, files = null) {
      this.isSaving = true
      this.updateEmployeeAssessment({
        employeeId: this.id,
        kpiId: this.kpiId,
        form: this.form
      })
        .then(
          (response) => {
            if (indicatorId !== null && files !== null) {
              const formData = new FormData()
              formData.append('file', files)
              formData.append('feature', 'assessment')
              formData.append('feature_id', indicatorId)
              formData.append('notes', '')
              formData.append('is_user_protected', true)
              formData.append('expiration_day', 0)
              this.replaceAttachment(formData).then((response) => {})
              this.isSaving = false
              console.log(this.form)
            } else {
              this.isSaving = false
            }
          },
          (error) => {
            this.isSaving = false
            this.form.errors.record(error.errors)
          }
        )
        .catch((error) => {
          this.isSaving = false
          console.log(JSON.stringify(error))
        })
    },
    onSubmit () {
      // if (!this.form.date.start || !this.form.date.end) {
      //   this.$notification.error("Please select a valid date range");
      //   return;
      // }
      this.$notification.success('Edit success')
      this.isSubmit = true
      this.findKpiResult(this.form.template.score_percentage)
        .then((response) => {
          this.isSubmit = false
          this.$alert
            .success(response.data.criteria, response.data.notes)
            .then(() => {
              this.$router.push(
                '/human-resource/kpi/kpi-assessment/' + this.id + '/history'
              )
            })
        })
        .catch((error) => {
          this.isSubmit = false
          this.$router.push(
            '/human-resource/kpi/kpi-assessment/' + this.id + '/history'
          )
        })
    },

    assignSelected (dataAssessment = null) {
      if (!this.isUser(this.employee.user_id) && dataAssessment !== null) {
        this.$set(this.dataAttachmentId, 'groups', dataAssessment.groups)
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

      if (
        automatedIDs.length > 0 &&
        this.form.date.start &&
        this.form.date.end
      ) {
        this.getAutomatedData({
          startDate: this.serverDateTime(this.form.date.start, 'start'),
          endDate: this.serverDateTime(this.form.date.end, 'end'),
          automated_codes: automatedIDs,
          employeeId: this.id
        }).then(
          (response) => {
            this.isLoading = false

            var templateTarget = 0
            var templateScore = 0
            var templateScorePercentage = 0

            this.form.template.groups.forEach((group, groupIndex) => {
              var groupTarget = 0
              var groupScore = 0
              var groupScorePercentage = 0

              group.indicators.forEach((indicator, indicatorIndex) => {
                var target =
                  this.form.template.groups[groupIndex].indicators[
                    indicatorIndex
                  ].target || 0
                var score = 0
                var scorePercentage = 0

                if (response[indicator.automated_code]) {
                  target = response[indicator.automated_code].target || 0
                  score = response[indicator.automated_code].score || 0

                  scorePercentage = (score / target) * indicator.weight || 0

                  if (scorePercentage > indicator.weight) {
                    scorePercentage = parseFloat(indicator.weight) || 0
                  }

                  this.$set(
                    this.form.template.groups[groupIndex].indicators[
                      indicatorIndex
                    ],
                    'automated_code',
                    indicator.automated_code
                  )
                } else if (indicator.selected) {
                  score =
                    this.form.template.groups[groupIndex].indicators[
                      indicatorIndex
                    ].selected.score || 0
                  scorePercentage = (score / target) * indicator.weight || 0
                }

                this.$set(
                  this.form.template.groups[groupIndex].indicators[
                    indicatorIndex
                  ],
                  'target',
                  target
                )
                this.$set(
                  this.form.template.groups[groupIndex].indicators[
                    indicatorIndex
                  ],
                  'score',
                  score
                )
                this.$set(
                  this.form.template.groups[groupIndex].indicators[
                    indicatorIndex
                  ],
                  'score_percentage',
                  scorePercentage
                )

                groupTarget += target
                groupScore += score
                groupScorePercentage += scorePercentage

                templateTarget += target
                templateScore += score
                templateScorePercentage += scorePercentage
              })

              this.$set(
                this.form.template.groups[groupIndex],
                'target',
                groupTarget
              )
              this.$set(
                this.form.template.groups[groupIndex],
                'score',
                groupScore
              )
              this.$set(
                this.form.template.groups[groupIndex],
                'score_percentage',
                groupScorePercentage
              )
            })

            this.$set(this.form.template, 'target', templateTarget)
            this.$set(this.form.template, 'score', templateScore)
            this.$set(
              this.form.template,
              'score_percentage',
              templateScorePercentage
            )
          },
          (error) => {
            this.isLoading = false
            console.log(JSON.stringify(error))
          }
        )
      } else {
        this.isLoading = false
      }
    }
  }
}
</script>
