<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit"
    >
      <p-modal
        :id="id"
        ref="group"
        :is-loading="isLoading"
        :title="'Kpi Template Group' | uppercase"
      >
        <template slot="content">
          <p-table>
            <tr
              v-show="groups.length > 0"
              slot="p-head"
              class="bg-info-light"
            >
              <th>Name</th>
              <th style="width:100px" />
            </tr>
            <tr
              v-for="group in groups"
              slot="p-body"
              :key="group.id"
            >
              <td>{{ group.name }}</td>
              <td>
                <a
                  href="javascript:void(0)"
                  class="badge badge-primary mr-5"
                  @click="edit(group)"
                ><i class="fa fa-pencil" /></a>
                <a
                  href="javascript:void(0)"
                  class="badge badge-danger"
                  @click="remove(group.id)"
                ><i class="fa fa-close" /></a>
              </td>
            </tr>
          </p-table>

          <hr>

          <p-form-row
            id="name"
            v-model="form.name"
            name="name"
            label="name"
            :disabled="isSaving"
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
            />
            <template v-if="isCreateMode">
              {{ $t('add') | uppercase }}
            </template>
            <template v-if="!isCreateMode">
              {{ $t('update') | uppercase }}
            </template>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="cancel"
          >
            <template v-if="isCreateMode">
              {{ $t('close') | uppercase }}
            </template>
            <template v-if="!isCreateMode">
              {{ $t('cancel') | uppercase }}
            </template>
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
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      form: new Form(),
      isCreateMode: true,
      isLoading: false,
      isSaving: false
    }
  },
  computed: {
    ...mapGetters('humanResourceKpiTemplateGroup', {
      groups: 'groups'
    })
  },
  methods: {
    ...mapMutations('humanResourceKpiTemplateGroup', {
      fetchKpiTemplateGroup: 'FETCH_ARRAY'
    }),
    ...mapActions('humanResourceKpiTemplateGroup', {
      getGroups: 'get',
      createGroup: 'create',
      updateGroup: 'update',
      deleteGroup: 'delete'
    }),
    show (template) {
      this.fetchKpiTemplateGroup(template.groups)
      this.form = new Form({
        kpi_template_id: template.id,
        name: ''
      })
      this.$refs.group.show()
    },
    close () {
      this.form.reset()
      this.$refs.group.close()
    },
    onSubmit () {
      this.isSaving = true
      if (this.isCreateMode) {
        this.createGroup(this.form)
          .then(
            (response) => {
              this.$notification.success('Create success')
              this.form.reset()
              this.isSaving = false
            },
            (error) => {
              this.$notification.error('Create failed', error.message)
              this.isSaving = false
            })
      } else {
        this.updateGroup(this.form)
          .then(
            (response) => {
              this.$notification.success('Update success')
              this.form.reset()
              this.isSaving = false
              this.isCreateMode = true
            },
            (error) => {
              this.$notification.error('Update failed', error.message)
              this.isSaving = false
            })
      }
    },
    edit (group) {
      for (const field in group) {
        this.$set(this.form, field, group[field])
      }
      this.isCreateMode = false
    },
    remove (groupId) {
      this.deleteGroup({ id: groupId })
        .then(
          (response) => {
            this.$notification.success('Delete success')
          },
          (error) => {
            this.$notification.success('Delete failed', error.message)
          })
    },
    cancel () {
      if (this.isCreateMode) {
        this.close()
      } else {
        this.form.reset()
        this.isCreateMode = !this.isCreateMode
      }
    }
  }
}
</script>
