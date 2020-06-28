<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        id="assign-assessment-modal"
        ref="assignKpiTemplate"
        title="Assign Kpi Template"
      >
        <template slot="content">
          <div
            v-if="templates.length > 0"
            class="list-group mb-20"
          >
            <template v-for="(template, index) in templates">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{
                  'active': selectedIndex === index
                }"
                href="javascript:void(0)"
                @click="choose(template, index)"
                @dblclick="chooseAndSubmit(template, index)"
              >
                <span><i class="fa fa-fw fa-hand-o-right mr-5" /> {{ template.name }}</span>
              </a>
            </template>
          </div>
          <div v-else>
            <h5 class="text-center">
              KPI Template not found
            </h5>
            <router-link
              to="/human-resource/kpi"
              class="btn btn-primary"
            >
              Create new KPI Template
            </router-link>
          </div>
        </template>
        <template slot="footer">
          <div v-if="templates.length > 0 && !isLoading">
            <button
              type="submit"
              class="btn btn-sm btn-primary"
            >
              Add
            </button>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="$refs.assignKpiTemplate.close()"
          >
            {{ $t('close') | uppercase }}
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      employeeId: null,
      template: null,
      selectedIndex: null,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', ['templates'])
  },
  created () {
    this.getKpiTemplates().then(response => {
      //
    }).catch(error => {
      console.log(JSON.stringify(error))
    })
  },
  methods: {
    ...mapActions('humanResourceKpiTemplate', { getKpiTemplates: 'get' }),
    ...mapActions('humanResourceEmployee', { assignAssessment: 'assignAssessment' }),
    show (employeeId) {
      this.employeeId = employeeId
      this.$refs.assignKpiTemplate.show()
    },
    close () {
      this.$refs.assignKpiTemplate.close()
    },
    choose (template, index) {
      this.template = template
      this.selectedIndex = index
    },
    onSubmit () {
      this.assignAssessment({
        employee_id: this.employeeId,
        kpi_template_id: this.template.id
      }).then((response) => {
        this.template = null
        this.$emit('assigned', response.data.kpi_template_id)
      })
      this.$refs.assignKpiTemplate.close()
    },
    chooseAndSubmit (template, index) {
      this.choose(template, index)
      this.assignAssessment({
        employee_id: this.employeeId,
        kpi_template_id: this.template.id
      }).then((response) => {
        this.template = null
        this.$emit('assigned', response.data.kpi_template_id)
      })
      this.$refs.assignKpiTemplate.close()
    }
  }
}
</script>
