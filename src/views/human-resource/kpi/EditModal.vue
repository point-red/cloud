<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit">
      <p-modal
        ref="templateModal"
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
              class="fa fa-asterisk fa-spin"/> Update
          </button>
          <button
            :disabled="loadingSaveButton"
            type="button"
            class="btn btn-danger"
            v-if="$permission.has('delete employee kpi')"
            @click="remove">
            <i
              v-show="loadingSaveButton"
              class="fa fa-asterisk fa-spin"/> Delete
          </button>
          <button :disabled="loadingSaveButton" type="button" class="btn btn-outline-danger" @click="close">
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
import { mapGetters, mapMutations, mapActions } from 'vuex'

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
  computed: {
    ...mapGetters('humanResourceKpiTemplate', {
      template: 'template'
    })
  },
  data () {
    return {
      form: new Form(),
      isCreateMode: true,
      loadingSaveButton: false
    }
  },
  methods: {
    ...mapMutations('humanResourceKpiTemplate', {
      fetchKpiTemplate: 'FETCH_OBJECT'
    }),
    ...mapActions('humanResourceKpiTemplate', {
      updateKpiTemplate: 'update',
      deleteKpiTemplate: 'delete'
    }),
    show (template) {
      this.fetchKpiTemplate(template)
      for (let field in template) {
        this.$set(this.form, field, template[field])
      }
      this.$refs.templateModal.show()
    },
    close () {
      this.$refs.templateModal.close()
    },
    onSubmit () {
      console.log(JSON.stringify(this.form))
      this.loadingSaveButton = true
      this.updateKpiTemplate(this.form)
        .then(
          (response) => {
            this.$notification.success('Update success')
            this.loadingSaveButton = false
            this.close()
          },
          (error) => {
            this.$notification.error('Update failed', error.message)
            this.form.errors.record(error.errors)
            this.loadingSaveButton = false
          })
    },
    remove () {
      this.loadingSaveButton = true
      this.deleteKpiTemplate(this.form)
        .then(response => {
          this.$notification.success('Delete success')
          this.loadingSaveButton = false
          this.close()
        })
        .catch(error => {
          this.$notification.error('Delete failed', error.message)
          this.loadingSaveButton = false
        })
    }
  }
}
</script>
