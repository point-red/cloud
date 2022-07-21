<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('delete study sheet') | uppercase"
      overlay-theme="dark"
    >
      <div class="row">
        <div class="col-sm-12">
          <p>
            {{ $t('ask to delete', {name: label}) | capitalize }}
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
  name: 'PluginStudySheetDelete',
  data () {
    return {
      isSaving: false,
      sheet: {}
    }
  },
  computed: {
    label () {
      const subject = this.sheet.subject?.name
      const date = this.$options.filters.dateFormat(this.sheet.started_at, 'DD MMM YYYY')
      return `${subject} (${date})`
    }
  },
  methods: {
    onSubmit () {
      this.isSaving = true
      axios.delete('/plugin/study/sheet/' + this.sheet.id, this.form)
        .then(() => {
          this.$emit('delete', this.sheet.id)
          this.close()
        })
        .catch(error => {
          this.$notification.error(error.data.message)
        })
        .finally(() => {
          this.isSaving = false
        })
    },
    open (sheet) {
      this.sheet = sheet
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>
