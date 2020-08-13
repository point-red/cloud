<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        :id="id"
        ref="copyGroupModal"
        :is-loading="isLoading"
        title="List Kpi Template"
      >
        <template slot="content">
          <div class="list-group push mb-20">
            <template v-for="(template, index) in templates">
              <button
                v-if="templateId != template.id"
                :key="index"
                type="button"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="{'active': template.id == form.template_id }"
                href="javascript:void(0)"
                @click="chooseTemplate(template)"
              >
                {{ template.name }}
              </button>
            </template>
          </div>
        </template>
        <template slot="footer">
          <button
            type="submit"
            class="btn btn-sm btn-block btn-primary"
          >
            {{ $t('copy to') | uppercase }} {{ form.template_name | uppercase }}
          </button>
        </template>
      </p-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      isSaving: false,
      templateId: null,
      form: new Form({
        template_id: null,
        template_name: null,
        group_id: null
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplate', ['templates', 'pagination'])
  },
  methods: {
    ...mapActions('humanResourceKpiTemplate', {
      getKpiTemplates: 'get',
      copyGroup: 'copyGroup'
    }),
    chooseTemplate (template) {
      this.form.template_id = template.id
      this.form.template_name = template.name
    },
    show (templateId, groupId) {
      this.templateId = templateId
      this.form.template_id = templateId
      this.form.group_id = groupId
      this.isLoading = true
      this.getKpiTemplates().finally(() => {
        this.isLoading = false
      })
      this.$refs.copyGroupModal.show()
    },
    close () {
      this.form.reset()
      this.$refs.copyGroupModal.close()
      this.$emit('closed', true)
    },
    onSubmit () {
      this.isSaving = true
      this.copyGroup(this.form)
        .then(response => {
          this.$emit('copied', this.form.template_id)
          this.$notification.success('copy success')
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.$notification.error('copy error', error.message)
        })
    }
  }
}
</script>
