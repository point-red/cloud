<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('update score setting') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <template v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="minimum-kpi"
              v-model="form.minimum_kpi"
              name="minimum-kpi"
              :disabled="isSaving"
              :label="$t('minimum kpi')"
              :errors="form.errors.get('minimum_kpi')"
              @errors="form.errors.set('minimum_kpi', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  id="minimum-kpi"
                  v-model="form.minimum_kpi"
                  name="minimum-kpi"
                  :is-text-right="false"
                  :disabled="isSaving"
                  :label="$t('minimum kpi')"
                  :errors="form.errors.get('minimum_kpi')"
                  @errors="form.errors.set('minimum_kpi', null)"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="minimum-coc"
              v-model="form.minimum_coc"
              name="minimum-coc"
              :disabled="isSaving"
              :label="$t('minimum coc')"
              :errors="form.errors.get('minimum_coc')"
              @errors="form.errors.set('minimum_coc', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  id="minimum-coc"
                  v-model="form.minimum_coc"
                  name="minimum-coc"
                  :is-text-right="false"
                  :disabled="isSaving"
                  :label="$t('minimum coc')"
                  :errors="form.errors.get('minimum_coc')"
                  @errors="form.errors.set('minimum_coc', null)"
                />
              </div>
            </p-form-row>
          </div>
        </div>
        <div class="pull-right">
          <button
            v-if="$permission.has('update employee job value score')"
            type="submit"
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            />
            {{ $t("update") | uppercase }}
          </button>
        </div>
      </template>
    </sweet-modal>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false,
      isSaving: false,
      isFailed: false,
      form: new Form({
        minimum_kpi: null,
        minimum_coc: null
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueScoreSetting', ['setting'])
  },
  methods: {
    ...mapActions('humanResourceJobValueScoreSetting', ['update', 'get']),
    getSetting () {
      this.isLoading = true
      this.get()
        .then((response) => {
          this.isLoading = false
          this.form.minimum_kpi = response.data.minimum_kpi
          this.form.minimum_coc = response.data.minimum_coc
          this.$nextTick(() => {
            this.$refs.minimum_kpi.setFocus()
          })
        })
        .catch((error) => {
          this.isLoading = false
          this.$notification.error(error.message)
        })
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then((response) => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        })
        .catch((error) => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open (jobLocation) {
      this.$refs.modal.open()
      this.getSetting()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
h2 {
  line-height: 3
}
</style>
