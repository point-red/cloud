<template>
  <div>
    <sweet-modal
      :ref="'form-approval-reject'"
      :title="$t('form approval reject') | uppercase"
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
        placeholder="reason"
      />
      <hr>
      <button
        type="button"
        class="btn btn-block btn-sm btn-danger mr-5"
        @click="reject()"
      >
        <i
          v-show="isSaving"
          class="fa fa-asterisk fa-spin"
        /> {{ $t('reject') | uppercase }}
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
      this.$refs['form-approval-reject'].open()
      this.$nextTick(() => {
        this.$refs.reason.focus()
      })
    },
    close () {
      this.$refs['form-approval-reject'].close()
      this.$emit('close', true)
    },
    reject () {
      this.isSaving = true

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
      this.reason = ''
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
