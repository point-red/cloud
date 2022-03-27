<template>
  <div>
    <form class="row" @submit.prevent="onSubmitComment">
      <p-modal
        id="assign-comment"
        ref="commentAssessment"
        :title="$t('comment assessment')"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template>
              <label>{{ $t("comment") | uppercase }}</label>
              <textarea v-model="comment" class="form-control mt-2" rows="3" />
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
      indicatorId: null,
      comment: ""
    };
  },
  methods: {
    show(indicator) {
      this.indicatorId = indicator.id;
      this.comment =
        indicator.selected.comment !== undefined
          ? indicator.selected.comment
          : "";
      this.$refs.commentAssessment.show();
    },
    close() {
      this.comment = "";
      this.$refs.commentAssessment.close();
    },
    onSubmitNotes() {
      this.$emit("saveComment", {
        indicatorId: this.indicatorId,
        comment: this.comment
      });
      this.comment = "";
      this.$refs.commentAssessment.close();
    }
  }
};
</script>
