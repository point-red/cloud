<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('edit service group') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <template v-if="isLoading">
        <h3 class="text-center">
          Loading ...
        </h3>
      </template>
      <template v-else>
        <div class="row">
          <div class="col-sm-12">
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
      </template>
    </sweet-modal>
  </form>
</template>

<script>
import Form from '@/utils/Form'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isLoading: false,
      isSaving: false,
      isFailed: false,
      form: new Form({
        id: null,
        name: null
      })
    }
  },
  computed: {
    ...mapGetters('masterServiceGroup', ['group'])
  },
  beforeDestroy () {
    this.close()
  },
  methods: {
    ...mapActions('masterServiceGroup', ['update', 'find']),
    findServiceGroup () {
      this.isLoading = true
      this.find({
        id: this.form.id
      }).then(response => {
        this.isLoading = false
        this.form.name = response.data.name
        this.$nextTick(() => {
          this.$refs.name.setFocus()
        })
      }).catch(error => {
        this.isLoading = false
        this.$notification.error(error.message)
      })
    },
    onClose () {
      this.isFailed = false
      Object.assign(this.$data, this.$options.data.call(this))
      this.$emit('close')
    },
    onSubmit () {
      this.isSaving = true
      this.update(this.form)
        .then(response => {
          this.isSaving = false
          this.$notification.success('update success')
          Object.assign(this.$data, this.$options.data.call(this))
          this.$emit('updated', response.data)
          this.close()
        }).catch(error => {
          this.isSaving = false
          this.isFailed = true
          this.form.errors.record(error.errors)
        })
    },
    open (group) {
      this.$refs.modal.open()
      this.form.id = group.id
      this.findServiceGroup()
    },
    close () {
      this.$refs.modal.close()
    }
  }
}
</script>

<style>
  h2 {
    line-height: 3;
  }
</style>
