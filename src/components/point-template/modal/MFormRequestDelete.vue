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
        @click="onDelete()"
      >
        {{ $t('delete') | uppercase }}
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
      if (this.form.reason != '') {
        if (this.form.reason.length > 255) {
          this.form.errors.record({
            reason: ['reason cannot be more than 255 character']
          })
          this.$notification.error('reason cannot be more than 255 character')
        } else {
          this.$emit('delete', this.form.reason)
          this.close()
        }
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
