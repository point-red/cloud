<template>
  <div>
    <sweet-modal
      ref="modal"
      :title="$t('edit glossary') | uppercase"
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
              id="code"
              name="code"
              :label="$t('code')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  id="code"
                  v-model="form.code"
                  name="code"
                  :placeholder="$t('code') | capitalize"
                  :label="$t('code')"
                  :errors="errors && errors.code"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="name"
              name="name"
              :label="$t('name')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  id="name"
                  v-model="form.name"
                  name="name"
                  :placeholder="$t('name') | capitalize"
                  :label="$t('name')"
                  :errors="errors && errors.name"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="abbreviation"
              name="abbreviation"
              :label="$t('abbreviation')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-input
                  id="abbreviation"
                  v-model="form.abbreviation"
                  name="abbreviation"
                  :placeholder="$t('abbreviation') | capitalize"
                  :label="$t('abbreviation')"
                  :errors="errors && errors.abbreviation"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="note"
              name="note"
              :label="$t('note')"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <textarea
                  id="note"
                  v-model="form.note"
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: {
        code: null,
        name: null,
        abbreviation: null,
        note: null
      },
      errors: null
    }
  },
  computed: {
    ...mapGetters('masterCustomer', ['customer'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('pluginPlayBookGlossary', [
      'show', 'update'
    ]),
    async getData () {
      try {
        const id = this.$route.params.id
        this.isLoading = true

        const glossary = await this.show(id)
        this.form = { ...glossary }
      } catch (error) {
      } finally {
        this.isLoading = false
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
        const { data } = await this.update(this.form)
        console.log(data)

        this.$emit('added', data)
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
        // this.$refs.name.setFocus()
        this.getData()
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
