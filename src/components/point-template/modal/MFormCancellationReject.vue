<template>
  <div>
    <sweet-modal
      :ref="'form-cancellation-reject'"
      :title="$t('form cancellation reject') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <textarea
        ref="reason"
        v-model="form.reason"
        rows="5"
        :class="{
          'form-control': true,
          'is-invalid': !!form.errors.get('reason')
        }"
        :placeholder="$t('reason')"
      />
      <hr>
      <button
        type="button"
        class="btn btn-block btn-sm btn-danger mr-5"
        @click="reject()"
      >
        {{ $t('reject') | uppercase }}
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
      form: new Form({ reason: '' })
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    open () {
      this.$refs['form-cancellation-reject'].open()
      this.$nextTick(() => {
        this.$refs.reason.focus()
      })
    },
    close () {
      this.$refs['form-cancellation-reject'].close()
      this.$emit('close', true)
    },
    reject () {
      if (this.form.reason.length > 255) {
        this.isSaving = false
        this.$notification.error('Reason should not empty')
        this.form.errors.record({
          reason: ['Reason should not empty']
        })

        return false
      }

      if (!this.form.reason) {
        this.isSaving = false
        this.$notification.error('Reason should not empty')
        this.form.errors.record({
          reason: ['Reason should not empty']
        })

        return false
      }

      this.$emit('reject', this.form.reason)
      this.close()
    },
    onClose () {
      this.form.reason = ''
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white;
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
