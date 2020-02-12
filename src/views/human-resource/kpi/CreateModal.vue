<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit">
      <p-modal
        ref="create"
        :id="id"
        :title="title | uppercase">
        <template slot="content">
          <p-form-row
            id="name"
            name="name"
            label="name"
            :disabled="loadingSaveButton"
            v-model="form.name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)">
          </p-form-row>
        </template>
        <template slot="footer">
          <button
            :disabled="loadingSaveButton"
            type="submit"
            class="btn btn-primary">
            <i
              v-show="loadingSaveButton"
              class="fa fa-asterisk fa-spin"/> Add
          </button>
          <button :disabled="loadingSaveButton" type="button" class="btn btn-sm btn-outline-danger" @click="close">
            <i
              v-show="loadingSaveButton"
              class="fa fa-asterisk fa-spin"/> Close
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
      type: String
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
      loadingSaveButton: false
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
      this.loadingSaveButton = true
      this.createKpiTemplate(this.form)
        .then(
          (response) => {
            this.$notification.success('Create success')
            this.form.reset()
            this.loadingSaveButton = false
            this.close()
          },
          (error) => {
            this.$notification.success('Create failed')
            this.form.errors.record(error.errors)
            this.loadingSaveButton = false
          })
    }
  }
}
</script>
