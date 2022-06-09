<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitNotes"
    >
      <p-modal
        id="assign-notes"
        ref="notesAssessment"
        :title="$t('notes assessment')"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template>
              <label>{{ $t("notes") | uppercase }}</label>
              <textarea
                v-model="notes"
                class="form-control mt-2"
                rows="3"
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
      notes: '',
      isdetail: false
    }
  },
  methods: {
    show (indicator, id, userId, isdetail = false) {
      this.indicatorId = indicator.id
      this.notes =
        indicator.selected !== undefined
          ? indicator.selected.notes !== undefined
            ? indicator.selected.notes
            : ''
          : ''
      this.employee_id = id
      this.employee_user_id = userId
      this.isdetail = isdetail
      this.$refs.notesAssessment.show()
    },
    isUser (employeeUserid) {
      return localStorage.getItem('userId') == employeeUserid
    },
    close () {
      this.notes = ''
      this.$refs.notesAssessment.close()
    },
    onSubmitNotes () {
      this.$emit('saveNotes', {
        indicatorId: this.indicatorId,
        notes: this.notes
      })
      this.notes = ''
      this.$refs.notesAssessment.close()
    }
  }
}
</script>
