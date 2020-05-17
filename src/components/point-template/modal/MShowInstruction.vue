<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="`accept ${form.approval_action || 'Loading'}` | uppercase"
      overlay-theme="dark"
      @close="onClose()">
      <div class="row">
        <div class="col-sm-12">
          <div class="alert alert-danger" v-if="errors">
            <strong>{{ errors.message }}</strong>
          </div>
          <form @submit.prevent="approve">
            <p-form-row
              :id="`number`"
              name="number"
              label="Instruction Number">
              <div slot="body" class="col-lg-9">
                <p-form-input
                  :id="`number`"
                  name="number"
                  placeholder="Instruction Number"
                  :label="$t('number')"
                  :errors="errors && errors.number"
                  v-model="form.number"
                  disabled="true" />
              </div>
            </p-form-row>
            <p-form-row
              :id="`name`"
              name="name"
              label="Instruction Name">
              <div slot="body" class="col-lg-9">
                <p-form-input
                  :id="`name`"
                  name="name"
                  placeholder="Instruction Name"
                  :label="$t('name')"
                  :errors="errors && errors.name"
                  v-model="form.name"
                  disabled="true" />
              </div>
            </p-form-row>
          </form>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <button class="btn btn-sm btn-light" @click="close">
          Cancel
        </button>
        <template v-if="form.approval_request_to === authUser.id">
          <template v-if="!form.approved_at && !form.declined_at">
            <button type="submit" @click="$refs.modalDeclineInstruction.open()" class="btn btn-sm btn-danger ml-2" :disabled="isSaving">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('decline') | uppercase }}
            </button>
            <button type="submit" class="btn btn-sm btn-success ml-2" :disabled="isSaving" @click="approve">
              <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('approve') | uppercase }}
            </button>
          </template>
          <button @click="confirmDelete()" class="btn btn-sm btn-danger ml-2" v-else-if="form.declined_at">
            Delete
          </button>
        </template>
      </div>
    </sweet-modal>
    <m-decline-instruction
      :instruction-id="form.id"
      ref="modalDeclineInstruction"
      @added="$emit('added'); close()"></m-decline-instruction>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'instructionId'
  ],
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      procedureSelectKey: (new Date().toString()),
      form: {
        number: 'Loading',
        name: 'Loading',
        procedure_id: ''
      },
      errors: null
    }
  },
  methods: {
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    async show () {
      let instruction = await this.$store.dispatch('pluginPlayBookInstruction/show', this.instructionId)

      this.form = instruction
    },
    async approve () {
      try {
        this.isSaving = true
        this.errors = null
        const payload = this.form

        await this.$store.dispatch('pluginPlayBookInstructionApproval/approve', this.instructionId)

        this.form = {
          number: null,
          name: null
        }

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
    async confirmDelete () {
      const title = `${this.$t('delete')} "${this.form.name}"`
      this.close()

      this.$alert.confirm(
        title, this.$t('confirmation delete message')
      ).then(async response => {
        try {
          this.isLoading = true
          this.isDeleteing = true

          await this.$store.dispatch('pluginPlayBookInstruction/delete', this.instructionId)

          this.$emit('added')
          this.close()
        } catch (error) {
        } finally {
          this.isDeleteing = false
          this.isLoading = false
        }
      }).catch(() => {
        this.open()
      })
    },
    open () {
      this.$refs.modal.open()
      this.$nextTick(async () => {
        this.show()
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
