<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('delete study subject') | uppercase"
      overlay-theme="dark"
    >
      <div class="row">
        <div class="col-sm-12">
          <p>
            {{ $t('ask to delete', {name: subject.name}) | capitalize }}
          </p>
        </div>
      </div>
      <div class="pull-right">
        <button
          type="submit"
          class="btn btn-sm btn-primary"
          :disabled="isSaving"
          @click="onSubmit"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('delete') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </form>
</template>

<script>
import axios from '@/axios'
export default {
  name: 'PluginStudySubjectDelete',
  data () {
    return {
      isSaving: false,
      subject: {}
    }
  },
  methods: {
    onSubmit () {
      this.isSaving = true
      axios.delete('/plugin/study/subject/' + this.subject.id, this.form)
        .then(() => {
          this.$emit('delete', this.subject.id)
          this.close()
        })
        .catch(error => {
          this.$notification.error(error.data.message)
        })
        .finally(() => {
          this.isSaving = false
        })
    },
    open (subject) {
      this.subject = subject
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>
