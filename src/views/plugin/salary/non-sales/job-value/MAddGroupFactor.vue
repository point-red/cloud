<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('Factors') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <p-block-inner :is-loading="isLoading">
        <div class="row">
          <div class="col-sm-12">
            <table class="table">
              <thead class="thead-light">
                <tr>
                  <th>Name</th>
                  <th style="width: 20%">
                    Actions
                  </th>
                </tr>
              </thead>
              <tr
                v-for="(groupFactor, index) in data"
                :key="groupFactor.id"
              >
                <td>{{ groupFactor.name }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    style="margin-right: 5px"
                    @click="() => onEdit(groupFactor)"
                  >
                    <i class="fa fa-pencil" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-default btn-sm"
                    @click="() => onDelete(groupFactor,index)"
                  >
                    <i class="fa fa-trash" />
                  </button>
                </td>
              </tr>
              <tbody />
            </table>
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
            <div
              v-if="isEdit"
              class="text-center"
            >
              <a
                href="#"
                @click="onCancelEdit"
              >Cancel Edit</a>
            </div>
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
      </p-block-inner>
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
      isLoading: false,
      isEdit: false,
      selectedData: {},
      data: [],
      group_id: null,
      form: new Form({
        id: null,
        name: null,
        group_id: null
      })
    }
  },
  computed: {
    ...mapGetters('pluginSalarySalaryNonSalesGroupFactor', ['groupFactor'])
  },
  methods: {
    ...mapActions('pluginSalarySalaryNonSalesGroupFactor', ['create', 'delete', 'update']),
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      if (this.isEdit) {
        this.update(this.form)
          .then(response => {
            this.isSaving = false
            this.$notification.success('update success')
            Object.assign(this.$data, this.$options.data.call(this))
            this.$emit('added', response.data)
            this.close()
          }).catch(error => {
            this.isSaving = false
            this.isFailed = true
            this.form.errors.record(error.errors)
          })
      } else {
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
      }
    },
    open (data = [], groupId) {
      if (window._.isEmpty(data)) {
        this.data = []
      } else {
        this.data = data
      }
      this.group_id = groupId
      this.form = new Form({
        id: null,
        name: null,
        group_id: groupId
      })
      this.$refs.modal.open()

      this.$nextTick(() => {
        this.$refs.name.setFocus()
      })
    },
    close () {
      this.$refs.modal.close()
    },
    onEdit (groupFactor) {
      this.isEdit = true
      this.form = new Form({
        id: groupFactor.id,
        name: groupFactor.name,
        group_id: this.group_id
      })
    },
    onDelete (groupFactor, index) {
      this.$alert.confirm(this.$t('delete'), this.$t('confirmation delete message')).then(response => {
        this.isLoading = true
        this.delete(groupFactor).then(response => {
          this.$notification.success('delete success')
          this.data = this.data.filter((v, i) => i !== index)
          this.$emit('added', response.data)
          this.isLoading = false
        }).catch(response => {
          this.isLoading = false
          this.$notification.error('cannot delete')
        })
      })
    },
    onCancelEdit () {
      this.isEdit = false
      this.form = new Form({
        id: null,
        name: null
      })
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
