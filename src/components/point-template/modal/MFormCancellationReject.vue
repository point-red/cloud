<template>
  <div>
    <sweet-modal
      :ref="'form-cancellation-reject'"
      :title="$t('form cancellation reject') | uppercase"
      overlay-theme="dark"
      @close="onClose()">
      <textarea rows="5" class="form-control" ref="reason" placeholder="reason" v-model="reason"></textarea>
      <hr>
      <button type="button" @click="reject()" class="btn btn-block btn-sm btn-danger mr-5">{{ $t('reject') | uppercase }}</button>
    </sweet-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isLoading: false,
      reason: ''
    }
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
