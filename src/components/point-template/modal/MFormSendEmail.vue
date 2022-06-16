<template>
  <div>
    <sweet-modal
      :ref="'form-send-email'"
      :title="$t('form send email') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <p-form-row
        id="to"
        ref="to"
        v-model="form.to"
        name="to"
        placeholder="ex: admin@point.com"
        :is-horizontal="false"
        :disabled="isSaving"
        :label="$t('email receipient')"
        :errors="form.errors.get('to')"
        @errors="form.errors.set('to', null)"
      />
      <div class="form-group">
        <label for="body">{{ $t('email body') | uppercase }}</label>
        <textarea
          id="body"
          ref="body"
          v-model="form.body"
          rows="5"
          :class="{
            'form-control': true,
            'is-invalid': !!form.errors.get('body')
          }"
          placeholder="body"
        />
      </div>
      <hr>
      <button
        type="button"
        class="btn btn-block btn-sm btn-danger mr-5"
        @click="onSubmit()"
      >
        {{ $t('send') | uppercase }}
      </button>
    </sweet-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'

export default {
  data () {
    return {
      isSaving: false,
      isLoading: false,
      form: new Form({
        to: '',
        body: 'Hello Mrs/Mr/Ms \nThe receipt for your Form is attached to this email'
      })
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    open () {
      this.$refs['form-send-email'].open()
      this.$nextTick(() => {
        this.$refs.body.focus()
      })
    },
    close () {
      this.$refs['form-send-email'].close()
      this.$emit('close', true)
    },
    onSubmit () {
      if (this._validateFormFields()) {
        this.$emit('submit', this.form)
        this.close()
      }
    },
    onClose () {
      this.form.body = ''
    },
    _validateFormFields () {
      let errors = 0

      if (!this.form.to) {
        this.form.errors.record({
          to: ['receipient must be filled']
        })
        this.$notification.error('receipient must be filled')
        errors++
      }

      if (!this.form.body) {
        this.form.errors.record({
          body: ['body must be filled']
        })
        this.$notification.error('body must be filled')
        errors++
      }

      return errors === 0
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
