<template>
  <div>
    <sweet-modal
      :ref="'form-request-close'"
      :title="$t('form request close') | uppercase"
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
        @click="onCloseRequest()"
      >
        {{ $t('close') | uppercase }}
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
      this.$refs['form-request-close'].open()
      this.$nextTick(() => {
        this.$refs.reason.focus()
      })
    },
    close () {
      this.$refs['form-request-close'].close()
      this.$emit('close', true)
    },
    onCloseRequest () {
      if (this.form.reason != '') {
        this.$emit('closeRequest', this.form.reason)
        this.close()
      } else {
        this.form.errors.record({
          reason: ['reason must be filled']
        })
        this.$notification.error('reason must be filled')
      }
    },
    onClose () {
      this.form.reason = ''
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
