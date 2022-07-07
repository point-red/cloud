<template>
  <div>
    <form @submit.prevent="submitForm">
      <div class="row">
        <p-block>
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
                class="col-lg-9 d-sm-flex"
              >
                <p-date-time-picker
                  id="ended_at"
                  v-model="form.ended_at"
                  :disabled="isSaving"
                  name="ended_at"
                />
                <div class="pl-sm-3 mt-3 mt-sm-0">
                  <button
                    type="button"
                    class="btn-duration"
                    @click="setDuration(30)"
                  >
                    30<br>min
                  </button>
                  <button
                    type="button"
                    class="btn-duration"
                    @click="setDuration(45)"
                  >
                    45<br>min
                  </button>
                  <button
                    type="button"
                    class="btn-duration"
                    @click="setDuration(60)"
                  >
                    60<br>min
                  </button>
                  <button
                    type="button"
                    class="btn-duration"
                    @click="setDuration(90)"
                  >
                    90<br>min
                  </button>
                  <button
                    type="button"
                    class="btn-duration"
                    @click="setDuration(120)"
                  >
                    120<br>min
                  </button>
                </div>
              </div>
            </p-form-row>

            <google-auth />

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
                  @fileChanged="photoUploaded"
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
                  accept="audio/*"
                  :disabled="isSaving"
                  @fileChanged="audioUploaded"
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
                  accept="video/*"
                  :disabled="isSaving"
                  @fileChanged="videoUploaded"
                />
              </div>
            </p-form-row>

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

            <p-form-row>
              <div
                slot="body"
                class="col-lg-9"
              >
                <div class="mb-2 d-flex font-size-lg text-primary">
                  <div class="mr-2">
                    <i class="fa fa-book" />
                  </div>
                  <div>
                    <a
                      href="https://docs.google.com/spreadsheets/d/11TVngjUsDSP3wPCZkO2B6jKOGNvPSlu-7UdYHb_SzbU/edit?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      style="text-decoration: underline;"
                    >
                      {{ $t('access topics library here') | titlecase }}
                    </a>
                  </div>
                </div>
              </div>
            </p-form-row>

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
                @click="cancel"
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
                /> {{ $t('draft') | uppercase }}
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
        </p-block>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '@/axios'
import Form from '@/utils/Form'
import GoogleAuth from '../GoogleAuth.vue'
import SelectSubject from '../SelectSubject.vue'
export default {
  name: 'PluginStudySheetCreate',
  components: {
    SelectSubject,
    GoogleAuth
  },
  beforeRouteLeave (to, from, next) {
  // If the form is dirty and the user did not confirm leave,
  // prevent losing unsaved changes by canceling navigation
    if (this.confirmStayInDirtyForm()) {
      next(false)
    } else {
    // Navigate to next view
      next()
    }
  },
  data () {
    return {
      isSaving: false,
      form: {
        started_at: this.$moment().startOf('hour').format('YYYY-MM-DD HH:mm:ss'),
        ended_at: this.$moment().startOf('hour').add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
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
      isSaved: false,
      pointForm: new Form({}),
      behaviorList: [
        { id: 'A', label: 'A - Excellent' },
        { id: 'B', label: 'B - Good' },
        { id: 'C', label: 'C - Need Improvement' }
      ]
    }
  },
  computed: {
    formIsDirty () {
      if (this.isSaved) return false

      return this.form.photo ||
        this.form.audio ||
        this.form.video ||
        this.form.subject_id ||
        this.form.institution ||
        this.form.teacher ||
        this.form.competency ||
        this.form.learning_goals ||
        this.form.activities ||
        this.form.grade ||
        this.form.behavior ||
        this.form.remarks
    }
  },
  created () {
    this.pointForm = new Form(this.form)
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  },
  methods: {
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
          this.isSaved = true
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
    cancel () {
      this.pointForm.reset()
      this.form = { ...this.point }
      this.$router.replace({ name: 'PluginStudySheetIndex' })
    },
    confirmLeave () {
      return window.confirm('Do you really want to leave? you have unsaved changes!')
    },
    confirmStayInDirtyForm () {
      return this.formIsDirty && !this.confirmLeave()
    },
    beforeWindowUnload (e) {
      if (this.confirmStayInDirtyForm()) {
      // Cancel the event
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = ''
      }
    },
    setDuration (minutes) {
      const startedAt = this.$moment(this.form.started_at)
      const endedAt = startedAt.add(minutes, 'minutes')
      this.form.ended_at = endedAt.format('YYYY-MM-DD HH:mm:ss')
    },
    photoUploaded (event) {
      this.form.photo = event
    },
    audioUploaded (event) {
      this.form.audio = event
    },
    videoUploaded (event) {
      this.form.video = event
    }
  }
}
</script>

<style scoped>
.btn-duration {
  padding: 0.5rem;
  border: 0;
  width: 3rem;
  margin-right: 0.25rem;
  line-height: 0.9rem;
  cursor: pointer;
}
.btn-duration:active,
.btn-duration:focus,
.btn-duration:focus-visible {
  outline: none;
}
.btn-duration:active,
.btn-duration:hover,
.btn-duration:focus {
  filter: brightness(85%);
}
</style>
