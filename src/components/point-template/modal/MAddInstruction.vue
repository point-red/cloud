<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('add instruction') | uppercase"
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
              :id="`number`"
              name="number"
              label="Instruction Number"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  :id="`number`"
                  v-model="form.number"
                  name="number"
                  placeholder="Instruction Number"
                  :label="$t('number')"
                  :errors="errors && errors.number"
                />
              </div>
            </p-form-row>
            <p-form-row
              :id="`name`"
              name="name"
              label="Instruction Name"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  :id="`name`"
                  v-model="form.name"
                  name="name"
                  placeholder="Instruction Name"
                  :label="$t('name')"
                  :errors="errors && errors.name"
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
          class="btn btn-sm btn-primary"
          :disabled="isSaving"
          @click="onSubmit"
        >
          <i
            v-show="isSaving"
            class="fa fa-asterisk fa-spin"
          /> {{ $t('save') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    procedureId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      procedureSelectKey: (new Date().toString()),
      form: {
        number: null,
        name: null,
        procedure_id: ''
      },
      errors: null
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('pluginPlayBookInstruction', [
      'store'
    ]),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    async getNextNumber () {
      const { number } = await this.$store.dispatch('pluginPlayBookInstruction/create', {
        procedure_id: this.form.procedure_id
      })

      this.form.number = number
    },
    async onSubmit () {
      try {
        this.isSaving = true
        this.errors = null
        const payload = this.form

        await this.store(payload)

        this.form = {
          number: null,
          name: null,
          procedure_id: ''
        }

        this.procedureSelectKey = (new Date().toString())
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
      this.$nextTick(async () => {
        this.form.procedure_id = this.procedureId
        this.getNextNumber()
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

  div.v-dropdown-container {
    z-index: 9999 !important;
  }

  .sweet-modal.is-visible {
    max-width: 800px;
  }
</style>
