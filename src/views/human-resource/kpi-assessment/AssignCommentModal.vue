<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmitComment"
    >
      <p-modal
        id="assign-comment"
        ref="commentAssessment"
        :title="$t('comment assessment')"
      >
        <template slot="content">
          <div class="list-group mb-20">
            <template>
              <label>{{ $t("comment") | uppercase }}</label>
              <textarea
                v-model="comment"
                class="form-control mt-2"
                rows="3"
                :readonly="isdetail"
              />
            </template>
          </div>
        </template>
        <template slot="footer">
          <button
            v-show="!isdetail"
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
      indicatorId: null,
      comment: '',
      isdetail: false
    }
  },
  methods: {
    show (indicator, isdetail = false) {
      this.indicatorId = indicator.id
      this.comment =
        indicator.selected !== undefined
          ? indicator.selected.comment !== undefined
            ? indicator.selected.comment
            : ''
          : ''
      this.isdetail = isdetail
      this.$refs.commentAssessment.show()
    },
    close () {
      this.comment = ''
      this.$refs.commentAssessment.close()
    },
    onSubmitComment () {
      this.$emit('saveComment', {
        indicatorId: this.indicatorId,
        comment: this.comment
      })
      this.comment = ''
      this.$refs.commentAssessment.close()
    }
  }
}
</script>
