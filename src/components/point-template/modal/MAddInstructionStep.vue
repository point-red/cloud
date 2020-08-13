<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('add step') | uppercase"
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
              :id="`name`"
              name="name"
              label="Step Name"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  :id="`name`"
                  v-model="form.name"
                  name="name"
                  placeholder="Step Name"
                  :label="$t('name')"
                  :errors="errors && errors.name"
                />
              </div>
            </p-form-row>
            <hr>
            <div class="text-right">
              <button
                class="btn btn-sm btn-light"
                type="button"
                @click="addContent"
              >
                <i class="fa fa-plus" />
              </button>
            </div>
            <div
              v-for="(content, i) of form.contents"
              :key="i"
              :ref="`content-${(i + 1)}`"
              class="card mt-3"
            >
              <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-center">
                  <h5># {{ (i + 1) }}</h5>
                  <button
                    class="btn btn-sm btn-light"
                    type="button"
                    @click="deleteContent(i)"
                  >
                    <i class="fa fa-times" />
                  </button>
                </div>
                <p-form-row
                  :id="`${i}-glossary`"
                  :name="`${i}-glossary`"
                  :label="`${$t('glossary')}`"
                >
                  <div
                    slot="body"
                    class="col-lg-9"
                  >
                    <p-select
                      :key="`${i}-${(new Date()).toString()}`"
                      v-model="form.contents[i].glossary_id"
                      :disabled="isSaving"
                      :options="glossaries[i]"
                    />
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
                    <vue-editor
                      v-model="form.contents[i].content"
                      :editor-toolbar="customToolbar"
                    />
                  </div>
                </p-form-row>
              </div>
            </div>
            <div
              v-if="form.contents.length > 1"
              class="text-right mt-3"
            >
              <button
                class="btn btn-sm btn-light"
                type="button"
                @click="addContent"
              >
                Add <i class="fa fa-plus" />
              </button>
            </div>
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
import { VueEditor } from 'vue2-editor'

export default {
  components: { VueEditor },
  props: {
    instructionId: {
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
      return new Array(this.form.contents.length).fill(null).map((_, iGlossary) => {
        return this.$store.getters['pluginPlayBookGlossary/glossaries']
          .map(_glossary => ({
            id: _glossary.id,
            label: `${_glossary.code} - ${_glossary.name} (${_glossary.abbreviation})`
          }))
          .filter(_glossary => {
            return !this.form.contents.find(
              (_content, iContent) => iContent !== iGlossary && parseInt(_content.glossary_id) === _glossary.id
            )
          })
      })
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('pluginPlayBookGlossary', [
      'get'
    ]),
    ...mapActions('pluginPlayBookInstruction', [
      'storeStep'
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
    async onSubmit () {
      try {
        this.isSaving = true
        this.errors = null
        const payload = this.form
        payload.instruction_id = this.instructionId

        await this.storeStep(payload)

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
        this.getGlossaries()
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
