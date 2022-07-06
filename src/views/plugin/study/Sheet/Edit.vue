<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="row">
        <p-block>
          <p-block-inner :is-loading="isLoading">
            <form @submit.prevent="onSubmit">
              <p-form-row
                id="started_at"
                name="started_at"
                :required="true"
                :label=" $t('start') | uppercase"
                :show-asterisk-on-required="true"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-date-time-picker
                    id="started_at"
                    v-model="form.started_at"
                    :disabled="isSaving"
                    name="started_at"
                  />
                </div>
              </p-form-row>

              <p-form-row
                id="ended_at"
                name="ended_at"
                :label="$t('end')"
                :required="true"
                :show-asterisk-on-required="true"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-date-time-picker
                    id="ended_at"
                    v-model="form.ended_at"
                    :disabled="isSaving"
                    name="ended_at"
                  />
                </div>
              </p-form-row>

              <p-form-row
                :label="$t('study subject')"
                :errors="pointForm.errors.get('subject_id')"
                :required="true"
                :show-asterisk-on-required="true"
                @errors="pointForm.errors.set('subject_id', null)"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <select-subject
                    v-model="form.subject_id"
                    :disabled="isSaving"
                  />
                </div>
              </p-form-row>

              <p-form-row
                :label="$t('photo')"
                :show-asterisk-on-required="true"
                :errors="pointForm.errors.get('photo')"
                @errors="pointForm.errors.set('photo', null)"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-form-file
                    id="photo"
                    ref="photo"
                    name="photo"
                    accept="image/*"
                    :disabled="isSaving"
                  />
                </div>
              </p-form-row>

              <p-form-row
                :label="$t('voice note')"
                :errors="pointForm.errors.get('audio')"
                @errors="pointForm.errors.set('audio', null)"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-form-file
                    id="audio"
                    ref="audio"
                    name="audio"
                    accept=".mp3, .m4a"
                    :disabled="isSaving"
                  />
                </div>
              </p-form-row>

              <p-form-row
                :label="$t('video')"
                :errors="pointForm.errors.get('video')"
                @errors="pointForm.errors.set('video', null)"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-form-file
                    id="video"
                    ref="video"
                    name="video"
                    accept=".mp4, .mov"
                    :disabled="isSaving"
                  />
                </div>
              </p-form-row>
              <!-- @fileChanged="onFileChange" -->

              <p-form-row
                id="institution"
                v-model="form.institution"
                name="institution"
                :disabled="isSaving"
                :label="$t('institution')"
                :errors="pointForm.errors.get('institution')"
                @errors="pointForm.errors.set('institution', null)"
              />

              <p-form-row
                id="teacher"
                v-model="form.teacher"
                name="teacher"
                :disabled="isSaving"
                :label="$t('teacher')"
                :errors="pointForm.errors.get('teacher')"
                @errors="pointForm.errors.set('teacher', null)"
              />

              <p-form-row
                id="competency"
                v-model="form.competency"
                name="competency"
                :disabled="isSaving"
                :label="$t('competency')"
                :required="true"
                :show-asterisk-on-required="true"
                :errors="pointForm.errors.get('competency')"
                @errors="pointForm.errors.set('competency', null)"
              />

              <p-form-row
                id="learning_goals"
                v-model="form.learning_goals"
                name="learning_goals"
                :disabled="isSaving"
                :label="$t('learning goals')"
                :required="true"
                :show-asterisk-on-required="true"
                :errors="pointForm.errors.get('learning_goals')"
                @errors="pointForm.errors.set('learning_goals', null)"
              />

              <p-form-row
                id="activities"
                v-model="form.activities"
                name="activities"
                :disabled="isSaving"
                :label="$t('activities')"
                :errors="pointForm.errors.get('activities')"
                @errors="pointForm.errors.set('activities', null)"
              />

              <p-form-row
                id="grade"
                name="grade"
                :label="$t('grade') + ' (0-100)'"
                :errors="pointForm.errors.get('grade')"
                @errors="pointForm.errors.set('grade', null)"
              >
                <div
                  slot="body"
                  class="col-1"
                >
                  <p-form-number
                    id="grade"
                    v-model="form.grade"
                    name="grade"
                    :is-text-right="false"
                    :disabled="isSaving"
                    :label="$t('grade')"
                    :max="100"
                  />
                </div>
              </p-form-row>

              <p-form-row
                id="behavior"
                name="behavior"
                :label="$t('behavior')"
                :required="true"
                :show-asterisk-on-required="true"
                :errors="pointForm.errors.get('behavior')"
                @errors="pointForm.errors.set('behavior', null)"
              >
                <div
                  slot="body"
                  class="col-lg-9"
                >
                  <p-select
                    id="behavior"
                    v-model="form.behavior"
                    :disabled="isSaving"
                    name="behavior"
                    :options="behaviorList"
                  />
                </div>
              </p-form-row>

              <p-form-row
                id="remarks"
                v-model="form.remarks"
                name="remarks"
                :disabled="isSaving"
                :label="$t('remarks')"
                :errors="pointForm.errors.get('remarks')"
                @errors="pointForm.errors.set('remarks', null)"
              />

              <div>
                <span class="text-danger">*</span> {{ $t('required') | capitalize }}
              </div>

              <div class="text-right mb-4">
                <button
                  type="button"
                  class="btn btn-sm btn-light mr-2"
                  :disabled="isSaving"
                >
                  {{ $t('cancel') | uppercase }}
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-secondary mr-2"
                  :disabled="isSaving"
                  @click="saveAsDraft"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save to draft') | uppercase }}
                </button>
                <button
                  type="submit"
                  class="btn btn-sm btn-primary"
                  :disabled="isSaving"
                  @click="onSubmit"
                >
                  <i
                    v-show="isSaving"
                    class="fa fa-asterisk fa-spin"
                  /> {{ $t('save') | uppercase }}
                </button>
              </div>
            </form>
          </p-block-inner>
        </p-block>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '@/axios'
import Form from '@/utils/Form'
import SelectSubject from '../SelectSubject.vue'
export default {
  name: 'PluginStudySheetEdit',
  components: {
    SelectSubject
  },
  data () {
    return {
      isSaving: false,
      isLoading: true,
      sheet: null,
      form: {
        started_at: null,
        ended_at: null,
        photo: null,
        audio: null,
        video: null,
        subject_id: null,
        institution: null,
        teacher: null,
        competency: null,
        learning_goals: null,
        activities: null,
        grade: null,
        behavior: null,
        remarks: null,
        is_draft: false
      },
      pointForm: new Form({}),
      behaviorList: [
        { id: 'A', label: 'A - Excellent' },
        { id: 'B', label: 'B - Good' },
        { id: 'C', label: 'C - Need Improvement' }
      ]
    }
  },
  created () {
    this.pointForm = new Form(this.form)
    this.getStudySheet()
  },
  methods: {
    getStudySheet () {
      axios.get('/plugin/study/sheet/' + this.$route.params.id)
        .then(response => {
          this.sheet = response.data

          this.form = {
            started_at: this.$moment(this.sheet.started_at).format('YYYY-MM-DD HH:mm:ss'),
            ended_at: this.$moment(this.sheet.ended_at).format('YYYY-MM-DD HH:mm:ss'),
            photo_file_id: this.sheet.photo_file_id,
            audio_file_id: this.sheet.audio_file_id,
            video_file_id: this.sheet.video_file_id,
            subject_id: this.sheet.subject_id,
            institution: this.sheet.institution,
            teacher: this.sheet.teacher,
            competency: this.sheet.competency,
            learning_goals: this.sheet.learning_goals,
            activities: this.sheet.activities,
            grade: this.sheet.grade,
            behavior: this.sheet.behavior,
            remarks: this.sheet.remarks,
            is_draft: false
          }

          this.emitUpdateSheetName()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    onSubmit () {
      this.isSaving = true
      const headers = {
        'Content-Type': 'multipart/form-data'
      }
      axios.post('/plugin/study/sheet', this.getFormData(), { headers })
        .then(response => {
          const message = this.$t('data has been saved')
          const capitalizedMessage = this.$options.filters.capitalize(message)
          this.$notification.success(capitalizedMessage)
          this.$router.replace({ name: 'PluginStudySheetShow', params: { id: response.data.id } })
        })
        .catch(error => {
          if (error.status === 422) {
            this.pointForm.errors.record(error.data.errors)
          }
        })
        .finally(() => {
          this.isSaving = false
        })
    },
    saveAsDraft () {
      this.form.is_draft = true
      this.onSubmit()
    },
    getFormData () {
      const formData = new FormData()

      const form = {
        ...this.form,
        started_at: new Date(this.form.started_at).toISOString(),
        ended_at: new Date(this.form.ended_at).toISOString()
      }

      Object.keys(form).forEach(key => {
        if (form[key] === false || form[key] === true) {
          // boolean will be sent as "true" and does not pass the validation
          formData.append(key, form[key] === false ? 0 : 1)
        } else if (form[key]) { // don't append empty string or null
          formData.append(key, form[key])
        }
      })

      return formData
    },
    photoUploaded () {},
    audioUploaded () {},
    videoUploaded () {}
  }
}
</script>
