<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitPlan"
    >
      <p-modal
        id="assign-plan"
        ref="planAssessment"
        :title="$t('input plan')"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template>
              <label>{{ $t("plan") | uppercase }}</label>
              <textarea
                v-model="plan"
                class="form-control mt-2"
                rows="20"
                :readonly="!isUser(employee_user_id) || isdetail"
              />
            </template>
          </div>
        </template>
        <template slot="footer">
          <button
            v-show="isUser(employee_user_id) && !isdetail"
            type="submit"
            class="btn btn-sm btn-primary"
          >
            Save
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
      employee_id: null,
      indicatorId: null,
      employee_user_id: null,
      plan: '',
      isdetail: false
    }
  },
  methods: {
    show (indicator, id, userId, isdetail = false) {
      this.indicatorId = indicator.id
      this.plan =
        indicator.selected !== undefined
          ? indicator.selected.plan !== undefined
            ? indicator.selected.plan
            : ''
          : ''
      this.employee_id = id
      this.employee_user_id = userId
      this.isdetail = isdetail
      this.$refs.planAssessment.show()
    },
    isUser (employeeUserid) {
      return localStorage.getItem('userId') == employeeUserid
    },
    close () {
      this.plan = ''
      this.$refs.planAssessment.close()
    },
    onSubmitPlan () {
      this.$emit('savePlan', {
        indicatorId: this.indicatorId,
        plan: this.plan
      })
      this.plan = ''
      this.$refs.planAssessment.close()
    }
  }
}
</script>
