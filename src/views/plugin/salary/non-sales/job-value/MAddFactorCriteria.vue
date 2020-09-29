<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('Factors') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <p-block-inner :is-loading="isLoading">
        <div class="row">
          <div class="col-sm-12">
            <table class="table">
              <thead class="thead-light">
                <tr>
                  <th>Level</th>
                  <th>Level Description</th>
                  <th>Score</th>
                  <th style="width: 20%">
                    Actions
                  </th>
                </tr>
              </thead>
              <tr
                v-for="(factorCriteria, index) in data"
                :key="factorCriteria.id"
              >
                <td>{{ factorCriteria.level }}</td>
                <td>{{ factorCriteria.description }}</td>
                <td>{{ factorCriteria.score }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    style="margin-right: 5px"
                    @click="() => onEdit(factorCriteria)"
                  >
                    <i class="fa fa-pencil" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="() => onDelete(factorCriteria,index)"
                  >
                    <i class="fa fa-trash" />
                  </button>
                </td>
              </tr>
              <tbody />
            </table>
            <p-form-row
              id="level"
              ref="level"
              v-model="form.level"
              :disabled="isSaving"
              :label="$t('level')"
              name="level"
              :errors="form.errors.get('level')"
              @errors="form.errors.set('level', null)"
            />
            <p-form-row
              id="description"
              ref="description"
              v-model="form.description"
              :disabled="isSaving"
              :label="$t('description')"
              name="description"
              :errors="form.errors.get('description')"
              @errors="form.errors.set('description', null)"
            />
            <p-form-row
              id="score"
              v-model="form.score"
              name="score"
              :disabled="isSaving"
              :label="$t('score')"
              :errors="form.errors.get('score')"
              @errors="form.errors.set('score', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  id="score"
                  v-model="form.score"
                  name="score"
                  :is-text-right="false"
                  :disabled="isSaving"
                  :label="$t('score')"
                  :errors="form.errors.get('score')"
                  @errors="form.errors.set('score', null)"
                />
              </div>
            </p-form-row>
            <div
              v-if="isEdit"
              class="text-center"
            >
              <a
                href="#"
                @click="onCancelEdit"
              >Cancel Edit</a>
            </div>
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary text-right"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('save') | uppercase }}
          </button>
        </div>
      </p-block-inner>
    </sweet-modal>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      isLoading: false,
      isEdit: false,
      selectedData: {},
      data: [],
      factor_id: null,
      form: new Form({
        id: null,
        level: null,
        description: null,
        score: null,
        factor_id: null
      })
    }
  },
  computed: {
    ...mapGetters('pluginSalarySalaryNonSalesFactorCriteria', ['factorCriteria'])
  },
  methods: {
    ...mapActions('pluginSalarySalaryNonSalesFactorCriteria', ['create', 'delete', 'update']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      if (this.isEdit) {
        this.update(this.form)
          .then(response => {
            this.isSaving = false
            this.$notification.success('update success')
            Object.assign(this.$data, this.$options.data.call(this))
            this.$emit('added', response.data)
            this.close()
          }).catch(error => {
            this.isSaving = false
            this.isFailed = true
            this.form.errors.record(error.errors)
          })
      } else {
        this.create(this.form)
          .then(response => {
            this.isSaving = false
            this.$notification.success('create success')
            Object.assign(this.$data, this.$options.data.call(this))
            this.$emit('added', response.data)
            this.close()
          }).catch(error => {
            this.isSaving = false
            this.isFailed = true
            this.form.errors.record(error.errors)
          })
      }
    },
    open (data = [], factorId) {
      if (window._.isEmpty(data)) {
        this.data = []
      } else {
        this.data = data
      }
      this.factor_id = factorId
      this.form = new Form({
        id: null,
        level: null,
        description: null,
        score: null,
        factor_id: factorId
      })
      this.$refs.modal.open()

      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    },
    onEdit (factorCriteria) {
      this.isEdit = true
      this.form = new Form({
        id: factorCriteria.id,
        level: factorCriteria.level,
        description: factorCriteria.description,
        score: factorCriteria.score,
        factor_id: this.factor_id
      })
    },
    onDelete (factorCriteria, index) {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isLoading = true
        this.delete(factorCriteria).then(response => {
          this.$notification.success('delete success')
          this.data = this.data.filter((v, i) => i !== index)
          this.$emit('added', response.data)
          this.isLoading = false
        }).catch(response => {
          this.isLoading = false
          this.$notification.error('cannot delete')
        })
      })
    },
    onCancelEdit () {
      this.isEdit = false
      this.form = new Form({
        id: null,
        level: null,
        description: null,
        score: null,
        factor_id: this.factor_id
      })
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
