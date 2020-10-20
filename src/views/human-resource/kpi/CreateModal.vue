<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        :id="id"
        ref="create"
        :title="title | uppercase"
      >
        <template slot="content">
          <p-form-row
            id="name"
            v-model="form.name"
            name="name"
            label="name"
            :disabled="isSaving"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)"
          />
        </template>
        <template slot="footer">
          <button
            :disabled="isSaving"
            type="submit"
            class="btn btn-sm btn-primary"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('save') | uppercase }}
          </button>
          <button
            :disabled="isSaving"
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="close"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('close') | uppercase }}
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: new Form({
        name: ''
      }),
      isSaving: false
    }
  },
  methods: {
    ...mapActions('humanResourceKpiTemplate', {
      createKpiTemplate: 'create'
    }),
    show () {
      this.$refs.create.show()
    },
    close () {
      this.$refs.create.close()
    },
    onSubmit () {
      this.isSaving = true
      this.createKpiTemplate(this.form)
        .then(
          (response) => {
            this.$notification.success('Create success')
            this.form.reset()
            this.isSaving = false
            this.close()
          },
          (error) => {
            this.$notification.success('Create failed')
            this.form.errors.record(error.errors)
            this.isSaving = false
          })
    }
  }
}
</script>
