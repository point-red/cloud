<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit">
      <p-modal
        ref="result"
        :id="id"
        :isLoading="isLoading"
        :title="'Kpi Result' | uppercase">
        <template slot="content">
          <p-table>
            <tr slot="p-head" v-show="results.length > 0" class="bg-info-light">
              <th>Score</th>
              <th>Criteria</th>
              <th>Notes</th>
              <th></th>
            </tr>
            <tr
              v-for="result in results"
              slot="p-body"
              :key="result.id">
              <td class="no-wrap">{{ result.score_min }}% - {{ result.score_max }}%</td>
              <td>{{ result.criteria }}</td>
              <td>{{ result.notes }}</td>
              <td>
                <a href="javascript:void(0)" class="badge badge-primary" @click="edit(result)"><i class="fa fa-pencil"></i></a>
                <a href="javascript:void(0)" class="badge badge-danger" @click="remove(result.id)"><i class="fa fa-close"></i></a>
              </td>
            </tr>
          </p-table>
          <hr>
          <p-form-row
            id="score-min"
            name="score-min"
            label="score min"
            :disabled="isSaving"
            v-model="form.score_min"
            :errors="form.errors.get('score_min')"
            @errors="form.errors.set('score_min', null)">
          </p-form-row>
          <p-form-row
            id="score-max"
            name="score-max"
            label="score max"
            :disabled="isSaving"
            v-model="form.score_max"
            :errors="form.errors.get('score_max')"
            @errors="form.errors.set('score_max', null)">
          </p-form-row>
          <p-form-row
            id="criteria"
            name="criteria"
            label="criteria"
            :disabled="isSaving"
            v-model="form.criteria"
            :errors="form.errors.get('criteria')"
            @errors="form.errors.set('criteria', null)">
          </p-form-row>
          <p-form-row
            id="notes"
            name="notes"
            label="notes"
            :disabled="isSaving"
            v-model="form.notes"
            :errors="form.errors.get('notes')"
            @errors="form.errors.set('notes', null)">
          </p-form-row>
        </template>
        <template slot="footer">
          <button
            :disabled="isSaving"
            type="submit"
            class="btn btn-primary">
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"/>
              <template v-if="isCreateMode">Add</template>
              <template v-if="!isCreateMode">{{ $t('update') | uppercase }}</template>
          </button>
          <button :disabled="isSaving" type="button" class="btn btn-sm btn-outline-danger" @click="cancel">
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"/>
              <template v-if="isCreateMode">{{ $t('close') | uppercase }}</template>
              <template v-if="!isCreateMode">{{ $t('cancel') | uppercase }}</template>
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

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
        id: '',
        score_min: '',
        score_max: '',
        criteria: '',
        notes: ''
      }),
      isCreateMode: true,
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiResult', {
      results: 'results'
    })
  },
  methods: {
    ...mapActions('humanResourceKpiResult', {
      getResults: 'get',
      createResult: 'create',
      updateResult: 'update',
      deleteResult: 'delete'
    }),
    cancel () {
      if (this.isCreateMode) {
        this.close()
      } else {
        this.form.reset()
        this.isCreateMode = !this.isCreateMode
      }
    },
    show () {
      this.isLoading = true
      this.isCreateMode = true
      this.getResults()
        .then(
          (response) => {
            this.isLoading = false
          }
        )
      this.form = new Form({
        id: '',
        score_min: '',
        score_max: '',
        criteria: '',
        notes: ''
      })
      this.$refs.result.show()
    },
    close () {
      this.form.reset()
      this.$refs.result.close()
    },
    onSubmit () {
      if (this.isCreateMode) {
        this.create()
      } else {
        this.update()
      }
    },
    create () {
      this.isSaving = true
      this.createResult(this.form)
        .then(
          (response) => {
            this.$notification.success('Create success')
            this.form.reset()
            this.isSaving = false
          },
          (error) => {
            this.$notification.error('Create failed', error.message)
            this.form.errors.record(error.errors)
            this.isSaving = false
          })
    },
    update () {
      this.isSaving = true
      this.updateResult(this.form)
        .then(
          (response) => {
            this.$notification.success('Update success')
            this.form.reset()
            this.isSaving = false
            this.isCreateMode = true
          },
          (error) => {
            this.$notification.error('Update failed', error.message)
            this.form.errors.record(error.errors)
            this.isSaving = false
          })
    },
    edit (result) {
      for (let field in result) {
        this.$set(this.form, field, result[field])
      }
      this.isCreateMode = false
    },
    remove (resultId) {
      this.deleteResult({ id: resultId })
        .then(
          (response) => {
            this.$notification.success('Delete success')
          },
          (error) => {
            this.$notification.success('Delete failed', error.message)
          })
    }
  }
}
</script>
