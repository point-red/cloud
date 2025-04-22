<template>
  <div>
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
              :label="$t('category')"
              name="category"
              :icon="'fa-plus'"
            >
              <div
                slot="body"
                class="col-lg-3"
              >
                <p-select
                  id="category"
                  v-model="form.category_id"
                  :errors="form.errors.get('category')"
                  name="category"
                  :options="categoryList"
                  @errors="form.errors.set('category', null)"
                />
              </div>
              <div
                class="col-lg-3"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-primary"
                  :disabled="isSaving"
                  @click="$refs.categoryName.open()"
                >
                  <i
                    class="fa fa-plus"
                  />
                </button>
              </div>
            </p-form-row>
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
              :readonly="true"
              :value="total_value"
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
                  {{ row.description }}
                </td>
                <td>
                  {{ row.value | numberFormat }}
                </td>
                <td>
                  <i
                    class="btn btn-sm fa fa-pencil"
                    @click="$refs.scale.open(index, row, form.scales)"
                  />
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
              @click="$refs.scale.open(null, null, form.scales)"
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
    <m-add-job-value-category-name
      ref="categoryName"
      @added="onAddedCategoryName()"
    />
    <m-job-value-criteria-scale
      ref="scale"
      @updated="onUpdateScale"
    />
  </div>
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
        scales: []
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueCriteria', ['criteria']),
    ...mapGetters('humanResourceJobValueCategory', ['categoryList']),
    total_value () {
      if (this.form.scales.length > 0) {
        return Math.max(...this.form.scales.map(item => item.value))
      }
      return 0
    }
  },
  methods: {
    ...mapActions('humanResourceJobValueCriteria', ['create']),
    ...mapActions('humanResourceJobValueCategory', {
      getCategories: 'get'
    }),
    addRow () {
      this.form.scales.push({
        description: null,
        value: null
      })
    },
    deleteRow (index) {
      this.$delete(this.form.scales, index)
    },
    onAddCategoryName (data) {
      this.categories.push({ id: data, label: data })
    },
    onUpdateScale (data) {
      if (data.index || data.index == 0) {
        this.forms.scales[data.index] = data.scale
      } else {
        this.form.scales.push(data.scale)
      }
      this.form.scales.sort((a, b) => a.value - b.value)
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onAddedCategoryName () {
      this.findCategories()
    },
    findCategories () {
      this.isLoading = true
      this.getCategories().then(response => {
        this.isLoading = false
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onSubmit () {
      this.isSaving = true
      this.form.total_score = this.total_value
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
      this.findCategories()
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
