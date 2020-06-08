<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitDuplicate">
      <p-modal
        ref="kpi"
        :id="id"
        :idKpi="idKpi"
        :isLoading="isLoading"
        title="List Kpi Template">

        <template slot="content">
          <div class="list-group mb-20">
            <!-- <template v-for="(score, index) in options"> -->
            <template>
              <div v-for="template in templates" :key="template" style="list-style: none; padding-left: 0;" class="list-group">
                <button type="button" v-if="template.id != idKpi" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  href="javascript:void(0)"
                  @click="id_template = template.id"
                >{{ template.name }}
                </button>
              </div>
            </template>
          </div>
        </template>
        <template slot="footer">
          <button type="submit" class="btn btn-sm btn-primary">OK</button>
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
    },
    idKpi: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      id_kpi: null,
      form: {
        kpi_template_id: null,
        name: null
      },
      form_indicator_kpi_template_group_id: null,
      form_indicator_name: null,
      form_indicator_weight: null,
      form_indicator_target: null,
      form_indicator_score_kpi_template_indicator_id: null,
      form_indicator_score_score: null,
      form_indicator_score_description: null,
      scores: [],
      group: null,
      id_template: null,
      isCreateMode: true,
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', ['templates', 'pagination', 'getTemplateById']),
    ...mapGetters('humanResourceKpiTemplateGroup', {
      groups: 'groups'
    }),
    ...mapGetters('humanResourceKpiTemplateIndicator', {
      indicators: 'indicators'
    }),
    ...mapGetters('humanResourceKpiTemplateScore', {
      scores: 'scores'
    }),
    payloadGroup () {
      return new Form(this.form)
    },
    payloadIndicator () {
      let payload = {
        kpi_template_group_id: this.form_indicator_kpi_template_group_id,
        name: this.form_indicator_name,
        weight: this.form_indicator_weight,
        target: this.form_indicator_target
      }
      return new Form(payload)
    },
    payloadScore () {
      let payload = {
        kpi_template_indicator_id: this.form_indicator_score_kpi_template_indicator_id,
        score: this.form_indicator_score_score,
        description: this.form_indicator_score_description
      }

      return new Form(payload)
    }
  },
  methods: {
    ...mapMutations('humanResourceKpiTemplateGroup', {
      fetchKpiTemplateGroup: 'FETCH_ARRAY'
    }),
    ...mapActions('humanResourceKpiTemplateGroup', {
      getGroups: 'get',
      createGroup: 'create'
    }),
    ...mapActions('humanResourceKpiTemplate', {
      getKpiTemplates: 'get'
    }),
    ...mapMutations('humanResourceKpiTemplateIndicator', {
      fetchKpiTemplateIndicator: 'FETCH_ARRAY'
    }),
    ...mapActions('humanResourceKpiTemplateIndicator', {
      getIndicators: 'get',
      createIndicator: 'create',
      updateIndicator: 'update',
      deleteIndicator: 'delete'
    }),
    ...mapMutations('humanResourceKpiTemplateScore', {
      fetchKpiTemplateScores: 'FETCH_ARRAY'
    }),
    ...mapActions('humanResourceKpiTemplateScore', {
      getScores: 'get',
      createScore: 'create',
      updateScore: 'update',
      deleteScore: 'delete'
    }),
    show (group) {
      this.group = group
      this.getKpiTemplates()
      this.getGroups()
      this.form = new Form()
      this.$refs.kpi.show()
    },
    close () {
      this.form.reset()
      this.$refs.kpi.close()
    },
    onSubmitDuplicate () {
      this.form.kpi_template_id = this.id_template
      this.form.name = this.group.name
      this.createGroup(this.payloadGroup)
        .then(
          (response) => {
            this.id_kpi = response.data.id
            this.$notification.success('Duplicate groub success')
            this.form.reset()
            this.close()
            this.saveIndicator()
            this.isSaving = false
          },
          (error) => {
            this.$notification.error('Duplicate groub failed', error.message)
            this.isSaving = false
          })
    },
    saveIndicator () {
      this.group.indicators.forEach(item => {
        // set indicator
        this.form_indicator_kpi_template_group_id = this.id_kpi
        this.form_indicator_name = item.name
        this.form_indicator_weight = item.weight
        this.form_indicator_target = item.target
        // set score
        this.createIndicator(this.payloadIndicator)
          .then(
            (response) => {
              this.saveScore(response.data.id, item.scores)
              this.$notification.success('Duplicate Indicator success')
            },
            (error) => {
              this.$notification.error('Duplicate Indicator  failed', error.message)
            })
      })
    },
    saveScore (id, scores) {
      scores.forEach(item => {
        if (item) {
          this.form_indicator_score_kpi_template_indicator_id = id
          this.form_indicator_score_score = item.score
          this.form_indicator_score_description = item.description
          this.createScore(this.payloadScore)
            .then(
              (response) => {
                this.$notification.success('Duplicate Score success')
              },
              (error) => {
                this.$notification.error('Duplicate Score  failed', error.message)
              })
        }
      })
    }
  }
}
</script>
