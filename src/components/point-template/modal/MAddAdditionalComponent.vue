<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('add additional component') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
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
            id="automated-code"
            name="automated-code"
            label="Source"
          >
            <div
              slot="body"
              class="col-form-label col-lg-9"
            >
              <p-select-modal
                id="automated-code"
                :title="'select source'"
                :value="form.automated_code_name"
                :choosen="form.automated_code"
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
          class="btn btn-sm btn-primary text-right"
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
  </form>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isSaving: false,
      isFailed: false,
      form: new Form({
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
  created () {
    this.getAvailableAutomatedCode()
  },
  methods: {
    ...mapActions('humanResourceEmployeeAdditionalComponent', ['create']),
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
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.create(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('create success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('added', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open () {
      this.getAvailableAutomatedCode()
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.name.setFocus()
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
