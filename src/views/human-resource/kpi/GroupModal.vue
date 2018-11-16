<template>
  <div>
    <form
      class="row"
      @submit.prevent="onSubmit">
      <p-modal
        ref="group"
        :id="id"
        :isLoading="loading"
        :title="'Kpi Template Group' | uppercase">
        <template slot="content">
          <p-table>
            <tr slot="p-head" v-show="groups.length > 0" class="bg-info-light">
              <th>Name</th>
              <th></th>
            </tr>
            <tr
              v-for="group in groups"
              slot="p-body"
              :key="group.id">
              <td>{{ group.name }}</td>
              <td>
                <a href="javascript:void(0)" class="badge badge-primary" @click="edit(group)"><i class="fa fa-pencil"></i></a>
                <a href="javascript:void(0)" class="badge badge-danger" @click="remove(group.id)"><i class="fa fa-close"></i></a>
              </td>
            </tr>
          </p-table>

          <hr>

          <p-form-row
            id="name"
            name="name"
            label="name"
            :disabled="loadingSaveButton"
            v-model="form.name">
          </p-form-row>
        </template>
        <template slot="footer">
          <button
                :disabled="loadingSaveButton"
                type="submit"
                class="btn btn-primary">
                <i
                  v-show="loadingSaveButton"
                  class="fa fa-asterisk fa-spin"/>
                <template v-if="isCreateMode">Add</template>
                <template v-if="!isCreateMode">Update</template>
          </button>
          <button type="button" class="btn btn-outline-danger" @click="cancel">
            <template v-if="isCreateMode">Close</template>
            <template v-if="!isCreateMode">Cancel</template>
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
      loading: false,
      loadingSaveButton: false
    }
  },
  computed: {
    ...mapGetters('KpiTemplateGroup', {
      groups: 'groups'
    })
  },
  methods: {
    ...mapMutations('KpiTemplateGroup', {
      fetchKpiTemplateGroup: 'FETCH_ARRAY'
    }),
    ...mapActions('KpiTemplateGroup', {
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
      this.loadingSaveButton = true
      if (this.isCreateMode) {
        this.createGroup(this.form)
          .then(
            (response) => {
              this.$notification.success('Create success')
              this.form.reset()
              this.loadingSaveButton = false
            },
            (error) => {
              this.$notification.error('Create failed', error.message)
              this.loadingSaveButton = false
            })
      } else {
        this.updateGroup(this.form)
          .then(
            (response) => {
              this.$notification.success('Update success')
              this.form.reset()
              this.loadingSaveButton = false
              this.isCreateMode = true
            },
            (error) => {
              this.$notification.error('Update failed', error.message)
              this.loadingSaveButton = false
            })
      }
    },
    edit (group) {
      for (let field in group) {
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
