<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('add criteria factor') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="row">
        <div class="col-sm-12">
          <p-form-row
            id="category"
            ref="category"
            v-model="form.category"
            :disabled="isSaving"
            :label="$t('category')"
            name="category"
            :errors="form.errors.get('category')"
            @errors="form.errors.set('category', null)"
          />
          <p-form-row
            id="criteria_factor"
            ref="criteria_factor"
            v-model="form.criteria_factor"
            :disabled="isSaving"
            :label="$t('criteria factor')"
            name="criteria_factor"
            :errors="form.errors.get('criteria_factor')"
            @errors="form.errors.set('criteria_factor', null)"
          />
          <p-form-row
            id="total_score"
            ref="total_score"
            v-model="form.total_score"
            :disabled="isSaving"
            :label="$t('total score')"
            name="total_score"
            :errors="form.errors.get('total_score')"
            @errors="form.errors.set('total_score', null)"
          />

          <p-separator />

          <h5>{{ $t('skala') | uppercase }}</h5>

          <point-table
            class="w-full"
          >
            <tr slot="p-head">
              <th>Skala</th>
              <th>Description</th>
              <th>Value</th>
              <th />
            </tr>
            <tr
              v-for="(row, index) in form.scales"
              slot="p-body"
              :key="index"
            >
              <td>
                {{ index + 1 }}
              </td>
              <td>
                <p-form-input
                  :id="'description-' + index"
                  v-model="row.description"
                  :name="'description-' + index"
                  :disabled="isSaving"
                  :errors="form.errors.get(`scales.${index}.description`)"
                  @errors="form.errors.set(`scales.${index}.description`, null)"
                />
              </td>
              <td>
                <p-form-number
                  :id="'value-' + index"
                  v-model="row.value"
                  :name="'value-' + index"
                  :disabled="isSaving"
                  :errors="form.errors.get(`scales.${index}.value`)"
                  @errors="form.errors.set(`scales.${index}.value`, null)"
                />
              </td>
              <td>
                <i
                  class="btn btn-sm fa fa-times"
                  @click="deleteRow(index)"
                />
              </td>
            </tr>
          </point-table>
          <button
            type="button"
            class="btn btn-sm btn-secondary"
            @click="addRow"
          >
            <i class="fa fa-plus" /> {{ $t("add") | uppercase }}
          </button>
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
    </sweet-modal>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import PointTable from 'point-table-vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    PointTable
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: new Form({
        category: null,
        criteria_factor: null,
        total_score: null,
        scales: [{
          description: null,
          value: null
        }]
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueCriteria', ['criteria'])
  },
  methods: {
    ...mapActions('humanResourceJobValueCriteria', ['create']),
    addRow () {
      this.form.scales.push({
        description: null,
        value: null
      })
    },
    deleteRow (index) {
      this.$delete(this.form.scales, index)
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
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
    },
    open () {
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }

  .sweet-modal.is-visible {
    max-width: 900px !important;
  }
</style>
