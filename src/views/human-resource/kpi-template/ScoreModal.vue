<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitScore"
    >
      <p-modal
        :id="id"
        ref="score"
        :is-loading="isLoading"
        title="Score Criteria"
      >
        <template slot="content">
          <table class="table">
            <tr>
              <td class="font-w700">
                {{ 'Indicator' | uppercase }}
              </td>
              <td class="full-width">
                {{ indicator.name }}
              </td>
            </tr>
          </table>
          <hr>
          <p-table>
            <tr
              v-show="scores.length > 0"
              slot="p-head"
              class="bg-info-light"
            >
              <th>Score Description</th>
              <th class="text-center">
                Score
              </th>
              <th />
            </tr>
            <tr
              v-for="score in scores"
              slot="p-body"
              :key="score.id"
            >
              <td>{{ score.description }}</td>
              <td class="text-center">
                {{ score.score }}
              </td>
              <td>
                <a
                  href="javascript:void(0)"
                  class="badge badge-primary mr-5"
                  @click="edit(score)"
                ><i class="fa fa-pencil" /></a>
                <a
                  href="javascript:void(0)"
                  class="badge badge-danger"
                  @click="remove(score.id)"
                ><i class="fa fa-close" /></a>
              </td>
            </tr>
          </p-table>
          <p-form-row
            id="description"
            v-model="form.description"
            name="description"
            label="score description"
            :disabled="isSaving"
          />
          <p-form-row
            id="score"
            v-model="form.score"
            name="score"
            label="score"
            :disabled="isSaving"
          />
        </template>
        <template slot="footer">
          <button
            :disabled="isSaving"
            type="submit"
            class="btn btn-sm btn-primary"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            />
            <template v-if="isCreateMode">
              {{ $t('add') | uppercase }}
            </template>
            <template v-if="!isCreateMode">
              {{ $t('update') | uppercase }}
            </template>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="cancel"
          >
            <template v-if="isCreateMode">
              {{ $t('close') | uppercase }}
            </template>
            <template v-if="!isCreateMode">
              {{ $t('cancel') | uppercase }}
            </template>
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: new Form({
        kpi_template_indicator_id: '',
        score: '',
        description: ''
      }),
      isCreateMode: true,
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplateIndicator', {
      indicator: 'indicator'
    }),
    ...mapGetters('humanResourceKpiTemplateScore', {
      scores: 'scores'
    })
  },
  methods: {
    ...mapMutations('humanResourceKpiTemplateScore', {
      fetchKpiTemplateScores: 'FETCH_ARRAY'
    }),
    ...mapMutations('humanResourceKpiTemplateIndicator', {
      fetchKpiTemplateIndicator: 'FETCH_OBJECT'
    }),
    ...mapActions('humanResourceKpiTemplateScore', {
      getScores: 'get',
      createScore: 'create',
      updateScore: 'update',
      deleteScore: 'delete'
    }),
    compareValues (key, order = 'asc') {
      return function innerSort (a, b) {
        // eslint-disable-next-line no-prototype-builtins
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0
        }

        const varA = (typeof a[key] === 'string')
          ? a[key].toUpperCase() : a[key]
        const varB = (typeof b[key] === 'string')
          ? b[key].toUpperCase() : b[key]

        let comparison = 0
        if (varA > varB) {
          comparison = 1
        } else if (varA < varB) {
          comparison = -1
        }
        return (
          (order === 'desc') ? (comparison * -1) : comparison
        )
      }
    },
    show (indicator) {
      this.fetchKpiTemplateScores(indicator.scores)
      this.fetchKpiTemplateIndicator(indicator)
      this.scores.sort(this.compareValues('score'))
      this.form = new Form({
        kpi_template_indicator_id: indicator.id,
        score: '',
        description: ''
      })
      this.$refs.score.show()
    },
    close () {
      this.form.reset()
      this.$refs.score.close()
    },
    onSubmitScore () {
      this.isSaving = true
      if (this.isCreateMode) {
        this.createScore(this.form)
          .then(
            (response) => {
              this.$notification.success('Create success')
              this.form.reset()
              this.isSaving = false
            },
            (error) => {
              this.$notification.error('Create failed', error.message)
              this.isSaving = false
            })
      } else {
        this.updateScore(this.form)
          .then(
            (response) => {
              this.$notification.success('Update success')
              this.form.reset()
              this.isSaving = false
              this.isCreateMode = true
            },
            (error) => {
              this.$notification.error('Update failed', error.message)
              this.isSaving = false
            })
      }
    },
    edit (score) {
      for (const field in score) {
        this.$set(this.form, field, score[field])
      }
      this.isCreateMode = false
    },
    remove (scoreId) {
      this.deleteScore({ id: scoreId })
        .then(
          (response) => {
            this.$notification.success('Delete success')
          },
          (error) => {
            this.$notification.success('Delete failed', error.message)
          })
    },
    cancel () {
      if (this.isCreateMode) {
        this.close()
      } else {
        this.form.reset()
        this.isCreateMode = !this.isCreateMode
      }
    }
  }
}
</script>
