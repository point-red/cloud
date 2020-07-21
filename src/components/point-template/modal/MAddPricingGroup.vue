<template>
  <div>
    <form @submit.prevent="onSubmit">
      <sweet-modal
        ref="modal"
        :title="$t('add pricing group') | uppercase"
        overlay-theme="dark"
        @close="onClose()"
      >
        <div class="row">
          <div class="col-sm-12">
            <p-form-row
              id="label"
              ref="label"
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
            class="btn btn-sm btn-primary"
            :disabled="isSaving"
            @click="onSubmit"
          >
            <i
              v-show="isSaving"
              class="fa fa-asterisk fa-spin"
            /> {{ $t('save') | uppercase }}
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
      isSaving: false,
      isFailed: false,
      isLoading: false,
      form: new Form({
        label: ''
      })
    }
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterPricingGroup', ['get', 'create']),
    onSubmit () {
      this.isSaving = true
      this.create(this.form).then(response => {
        Object.assign(this.$data, this.$options.data.call(this))
        this.isSaving = false
        this.$emit('added', response.data)
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
    open () {
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.label.setFocus()
      })
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
