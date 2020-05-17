<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="`${$t('add procedure')} ${parentId ? 'content' : ''}` | uppercase"
      overlay-theme="dark"
      @close="onClose()">
      <div class="row">
        <div class="col-sm-12">
          <div class="alert alert-danger" v-if="errors">
            <strong>{{ errors.message }}</strong>
          </div>
          <form @submit.prevent="onSubmit">
            <p-form-row
              :id="`${parentId || 'parent'}-code`"
              name="code"
              :label="$t('code')">
              <div slot="body" class="col-lg-9">
                <p-form-input
                  :id="`${parentId || 'parent'}-code`"
                  name="code"
                  :placeholder="$t('code') | capitalize"
                  :label="$t('code')"
                  :errors="errors && errors.code"
                  v-model="form.code" />
              </div>
            </p-form-row>
            <p-form-row
              :id="`${parentId || 'parent'}-name`"
              name="name"
              :label="$t('name')">
              <div slot="body" class="col-lg-9">
                <p-form-input
                  :id="`${parentId || 'parent'}-name`"
                  name="name"
                  :placeholder="$t('name') | capitalize"
                  :label="$t('name')"
                  :errors="errors && errors.name"
                  v-model="form.name" />
              </div>
            </p-form-row>
            <p-form-row
              :id="`${parentId || 'parent'}-purpose`"
              name="purpose"
              :label="$t('purpose')">
              <div slot="body" class="col-lg-9">
                <textarea
                  :id="`${parentId || 'parent'}-purpose`"
                  name="purpose"
                  :placeholder="$t('purpose') | capitalize"
                  class="form-control"
                  :label="$t('purpose')"
                  v-model="form.purpose"></textarea>
              </div>
            </p-form-row>
            <p-form-row
              :id="`${parentId || 'parent'}-content`"
              name="content"
              :label="$t('content')"
              v-if="parentId">
              <div slot="body" class="col-lg-9">
                <textarea
                  :id="`${parentId || 'parent'}-content`"
                  name="content"
                  :placeholder="$t('content') | capitalize"
                  class="form-control"
                  :label="$t('content')"
                  v-model="form.content"></textarea>
              </div>
            </p-form-row>
            <p-form-row
              :id="`${parentId || 'parent'}-note`"
              name="note"
              :label="$t('notes')">
              <div slot="body" class="col-lg-9">
                <textarea
                  :id="`${parentId || 'parent'}-note`"
                  name="note"
                  :placeholder="$t('note') | capitalize"
                  class="form-control"
                  :label="$t('notes')"
                  v-model="form.note"></textarea>
              </div>
            </p-form-row>
          </form>
        </div>
      </div>
      <hr>
      <div class="pull-right">
        <button type="submit" class="btn btn-sm btn-primary" :disabled="isSaving" @click="onSubmit">
          <i v-show="isSaving" class="fa fa-asterisk fa-spin"/> {{ $t('save') | uppercase }}
        </button>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'parentId'
  ],
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
  methods: {
    ...mapActions('pluginPlayBookProcedure', [
      'store', 'create'
    ]),
    async getCode () {
      try {
        let { code } = await this.create({
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
