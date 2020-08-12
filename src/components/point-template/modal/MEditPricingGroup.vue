<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('edit pricing group') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="label"
              v-model="form.label"
              :disabled="isSaving"
              :label="$t('label')"
              name="label"
              :errors="form.errors.get('label')"
              @errors="form.errors.set('label', null)"
            />
          </div>
        </div>
        <div class="pull-right">
          <button
            type="submit"
            class="btn btn-sm btn-primary mr-5"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('update') | uppercase }}
          </button>
          <button
            v-if="$permission.has('delete item')"
            type="button"
            :disabled="isSaving"
            class="btn btn-sm btn-danger"
            @click="onDelete()"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('delete') | uppercase }}
          </button>
        </div>
      </sweet-modal>
    </form>
  </div>
</template>

<script>
import Form from '@/utils/Form'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      isFailed: false,
      isSaving: false,
      isLoading: false,
      form: new Form({
        id: null,
        label: ''
      })
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterPricingGroup', ['get', 'update', 'delete']),
    onSubmit () {
      this.isSaving = true
      this.update(this.form).then(response => {
        this.form.id = null
        this.form.label = ''
        this.isSaving = false
        this.$emit('updated', true)
        this.close()
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    onDelete () {
      this.isSaving = true
      this.delete(this.form).then(response => {
        this.form.id = null
        this.form.label = ''
        this.isSaving = false
        this.$emit('updated', true)
        this.close()
      }).catch(error => {
        this.$notification.error(error.message)
        this.isSaving = false
      })
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    open (group) {
      this.$refs.modal.open()
      this.form.id = group.id
      this.form.label = group.label
    },
    close () {
      this.$refs.modal.close()
      this.$emit('close', true)
    }
  }
}
</script>

<style scoped>
input:readonly {
  background-color: white
}
input {
  min-width: 200px;
}
.link {
  border-bottom: dotted 1px #2196f3;
  color: #2196f3;
  cursor: pointer;
}
</style>
