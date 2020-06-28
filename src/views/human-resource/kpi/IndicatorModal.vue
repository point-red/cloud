<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        :id="id"
        ref="indicator"
        :is-loading="isLoading"
        :title="'Kpi Template Indicator' | uppercase"
        :hidden="selectingAutomatedIndicator"
      >
        <template slot="content">
          <p-table>
            <tr
              v-show="indicators.length > 0"
              slot="p-head"
              class="bg-info-light"
            >
              <th>Name</th>
              <th class="text-center">
                Weight
              </th>
              <th class="text-center">
                Target
              </th>
              <th style="width:100px" />
            </tr>
            <tr
              v-for="indicator in indicators"
              slot="p-body"
              :key="indicator.id"
            >
              <td>{{ indicator.name }}</td>
              <td class="text-center">
                {{ indicator.weight }}%
              </td>
              <td class="text-center">
                <template v-if="!indicator.automated_code">
                  {{ indicator.target }}
                </template>
              </td>
              <td>
                <a
                  href="javascript:void(0)"
                  class="badge badge-primary mr-5"
                  @click="edit(indicator)"
                ><i class="fa fa-pencil" /></a>
                <a
                  href="javascript:void(0)"
                  class="badge badge-danger"
                  @click="remove(indicator)"
                ><i class="fa fa-close" /></a>
              </td>
            </tr>
          </p-table>

          <hr :hidden="!isCreateMode">

          <p-form-check-box
            id="automated-indicator-check"
            name="automated-indicator-check"
            :description="'Use Automated Indicator'"
            :checked="automatedIndicatorChecked"
            :hidden="!isCreateMode"
            @click.native="toggleAutomatedIndicator()"
          />

          <p-form-row
            id="automated-indicator"
            :label="$t('automated indicator')"
            :hidden="!automatedIndicatorChecked"
          >
            <div
              v-if="form.automated_indicator"
              slot="body"
              class="col-lg-9 col-form-label"
            >
              <a
                href="javascript:void(0)"
                @click="showAutomatedIndicatorModal(id)"
              >{{ form.automated_indicator.label }}</a>
            </div>
            <div
              v-else
              slot="body"
              class="col-lg-9"
              @click="showAutomatedIndicatorModal(id)"
            >
              <button
                type="button"
                class="btn btn-sm btn-primary"
              >
                Assign Automated Indicator
              </button>
            </div>
          </p-form-row>

          <hr>

          <p-form-row
            id="name"
            v-model="form.name"
            name="name"
            label="name"
            :disabled="isSaving"
          />
          <p-form-row
            id="weight"
            v-model="form.weight"
            name="weight"
            label="weight"
            :disabled="isSaving"
          />
          <p-form-row
            id="target"
            v-model="form.target"
            name="target"
            label="target"
            :disabled="isSaving || automatedIndicatorChecked || !canEditTarget"
            :hidden="automatedIndicatorChecked || !canEditTarget"
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

    <assign-automated-indicator-modal
      ref="assignAutomatedIndicator"
      @assigned="closeAutomatedIndicatorModal"
    />
  </div>
</template>

<script>
import Form from '@/utils/Form'
import AssignAutomatedIndicatorModal from './AssignAutomatedIndicatorModal'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    AssignAutomatedIndicatorModal
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: new Form({
        kpi_template_group_id: '',
        kpi_template_id: '',
        automated_indicator: null,
        name: '',
        weight: '',
        target: ''
      }),
      isCreateMode: true,
      isLoading: false,
      isSaving: false,
      automatedIndicatorChecked: false,
      selectingAutomatedIndicator: false,
      canEditTarget: true
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplateIndicator', {
      indicators: 'indicators'
    })
  },
  methods: {
    ...mapMutations('humanResourceKpiTemplateIndicator', {
      fetchKpiTemplateIndicator: 'FETCH_ARRAY'
    }),
    ...mapActions('humanResourceKpiTemplateIndicator', {
      getIndicators: 'get',
      createIndicator: 'create',
      updateIndicator: 'update',
      deleteIndicator: 'delete'
    }),
    show (group) {
      this.form = new Form({
        kpi_template_group_id: group.id,
        kpi_template_id: group.kpi_template_id,
        name: '',
        weight: '',
        target: '',
        automated_indicator: null
      })
      this.fetchKpiTemplateIndicator(group.indicators)
      this.$refs.indicator.show()
    },
    close () {
      this.form.reset()
      this.$refs.indicator.close()
    },
    onSubmit () {
      if (this.isCreateMode) {
        if ((this.automatedIndicatorChecked && this.form.automated_indicator != null) || !this.automatedIndicatorChecked) {
          if (this.automatedIndicatorChecked && this.form.automated_indicator != null) {
            this.form.target = 0
          }

          this.isSaving = true
          this.createIndicator(this.form)
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
          this.$notification.error('Please Select one Automated Indicator')
        }
      } else {
        if (this.form.automated_indicator != null || !this.automatedIndicatorChecked) {
          if (this.form.automated_indicator != null) {
            this.form.target = 0
          }

          this.isSaving = true
          this.updateIndicator(this.form)
            .then(
              (response) => {
                this.$notification.success('Update success')
                this.isSaving = false
                this.isCreateMode = false
              },
              (error) => {
                this.$notification.error('Update failed', error.message)
                this.isSaving = false
              })
        } else {
          this.$notification.error('Please Select one Automated Indicator')
        }
      }
    },
    edit (indicator) {
      for (const field in indicator) {
        this.$set(this.form, field, indicator[field])
      }

      if (indicator.automated_code) {
        this.automatedIndicatorChecked = false
        this.canEditTarget = false
        this.form.automated_indicator = indicator
        this.form.target = ''
      } else {
        this.automatedIndicatorChecked = false
        this.canEditTarget = true
        this.form.automated_indicator = null
      }

      this.isCreateMode = false
    },
    remove (indicator) {
      this.deleteIndicator(indicator)
        .then(
          (response) => {
            this.form.reset()
            this.isCreateMode = true
            this.canEditTarget = true
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
        this.canEditTarget = true
      }
    },
    toggleAutomatedIndicator () {
      if (this.automatedIndicatorChecked) {
        this.automatedIndicatorChecked = false
        this.canEditTarget = true
        this.form.automated_indicator = null
      } else {
        this.automatedIndicatorChecked = true
        this.canEditTarget = false
      }
    },
    showAutomatedIndicatorModal (id) {
      this.selectingAutomatedIndicator = true
      this.$refs.assignAutomatedIndicator.show(this.form.automated_indicator)
    },
    closeAutomatedIndicatorModal (data) {
      this.selectingAutomatedIndicator = false
      this.form.automated_indicator = data
    }
  }
}
</script>
