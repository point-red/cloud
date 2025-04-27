<template>
  <form @submit.prevent="onSubmit">
    <sweet-modal
      ref="modal"
      :title="$t('add category') | uppercase"
      overlay-theme="dark"
      @close="onClose()"
    >
      <div class="row">
        <div class="col-sm-12">
          <p-form-row
            id="category"
            ref="category"
            v-model="form.category"
            :label="$t('category')"
            :disabled="isSaving"
            name="category"
            :errors="form.errors.get('category')"
            @errors="form.errors.set('category', null)"
          />
        </div>
      </div>
      <div class="pull-right">
        <button
          type="button"
          class="btn btn-sm btn-primary mr-5"
          :disabled="isSaving"
          @click="onSubmit"
        >
          {{ $t('save') | uppercase }}
        </button>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger"
          :disabled="isSaving"
          @click="close()"
        >
          {{ $t('close') | uppercase }}
        </button>
      </div>
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
      form: new Form({
        category: null
      })
    }
  },
  computed: {
    ...mapGetters('humanResourceJobValueCategory', ['category'])
  },
  methods: {
    ...mapActions('humanResourceJobValueCategory', ['create']),
    onSubmit () {
      this.isSaving = true
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
    },
    updated () {
      const isDuplicate = this.categories.some((item) =>
        item.label === this.category
      )

      if (isDuplicate) {
        this.$notification.error('Category already exist')
        return
      }

      this.$emit('updated', this.category)
      this.close()
    },
    open () {
      this.$refs.modal.open()
      this.$nextTick(() => {
        this.$refs.category.setFocus()
      })
    },
    close () {
      this.category = null
      this.$refs.modal.close()
    },
    onClose () {
      this.$emit('close', true)
    }
  }
}
</script>
