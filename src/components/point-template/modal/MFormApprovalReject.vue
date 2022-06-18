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
        v-model="reason"
        rows="5"
        class="form-control"
        placeholder="reason"
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
      this.$emit('reject', this.reason)
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
