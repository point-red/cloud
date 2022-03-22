<template>
  <div>
    <form class="row" @submit.prevent="onSubmitNotes">
      <p-modal id="assign-notes" ref="notesAssessment" :title="$t('notes assessment')">
        <template slot="content">
          <div class="list-group mb-20">
            <template>
              <label>{{$t('notes') | uppercase}}</label>
              <textarea v-model="notes" class="form-control mt-2" rows="3" />
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
  data () {
    return {
      indicatorId: null,
      notes: ''
    }
  },
  methods: {
    show (indicator) {
      this.indicatorId = indicator.id
      this.notes = indicator.notes !== '' ? indicator.notes : ''
      this.$refs.notesAssessment.show()
    },
    close () {
      this.$refs.notesAssessment.close()
    },
    onSubmitNotes () {
      this.$emit('saveNotes', {
        indicatorId: this.indicatorId,
        notes: this.notes
      })
      this.notes = ''
      this.$refs.notesAssessment.close()
    },
  }
}
</script>