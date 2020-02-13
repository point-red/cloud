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
            :disabled="isSaving"
            v-model="form.name"
            :errors="form.errors.get('name')"
            @errors="form.errors.set('name', null)">
          </p-form-row>
        </template>
        <template slot="footer">
          <button
            :disabled="isSaving"
            type="submit"
            class="btn btn-primary">
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"/> Update
          </button>
          <button
            :disabled="isSaving"
            type="button"
            class="btn btn-danger"
            v-if="$permission.has('delete employee kpi')"
            @click="remove">
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"/> {{ $t('delete') | uppercase }}
          </button>
          <button :disabled="isSaving" type="button" class="btn btn-sm btn-outline-danger" @click="close">
            <i
              v-show="isSaving"
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
      isSaving: false
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
      this.isSaving = true
      this.updateKpiTemplate(this.form)
        .then(
          (response) => {
            this.$notification.success('Update success')
            this.isSaving = false
            this.close()
          },
          (error) => {
            this.$notification.error('Update failed', error.message)
            this.form.errors.record(error.errors)
            this.isSaving = false
          })
    },
    remove () {
      this.isSaving = true
      this.deleteKpiTemplate(this.form)
        .then(response => {
          this.$notification.success('Delete success')
          this.isSaving = false
          this.close()
        })
        .catch(error => {
          this.$notification.error('Delete failed', error.message)
          this.isSaving = false
        })
    }
  }
}
</script>
