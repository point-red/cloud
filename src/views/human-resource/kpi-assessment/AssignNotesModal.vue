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
                :readonly="!isUser(employee_user_id) || isdetail"
              />
            </template>
          </div>
        </template>
        <template slot="footer">
          <button
            type="submit"
            v-show="isUser(employee_user_id) && !isdetail"
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
  data() {
    return {
      employee_id: null,
      indicatorId: null,
      employee_user_id: null,
      notes: "",
      isdetail: false,
    };
  },
  methods: {
    show(indicator, id, user_id, isdetail = false) {
      this.indicatorId = indicator.id;
      this.notes =
        indicator.selected !== undefined
          ? indicator.selected.notes !== undefined
            ? indicator.selected.notes
            : ""
          : "";
      this.employee_id = id;
      this.employee_user_id = user_id;
      this.isdetail = isdetail;
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
        notes: this.notes,
      });
      this.notes = "";
      this.$refs.notesAssessment.close();
    },
  },
};
</script>
