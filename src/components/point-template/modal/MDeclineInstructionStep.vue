<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('decline instruction step') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="row">
        <div class="col-sm-12">
          <div
            v-if="errors"
            class="alert alert-danger"
          >
            <strong>{{ errors.message }}</strong>
          </div>
          <form @submit.prevent="onSubmit">
            <p-form-row
              :id="`${new Date().toString()}-note`"
              name="note"
              :label="$t('note')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <textarea
                  :id="`${new Date().toString()}-note`"
                  v-model="form.approval_note"
                  name="note"
                  :placeholder="$t('note') | capitalize"
                  class="form-control"
                  :label="$t('note')"
                />
              </div>
            </p-form-row>
          </form>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <button
          type="submit"
          class="btn btn-sm btn-danger"
          :disabled="isSaving"
          @click="onSubmit"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('decline') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    instructionId: {
      type: Number,
      default: null
    },
    instructionStepId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: {
        approval_note: null
      },
      errors: null
    }
  },
  computed: {
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('pluginPlayBookInstructionApproval', [
      'declineStep'
    ]),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    async onSubmit () {
      try {
        this.isSaving = true
        this.errors = null
        const payload = this.form
        payload.id = this.instructionStepId
        payload.instruction_id = this.instructionId

        await this.declineStep(payload)

        this.$emit('added')
        this.close()
      } catch (error) {
        this.errors = {
          message: error.message,
          ...error.errors
        }
      } finally {
        this.isSaving = false
      }
    },
    open () {
      this.$refs.modal.open()
      this.$nextTick(() => {
      })
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
