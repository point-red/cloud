<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('add job location') | uppercase"
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
            :label="$t('location name')"
            name="name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"
          />
          <p-form-row
            id="base-salary"
            v-model="form.base_salary"
            name="base-salary"
            :disabled="isSaving"
            :label="$t('area value')"
            :errors="form.errors.get('base_salary')"
            @errors="form.errors.set('base_salary', null)"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="base-salary"
                v-model="form.base_salary"
                name="base-salary"
                :is-text-right="false"
                :disabled="isSaving"
                :label="$t('area value')"
                :errors="form.errors.get('base_salary')"
                @errors="form.errors.set('base_salary', null)"
              />
            </div>
          </p-form-row>
          <p-form-row
            id="multiplier-kpi"
            v-model="form.multiplier_kpi"
            name="multiplier-kpi"
            :disabled="isSaving"
            :label="$t('multiplier kpi')"
            :errors="form.errors.get('multiplier_kpi')"
            @errors="form.errors.set('multiplier_kpi', null)"
          >
            <div
              slot="body"
              class="col-lg-9"
            >
              <p-form-number
                id="multiplier-kpi"
                v-model="form.multiplier_kpi"
                name="multiplier-kpi"
                :is-text-right="false"
                :disabled="isSaving"
                :label="$t('multiplier kpi')"
                :errors="form.errors.get('multiplier_kpi')"
                @errors="form.errors.set('multiplier_kpi', null)"
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
        base_salary: null,
        multiplier_kpi: null
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceEmployeeJobLocation', ['jobLocation'])
  },
  methods: {
    ...mapActions('humanResourceEmployeeJobLocation', ['create']),
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
