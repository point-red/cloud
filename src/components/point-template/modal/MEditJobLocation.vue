<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('edit job location') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <template v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="name"
              ref="name"
              v-model="form.name"
              :disabled="isSaving"
              :label="$t('location name')"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />
            <div class="form-group row">
              <label
                for="area-value"
                class="col-form-label col-lg-3"
              >
                {{ $t("area value") | uppercase }}
              </label>
              <div class="col-lg-9">
                <point-table
                  class="w-full"
                >
                  <tr slot="p-head">
                    <th>Year</th>
                    <th>Value</th>
                    <th>Notes</th>
                    <th />
                  </tr>
                  <tr
                    v-for="(row, index) in form.area_values"
                    slot="p-body"
                    :key="index"
                  >
                    <td>
                      <p-form-number
                        :id="'year-' + index"
                        v-model="row.year"
                        :name="'year-' + index"
                        :disabled="isSaving"
                        :errors="form.errors.get(`area_values.${index}.year`)"
                        @errors="form.errors.set(`area_values.${index}.year`, null)"
                      />
                    </td>
                    <td>
                      <p-form-number
                        :id="'value-' + index"
                        v-model="row.value"
                        :name="'value-' + index"
                        :disabled="isSaving"
                        :errors="form.errors.get(`area_values.${index}.value`)"
                        @errors="form.errors.set(`area_values.${index}.value`, null)"
                      />
                    </td>
                    <td>
                      <p-form-input
                        :id="'notes-' + index"
                        v-model="row.notes"
                        :name="'notes-' + index"
                        :disabled="isSaving"
                        :errors="form.errors.get(`area_values.${index}.notes`)"
                        @errors="form.errors.set(`area_values.${index}.notes`, null)"
                      />
                    </td>
                    <td>
                      <i
                        v-if="!row.id"
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
            <p-form-row
              id="multiplier-kpi"
              v-model="form.multiplier_kpi"
              name="multiplier-kpi"
              :disabled="isSaving"
              :label="$t('multiplier kpi')"
              :errors="form.errors.get('multiplier_kpi')"
              @errors="form.errors.set('multiplier_kpi', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  id="multiplier-kpi"
                  v-model="form.multiplier_kpi"
                  name="multiplier-kpi"
                  :is-text-right="false"
                  :disabled="isSaving"
                  :label="$t('multiplier kpi')"
                  :errors="form.errors.get('multiplier_kpi')"
                  @errors="form.errors.set('multiplier_kpi', null)"
                />
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('update') | uppercase }}
          </button>
        </div>
      </template>
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
      isLoading: false,
      isSaving: false,
      isFailed: false,
      form: new Form({
        id: null,
        name: null,
        area_values: [{
          id: null,
          year: null,
          value: null,
          notes: null
        }],
        multiplier_kpi: null
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocation'])
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', ['update', 'find']),
    findJobLocation () {
      this.isLoading = true
      this.find({
        id: this.form.id
      }).then(response => {
        this.isLoading = false
        this.form.name = response.data.name
        this.form.area_values = response.data.area_values
        this.form.multiplier_kpi = response.data.multiplier_kpi
        this.$nextTick(() => {
          this.$refs.name.setFocus()
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    addRow () {
      this.form.area_values.push({
        id: null,
        year: null,
        value: null,
        notes: null
      })
    },
    deleteRow (index) {
      this.$delete(this.form.area_values, index)
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open (jobLocation) {
      this.$refs.modal.open()
      this.form.id = jobLocation.id
      this.findJobLocation()
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
</style>
