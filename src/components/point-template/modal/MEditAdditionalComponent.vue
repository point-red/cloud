<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('edit additional component') | uppercase"
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
              id="name"
              ref="name"
              v-model="form.name"
              :disabled="isSaving"
              :label="$t('name')"
              name="name"
              :errors="form.errors.get('name')"
              @errors="form.errors.set('name', null)"
            />
            <p-form-row
              id="weight"
              v-model="form.weight"
              name="weight"
              :disabled="isSaving"
              :label="$t('weight')"
              :errors="form.errors.get('weight')"
              @errors="form.errors.set('weight', null)"
            >
              <div
                slot="body"
                class="col-lg-9"
              >
                <p-form-number
                  id="weight"
                  v-model="form.weight"
                  name="weight"
                  :is-text-right="false"
                  :disabled="isSaving"
                  :label="$t('weight')"
                  :errors="form.errors.get('weight')"
                  @errors="form.errors.set('weight', null)"
                />
              </div>
            </p-form-row>
            <p-form-row
              id="automated-code-2"
              name="automated-code-2"
              label="Source"
            >
              <div
                slot="body"
                class="col-form-label col-lg-9"
              >
                <p-select-modal
                  id="automated-code-2"
                  :title="'select source'"
                  :value="form.automated_code_name"
                  :choosen="form.automated_code_name"
                  :options="automatedCodeOptions"
                  @choosen="chooseAutomatedCode"
                  @search="searchAutomatedCode"
                />
              </div>
            </p-form-row>
          </div>
        </div>
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
        id: null,
        name: null,
        weight: null,
        automated_code: null,
        automated_code_name: null
      }),
      automatedCodeOptionsTemplate: [
        { id: 'balance', label: 'Balance SKU Area' },
        { id: 'achievement_national_call', label: '%C National Achievement' },
        { id: 'achievement_national_effective_call', label: '%EC National Achievement' },
        { id: 'achievement_national_value', label: '%Value National Achievement' },
        { id: 'achievement_area_call', label: '%C Area Achievement' },
        { id: 'achievement_area_effective_call', label: '%EC Area Achievement' },
        { id: 'achievement_area_value', label: '%Value Area Achievement' }
      ],
      automatedCodeOptions: []
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeAdditionalComponent', ['additionalComponent'])
  },
  methods: {
    ...mapActions('humanResourceEmployeeAdditionalComponent', ['update', 'find']),
    getAvailableAutomatedCode () {
      this.automatedCodeOptions = []
      for (var i in this.automatedCodeOptionsTemplate) {
        this.automatedCodeOptions.push({
          id: this.automatedCodeOptionsTemplate[i].id,
          label: this.automatedCodeOptionsTemplate[i].label
        })
      }
    },
    chooseAutomatedCode (value) {
      this.form.automated_code = value.id
      this.form.automated_code_name = value.label
    },
    searchAutomatedCode (value) {
      this.getAvailableAutomatedCode()

      var filtered = this.automatedCodeOptions.filter((str) => {
        return str.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
      })

      this.automatedCodeOptions = []
      for (var i = 0; i < filtered.length; i++) {
        this.automatedCodeOptions.push({
          id: filtered[i].id,
          label: filtered[i].label
        })
      }
    },
    findAdditionalComponent () {
      this.isLoading = true
      this.find({
        id: this.form.id
      }).then(response => {
        this.isLoading = false
        this.form.name = response.data.name
        this.form.weight = response.data.weight
        this.form.automated_code = response.data.automated_code
        this.form.automated_code_name = response.data.automated_code_name
        this.$nextTick(() => {
          this.$refs.name.setFocus()
        })
      }).catch(error => {
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
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open (additionalComponent) {
      this.getAvailableAutomatedCode()
      this.$refs.modal.open()
      this.form.id = additionalComponent.id
      this.findAdditionalComponent()
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
