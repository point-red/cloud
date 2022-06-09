<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        :id="id"
        ref="templateModal"
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
            /> {{ $t('update') | uppercase }}
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
import { mapGetters, mapMutations, mapActions } from 'vuex'

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
      form: new Form(),
      isCreateMode: true,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', {
      template: 'template'
    })
  },
  methods: {
    ...mapMutations('humanResourceKpiTemplate', {
      fetchKpiTemplate: 'FETCH_OBJECT'
    }),
    ...mapActions('humanResourceKpiTemplate', {
      updateKpiTemplate: 'update'
    }),
    show (template) {
      this.fetchKpiTemplate(template)
      for (const field in template) {
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
    }
  }
}
</script>
