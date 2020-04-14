<template>
  <div>
    <form class="row" @submit.prevent="onSubmitFile">
      <sweet-modal
        ref="modal"
        :title="$t('add attachment') | uppercase"
        overlay-theme="dark"
        @close="onClose()">
        <p-form-row id="file" name="file" :label="$t('file')">
          <div slot="body" class="col-lg-9">
            <p-form-file id="file" name="file" @fileChanged="onFileChange" ref="file"/>
          </div>
        </p-form-row>
        <p-form-row id="notes" name="notes" :label="$t('notes')" v-model="notes"></p-form-row>
        <div class="pull-right">
          <button type="submit" class="btn btn-sm btn-primary">
            {{ $t('add') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String
    },
    feature: {
      type: String,
      required: true
    },
    featureId: {
      type: Number,
      default: null
    },
    expirationDay: {
      type: Number,
      default: null
    },
    isUserProtected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      notes: '',
      file: null
    }
  },
  methods: {
    ...mapActions('cloudStorage', ['upload']),
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
    },
    onFileChange (file) {
      this.file = file
    },
    open () {
      this.$refs.file.reset()
      this.notes = ''
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close')
    },
    onSubmitFile () {
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('feature', this.feature)
      formData.append('feature_id', this.featureId)
      formData.append('notes', this.notes)
      formData.append('is_user_protected', this.isUserProtected)
      formData.append('expiration_day', this.expirationDay)
      this.upload(formData)
        .then(response => {
          this.$notification.success('Upload success')
          this.$emit('uploaded', response)
        })
      this.close()
    }
  }
}
</script>
