<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit">
      <p-modal
        ref="indicator"
        :id="id"
        :isLoading="loading"
        :title="'Kpi Template Indicator' | uppercase">
        <template slot="content">
          <p-table>
            <tr slot="p-head" v-show="indicators.length > 0" class="bg-info-light">
              <th>Name</th>
              <th class="text-center">Weight</th>
              <th class="text-center">Target</th>
              <th></th>
            </tr>
            <tr
              v-for="indicator in indicators"
              slot="p-body"
              :key="indicator.id">
              <td>{{ indicator.name }}</td>
              <td class="text-center">{{ indicator.weight }}%</td>
              <td class="text-center">{{ indicator.target }}</td>
              <td>
                <a href="javascript:void(0)" class="badge badge-primary" @click="edit(indicator)"><i class="fa fa-pencil"></i></a>
                <a href="javascript:void(0)" class="badge badge-danger" @click="remove(indicator)"><i class="fa fa-close"></i></a>
              </td>
            </tr>
          </p-table>

          <hr>

          <p-form-row
            id="name"
            name="name"
            label="name"
            :disabled="loadingSaveButton"
            v-model="form.name">
          </p-form-row>
          <p-form-row
            id="weight"
            name="weight"
            label="weight"
            :disabled="loadingSaveButton"
            v-model="form.weight">
          </p-form-row>
          <p-form-row
            id="target"
            name="target"
            label="target"
            :disabled="loadingSaveButton"
            v-model="form.target">
          </p-form-row>
        </template>
        <template slot="footer">
          <button
            :disabled="loadingSaveButton"
            type="submit"
            class="btn btn-primary">
            <i
              v-show="loadingSaveButton"
              class="fa fa-asterisk fa-spin"/>
            <template v-if="isCreateMode">Add</template>
            <template v-if="!isCreateMode">Update</template>
          </button>
          <button type="button" class="btn btn-outline-danger" @click="cancel">
            <template v-if="isCreateMode">Close</template>
            <template v-if="!isCreateMode">Cancel</template>
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
        kpi_template_group_id: '',
        kpi_template_id: '',
        name: '',
        weight: '',
        target: ''
      }),
      isCreateMode: true,
      loading: false,
      loadingSaveButton: false
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
        target: ''
      })
      this.fetchKpiTemplateIndicator(group.indicators)
      this.$refs.indicator.show()
    },
    close () {
      this.form.reset()
      this.$refs.indicator.close()
    },
    onSubmit () {
      this.loadingSaveButton = true
      if (this.isCreateMode) {
        this.createIndicator(this.form)
          .then(
            (response) => {
              this.$notification.success('Create success')
              this.form.reset()
              this.loadingSaveButton = false
            },
            (error) => {
              this.$notification.error('Create failed', error.message)
              this.loadingSaveButton = false
            })
      } else {
        this.updateIndicator(this.form)
          .then(
            (response) => {
              this.$notification.success('Update success')
              this.form.reset()
              this.loadingSaveButton = false
              this.isCreateMode = true
            },
            (error) => {
              this.$notification.error('Update failed', error.message)
              this.loadingSaveButton = false
            })
      }
    },
    edit (indicator) {
      for (let field in indicator) {
        this.$set(this.form, field, indicator[field])
      }
      this.isCreateMode = false
    },
    remove (indicator) {
      this.deleteIndicator(indicator)
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
