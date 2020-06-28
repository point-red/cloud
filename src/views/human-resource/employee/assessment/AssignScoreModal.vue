<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitEmployeeAssessment"
    >
      <p-modal
        id="assign-score"
        ref="employeeAssessment"
        :title="$t('employee assessment')"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template v-for="(scoreAssessment, index) in options">
              <a
                :key="index"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{
                  'active': selectedScoreIndex === index
                }"
                href="javascript:void(0)"
                @click="chooseScore(scoreAssessment, index)"
                @dblclick="onChooseAndSubmitEmployeeAssessment(scoreAssessment, index)"
              >
                <span><i class="fa fa-fw fa-hand-o-right mr-5" /> {{ scoreAssessment.description }}</span>
                <span class="badge badge-pill badge-secondary">{{ scoreAssessment.score }}</span>
              </a>
            </template>
          </div>
        </template>
        <template slot="footer">
          <button
            type="submit"
            class="btn btn-sm btn-primary"
          >
            Add
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      score: null,
      indicatorId: null,
      selectedScoreIndex: null,
      selectedScoreDescription: null,
      notes: '',
      options: []
    }
  },
  watch: {
    'employeeAssessment' () {
      this.$emit('value', this.employeeAssessment)
    }
  },
  methods: {
    show (indicator) {
      this.indicatorId = indicator.id
      this.options = indicator.scores
      this.options = this.options.sort(function (a, b) {
        return a.score - b.score
      })

      this.$refs.employeeAssessment.show()
    },
    close () {
      this.options = null
      this.$refs.employeeAssessment.close()
    },
    chooseScore (score, index) {
      this.selectedScoreIndex = index
      this.score = score
    },
    onSubmitEmployeeAssessment () {
      this.$emit('add', {
        indicatorId: this.indicatorId,
        score: this.score,
        notes: this.notes
      })
      this.score = null
      this.notes = ''
      this.selectedScoreIndex = null
      this.$refs.employeeAssessment.close()
    },
    onChooseAndSubmitEmployeeAssessment (score, index) {
      this.chooseScore(score, index)
      this.$emit('add', {
        indicatorId: this.indicatorId,
        score: this.score,
        notes: this.notes
      })
      this.score = null
      this.notes = ''
      this.selectedScoreIndex = null
      this.$refs.employeeAssessment.close()
    },
    employeeAssessmentName (value) {
      var obj = this.options.filter(function (el) {
        if (el.id === value) {
          return el.label
        }
      })
      return obj[0].label
    }
  }
}
</script>
