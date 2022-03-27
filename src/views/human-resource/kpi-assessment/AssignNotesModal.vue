<template>
  <div>
    <form class="row" @submit.prevent="onSubmitNotes">
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
                :readonly="!isUser(employee_id)"
              />
            </template>
          </div>
        </template>
        <template slot="footer">
          <button type="submit" class="btn btn-sm btn-primary">Save</button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employee_id: null,
      indicatorId: null,
      notes: ""
    };
  },
  methods: {
    show(indicator, id) {
      this.indicatorId = indicator.id;
      this.notes =
        indicator.selected !== undefined
          ? indicator.selected.notes !== undefined
            ? indicator.selected.notes
            : ""
          : "";
      this.employee_id = id;
      this.$refs.notesAssessment.show();
    },
    isUser(employee_userid) {
      return localStorage.getItem("userId") == employee_userid;
    },
    close() {
      this.notes = "";
      this.$refs.notesAssessment.close();
    },
    onSubmitNotes() {
      this.$emit("saveNotes", {
        indicatorId: this.indicatorId,
        notes: this.notes
      });
      this.notes = "";
      this.$refs.notesAssessment.close();
    }
  }
};
</script>
