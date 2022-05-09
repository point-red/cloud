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
        v-model="reason"
        rows="5"
        class="form-control"
        placeholder="reason"
      />
      <hr>
      <button
        type="button"
        class="btn btn-block btn-sm btn-danger mr-5"
        @click="onCloseForm()"
      >
        {{ $t('close form') | uppercase }}
      </button>
    </sweet-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isSaving: false,
      isLoading: false,
      reason: ''
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
    onCloseForm () {
      if (this.reason != '') {
        this.$emit('close-form', this.reason)
        this.close()
      } else {
        this.close()
        this.$notification.error('reason must be filled')
      }
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
