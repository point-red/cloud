<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('edit study subject') | uppercase"
      overlay-theme="dark"
    >
      <div class="row">
        <div class="col-sm-12">
          <p-form-row
            id="name"
            ref="name"
            v-model="form.name"
            name="name"
            :label="$t('name')"
            :placeholder="$t('required') | uppercase"
            :disabled="isSaving"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"
          />
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
          /> {{ $t('save') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </form>
</template>

<script>
import axios from '@/axios'
import Form from '@/utils/Form'
export default {
  name: 'PluginStudySubjectEdit',
  data () {
    return {
      form: new Form({
        name: ''
      }),
      isSaving: false,
      subject: null
    }
  },
  methods: {
    onSubmit () {
      this.isSaving = true
      axios.put('/plugin/study/subject/' + this.subject.id, this.form)
        .then(response => {
          this.$emit('update', response.data)
          this.close()
        })
        .catch(error => {
          if (error.status === 422) {
            this.form.errors.record(error.data.errors)
          } else {
            this.$notification.error(error.data.message)
          }
        })
        .finally(() => {
          this.isSaving = false
        })
    },
    open (subject) {
      this.subject = subject
      this.form.name = subject.name
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>
