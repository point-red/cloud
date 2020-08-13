<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="`accept ${form.approval_action || 'Loading'}` | uppercase"
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
              id="name"
              name="name"
              label="Step Name"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <div class="form-control">
                  {{ form.name }}
                </div>
              </div>
            </p-form-row>
            <hr>
            <div
              v-for="(content, i) of form.contents"
              :key="i"
              :ref="`content-${(i + 1)}`"
              class="card mt-3"
            >
              <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-center">
                  <h5># {{ (i + 1) }}</h5>
                </div>
                <p-form-row
                  :id="`${i}-glossary`"
                  :name="`${i}-glossary`"
                  :label="`${$t('glossary')}`"
                >
                  <div
                    v-if="form.contents[i] && form.contents[i].glossary"
                    slot="body"
                    class="col-lg-9"
                  >
                    {{ form.contents[i].glossary.code }} - {{ form.contents[i].glossary.name }}
                  </div>
                </p-form-row>
                <p-form-row
                  :id="`${i}-content`"
                  :name="`${i}-content`"
                  :label="`Content`"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <div>
                      form.contents[i].content
                    </div>
                  </div>
                </p-form-row>
              </div>
            </div>
          </form>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <button
          class="btn btn-sm btn-light"
          @click="close"
        >
          Cancel
        </button>
        <template v-if="form.approval_request_to === authUser.id">
          <template v-if="!form.approved_at && !form.declined_at">
            <button
              type="submit"
              class="btn btn-sm btn-danger ml-2"
              :disabled="isSaving"
              @click="$refs.modalDeclineInstructionStep.open()"
            >
              <i
                v-show="isSaving"
                class="fa fa-asterisk fa-spin"
              /> {{ $t('decline') | uppercase }}
            </button>
            <button
              type="submit"
              class="btn btn-sm btn-success ml-2"
              :disabled="isSaving"
              @click="approve"
            >
              <i
                v-show="isSaving"
                class="fa fa-asterisk fa-spin"
              /> {{ $t('approve') | uppercase }}
            </button>
          </template>
          <button
            v-else-if="form.declined_at"
            class="btn btn-sm btn-danger ml-2"
            @click="confirmDeleteStep()"
          >
            Delete
          </button>
        </template>
      </div>
    </sweet-modal>
    <m-decline-instruction-step
      ref="modalDeclineInstructionStep"
      :instruction-id="form.instruction_id"
      :instruction-step-id="form.id"
      @added="$emit('added'); close()"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    step: {
      type: Object,
      default: null
    },
    stepId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: {
        name: null,
        contents: [
          {
            glossary_id: null,
            content: null
          }
        ]
      },
      customToolbar: [
        ['bold', 'italic', 'underline'], ['link', 'code-block']
      ],
      errors: null
    }
  },
  computed: {
    glossaries () {
      return this.$store.getters['pluginPlayBookGlossary/glossaries'].map(_glossary => ({
        id: _glossary.id,
        label: `${_glossary.code} - ${_glossary.name} (${_glossary.abbreviation})`
      }))
    },
    ...mapGetters('auth', ['authUser'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('pluginPlayBookGlossary', [
      'get'
    ]),
    ...mapActions('pluginPlayBookInstruction', [
      'updateStep'
    ]),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    async getGlossaries () {
      this.get({
        limit: 1000
      })
    },
    async approve () {
      try {
        this.isSaving = true
        this.errors = null

        await this.$store.dispatch('pluginPlayBookInstructionApproval/approveStep', this.form)

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
    async confirmDeleteStep () {
      const title = `${this.$t('delete')} Step "${this.step.name}"`
      this.close()

      this.$alert.confirm(
        title, this.$t('confirmation delete message')
      ).then(async response => {
        try {
          this.isLoading = true
          this.isDeleteing = true

          await this.$store.dispatch('pluginPlayBookInstruction/deleteStep', this.step)

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
      this.$nextTick(() => {
        this.getGlossaries()

        if (this.step) {
          this.form = { ...this.step }
          this.form.contents = this.form.contents.map(_content => ({ ..._content }))
        } else {
          // load from API
        }
      })
    },
    close () {
      this.$refs.modal.close()
    },
    addContent () {
      this.form.contents.push({ glossary_id: null, content: null })
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs[`content-${this.form.contents.length}`][0].scrollIntoView({
            behavior: 'smooth'
          })
        }, 100)
      })
    },
    deleteContent (i) {
      this.form.contents.splice(i, 1)
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
