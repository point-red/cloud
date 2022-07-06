<template>
  <div>
    <div class="row">
      <p-block>
        <div class="text-right">
          <router-link
            :to="{name: 'PluginStudySheetEdit', params: {id: $route.params.id}}"
            class="btn btn-sm btn-outline-secondary mr-5"
          >
            {{ $t('edit') | uppercase }}
          </router-link>
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="$refs.modalDelete.open(sheet)"
          >
            {{ $t('delete') | uppercase }}
          </button>
        </div>
        <hr>
        <p-block-inner :is-loading="isLoading">
          <template v-if="sheet">
            <p-form-row
              id="started_at"
              :value="sheet.started_at | dateFormat('DD MMMM YYYY HH:mm:ss')"
              :label="$t('start')"
              name="started_at"
              readonly
            />
            <p-form-row
              id="ended_at"
              :value="sheet.ended_at | dateFormat('DD MMMM YYYY HH:mm:ss')"
              :label="$t('end')"
              name="ended_at"
              readonly
            />
            <p-form-row
              id="subject_id"
              :value="sheet.subject ? sheet.subject.name : ''"
              :label="$t('study subject')"
              name="subject_id"
              readonly
            />
            <p-form-row
              id="photo"
              :label="$t('photo')"
              name="photo"
              readonly
            >
              <div
                v-if="sheet.photo"
                slot="body"
                class="col-lg-9"
              >
                <iframe
                  :src="sheet.photo"
                  allow="autoplay"
                  width="100%"
                  height="360px"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="audio"
              :label="$t('voice note')"
              name="audio"
              readonly
            >
              <div
                v-if="sheet.audio"
                slot="body"
                class="col-lg-9"
              >
                <iframe
                  :src="sheet.audio"
                  allow="autoplay"
                  width="100%"
                  height="80px"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="video"
              :label="$t('video')"
              name="video"
              readonly
            >
              <div
                v-if="sheet.video"
                slot="body"
                class="col-lg-9"
              >
                <iframe
                  :src="sheet.video"
                  allow="autoplay"
                  width="100%"
                  height="360px"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="institution"
              :value="sheet.institution"
              :label="$t('institution')"
              name="institution"
              readonly
            />
            <p-form-row
              id="teacher"
              :value="sheet.teacher"
              :label="$t('teacher')"
              name="teacher"
              readonly
            />
            <p-form-row
              id="competency"
              :value="sheet.competency"
              :label="$t('competency')"
              name="competency"
              readonly
            />
            <p-form-row
              id="learning_goals"
              :value="sheet.learning_goals"
              :label="$t('learning goals')"
              name="learning_goals"
              readonly
            />
            <p-form-row
              id="activities"
              :value="sheet.activities"
              :label="$t('activities')"
              name="activities"
              readonly
            />
            <p-form-row
              id="grade"
              :value="sheet.grade"
              :label="$t('grade')"
              name="grade"
              readonly
            />
            <p-form-row
              id="behavior"
              :value="behavior"
              :label="$t('behavior')"
              name="behavior"
              readonly
            />
            <p-form-row
              id="remarks"
              :value="sheet.remarks"
              :label="$t('remarks')"
              name="remarks"
              readonly
            />
          </template>
        </p-block-inner>
      </p-block>
    </div>

    <m-delete
      ref="modalDelete"
      @delete="sheetDeleted"
    />
  </div>
</template>

<script>
import axios from '@/axios'
import MDelete from './Delete.vue'
export default {
  name: 'PluginStudySheetShow',
  components: {
    MDelete
  },
  data () {
    return {
      isLoading: true,
      sheet: null,
      behaviorList: [
        { id: 'A', label: 'A - Excellent' },
        { id: 'B', label: 'B - Good' },
        { id: 'C', label: 'C - Need Improvement' }
      ]
    }
  },
  computed: {
    behavior () {
      if (!this.sheet.behavior) {
        return ''
      }
      const behaviorList = [
        { id: 'A', label: 'A - Excellent' },
        { id: 'B', label: 'B - Good' },
        { id: 'C', label: 'C - Need Improvement' }
      ]

      const find = behaviorList.find(b => b.id === this.sheet.behavior)

      return find ? find.label : this.sheet.behavior
    }
  },
  created () {
    this.getStudySheet()
  },
  methods: {
    getStudySheet () {
      axios.get('/plugin/study/sheet/' + this.$route.params.id)
        .then(response => {
          this.sheet = response.data
          this.emitUpdateSheetName()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    emitUpdateSheetName () {
      const startedAt = this.sheet.started_at ? this.$moment(this.sheet.started_at).format('DD MMM YYYY') : ''
      const subjectName = this.sheet.subject?.name
      const sheetName = [subjectName, startedAt].filter(_ => _).join(' - ')
      this.$emit('updateSheetName', sheetName)
    },
    sheetDeleted () {
      this.$router.replaace({ name: 'PluginStudySheetIndex' })
    }
  }
}
</script>
