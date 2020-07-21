<template>
  <div>
    <sweet-modal
      :ref="'form-request-delete'"
      :title="$t('form request delete') | uppercase"
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
        @click="onDelete()"
      >
        {{ $t('delete') | uppercase }}
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
      this.$refs['form-request-delete'].open()
      this.$nextTick(() => {
        this.$refs.reason.focus()
      })
    },
    close () {
      this.$refs['form-request-delete'].close()
      this.$emit('close', true)
    },
    onDelete () {
      this.$emit('delete', this.reason)
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
