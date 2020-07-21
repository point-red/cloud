<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="`${$t('add procedure')} ${parentId ? 'content' : ''}` | uppercase"
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
              :id="`${parentId || 'parent'}-code`"
              name="code"
              :label="$t('code')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  :id="`${parentId || 'parent'}-code`"
                  v-model="form.code"
                  name="code"
                  :placeholder="$t('code') | capitalize"
                  :label="$t('code')"
                  :errors="errors && errors.code"
                />
              </div>
            </p-form-row>
            <p-form-row
              :id="`${parentId || 'parent'}-name`"
              name="name"
              :label="$t('name')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  :id="`${parentId || 'parent'}-name`"
                  v-model="form.name"
                  name="name"
                  :placeholder="$t('name') | capitalize"
                  :label="$t('name')"
                  :errors="errors && errors.name"
                />
              </div>
            </p-form-row>
            <p-form-row
              :id="`${parentId || 'parent'}-purpose`"
              name="purpose"
              :label="$t('purpose')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <textarea
                  :id="`${parentId || 'parent'}-purpose`"
                  v-model="form.purpose"
                  name="purpose"
                  :placeholder="$t('purpose') | capitalize"
                  class="form-control"
                  :label="$t('purpose')"
                />
              </div>
            </p-form-row>
            <p-form-row
              v-if="parentId"
              :id="`${parentId || 'parent'}-content`"
              name="content"
              :label="$t('content')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <textarea
                  :id="`${parentId || 'parent'}-content`"
                  v-model="form.content"
                  name="content"
                  :placeholder="$t('content') | capitalize"
                  class="form-control"
                  :label="$t('content')"
                />
              </div>
            </p-form-row>
            <p-form-row
              :id="`${parentId || 'parent'}-note`"
              name="note"
              :label="$t('notes')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <textarea
                  :id="`${parentId || 'parent'}-note`"
                  v-model="form.note"
                  name="note"
                  :placeholder="$t('note') | capitalize"
                  class="form-control"
                  :label="$t('notes')"
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
    parentId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: {
        code: null,
        name: null,
        purpose: null,
        content: null,
        note: null
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
    ...mapActions('pluginPlayBookProcedure', [
      'store', 'create'
    ]),
    async getCode () {
      try {
        const { code } = await this.create({
          procedure_id: this.parentId
        })
        this.form.code = code
      } catch (error) {
      }
    },
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

        if (this.parentId) {
          payload.procedure_id = parseInt(this.parentId)
        }

        await this.store(payload)

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
        this.getCode()
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
